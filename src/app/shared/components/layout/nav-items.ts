import { User } from '../../../core/models/auth.model';
import { MODULE_ROUTES, canAccess } from '../../../core/auth/module-routes';

export interface NavItem {
  label: string;
  shortLabel: string;
  icon: string;
  route: string;
}

/**
 * Menu lateral/inferior: só os módulos que o usuário pode ver. Configurações, Trocar assinatura
 * e Sair ficam no menu do usuário, na barra do topo.
 */
export function navItemsFor(user: User | null): NavItem[] {
  return MODULE_ROUTES.filter((m) => canAccess(user, m.permission));
}
