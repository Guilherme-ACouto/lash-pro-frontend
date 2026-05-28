import { createReducer, on } from '@ngrx/store';
import { Anamnese, AnamneseSummary, LashMapping, MappingSummary } from '../models/fichas.model';
import { FichasActions } from './fichas.actions';

export interface FichasState {
  anamneseSummaries: AnamneseSummary[];
  totalAnamneses: number;
  currentAnamnese: Anamnese | null;
  generatedLink: string | null;
  mappingSummaries: MappingSummary[];
  totalMappings: number;
  clientMappings: LashMapping[];
  totalClientMappings: number;
  currentMapping: LashMapping | null;
  search: string;
  page: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: FichasState = {
  anamneseSummaries: [],
  totalAnamneses: 0,
  currentAnamnese: null,
  generatedLink: null,
  mappingSummaries: [],
  totalMappings: 0,
  clientMappings: [],
  totalClientMappings: 0,
  currentMapping: null,
  search: '',
  page: 0,
  isLoading: false,
  error: null,
};

export const fichasReducer = createReducer(
  initialState,

  on(FichasActions.loadAnamneseSummaries, (state) => ({ ...state, isLoading: true, error: null })),
  on(FichasActions.loadAnamneseSummariesSuccess, (state, { summaries, total }) => ({
    ...state, isLoading: false, anamneseSummaries: summaries, totalAnamneses: total,
  })),
  on(FichasActions.loadAnamneseSummariesFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.loadAnamnese, (state) => ({ ...state, isLoading: true, error: null, currentAnamnese: null })),
  on(FichasActions.loadAnamneseSuccess, (state, { anamnese }) => ({ ...state, isLoading: false, currentAnamnese: anamnese })),
  on(FichasActions.loadAnamneseFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.saveAnamnese, (state) => ({ ...state, isLoading: true, error: null })),
  on(FichasActions.saveAnamneseSuccess, (state, { anamnese }) => ({ ...state, isLoading: false, currentAnamnese: anamnese })),
  on(FichasActions.saveAnamneseFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.generateLink, (state) => ({ ...state, isLoading: true, generatedLink: null })),
  on(FichasActions.generateLinkSuccess, (state, { url }) => ({ ...state, isLoading: false, generatedLink: url })),
  on(FichasActions.generateLinkFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.loadMappingSummaries, (state) => ({ ...state, isLoading: true, error: null })),
  on(FichasActions.loadMappingSummariesSuccess, (state, { summaries, total }) => ({
    ...state, isLoading: false, mappingSummaries: summaries, totalMappings: total,
  })),
  on(FichasActions.loadMappingSummariesFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.loadClientMappings, (state) => ({ ...state, isLoading: true, error: null, clientMappings: [] })),
  on(FichasActions.loadClientMappingsSuccess, (state, { mappings, total }) => ({
    ...state, isLoading: false, clientMappings: mappings, totalClientMappings: total,
  })),
  on(FichasActions.loadClientMappingsFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.loadMapping, (state) => ({ ...state, isLoading: true, currentMapping: null })),
  on(FichasActions.loadMappingSuccess, (state, { mapping }) => ({ ...state, isLoading: false, currentMapping: mapping })),
  on(FichasActions.loadMappingFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.createMapping, (state) => ({ ...state, isLoading: true, error: null })),
  on(FichasActions.createMappingSuccess, (state, { mapping }) => ({
    ...state, isLoading: false, clientMappings: [mapping, ...state.clientMappings],
    totalClientMappings: state.totalClientMappings + 1,
  })),
  on(FichasActions.createMappingFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.updateMapping, (state) => ({ ...state, isLoading: true, error: null })),
  on(FichasActions.updateMappingSuccess, (state, { mapping }) => ({
    ...state, isLoading: false, currentMapping: mapping,
    clientMappings: state.clientMappings.map(m => m.id === mapping.id ? mapping : m),
  })),
  on(FichasActions.updateMappingFailure, (state, { error }) => ({ ...state, isLoading: false, error })),

  on(FichasActions.deleteMappingSuccess, (state, { id }) => ({
    ...state, clientMappings: state.clientMappings.filter(m => m.id !== id),
    totalClientMappings: state.totalClientMappings - 1,
  })),
  on(FichasActions.deleteMappingFailure, (state, { error }) => ({ ...state, error })),

  on(FichasActions.setSearch, (state, { search }) => ({ ...state, search, page: 0 })),
  on(FichasActions.setPage, (state, { page }) => ({ ...state, page })),
);
