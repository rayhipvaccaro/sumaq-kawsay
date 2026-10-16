export const PERMISSIONS = [
  { code: 'cms.edit', label: 'Editar contenido (paquetes, galeria, prensa, textos)' },
  { code: 'leads.view', label: 'Ver contactos y consultas' },
  { code: 'orders.view', label: 'Ver pedidos y reservas' },
  { code: 'payments.manage', label: 'Contabilidad y pagos' },
  { code: 'fx.edit', label: 'Editar tipo de cambio' },
  { code: 'agencies.manage', label: 'Gestionar agencias y descuentos' },
  { code: 'area.manage', label: 'Administrar su area de servicio' },
  { code: 'sales.own', label: 'Ver ventas propias (agencia)' },
  { code: 'customers.reset', label: 'Ver clientes y restablecer su clave' },
] as const;

export const PERMISSION_CODES: string[] = PERMISSIONS.map((p) => p.code);
export const ALL_PERMISSIONS: string[] = [...PERMISSION_CODES];
