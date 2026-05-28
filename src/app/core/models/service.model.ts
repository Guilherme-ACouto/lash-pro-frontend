export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  active: boolean;
  createdAt: string;
}

export interface CreateServiceRequest {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
}

export interface ServiceState {
  services: Service[];
  totalElements: number;
  currentPage: number;
  pageSize: number;
  search: string;
  selectedService: Service | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}
