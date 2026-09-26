// Chaves enviadas pelo backend no header X-bravapro-alert (RestUtils/AlertMessageType, brava-core) — formato "{entidade}.{tipo}".
export const X_BRAVAPRO_ALERT = 'X-bravapro-alert';

export const DEFAULT_ALERT_MESSAGE = 'Operação realizada com sucesso';

export const ALERT_MESSAGES: Record<string, string> = {
  'client.created': 'Cliente cadastrado com sucesso',
  'client.updated': 'Cliente atualizado com sucesso',
  'client.deleted': 'Cliente excluído com sucesso',
  'client.deactivated': 'Cliente inativado com sucesso',
  'client.reactivated': 'Cliente reativado com sucesso',

  'service.created': 'Serviço cadastrado com sucesso',
  'service.updated': 'Serviço atualizado com sucesso',
  'service.deleted': 'Serviço excluído com sucesso',

  'appointment.created': 'Agendamento criado com sucesso',
  'appointment.updated': 'Agendamento atualizado com sucesso',

  'financialEntry.created': 'Lançamento criado com sucesso',
  'financialEntry.updated': 'Lançamento atualizado com sucesso',
  'financialEntry.deleted': 'Lançamento excluído com sucesso',

  'inventoryItem.created': 'Item cadastrado com sucesso',
  'inventoryItem.updated': 'Item atualizado com sucesso',
  'inventoryItem.deleted': 'Item excluído com sucesso',
  'inventoryMovement.created': 'Movimentação de estoque registrada com sucesso',

  'anamnese.updated': 'Ficha de anamnese salva com sucesso',

  'mapping.created': 'Ficha de mapping salva com sucesso',
  'mapping.updated': 'Ficha de mapping atualizada com sucesso',
  'mapping.deleted': 'Ficha de mapping excluída com sucesso',

  'teamInvite.created': 'Convite enviado',
  'teamInvite.updated': 'Convite reenviado — o link anterior deixou de valer',
  'teamInvite.deleted': 'Convite cancelado',
  'teamUser.updated': 'Acesso atualizado',
  'teamUser.deactivated': 'Usuário inativado',
  'teamUser.reactivated': 'Usuário reativado',
  'teamUser.deleted': 'Usuário excluído',
  'teamUserPasswordReset.updated': 'E-mail de redefinição de senha enviado',
  'teamUserSessions.updated': 'Sessões encerradas',

  'businessUnit.updated': 'Dados da empresa salvos',
  'invite.updated': 'Convite aceito',
};
