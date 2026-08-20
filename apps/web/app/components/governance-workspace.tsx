'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from './icons';

const reviewLanes = [
  [
    'Asset diligence',
    'Complete',
    'Samira K. · Asset analyst',
    'Supplier, site and equipment evidence linked',
  ],
  [
    'Compliance & risk',
    'Complete',
    'Daniel R. · Independent checker',
    'Synthetic KYB and ownership checks reviewed',
  ],
  [
    'Legal structure',
    'Conditional',
    'External counsel placeholder',
    'Jurisdiction-specific opinion still required for pilot',
  ],
  [
    'Independent Shariah',
    'Conditional',
    'Adviser appointment pending',
    'Illustrative structure only; no ruling implied',
  ],
] as const;

const initialAuditEvents = [
  ['10:42', 'Synthetic disclosure v1 approved for preview', 'checker-demo-02'],
  ['10:31', 'Asset diligence evidence pack marked complete', 'asset-reviewer-01'],
  ['10:18', 'Ownership mismatch routed to manual review', 'policy-engine-v1'],
  ['09:54', 'Originator submitted application version 1', 'originator-demo-01'],
] as const;

export function GovernanceWorkspace({ activeRole }: { activeRole: 'operations' | 'compliance' }) {
  const [stage, setStage] = useState<'ready' | 'handed_off' | 'checked'>(
    activeRole === 'compliance' ? 'handed_off' : 'ready',
  );
  const [auditEvents, setAuditEvents] = useState<readonly (readonly [string, string, string])[]>(
    activeRole === 'compliance'
      ? [
          ['Now', 'Disclosure v2 received from operations maker', 'operations-demo-01'],
          ...initialAuditEvents,
        ]
      : initialAuditEvents,
  );

  const recordHandoff = () => {
    if (activeRole !== 'operations' || stage !== 'ready') return;
    setStage('handed_off');
    setAuditEvents((events) => [
      ['Now', 'Disclosure v2 handed to independent checker', 'operations-demo-01'],
      ...events,
    ]);
  };

  const recordCheck = () => {
    if (activeRole !== 'compliance' || stage !== 'handed_off') return;
    setStage('checked');
    setAuditEvents((events) => [
      ['Now', 'Independent synthetic check recorded for disclosure v2', 'checker-demo-02'],
      ...events,
    ]);
  };

  const exportAudit = () => {
    const csv = [
      'Time,Event,Actor',
      ...auditEvents.map(([time, event, actor]) => `"${time}","${event}","${actor}"`),
    ].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mizant-synthetic-audit-events.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="governance-banner">
        <div>
          <span className="governance-banner__icon">
            <Icon name="shield" size={27} />
          </span>
          <div>
            <p className="micro-label">Opportunity control status · MZT-SYN-001</p>
            <h2>Safe for synthetic demonstration only</h2>
            <p>
              Two review lanes contain pilot conditions. Live publication, money movement and
              ownership issuance remain unavailable.
            </p>
          </div>
        </div>
        <div className="gate-score">
          <strong>4</strong>
          <span>review lanes evidenced</span>
          <small>2 conditional for pilot</small>
        </div>
      </section>

      <div className="governance-grid">
        <section className="governance-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Independent review lanes</p>
              <h2>Release checklist</h2>
            </div>
            <span className="version-chip">Policy v1</span>
          </div>
          <div className="review-lanes">
            {reviewLanes.map(([name, status, owner, note]) => (
              <article key={name}>
                <span
                  className={
                    status === 'Complete'
                      ? 'review-mark review-mark--complete'
                      : 'review-mark review-mark--conditional'
                  }
                >
                  {status === 'Complete' ? <Icon name="check" size={16} /> : '!'}
                </span>
                <div>
                  <div>
                    <strong>{name}</strong>
                    <span>{status}</span>
                  </div>
                  <p>{note}</p>
                  <small>{owner}</small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="governance-panel maker-checker-panel">
          <p className="eyebrow">Maker-checker control</p>
          <h2>One person prepares. Another checks.</h2>
          <div className="maker-checker">
            <div className={activeRole === 'operations' ? 'is-active-role' : ''}>
              <span>M</span>
              <div>
                <strong>Operations maker</strong>
                <p>Prepared disclosure v2</p>
                <small>operations-demo-01</small>
              </div>
            </div>
            <span className="maker-line">Attributable hand-off</span>
            <div className={activeRole === 'compliance' ? 'is-active-role' : ''}>
              <span>C</span>
              <div>
                <strong>Independent checker</strong>
                <p>Reviews the exact version</p>
                <small>checker-demo-02</small>
              </div>
            </div>
          </div>
          <div
            className={`control-result ${stage === 'checked' ? 'control-result--complete' : ''}`}
            aria-live="polite"
          >
            <Icon name={stage === 'ready' ? 'document' : 'check'} size={18} />
            <span>
              <strong>
                {stage === 'ready'
                  ? 'Ready for hand-off'
                  : stage === 'handed_off'
                    ? 'Awaiting independent check'
                    : 'Separation confirmed'}
              </strong>
              {stage === 'ready'
                ? 'The maker may submit this exact version for checking.'
                : stage === 'handed_off'
                  ? 'Only a different synthetic user may record the check.'
                  : 'Different synthetic users completed the two actions.'}
            </span>
          </div>
          {activeRole === 'operations' ? (
            <>
              <button
                className="button button--primary control-action"
                type="button"
                onClick={recordHandoff}
                disabled={stage !== 'ready'}
              >
                Record maker hand-off <Icon name="arrow" size={17} />
              </button>
              {stage === 'handed_off' ? (
                <Link className="checker-switch-link" href="/governance?role=compliance">
                  Continue as independent checker →
                </Link>
              ) : null}
            </>
          ) : (
            <button
              className="button button--primary control-action"
              type="button"
              onClick={recordCheck}
              disabled={stage === 'checked'}
            >
              Record independent check <Icon name="check" size={17} />
            </button>
          )}
        </section>
      </div>

      <div className="governance-grid governance-grid--lower">
        <section className="governance-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Append-only history</p>
              <h2>Recent audit events</h2>
            </div>
            <button className="text-button" type="button" onClick={exportAudit}>
              Export synthetic CSV
            </button>
          </div>
          <div className="audit-timeline">
            {auditEvents.map(([time, event, actor], index) => (
              <article key={`${time}-${event}-${index}`}>
                <time>{time}</time>
                <span />
                <div>
                  <strong>{event}</strong>
                  <small>Actor · {actor}</small>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="governance-panel control-boundaries">
          <p className="eyebrow">Hard boundaries</p>
          <h2>Disabled by design</h2>
          <ul>
            <li>
              <Icon name="lock" size={17} />
              <span>
                <strong>Live funding</strong>No customer money or payment instruction
              </span>
            </li>
            <li>
              <Icon name="lock" size={17} />
              <span>
                <strong>Production ownership</strong>No live register or token issuance
              </span>
            </li>
            <li>
              <Icon name="lock" size={17} />
              <span>
                <strong>Automated approval</strong>No AI, rule or provider can give final clearance
              </span>
            </li>
            <li>
              <Icon name="lock" size={17} />
              <span>
                <strong>Public transfer</strong>No secondary market or permissionless wallet path
              </span>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
