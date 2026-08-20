'use client';

import { useEffect, useState } from 'react';
import { Icon } from './icons';
import {
  accessAdministrationStorageKey,
  changeUserStatus,
  decideAccessRequest,
  parseAccessAdministrationState,
  seedAccessAdministrationState,
  type AccessAdministrationState,
  type ManagedUserStatus,
} from '../lib/access-administration';

type AdminView = 'access' | 'users' | 'controls' | 'audit';
const adminId = 'platform-admin-01';

const formatDate = (value: string) =>
  value === 'Never'
    ? value
    : new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value));

export function AdminConsole() {
  const [state, setState] = useState<AccessAdministrationState>(seedAccessAdministrationState);
  const [view, setView] = useState<AdminView>('access');
  const [selectedRequest, setSelectedRequest] = useState('ACCESS-1024');
  const [selectedUser, setSelectedUser] = useState('USR-1001');
  const [reason, setReason] = useState('Role and organisation scope confirmed for preview access');
  const [message, setMessage] = useState('');

  useEffect(() => {
    setState(
      parseAccessAdministrationState(window.localStorage.getItem(accessAdministrationStorageKey)),
    );
  }, []);

  const persist = (next: AccessAdministrationState, result: string) => {
    setState(next);
    window.localStorage.setItem(accessAdministrationStorageKey, JSON.stringify(next));
    setMessage(result);
  };

  const request = state.requests.find((candidate) => candidate.id === selectedRequest);
  const user = state.users.find((candidate) => candidate.id === selectedUser);
  const pendingRequests = state.requests.filter((candidate) => candidate.status === 'pending');
  const activeUsers = state.users.filter((candidate) => candidate.status === 'active');
  const privilegedReadiness = [
    ['Privileged MFA', 'Configured', 'Required before live privileged accounts'],
    ['Role review', 'Due in 43 days', 'Quarterly review schedule'],
    ['Session revocation', 'Provider-gated', 'Adapter boundary ready; identity provider required'],
    ['Emergency suspension', 'Available', 'Investor, user, offering and system scopes'],
    ['Audit export', 'Available', `${state.audit.length} attributable events in this browser`],
  ] as const;

  const decide = (decision: 'approve' | 'decline') => {
    if (!request) return;
    try {
      const next = decideAccessRequest(
        state,
        request.id,
        decision,
        adminId,
        new Date().toISOString(),
        reason,
      );
      persist(
        next,
        decision === 'approve'
          ? `${request.name} now has scoped ${request.requestedRole} access.`
          : `${request.name} was declined with a recorded reason.`,
      );
      setSelectedRequest(
        next.requests.find((candidate) => candidate.status === 'pending')?.id ?? '',
      );
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message.replaceAll('_', ' ') : 'Action failed');
    }
  };

  const setUserStatus = (status: ManagedUserStatus) => {
    if (!user) return;
    try {
      const next = changeUserStatus(
        state,
        user.id,
        status,
        adminId,
        new Date().toISOString(),
        reason,
      );
      persist(next, `${user.name} is now ${status}.`);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message.replaceAll('_', ' ') : 'Action failed');
    }
  };

  const exportAudit = () => {
    const rows = [
      ['Sequence', 'Action', 'Actor', 'Subject', 'Occurred at', 'Reason'],
      ...state.audit.map((event) => [
        String(event.sequence),
        event.action,
        event.actor,
        event.subject,
        event.occurredAt,
        event.reason,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mizant-access-audit.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="admin-kpis" aria-label="Administration summary">
        <article>
          <span>Pending access</span>
          <strong>{pendingRequests.length}</strong>
          <small>Awaiting administrator decision</small>
        </article>
        <article>
          <span>Active users</span>
          <strong>{activeUsers.length}</strong>
          <small>Across investor, SME and originator roles</small>
        </article>
        <article>
          <span>Privileged roles</span>
          <strong>6</strong>
          <small>MFA and periodic review required</small>
        </article>
        <article>
          <span>Open control alerts</span>
          <strong>2</strong>
          <small>One access review · one evidence expiry</small>
        </article>
      </section>

      <nav className="admin-view-tabs" aria-label="Administration views">
        {(
          [
            ['access', 'Access requests', pendingRequests.length],
            ['users', 'People & roles', state.users.length],
            ['controls', 'Platform controls', 2],
            ['audit', 'Audit trail', state.audit.length],
          ] as const
        ).map(([id, label, count]) => (
          <button
            type="button"
            key={id}
            className={view === id ? 'is-active' : ''}
            onClick={() => setView(id)}
          >
            {label}
            <span>{count}</span>
          </button>
        ))}
      </nav>

      {message ? (
        <div className="admin-action-message" role="status">
          <Icon name="check" size={18} />
          {message}
        </div>
      ) : null}

      {view === 'access' ? (
        <div className="admin-master-detail">
          <section className="admin-record-list" aria-label="Access requests">
            <div className="admin-list-heading">
              <span>Request queue</span>
              <strong>{pendingRequests.length} pending</strong>
            </div>
            {state.requests.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedRequest(item.id)}
                className={request?.id === item.id ? 'is-selected' : ''}
              >
                <span className={`admin-record-icon admin-record-icon--${item.requestedRole}`}>
                  <Icon name={item.requestedRole === 'investor' ? 'users' : 'building'} size={18} />
                </span>
                <div>
                  <span>{item.id}</span>
                  <strong>{item.name}</strong>
                  <small>{item.organisation}</small>
                </div>
                <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
              </button>
            ))}
          </section>
          {request ? (
            <section className="admin-record-detail">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{request.id}</p>
                  <h2>{request.name}</h2>
                  <p>{request.email}</p>
                </div>
                <span className={`admin-status admin-status--${request.status}`}>
                  {request.status}
                </span>
              </div>
              <div className="admin-detail-facts">
                <div>
                  <span>Organisation</span>
                  <strong>{request.organisation}</strong>
                </div>
                <div>
                  <span>Requested role</span>
                  <strong>{request.requestedRole}</strong>
                </div>
                <div>
                  <span>Purpose</span>
                  <strong>{request.purpose}</strong>
                </div>
                <div>
                  <span>Requested</span>
                  <strong>{formatDate(request.submittedAt)}</strong>
                </div>
              </div>
              <div className="admin-control-checks">
                <h3>Access decision checks</h3>
                <ul>
                  <li>
                    <Icon name="check" size={16} />
                    <span>
                      <strong>Least privilege</strong>One external workspace role only
                    </span>
                  </li>
                  <li>
                    <Icon name="check" size={16} />
                    <span>
                      <strong>Organisation scope</strong>Records limited to the assigned
                      organisation
                    </span>
                  </li>
                  <li>
                    <Icon name="shield" size={16} />
                    <span>
                      <strong>Provider gate</strong>Real identity and email verification not active
                    </span>
                  </li>
                </ul>
              </div>
              <label className="admin-reason">
                <span>Decision reason</span>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                />
              </label>
              {request.status === 'pending' ? (
                <div className="admin-detail-actions">
                  <button
                    className="button button--secondary"
                    type="button"
                    onClick={() => decide('decline')}
                  >
                    Decline request
                  </button>
                  <button
                    className="button button--primary"
                    type="button"
                    onClick={() => decide('approve')}
                  >
                    Approve scoped access <Icon name="check" size={17} />
                  </button>
                </div>
              ) : (
                <p className="admin-decision-note">
                  Decision recorded by {request.reviewedBy} · {request.reason}
                </p>
              )}
            </section>
          ) : null}
        </div>
      ) : null}

      {view === 'users' ? (
        <div className="admin-master-detail">
          <section className="admin-record-list" aria-label="Managed users">
            <div className="admin-list-heading">
              <span>People directory</span>
              <strong>{state.users.length} users</strong>
            </div>
            {state.users.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => setSelectedUser(item.id)}
                className={user?.id === item.id ? 'is-selected' : ''}
              >
                <span className="admin-avatar">
                  {item.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')
                    .slice(0, 2)}
                </span>
                <div>
                  <span>{item.id}</span>
                  <strong>{item.name}</strong>
                  <small>{item.roles.join(', ')}</small>
                </div>
                <span className={`admin-status admin-status--${item.status}`}>{item.status}</span>
              </button>
            ))}
          </section>
          {user ? (
            <section className="admin-record-detail">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">{user.id}</p>
                  <h2>{user.name}</h2>
                  <p>{user.email}</p>
                </div>
                <span className={`admin-status admin-status--${user.status}`}>{user.status}</span>
              </div>
              <div className="admin-detail-facts">
                <div>
                  <span>Organisation</span>
                  <strong>{user.organisation}</strong>
                </div>
                <div>
                  <span>Role assignment</span>
                  <strong>{user.roles.join(', ')}</strong>
                </div>
                <div>
                  <span>MFA posture</span>
                  <strong>{user.mfa}</strong>
                </div>
                <div>
                  <span>Last active</span>
                  <strong>{formatDate(user.lastActive)}</strong>
                </div>
              </div>
              <div className="admin-role-boundary">
                <Icon name="lock" size={19} />
                <div>
                  <strong>Technical admin does not grant business approval authority</strong>
                  <span>
                    Legal, compliance, Shariah and financial approvals remain independently
                    assigned.
                  </span>
                </div>
              </div>
              <label className="admin-reason">
                <span>Change reason</span>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={3}
                />
              </label>
              <div className="admin-detail-actions admin-detail-actions--three">
                <button
                  className="button button--secondary"
                  type="button"
                  disabled={user.status === 'removed'}
                  onClick={() => setUserStatus('removed')}
                >
                  Remove access
                </button>
                <button
                  className="button button--secondary"
                  type="button"
                  disabled={user.status === 'suspended' || user.status === 'removed'}
                  onClick={() => setUserStatus('suspended')}
                >
                  Suspend
                </button>
                <button
                  className="button button--primary"
                  type="button"
                  disabled={user.status === 'active'}
                  onClick={() => setUserStatus('active')}
                >
                  Reactivate
                </button>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}

      {view === 'controls' ? (
        <section className="admin-controls-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Security & operating controls</p>
              <h2>Platform control posture</h2>
              <p>
                High-risk capabilities remain fail-closed until the required provider and
                professional gates exist.
              </p>
            </div>
            <span className="version-chip">Control set v1</span>
          </div>
          <div className="admin-control-table">
            {privilegedReadiness.map(([control, status, detail]) => (
              <article key={control}>
                <div>
                  <strong>{control}</strong>
                  <span>{detail}</span>
                </div>
                <span>{status}</span>
              </article>
            ))}
          </div>
          <div className="admin-kill-switches">
            <div>
              <Icon name="lock" size={21} />
              <span>
                <strong>Live money</strong>Disabled globally
              </span>
              <button type="button" disabled>
                Locked
              </button>
            </div>
            <div>
              <Icon name="layers" size={21} />
              <span>
                <strong>Production chain</strong>Disabled globally
              </span>
              <button type="button" disabled>
                Locked
              </button>
            </div>
            <div>
              <Icon name="shield" size={21} />
              <span>
                <strong>Automated approvals</strong>Prohibited
              </span>
              <button type="button" disabled>
                Locked
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {view === 'audit' ? (
        <section className="admin-audit-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Append-only evidence</p>
              <h2>Access administration history</h2>
              <p>Every decision records the actor, subject, time and reason.</p>
            </div>
            <button
              type="button"
              className="button button--secondary button--compact"
              onClick={exportAudit}
            >
              Export CSV
            </button>
          </div>
          <div className="admin-audit-table" role="table" aria-label="Access audit history">
            {state.audit
              .slice()
              .reverse()
              .map((event) => (
                <article key={event.sequence} role="row">
                  <span>#{String(event.sequence).padStart(3, '0')}</span>
                  <div>
                    <strong>{event.action.replaceAll('_', ' ')}</strong>
                    <small>{event.reason}</small>
                  </div>
                  <div>
                    <span>{event.actor}</span>
                    <small>{event.subject}</small>
                  </div>
                  <time>{formatDate(event.occurredAt)}</time>
                </article>
              ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
