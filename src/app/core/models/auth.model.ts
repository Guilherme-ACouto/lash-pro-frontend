/**
 * Usuário logado como o backend devolve em GET /api/me. As permissões vêm por requisição (nunca
 * do token), então recarregar o /me reflete na hora qualquer mudança feita pelo administrador.
 */
export interface User {
  id: string;
  name: string;
  email: string;
  /** Administrador da assinatura (ou equipe da plataforma em modo suporte): acesso total. */
  admin: boolean;
  /** Titular da assinatura. */
  accountOwner: boolean;
  /** E-mail do domínio da plataforma (Brava Pro): pode entrar em qualquer assinatura. */
  platformAdmin: boolean;
  /** Equipe da plataforma operando dentro de uma assinatura que não é a dela. */
  supportSession: boolean;
  tenantId: string;
  tenantName: string;
  /** Chaves como "client", "client.create" — vazio para administradores. */
  permissions: string[];
}

export interface Brand {
  tradeName: string;
  logoUrl: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  name: string;
  email: string;
  admin: boolean;
}

export interface InvitationDetails {
  name: string;
  email: string;
  tenantName: string;
  expired: boolean;
}

export interface SupportSession {
  accessToken: string;
  refreshToken: string;
  tenantId: string;
  tenantName: string;
}

export interface AuthState {
  user: User | null;
  brand: Brand | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  invitation: InvitationDetails | null;
}
