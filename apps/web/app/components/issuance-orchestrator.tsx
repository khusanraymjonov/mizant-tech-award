'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  advanceIssuance,
  evaluateIssuanceReadiness,
  type GovernedIssuanceCase,
  type IssuanceAction,
  type IssuanceStage,
} from '@mizant/domain/issuance-lifecycle';
import type { Actor, OrganisationRole } from '@mizant/domain';
import { Icon } from './icons';

const storageKey = 'mizant-governed-issuance-v1';

const initialCase: GovernedIssuanceCase = {
  id: 'MZT-SYN-001',
  organisationId: 'mizant-platform',
  stage: 'asset_modelled',
  version: 1,
  synthetic: true,
  assetPoolId: 'SYN-ASSET-POOL-001',
  legalStructureId: 'SYN-IJARAH-SPV-001',
  instrumentId: 'SYN-INST-001',
  rightsVersionId: 'SYN-RIGHTS-001-v1',
  economicsVersionId: 'SYN-ECON-001-v1',
  disclosureVersionId: 'SYN-DISC-001-v1',
  officialRegisterAuthority: 'Synthetic issuer register · mock adapter',
  targetUnits: 2_500n,
  unitPriceMinor: 10_000n,
  currency: 'USD',
  evidenceComplete: true,
  rightsMapped: true,
  registerAuthorityDeclared: true,
  approvals: [],
  confirmedUnits: 0n,
  events: [],
};

const makeActor = (id: string, role: OrganisationRole): Actor => ({
  id,
  organisationId: 'mizant-platform',
  roles: [role],
  kind: 'human',
});

const actionPlan: readonly {
  action: IssuanceAction;
  role: OrganisationRole;
  actor: string;
  title: string;
  description: string;
  button: string;
}[] = [
  {
    action: 'submit_evidence',
    role: 'originator',
    actor: 'originator-demo-01',
    title: 'Freeze the evidence pack',
    description: 'Bind the verified equipment, supplier, ownership and SME evidence to version 1.',
    button: 'Freeze evidence pack',
  },
  {
    action: 'submit_governance',
    role: 'operations_maker',
    actor: 'operations-maker-01',
    title: 'Open independent governance review',
    description: 'Hand the exact asset, rights and disclosure versions to separate control owners.',
    button: 'Submit to governance',
  },
  {
    action: 'approve_legal',
    role: 'legal_reviewer',
    actor: 'legal-reviewer-01',
    title: 'Record legal rights review',
    description:
      'Confirm the demonstration rights map and register authority for this controlled case.',
    button: 'Record legal review',
  },
  {
    action: 'approve_compliance',
    role: 'compliance_reviewer',
    actor: 'compliance-reviewer-01',
    title: 'Record compliance review',
    description:
      'Confirm eligibility, financial-crime and distribution controls for the synthetic route.',
    button: 'Record compliance review',
  },
  {
    action: 'approve_shariah',
    role: 'shariah_reviewer',
    actor: 'shariah-reviewer-01',
    title: 'Record independent Shariah review',
    description: 'Bind the Ijarah checklist, conditions and reviewer evidence to the same version.',
    button: 'Record Shariah review',
  },
  {
    action: 'prepare_issuance',
    role: 'ownership_administrator',
    actor: 'ownership-maker-01',
    title: 'Prepare the issuance instruction',
    description: 'Create one idempotent off-chain instruction for the approved fixed supply.',
    button: 'Prepare issuance instruction',
  },
  {
    action: 'approve_issuance',
    role: 'operations_checker',
    actor: 'operations-checker-02',
    title: 'Approve as an independent checker',
    description: 'A different human checks the exact instruction, supply and policy version.',
    button: 'Approve exact instruction',
  },
  {
    action: 'confirm_register',
    role: 'ownership_administrator',
    actor: 'register-checker-02',
    title: 'Confirm the mock official register',
    description: 'The separate register operator confirms all 2,500 units against the instruction.',
    button: 'Confirm register instruction',
  },
  {
    action: 'reconcile',
    role: 'operations_checker',
    actor: 'operations-checker-02',
    title: 'Reconcile all records',
    description: 'Compare approved supply, internal ledger and mock register before final status.',
    button: 'Run final reconciliation',
  },
];

const stages: readonly { id: IssuanceStage; label: string; detail: string }[] = [
  { id: 'asset_modelled', label: 'Asset & rights', detail: 'Canonical records separated' },
  { id: 'evidence_ready', label: 'Evidence freeze', detail: 'Version-bound source pack' },
  {
    id: 'governance_review',
    label: 'Independent approvals',
    detail: 'Legal, compliance and Shariah',
  },
  {
    id: 'issuance_prepared',
    label: 'Instruction prepared',
    detail: 'Idempotent fixed-supply request',
  },
  { id: 'checker_approved', label: 'Checker approved', detail: 'Maker-checker separated' },
  {
    id: 'register_confirmed',
    label: 'Register confirmed',
    detail: 'Mock authority acknowledgement',
  },
  { id: 'reconciled', label: 'Reconciled', detail: 'Supply and positions balanced' },
];

const replay = (actions: readonly IssuanceAction[]) =>
  actions.reduce((value, action, index) => {
    const plan = actionPlan.find((item) => item.action === action);
    if (!plan) return value;
    return advanceIssuance(
      value,
      action,
      makeActor(plan.actor, plan.role),
      `2026-08-18T${String(9 + Math.floor(index / 6)).padStart(2, '0')}:${String((index * 7) % 60).padStart(2, '0')}:00.000Z`,
    );
  }, initialCase);

export function IssuanceOrchestrator() {
  const [actions, setActions] = useState<readonly IssuanceAction[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as IssuanceAction[];
      if (Array.isArray(parsed)) {
        replay(parsed);
        setActions(parsed);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  const issuance = useMemo(() => replay(actions), [actions]);
  const next = actionPlan[actions.length];
  const checks = evaluateIssuanceReadiness(issuance);
  const stageIndex = stages.findIndex((stage) => stage.id === issuance.stage);

  const advance = () => {
    if (!next) return;
    try {
      const value = [...actions, next.action];
      replay(value);
      setActions(value);
      window.localStorage.setItem(storageKey, JSON.stringify(value));
      setMessage(`${next.title} was recorded by ${next.actor}.`);
    } catch (cause) {
      setMessage(cause instanceof Error ? cause.message.replaceAll('_', ' ') : 'Action blocked');
    }
  };

  const reset = () => {
    setActions([]);
    setMessage('The controlled issuance case was reset to its approved starting fixture.');
    window.localStorage.removeItem(storageKey);
  };

  return (
    <section className="issuance-orchestrator" aria-labelledby="issuance-workflow-title">
      <div className="issuance-orchestrator__heading">
        <div>
          <p className="eyebrow">End-to-end issuance procedure</p>
          <h2 id="issuance-workflow-title">
            Tokenise the reference asset, one controlled gate at a time.
          </h2>
          <p>
            Follow the exact path from verified equipment to a reconciled digital-unit register.
          </p>
        </div>
        <button type="button" className="text-button" onClick={reset}>
          Reset workflow
        </button>
      </div>

      <div className="issuance-layout">
        <aside className="issuance-stage-rail" aria-label="Issuance stages">
          <div className="issuance-case-id">
            <span className="status-dot">Case in progress</span>
            <strong>MZT-SYN-001</strong>
            <small>Object version {issuance.version}</small>
          </div>
          <ol>
            {stages.map((stage, index) => (
              <li
                key={stage.id}
                className={
                  index < stageIndex ? 'is-complete' : index === stageIndex ? 'is-current' : ''
                }
              >
                <span>{index < stageIndex ? <Icon name="check" size={15} /> : index + 1}</span>
                <div>
                  <strong>{stage.label}</strong>
                  <small>{stage.detail}</small>
                </div>
              </li>
            ))}
          </ol>
        </aside>

        <div className="issuance-workspace">
          <section className="canonical-stack" aria-label="Canonical transaction layers">
            <div>
              <span>01</span>
              <small>Asset pool</small>
              <strong>SYN-ASSET-POOL-001</strong>
              <p>42 identifiable solar equipment units</p>
            </div>
            <div>
              <span>02</span>
              <small>Legal structure</small>
              <strong>SYN-IJARAH-SPV-001</strong>
              <p>Project vehicle owns and leases equipment</p>
            </div>
            <div>
              <span>03</span>
              <small>Rights & economics</small>
              <strong>RIGHTS / ECON v1</strong>
              <p>Defined beneficial rights and rental waterfall</p>
            </div>
            <div>
              <span>04</span>
              <small>Digital instrument</small>
              <strong>SYN-INST-001</strong>
              <p>2,500 restricted units · $100 reference</p>
            </div>
          </section>

          <div className="issuance-action-grid">
            <section className="issuance-next-action">
              {next ? (
                <>
                  <div className="issuance-action-role">
                    <span>{actions.length + 1}</span>
                    <div>
                      <small>Current responsible role</small>
                      <strong>{next.role.replaceAll('_', ' ')}</strong>
                    </div>
                  </div>
                  <p className="eyebrow">Next controlled action</p>
                  <h3>{next.title}</h3>
                  <p>{next.description}</p>
                  <div className="issuance-actor">
                    <Icon name="users" size={17} />
                    <span>
                      <strong>Acting as {next.actor}</strong>Human demonstration identity ·
                      organisation scoped
                    </span>
                  </div>
                  <button className="button button--primary" type="button" onClick={advance}>
                    {next.button}
                    <Icon name="arrow" size={17} />
                  </button>
                </>
              ) : (
                <div className="issuance-complete">
                  <span>
                    <Icon name="check" size={28} />
                  </span>
                  <p className="eyebrow">Controlled issuance complete</p>
                  <h3>2,500 units reconcile across every governed record.</h3>
                  <p>
                    The mock register confirmed the instruction and the independent checker recorded
                    the final reconciliation.
                  </p>
                </div>
              )}
            </section>

            <section className="issuance-gate-panel">
              <div>
                <p className="eyebrow">Release-gate evidence</p>
                <span>
                  {checks.filter((check) => check.passed).length} / {checks.length} passed
                </span>
              </div>
              <ul>
                {checks.map((check) => (
                  <li key={check.code} className={check.passed ? 'is-passed' : ''}>
                    <span>{check.passed ? <Icon name="check" size={14} /> : '·'}</span>
                    <div>
                      <strong>{check.label}</strong>
                      <small>{check.code.replaceAll('_', ' ')}</small>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {message ? (
            <div className="issuance-message" role="status">
              <Icon name="document" size={18} />
              <span>
                <strong>Audit event recorded</strong>
                {message}
              </span>
            </div>
          ) : null}

          <section className="issuance-ledger">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">Register & ledger reconciliation</p>
                <h3>Fixed supply control</h3>
              </div>
              <span
                className={`register-balance-chip ${issuance.stage === 'reconciled' ? 'is-balanced' : ''}`}
              >
                {issuance.stage === 'reconciled' ? 'Balanced' : 'Pending confirmation'}
              </span>
            </div>
            <div className="issuance-ledger-grid">
              <div>
                <span>Approved supply</span>
                <strong>2,500</strong>
                <small>Instrument terms v1</small>
              </div>
              <span>=</span>
              <div>
                <span>Investor positions</span>
                <strong>{issuance.stage === 'reconciled' ? '1,700' : '—'}</strong>
                <small>Confirmed holder references</small>
              </div>
              <span>+</span>
              <div>
                <span>Unallocated pool</span>
                <strong>{issuance.stage === 'reconciled' ? '800' : '—'}</strong>
                <small>Controlled remaining capacity</small>
              </div>
              <span className="ledger-difference">
                Difference <strong>{issuance.stage === 'reconciled' ? '0' : 'Pending'}</strong>
              </span>
            </div>
          </section>

          <details className="issuance-audit-details">
            <summary>
              View complete issuance audit history <span>{issuance.events.length} events</span>
            </summary>
            <ol>
              {issuance.events.map((event) => (
                <li key={event.sequence}>
                  <span>#{String(event.sequence).padStart(2, '0')}</span>
                  <div>
                    <strong>{event.action.replaceAll('_', ' ')}</strong>
                    <small>
                      {event.actorId} · {event.actorRole.replaceAll('_', ' ')} ·{' '}
                      {event.evidenceReference}
                    </small>
                  </div>
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>
    </section>
  );
}
