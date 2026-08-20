import type { Actor } from './model.js';

export interface AuditEvent {
  id: string;
  occurredAt: string;
  actorId: string;
  actorKind: Actor['kind'];
  actorRoles: readonly string[];
  organisationId: string;
  objectType: string;
  objectId: string;
  action: string;
  previousReference: string | null;
  newReference: string | null;
  requestId: string;
  source: 'web' | 'api' | 'worker' | 'system';
}

export function makeAuditEvent(input: Omit<AuditEvent, 'id' | 'occurredAt'>): Readonly<AuditEvent> {
  return Object.freeze({ ...input, id: crypto.randomUUID(), occurredAt: new Date().toISOString() });
}
