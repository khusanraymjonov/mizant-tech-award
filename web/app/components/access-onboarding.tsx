'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './icons';
import {
  accessAdministrationStorageKey,
  createAccessRequest,
  parseAccessAdministrationState,
  type ExternalWorkspaceRole,
} from '../lib/access-administration';

const roleOptions: Record<
  ExternalWorkspaceRole,
  { label: string; description: string; route: string; next: readonly string[] }
> = {
  investor: {
    label: 'Investor',
    description: 'Understand opportunities, complete eligibility steps and follow holdings.',
    route: '/demo',
    next: ['Review investor readiness', 'Understand rights and risks', 'Simulate a commitment'],
  },
  sme: {
    label: 'SME / asset user',
    description: 'Request productive equipment, provide evidence and track obligations.',
    route: '/applications',
    next: ['Describe the asset need', 'Prepare the evidence pack', 'Track human review'],
  },
  originator: {
    label: 'Originator',
    description: 'Invite SMEs, assemble assets and coordinate review-ready submissions.',
    route: '/origination',
    next: ['Build a pipeline', 'Check evidence readiness', 'Hand off to independent review'],
  },
};

export function AccessOnboarding() {
  const [role, setRole] = useState<ExternalWorkspaceRole>('investor');
  const [name, setName] = useState('Amina Preview');
  const [email, setEmail] = useState('amina.preview@example.test');
  const [organisation, setOrganisation] = useState('Fictional organisation');
  const [submittedReference, setSubmittedReference] = useState('');
  const [error, setError] = useState('');
  const selected = roleOptions[role];
  const purpose = `Explore the ${selected.label.toLowerCase()} workspace`;

  const submit = () => {
    try {
      const current = parseAccessAdministrationState(
        window.localStorage.getItem(accessAdministrationStorageKey),
      );
      const next = createAccessRequest(
        current,
        { name, email, organisation, requestedRole: role, purpose },
        new Date().toISOString(),
      );
      window.localStorage.setItem(accessAdministrationStorageKey, JSON.stringify(next));
      setSubmittedReference(next.requests[0]?.id ?? 'ACCESS-NEW');
      setError('');
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message === 'REQUEST_ALREADY_EXISTS'
          ? 'A request already exists for this fictional email. Open the workspace or reset browser storage to start again.'
          : 'Use a fictional address ending in @example.test. Never enter a real person’s details here.',
      );
    }
  };

  return (
    <div className="access-onboarding-layout">
      <section className="access-role-panel" aria-labelledby="choose-role-title">
        <p className="eyebrow">Choose your perspective</p>
        <h2 id="choose-role-title">What brings you to Mizant?</h2>
        <div className="access-role-options">
          {(
            Object.entries(roleOptions) as [
              ExternalWorkspaceRole,
              (typeof roleOptions)[ExternalWorkspaceRole],
            ][]
          ).map(([id, option]) => (
            <button
              className={role === id ? 'is-selected' : ''}
              type="button"
              key={id}
              onClick={() => setRole(id)}
              aria-pressed={role === id}
            >
              <span>{id === 'investor' ? <Icon name="users" /> : <Icon name="building" />}</span>
              <div>
                <strong>{option.label}</strong>
                <small>{option.description}</small>
              </div>
              <Icon name="arrow" size={17} />
            </button>
          ))}
        </div>
        <div className="role-first-steps">
          <span>Your guided first steps</span>
          <ol>
            {selected.next.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      </section>

      <section className="access-request-panel" aria-labelledby="request-access-title">
        {submittedReference ? (
          <div className="access-success" role="status">
            <span>
              <Icon name="check" size={25} />
            </span>
            <p className="eyebrow">Request recorded · {submittedReference}</p>
            <h2>Your {selected.label.toLowerCase()} preview is ready.</h2>
            <p>
              The access request is now visible in the administrator queue. You can explore the
              guided workspace while the controlled approval process is demonstrated.
            </p>
            <div className="access-success__actions">
              <Link className="button button--primary" href={selected.route}>
                Open my workspace <Icon name="arrow" size={17} />
              </Link>
              <Link className="button button--secondary" href="/learn">
                View the learning centre
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Preview access request</p>
                <h2 id="request-access-title">Create a fictional profile</h2>
                <p>Use only invented details. Identity verification remains provider-gated.</p>
              </div>
              <span className="version-chip">Step 1 of 1</span>
            </div>
            <div className="access-form-grid">
              <label>
                <span>Fictional name</span>
                <input value={name} onChange={(event) => setName(event.target.value)} />
              </label>
              <label>
                <span>Fictional work email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-describedby="fictional-email-note"
                />
                <small id="fictional-email-note">Must end in @example.test</small>
              </label>
              <label>
                <span>Fictional organisation</span>
                <input
                  value={organisation}
                  onChange={(event) => setOrganisation(event.target.value)}
                />
              </label>
              <div className="access-scope-summary">
                <span>Requested access</span>
                <strong>{selected.label} workspace</strong>
                <small>Least-privilege access · no approval authority</small>
              </div>
            </div>
            {error ? (
              <p className="form-error" role="alert">
                {error}
              </p>
            ) : null}
            <div className="access-form-footer">
              <div>
                <Icon name="shield" size={19} />
                <span>
                  <strong>Admin approval is recorded</strong>
                  Every grant, suspension and removal remains in the audit history.
                </span>
              </div>
              <button className="button button--primary" type="button" onClick={submit}>
                Request preview access <Icon name="arrow" size={17} />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
