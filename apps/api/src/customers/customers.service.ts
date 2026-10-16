import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

const TOURIST = 'Turista';
const AGENCY = 'Agencia';
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';

function tempPassword(len = 12): string {
  let s = '';
  for (let i = 0; i < len; i++) s += CHARS[randomInt(CHARS.length)];
  return s;
}

export interface EnsureInput {
  email: string;
  fullName: string;
  docType: string; // DNI | PASAPORTE
  docNumber: string;
}

/** DNI = 8 numeros (nacionales). Pasaporte = 6 a 12 letras/numeros (extranjeros). */
export function cleanDoc(typeRaw: unknown, numRaw: unknown) {
  const docType = String(typeRaw ?? '').trim().toUpperCase();
  const docNumber = String(numRaw ?? '').trim().toUpperCase().replace(/\s+/g, '');
  if (docType === 'DNI') {
    if (!/^\d{8}$/.test(docNumber)) {
      throw new BadRequestException('El DNI debe tener 8 numeros');
    }
  } else if (docType === 'PASAPORTE') {
    if (!/^[A-Z0-9]{6,12}$/.test(docNumber)) {
      throw new BadRequestException('Pasaporte: 6 a 12 letras o numeros');
    }
  } else {
    throw new BadRequestException('Tipo de documento: DNI o PASAPORTE');
  }
  return { docType, docNumber };
}

const listSelect = {
  id: true,
  username: true,
  fullName: true,
  docType: true,
  docNumber: true,
  discountPct: true,
  active: true,
  mustChangePassword: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { name: true } },
} as const;

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  private audit(actorId: number | null, action: string, ip?: string, detail?: string) {
    return this.prisma.auditLog.create({
      data: { userId: actorId, action, ip: ip ?? null, detail: detail ?? null },
    });
  }

  /**
   * Llamado por el servidor web al crear una orden.
   * - Correo nuevo: crea la cuenta. Usuario = correo, clave inicial = documento.
   * - Correo ya existente y mismo documento: devuelve esa cuenta (mismo turista).
   * - Correo existente con otro documento, o de otro tipo de cuenta: no enlaza.
   */
  async ensureTourist(input: EnsureInput) {
    const email = String(input.email ?? '').trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 160) {
      throw new BadRequestException('correo invalido');
    }
    const fullName = String(input.fullName ?? '').trim().slice(0, 120);
    if (fullName.length < 2) throw new BadRequestException('nombre invalido');
    const { docType, docNumber } = cleanDoc(input.docType, input.docNumber);

    const existing = await this.prisma.user.findUnique({
      where: { username: email },
      include: { role: true },
    });
    if (existing) {
      const same = existing.role.name === TOURIST && existing.docNumber === docNumber;
      return { userId: same ? existing.id : null, created: false };
    }

    const role = await this.prisma.role.upsert({
      where: { name: TOURIST },
      update: {},
      create: {
        name: TOURIST,
        description: 'Cliente que reserva en la web',
        isAdmin: false,
        permissions: [],
      },
    });
    try {
      const user = await this.prisma.user.create({
        data: {
          username: email,
          fullName,
          roleId: role.id,
          docType,
          docNumber,
          passwordHash: await bcrypt.hash(docNumber, 12),
          mustChangePassword: true,
        },
      });
      await this.audit(null, 'TOURIST_CREATED', undefined, `usuario: ${email}`);
      return { userId: user.id, created: true };
    } catch (e) {
      if ((e as { code?: string }).code === 'P2002') {
        // otra reserva creo la cuenta al mismo tiempo
        const again = await this.prisma.user.findUnique({ where: { username: email } });
        const same = again?.docNumber === docNumber;
        return { userId: same && again ? again.id : null, created: false };
      }
      throw e;
    }
  }

  list() {
    return this.prisma.user.findMany({
      where: { role: { name: { in: [TOURIST, AGENCY] } } },
      orderBy: { id: 'desc' },
      select: listSelect,
    });
  }

  /**
   * Turista: la clave vuelve a ser su documento (se puede corregir el documento).
   * Agencia: clave temporal nueva.
   * Nunca toca cuentas del personal.
   */
  async resetPassword(
    id: number,
    actorId: number,
    ip?: string,
    fix?: { docType?: string; docNumber?: string },
  ) {
    const target = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!target) throw new NotFoundException('Cuenta no existe');
    const kind = target.role.name;
    if (kind !== TOURIST && kind !== AGENCY) {
      throw new ForbiddenException('Solo cuentas de turista o agencia');
    }

    let newPassword: string;
    let docData: { docType: string; docNumber: string } | null = null;
    if (kind === TOURIST) {
      if (fix?.docNumber) {
        docData = cleanDoc(fix.docType ?? target.docType, fix.docNumber);
        newPassword = docData.docNumber;
      } else if (target.docNumber) {
        newPassword = target.docNumber;
      } else {
        throw new BadRequestException('Esta cuenta no tiene documento. Indica uno.');
      }
    } else {
      newPassword = tempPassword();
    }

    await this.prisma.user.update({
      where: { id },
      data: {
        ...(docData ?? {}),
        passwordHash: await bcrypt.hash(newPassword, 12),
        mustChangePassword: true,
        failedAttempts: 0,
        lockedUntil: null,
        tokenVersion: { increment: 1 },
      },
    });
    await this.audit(actorId, 'CUSTOMER_PASSWORD_RESET', ip, `usuario: ${target.username}`);
    return { id, username: target.username, tempPassword: newPassword };
  }
}
