import { createAction, props } from '@ngrx/store';
import {
  Anamnese,
  AnamneseSummary,
  LashMapping,
  MappingSummary,
  SaveAnamneseRequest,
  CreateMappingRequest,
} from '../models/fichas.model';

export const FichasActions = {
  // Anamnese — lista
  loadAnamneseSummaries: createAction('[Fichas] Load Anamnese Summaries'),
  loadAnamneseSummariesSuccess: createAction(
    '[Fichas] Load Anamnese Summaries Success',
    props<{ summaries: AnamneseSummary[]; total: number }>()
  ),
  loadAnamneseSummariesFailure: createAction(
    '[Fichas] Load Anamnese Summaries Failure',
    props<{ error: string }>()
  ),

  // Anamnese — detalhe
  loadAnamnese: createAction('[Fichas] Load Anamnese', props<{ clientId: string }>()),
  loadAnamneseSuccess: createAction(
    '[Fichas] Load Anamnese Success',
    props<{ anamnese: Anamnese }>()
  ),
  loadAnamneseFailure: createAction('[Fichas] Load Anamnese Failure', props<{ error: string }>()),

  // Anamnese — salvar
  saveAnamnese: createAction(
    '[Fichas] Save Anamnese',
    props<{ clientId: string; request: SaveAnamneseRequest }>()
  ),
  saveAnamneseSuccess: createAction(
    '[Fichas] Save Anamnese Success',
    props<{ anamnese: Anamnese }>()
  ),
  saveAnamneseFailure: createAction('[Fichas] Save Anamnese Failure', props<{ error: string }>()),

  // Anamnese — gerar link
  generateLink: createAction('[Fichas] Generate Link', props<{ clientId: string }>()),
  generateLinkSuccess: createAction('[Fichas] Generate Link Success', props<{ url: string }>()),
  generateLinkFailure: createAction('[Fichas] Generate Link Failure', props<{ error: string }>()),

  // Mapping — lista geral
  loadMappingSummaries: createAction('[Fichas] Load Mapping Summaries'),
  loadMappingSummariesSuccess: createAction(
    '[Fichas] Load Mapping Summaries Success',
    props<{ summaries: MappingSummary[]; total: number }>()
  ),
  loadMappingSummariesFailure: createAction(
    '[Fichas] Load Mapping Summaries Failure',
    props<{ error: string }>()
  ),

  // Mapping — por cliente
  loadClientMappings: createAction('[Fichas] Load Client Mappings', props<{ clientId: string }>()),
  loadClientMappingsSuccess: createAction(
    '[Fichas] Load Client Mappings Success',
    props<{ mappings: LashMapping[]; total: number }>()
  ),
  loadClientMappingsFailure: createAction(
    '[Fichas] Load Client Mappings Failure',
    props<{ error: string }>()
  ),

  // Mapping — detalhe
  loadMapping: createAction('[Fichas] Load Mapping', props<{ id: string }>()),
  loadMappingSuccess: createAction(
    '[Fichas] Load Mapping Success',
    props<{ mapping: LashMapping }>()
  ),
  loadMappingFailure: createAction('[Fichas] Load Mapping Failure', props<{ error: string }>()),

  // Mapping — criar
  createMapping: createAction(
    '[Fichas] Create Mapping',
    props<{ clientId: string; request: CreateMappingRequest }>()
  ),
  createMappingSuccess: createAction(
    '[Fichas] Create Mapping Success',
    props<{ mapping: LashMapping }>()
  ),
  createMappingFailure: createAction('[Fichas] Create Mapping Failure', props<{ error: string }>()),

  // Mapping — atualizar
  updateMapping: createAction(
    '[Fichas] Update Mapping',
    props<{ id: string; request: CreateMappingRequest }>()
  ),
  updateMappingSuccess: createAction(
    '[Fichas] Update Mapping Success',
    props<{ mapping: LashMapping }>()
  ),
  updateMappingFailure: createAction('[Fichas] Update Mapping Failure', props<{ error: string }>()),

  // Mapping — excluir
  deleteMapping: createAction('[Fichas] Delete Mapping', props<{ id: string; clientId: string }>()),
  deleteMappingSuccess: createAction('[Fichas] Delete Mapping Success', props<{ id: string; clientId: string }>()),
  deleteMappingFailure: createAction('[Fichas] Delete Mapping Failure', props<{ error: string }>()),

  // Filtros comuns
  setSearch: createAction('[Fichas] Set Search', props<{ search: string }>()),
  setPage: createAction('[Fichas] Set Page', props<{ page: number }>()),
};
