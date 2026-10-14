import { NextRequest, NextResponse } from 'next/server';
import type { PaymentMethod, PaymentRecord } from '@/data/businessData';
import { mutateCms } from '@/lib/orderStore';
import { publicOrder, tokenOk } from '@/lib/orderPublic';
import {
  chargeCardSimulated,
  chargeWalletSimulated,
  newTxId,
  validateCard,
  type CardInput,
} from '@/lib/payments/simulated';

// Cobro SIMULADO. El monto lo calcula el servidor desde la orden; el cliente solo elige
// metodo y plan (50% o 100%). Nunca se guarda ni se registra el numero completo ni el CVV.
const METHODS: PaymentMethod[] = ['tarjeta', 'yape_plin', 'transferencia_bcp', 'interbank', 'efectivo'];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  let b: {
    t?: string;
    method?: PaymentMethod;
    plan?: '50' | '100';
    card?: CardInput;
    phone?: string;
    operationCode?: string;
  };
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: 'Datos invalidos' }, { status: 400 });
  }
  const method = b.method as PaymentMethod;
  if (!METHODS.includes(method)) {
    return NextResponse.json({ error: 'Metodo de pago invalido' }, { status: 400 });
  }

  try {
    const out = await mutateCms((data) => {
      const order = data.reservations.find((r) => r.id === id);
      if (!order || !tokenOk(order, b.t)) {
        return { code: 404 as const, error: 'Orden no encontrada' };
      }
      if (order.status === 'declinado' || order.paymentStatus === 'anulado') {
        return { code: 409 as const, error: 'Esta orden ya no admite pagos' };
      }
      const paid = order.amountPaidPEN ?? 0;
      const remaining = Math.round((order.totalPEN - paid) * 100) / 100;
      if (remaining <= 0.009 || order.paymentStatus === 'pagado_100') {
        return { code: 409 as const, error: 'La orden ya esta pagada' };
      }
      const failed = (order.payments ?? []).filter((p) => p.status === 'rechazado').length;
      if (failed >= 5) {
        return { code: 429 as const, error: 'Demasiados intentos rechazados. Contacta a Ventas.' };
      }

      // Primer pago: 50% o 100%. Si ya hay adelanto, solo se paga el saldo.
      const plan = paid > 0 || b.plan === '100' ? 'pagado_100' : 'adelanto_50';
      const amount =
        plan === 'pagado_100' ? remaining : Math.min(remaining, Math.round(order.totalPEN * 50) / 100);

      let status: PaymentRecord['status'];
      let txId = newTxId('SIM');
      let message = '';
      let cardBrand: string | undefined;
      let cardLast4: string | undefined;
      let operationCode: string | undefined;

      if (method === 'tarjeta') {
        const card = b.card as CardInput | undefined;
        const err = card ? validateCard(card) : 'Faltan los datos de la tarjeta';
        if (err) return { code: 400 as const, error: err };
        const r = chargeCardSimulated(card!, amount);
        status = r.approved ? 'aprobado' : 'rechazado';
        txId = r.txId;
        message = r.message;
        cardBrand = r.brand;
        cardLast4 = r.last4;
      } else if (method === 'yape_plin') {
        const r = chargeWalletSimulated(b.phone ?? '');
        if (!r.approved && r.message.startsWith('Celular')) {
          return { code: 400 as const, error: r.message };
        }
        status = r.approved ? 'aprobado' : 'rechazado';
        txId = r.txId;
        message = r.message;
      } else if (method === 'efectivo') {
        status = 'por_verificar';
        message = 'Pagaras en el lugar. Reserva a la espera de confirmacion.';
      } else {
        const code = String(b.operationCode ?? '').trim().slice(0, 30);
        if (code.length < 4) {
          return { code: 400 as const, error: 'Escribe el numero de operacion de tu transferencia' };
        }
        operationCode = code;
        status = 'por_verificar';
        message = 'Contabilidad verificara tu transferencia.';
      }

      const now = new Date().toISOString();
      const record: PaymentRecord = {
        id: `pay-${Date.now()}`,
        date: now,
        method,
        plan,
        amountPEN: amount,
        status,
        provider: 'simulado',
        txId,
        cardBrand,
        cardLast4,
        operationCode,
        message,
      };
      order.payments = [...(order.payments ?? []), record];
      order.paymentMethod = method;

      if (status === 'aprobado') {
        order.amountPaidPEN = Math.round((paid + amount) * 100) / 100;
        order.paymentStatus = order.amountPaidPEN >= order.totalPEN - 0.009 ? 'pagado_100' : 'adelanto_50';
        order.emailLogs = [
          ...order.emailLogs,
          {
            id: `log-${Date.now()}`,
            date: now,
            sender: 'sistema@sumaqkawsay.pe',
            recipient: order.customerEmail,
            subject: `Pago recibido ${order.id} · S/ ${amount.toFixed(2)}`,
            body: `Hola ${order.customerName}, recibimos tu pago de S/ ${amount.toFixed(2)} (operacion ${txId}). Estado: ${order.paymentStatus === 'pagado_100' ? 'pagado al 100%' : 'adelanto del 50%'}.`,
            type: 'confirmacion_voucher',
          },
        ];
      }

      return {
        code: 200 as const,
        result: { status, message, txId, amountPEN: amount, cardBrand, cardLast4 },
        order: publicOrder(order),
      };
    });

    if (out.code !== 200) {
      return NextResponse.json({ error: out.error }, { status: out.code });
    }
    return NextResponse.json({ ok: out.result.status !== 'rechazado', result: out.result, order: out.order });
  } catch (e) {
    console.error('PAY: fallo al guardar el pago:', e instanceof Error ? e.message : 'error');
    return NextResponse.json({ error: 'No se pudo registrar el pago' }, { status: 500 });
  }
}
