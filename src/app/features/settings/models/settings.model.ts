export interface TeamUser {
  id: string;
  name: string;
  email: string;
  admin: boolean;
  active: boolean;
  accountOwner: boolean;
  professional: boolean;
  permissions: string[];
  lastLoginAt: string | null;
  createdAt: string;
}

export interface TeamInvite {
  id: string;
  name: string;
  email: string;
  admin: boolean;
  professional: boolean;
  permissions: string[];
  token: string;
  expiresAt: string;
  expired: boolean;
  createdAt: string;
}

export interface InviteUserRequest {
  name: string;
  email: string;
  admin: boolean;
  professional: boolean;
  permissions: string[];
}

export interface UpdateTeamUserRequest {
  name: string;
  admin: boolean;
  professional: boolean;
  permissions: string[];
}

export type DocumentType = 'CPF' | 'CNPJ';

export interface BusinessUnit {
  id: string;
  main: boolean;
  tradeName: string;
  legalName: string | null;
  documentType: DocumentType | null;
  document: string | null;
  municipalRegistration: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram: string | null;
  website: string | null;
  zipCode: string | null;
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  logoUrl: string | null;
}

export type UpdateBusinessUnitRequest = Omit<BusinessUnit, 'id' | 'main' | 'logoUrl'>;

export interface CepAddress {
  street: string;
  district: string;
  city: string;
  state: string;
}

// ── Matriz de permissões ────────────────────────────────────────────────────

export type PermissionAction = 'view' | 'create' | 'update' | 'delete';

export interface PermissionModule {
  key: string;
  label: string;
  description: string;
  actions: PermissionAction[];
}

export const PERMISSION_ACTIONS: { key: PermissionAction; label: string }[] = [
  { key: 'view', label: 'Ver' },
  { key: 'create', label: 'Criar' },
  { key: 'update', label: 'Editar' },
  { key: 'delete', label: 'Excluir' },
];

/** Mesmas chaves do enum Permission do backend (raiz = ver; filhas = ações). */
export const PERMISSION_MODULES: PermissionModule[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'Indicadores, faturamento e agenda do dia', actions: ['view'] },
  { key: 'appointment', label: 'Agenda', description: 'Editar inclui confirmar, concluir, cancelar e não compareceu', actions: ['view', 'create', 'update'] },
  { key: 'client', label: 'Clientes', description: 'Editar inclui inativar e reativar', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'service', label: 'Serviços', description: 'Catálogo de serviços e preços', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'record', label: 'Fichas', description: 'Anamnese e mapeamento', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'financial', label: 'Financeiro', description: 'Lançamentos, contas a pagar e a receber', actions: ['view', 'create', 'update', 'delete'] },
  { key: 'inventory', label: 'Estoque', description: 'Editar inclui registrar compra e saída', actions: ['view', 'create', 'update', 'delete'] },
];

export function permissionKey(module: string, action: PermissionAction): string {
  return action === 'view' ? module : `${module}.${action}`;
}

function all(module: string): string[] {
  return ['view', 'create', 'update', 'delete'].map((a) => permissionKey(module, a as PermissionAction));
}

export interface PermissionTemplate {
  key: string;
  label: string;
  professional: boolean;
  permissions: string[];
}

/** Modelos prontos: só preenchem as caixinhas — depois dá pra ajustar à vontade. */
export const PERMISSION_TEMPLATES: PermissionTemplate[] = [
  {
    key: 'reception',
    label: 'Recepção',
    professional: false,
    permissions: ['appointment', 'appointment.create', 'appointment.update', ...all('client'), 'service', 'record'],
  },
  {
    key: 'professional',
    label: 'Profissional',
    professional: true,
    permissions: [
      'appointment', 'appointment.create', 'appointment.update',
      'client', 'client.create', 'client.update',
      'service', 'inventory', ...all('record'),
    ],
  },
  {
    key: 'financial',
    label: 'Financeiro',
    professional: false,
    permissions: ['dashboard', ...all('financial'), ...all('inventory'), 'service'],
  },
  {
    key: 'readonly',
    label: 'Somente consulta',
    professional: false,
    permissions: PERMISSION_MODULES.map((m) => m.key),
  },
];
