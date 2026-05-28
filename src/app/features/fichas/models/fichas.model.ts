export type SleepSide = 'DIREITO' | 'ESQUERDO' | 'AMBOS';

export interface Anamnese {
  id: string | null;
  clientId: string;
  clientName: string;
  guardianName: string | null;
  address: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  birthDate: string | null;
  phone: string | null;
  cpf: string | null;
  rg: string | null;
  hadLashExtensions: boolean;
  wearsMascara: boolean;
  hasAllergies: boolean;
  hasThyroidIssues: boolean;
  sleepSide: SleepSide;
  hadEyeProcedure: boolean;
  isPregnantOrNursing: boolean;
  hadOncologicalTreatment: boolean;
  hasSkinDisease: boolean;
  hasHealthTreatment: boolean;
  usesMedication: boolean;
  termAccepted: boolean;
  termAcceptedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface AnamneseSummary {
  clientId: string;
  clientName: string;
  hasAnamnese: boolean;
  updatedAt: string | null;
}

export interface LashMapping {
  id: string;
  clientId: string;
  clientName: string;
  mappingDate: string;
  mappingType: string | null;
  curvature: string | null;
  humidity: string | null;
  temperature: string | null;
  thickness: string | null;
  threadBrand: string | null;
  threadFormat: string | null;
  adhesive: string | null;
  lengthsUsed: string | null;
  observations: string | null;
  canvasData: string | null;
  photoBefore: string | null;
  photoAfter: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MappingSummary {
  clientId: string;
  clientName: string;
  mappingCount: number;
  lastMappingDate: string | null;
}

export interface SaveAnamneseRequest {
  guardianName?: string;
  address?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  birthDate?: string;
  phone?: string;
  cpf?: string;
  rg?: string;
  hadLashExtensions: boolean;
  wearsMascara: boolean;
  hasAllergies: boolean;
  hasThyroidIssues: boolean;
  sleepSide: string;
  hadEyeProcedure: boolean;
  isPregnantOrNursing: boolean;
  hadOncologicalTreatment: boolean;
  hasSkinDisease: boolean;
  hasHealthTreatment: boolean;
  usesMedication: boolean;
  termAccepted: boolean;
}

export interface CreateMappingRequest {
  mappingDate?: string;
  mappingType?: string;
  curvature?: string;
  humidity?: string;
  temperature?: string;
  thickness?: string;
  threadBrand?: string;
  threadFormat?: string;
  adhesive?: string;
  lengthsUsed?: string;
  observations?: string;
  canvasData?: string;
  photoBefore?: string;
  photoAfter?: string;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface GenerateLinkResponse {
  url: string;
}

export interface AnamnesePublicResponse {
  clientName: string;
  clientPhone: string | null;
  anamnese: Anamnese | null;
}

export type SubmitAnamneseRequest = SaveAnamneseRequest;
