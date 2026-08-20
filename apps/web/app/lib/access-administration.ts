export type ExternalWorkspaceRole = 'investor' | 'sme' | 'originator';
export type AccessRequestStatus = 'pending' | 'approved' | 'declined';
export type ManagedUserStatus = 'active' | 'suspended' | 'removed';

export interface AccessRequestRecord {
  id: string;
  name: string;
  email: string;
  organisation: string;
  requestedRole: ExternalWorkspaceRole;
  purpose: string;
  submittedAt: string;
  status: AccessRequestStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  reason?: string;
}

export interface ManagedUserRecord {
  id: string;
  name: string;
  email: string;
  organisation: string;
  roles: readonly ExternalWorkspaceRole[];
  status: ManagedUserStatus;
  mfa: 'required' | 'optional' | 'enabled';
  lastActive: string;
  createdFrom: string;
}

export interface AccessAuditRecord {
  sequence: number;
  action: string;
  actor: string;
  subject: string;
  occurredAt: string;
  reason: string;
}

export interface AccessAdministrationState {
  requests: readonly AccessRequestRecord[];
  users: readonly ManagedUserRecord[];
  audit: readonly AccessAuditRecord[];
}

export const accessAdministrationStorageKey = 'mizant-access-administration-v1';

export const seedAccessAdministrationState: AccessAdministrationState = {
  requests: [
    {
      id: 'ACCESS-1024',
      name: 'Mariam Yusupova',
      email: 'mariam.yusupova@example.test',
      organisation: 'Silk Road Foods',
      requestedRole: 'sme',
      purpose: 'Prepare a productive-equipment application',
      submittedAt: '2026-08-18T08:35:00.000Z',
      status: 'pending',
    },
    {
      id: 'ACCESS-1023',
      name: 'Timur Akhmedov',
      email: 'timur.akhmedov@example.test',
      organisation: 'Tashkent Originations',
      requestedRole: 'originator',
      purpose: 'Coordinate SME evidence and asset submissions',
      submittedAt: '2026-08-18T07:40:00.000Z',
      status: 'pending',
    },
  ],
  users: [
    {
      id: 'USR-1001',
      name: 'Alex Morgan',
      email: 'alex.morgan@example.test',
      organisation: 'Individual investor',
      roles: ['investor'],
      status: 'active',
      mfa: 'optional',
      lastActive: '2026-08-18T08:52:00.000Z',
      createdFrom: 'ACCESS-1001',
    },
    {
      id: 'USR-1002',
      name: 'Nodira Karimova',
      email: 'nodira.karimova@example.test',
      organisation: 'Samarkand Cold Chain',
      roles: ['sme'],
      status: 'active',
      mfa: 'enabled',
      lastActive: '2026-08-18T08:18:00.000Z',
      createdFrom: 'ACCESS-1002',
    },
    {
      id: 'USR-1003',
      name: 'Farida Rasulova',
      email: 'farida.rasulova@example.test',
      organisation: 'Mizant Origination Network',
      roles: ['originator'],
      status: 'active',
      mfa: 'enabled',
      lastActive: '2026-08-18T08:03:00.000Z',
      createdFrom: 'ACCESS-1003',
    },
  ],
  audit: [
    {
      sequence: 1,
      action: 'role_granted',
      actor: 'platform-admin-01',
      subject: 'USR-1003',
      occurredAt: '2026-08-17T16:00:00.000Z',
      reason: 'Originator preview access approved',
    },
  ],
};

const withAudit = (
  state: AccessAdministrationState,
  record: Omit<AccessAuditRecord, 'sequence'>,
): AccessAdministrationState => ({
  ...state,
  audit: [...state.audit, { ...record, sequence: state.audit.length + 1 }],
});

export function parseAccessAdministrationState(value: string | null): AccessAdministrationState {
  if (!value) return seedAccessAdministrationState;
  try {
    const parsed = JSON.parse(value) as Partial<AccessAdministrationState>;
    if (
      !Array.isArray(parsed.requests) ||
      !Array.isArray(parsed.users) ||
      !Array.isArray(parsed.audit)
    )
      return seedAccessAdministrationState;
    return parsed as AccessAdministrationState;
  } catch {
    return seedAccessAdministrationState;
  }
}

export function createAccessRequest(
  state: AccessAdministrationState,
  input: Omit<AccessRequestRecord, 'id' | 'submittedAt' | 'status'>,
  submittedAt: string,
): AccessAdministrationState {
  if (!input.email.toLowerCase().endsWith('@example.test'))
    throw new Error('FICTIONAL_EMAIL_REQUIRED');
  if (state.requests.some((request) => request.email.toLowerCase() === input.email.toLowerCase()))
    throw new Error('REQUEST_ALREADY_EXISTS');
  const nextNumber = 1025 + state.requests.length;
  const request: AccessRequestRecord = {
    ...input,
    id: `ACCESS-${nextNumber}`,
    submittedAt,
    status: 'pending',
  };
  return withAudit(
    { ...state, requests: [request, ...state.requests] },
    {
      action: 'access_requested',
      actor: request.id,
      subject: request.id,
      occurredAt: submittedAt,
      reason: `${request.requestedRole} workspace requested`,
    },
  );
}

export function decideAccessRequest(
  state: AccessAdministrationState,
  requestId: string,
  decision: 'approve' | 'decline',
  adminId: string,
  occurredAt: string,
  reason: string,
): AccessAdministrationState {
  const request = state.requests.find((candidate) => candidate.id === requestId);
  if (!request) throw new Error('ACCESS_REQUEST_NOT_FOUND');
  if (request.status !== 'pending') throw new Error('ACCESS_REQUEST_ALREADY_DECIDED');
  if (!reason.trim()) throw new Error('DECISION_REASON_REQUIRED');

  const requests = state.requests.map((candidate) =>
    candidate.id === requestId
      ? {
          ...candidate,
          status: decision === 'approve' ? ('approved' as const) : ('declined' as const),
          reviewedAt: occurredAt,
          reviewedBy: adminId,
          reason,
        }
      : candidate,
  );
  const users =
    decision === 'approve'
      ? [
          {
            id: `USR-${1100 + state.users.length}`,
            name: request.name,
            email: request.email,
            organisation: request.organisation,
            roles: [request.requestedRole],
            status: 'active' as const,
            mfa:
              request.requestedRole === 'investor' ? ('optional' as const) : ('required' as const),
            lastActive: 'Never',
            createdFrom: request.id,
          },
          ...state.users,
        ]
      : state.users;
  return withAudit(
    { ...state, requests, users },
    {
      action: decision === 'approve' ? 'access_approved' : 'access_declined',
      actor: adminId,
      subject: request.id,
      occurredAt,
      reason,
    },
  );
}

export function changeUserStatus(
  state: AccessAdministrationState,
  userId: string,
  status: ManagedUserStatus,
  adminId: string,
  occurredAt: string,
  reason: string,
): AccessAdministrationState {
  const user = state.users.find((candidate) => candidate.id === userId);
  if (!user) throw new Error('USER_NOT_FOUND');
  if (!reason.trim()) throw new Error('DECISION_REASON_REQUIRED');
  if (user.status === status) return state;
  return withAudit(
    {
      ...state,
      users: state.users.map((candidate) =>
        candidate.id === userId ? { ...candidate, status } : candidate,
      ),
    },
    {
      action: status === 'active' ? 'user_reactivated' : `user_${status}`,
      actor: adminId,
      subject: userId,
      occurredAt,
      reason,
    },
  );
}
