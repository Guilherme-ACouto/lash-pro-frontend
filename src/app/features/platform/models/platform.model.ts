export interface Tenant {
  id: string;
  name: string;
  schemaName: string;
  active: boolean;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
}
