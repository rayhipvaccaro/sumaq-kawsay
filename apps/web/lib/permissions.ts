export interface PermUser {
  isAdmin: boolean;
  permissions?: string[];
  mustChangePassword?: boolean;
  role?: string;
}

export const STAFF_PERMS = [
  'cms.edit',
  'leads.view',
  'orders.view',
  'payments.manage',
  'fx.edit',
  'agencies.manage',
  'area.manage',
  'customers.reset',
];

export function hasPerm(user: PermUser | null | undefined, perm: string): boolean {
  if (!user || user.mustChangePassword) return false;
  if (user.isAdmin) return true;
  return (user.permissions ?? []).includes(perm);
}

export function hasAny(user: PermUser | null | undefined, perms: string[]): boolean {
  return perms.some((p) => hasPerm(user, p));
}

export function isStaff(user: PermUser | null | undefined): boolean {
  return hasAny(user, STAFF_PERMS);
}

/** Campos del CMS y el permiso que hace falta para verlos/editarlos. */
export const CMS_FIELD_PERMS: Record<string, string[]> = {
  tours: ['cms.edit'],
  generalContent: ['cms.edit'], 
  pages: ['cms.edit'], siteData: ['cms.edit'],
  testimonials: ['cms.edit'],
  contacts: ['leads.view'],
  reservations: ['orders.view', 'payments.manage'],
  accountingEntries: ['payments.manage'],
  providers: ['payments.manage'],
  stockItems: ['payments.manage', 'area.manage'],
};

/** Pagina de inicio segun lo que puede hacer el usuario (a donde cae al entrar). */
export function homeFor(user: PermUser | null | undefined): string {
  if (!user) return '/login';
  if (user.isAdmin) return '/admin';
  if (user.role === 'Agencia' || user.role === 'Turista') return '/mis-reservas';
  if (hasPerm(user, 'area.manage')) return '/admin/mi-area';
  if (hasPerm(user, 'payments.manage')) return '/admin/finanzas/ventas';
  if (hasAny(user, ['orders.view', 'agencies.manage'])) return '/admin/reservas';
  if (hasPerm(user, 'cms.edit')) return '/admin/cms/tours';
  if (hasPerm(user, 'leads.view')) return '/admin/cms/contacts';
  return '/';
}

/** Regla de acceso por ruta del panel. */
export function adminPathAllowed(path: string, user: PermUser | null | undefined): boolean {
  if (!user || user.mustChangePassword) return false;
  if (path.startsWith('/admin/usuarios') || path.startsWith('/admin/operacion')) return Boolean(user.isAdmin);
  if (path.startsWith('/admin/mi-area')) return hasPerm(user, 'area.manage');
  if (path.startsWith('/admin/clientes')) return hasPerm(user, 'customers.reset');
  if (path.startsWith('/admin/finanzas')) return hasPerm(user, 'payments.manage');
  if (path.startsWith('/admin/reservas')) return hasAny(user, ['orders.view', 'payments.manage']);
  if (path.startsWith('/admin/paginas')) return hasPerm(user, 'cms.edit'); 
  if (path.startsWith('/admin/datos')) return hasPerm(user, 'cms.edit');
  if (path.startsWith('/admin/cms/contacts')) return hasPerm(user, 'leads.view');
  if (path.startsWith('/admin/cms/settings')) return Boolean(user.isAdmin);
  if (path.startsWith('/admin/cms')) return hasPerm(user, 'cms.edit');
  return isStaff(user);
}
