export interface Client {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateClientRequest {
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
}

export interface ClientState {
  clients: Client[];
  totalElements: number;
  currentPage: number;
  pageSize: number;
  search: string;
  selectedClient: Client | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}
