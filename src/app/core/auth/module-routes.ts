import { User } from '../models/auth.model';

/**
 * Módulos do sistema com a permissão de leitura (chave raiz) exigida pra entrar em cada um.
 * Usado pelo menu, pelos guards e pra escolher a tela inicial de quem não tem Dashboard.
 */
export interface ModuleRoute {
  label: string;
  shortLabel: string;
  icon: string;
  route: string;
  permission: string;
}

export const MODULE_ROUTES: ModuleRoute[] = [
  { label: 'Dashboard', shortLabel: 'Início', icon: 'dashboard', route: '/dashboard', permission: 'dashboard' },
  { label: 'Clientes', shortLabel: 'Clientes', icon: 'people', route: '/clients', permission: 'client' },
  { label: 'Agendamentos', shortLabel: 'Agenda', icon: 'calendar_month', route: '/appointments', permission: 'appointment' },
  { label: 'Fichas', shortLabel: 'Fichas', icon: 'assignment', route: '/fichas', permission: 'record' },
  { label: 'Serviços', shortLabel: 'Serviços', icon: 'design_services', route: '/services', permission: 'service' },
  { label: 'Financeiro', shortLabel: 'Financeiro', icon: 'account_balance_wallet', route: '/financial', permission: 'financial' },
  { label: 'Estoque', shortLabel: 'Estoque', icon: 'inventory_2', route: '/inventory', permission: 'inventory' },
];

export function canAccess(user: User | null, permission: string): boolean {
  return !!user && (user.admin || user.permissions.includes(permission));
}

/** Primeira tela que o usuário pode abrir (Dashboard pra quem tem, senão o primeiro módulo liberado). */
export function firstAllowedRoute(user: User | null): string {
  const first = MODULE_ROUTES.find((m) => canAccess(user, m.permission));
  if (first) return first.route;
  if (user?.platformAdmin) return '/platform/tenants';
  return '/sem-acesso';
}
