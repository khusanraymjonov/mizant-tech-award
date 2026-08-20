import { describe, expect, it } from 'vitest';
import {
  changeUserStatus,
  createAccessRequest,
  decideAccessRequest,
  seedAccessAdministrationState,
} from './access-administration';

describe('preview access administration', () => {
  it('creates and approves a fictional access request with an audit trail', () => {
    let state = createAccessRequest(
      seedAccessAdministrationState,
      {
        name: 'Synthetic Investor',
        email: 'synthetic.investor@example.test',
        organisation: 'Individual investor',
        requestedRole: 'investor',
        purpose: 'Explore the investor journey',
      },
      '2026-08-18T09:00:00.000Z',
    );
    const request = state.requests[0]!;
    state = decideAccessRequest(
      state,
      request.id,
      'approve',
      'platform-admin-01',
      '2026-08-18T09:05:00.000Z',
      'Role and scope confirmed',
    );
    expect(state.requests[0]?.status).toBe('approved');
    expect(state.users.some((user) => user.email === request.email)).toBe(true);
    expect(state.audit.at(-1)?.action).toBe('access_approved');
  });

  it('rejects real-looking email domains in the controlled preview', () => {
    expect(() =>
      createAccessRequest(
        seedAccessAdministrationState,
        {
          name: 'Real Person',
          email: 'person@gmail.com',
          organisation: 'Real Organisation',
          requestedRole: 'sme',
          purpose: 'Test',
        },
        '2026-08-18T09:00:00.000Z',
      ),
    ).toThrow('FICTIONAL_EMAIL_REQUIRED');
  });

  it('suspends access without deleting the user or audit history', () => {
    const value = changeUserStatus(
      seedAccessAdministrationState,
      'USR-1001',
      'suspended',
      'platform-admin-01',
      '2026-08-18T09:10:00.000Z',
      'Periodic access review',
    );
    expect(value.users.find((user) => user.id === 'USR-1001')?.status).toBe('suspended');
    expect(value.audit.at(-1)?.action).toBe('user_suspended');
  });
});
