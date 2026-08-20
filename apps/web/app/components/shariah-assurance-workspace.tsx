'use client';

import { useState } from 'react';
import {
  evaluateShariahMonitoring,
  type ShariahMonitoringScenario,
} from '@mizant/domain/issuance-lifecycle';
import { Icon } from './icons';

const conditions = [
  [
    'Asset ownership before lease',
    'Satisfied',
    'Supplier invoice, title schedule and acquisition sequence v1',
  ],
  [
    'Permitted productive use',
    'Satisfied',
    'Food-processing site declaration and equipment specification',
  ],
  [
    'Maintenance responsibility',
    'Satisfied',
    'Owner bears structural maintenance; SME handles operating care',
  ],
  ['Insurance / takaful evidence', 'Due 12 Sep', 'Renewal evidence required before policy expiry'],
  [
    'Late-payment treatment',
    'Satisfied',
    'No income benefit from late-payment charge; approved treatment recorded',
  ],
] as const;

const sources = [
  [
    'AAOIFI Shariah governance standards',
    'https://aaoifi.com/announcement/the-aaoifi-governance-and-ethics-board-ageb-issues-five-governance-stanadrds-on-shariah-governance/?lang=en',
  ],
  [
    'IFSB-19 disclosure principles',
    'https://www.ifsb.org/wp-content/uploads/2023/10/IFSB-19-Guiding-Principles-on-Disclosure-of-ICM-Products-final.pdf',
  ],
] as const;

export function ShariahAssuranceWorkspace() {
  const [scenario, setScenario] = useState<ShariahMonitoringScenario>('operating_as_approved');
  const [reviewOpened, setReviewOpened] = useState(false);
  const result = evaluateShariahMonitoring(scenario);

  return (
    <>
      <section className="shariah-decision-card">
        <div>
          <span className="shariah-calligraphy">ش</span>
          <div>
            <p className="micro-label">Independent case · SHR-MZT-001 · version 1</p>
            <h2>Controlled demonstration review recorded</h2>
            <p>
              The Ijarah structure has a complete synthetic review record for workflow testing. It
              is not a jurisdiction-specific fatwa or live product approval.
            </p>
          </div>
        </div>
        <dl>
          <div>
            <dt>Reviewer role</dt>
            <dd>Independent Shariah reviewer</dd>
          </div>
          <div>
            <dt>Decision date</dt>
            <dd>18 Aug 2026</dd>
          </div>
          <div>
            <dt>Next scheduled review</dt>
            <dd>18 Nov 2026</dd>
          </div>
        </dl>
      </section>

      <div className="shariah-assurance-grid">
        <section className="shariah-conditions-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Ijarah structure controls</p>
              <h2>Conditions and evidence</h2>
              <p>Each condition has an owner, source, due date and lifecycle consequence.</p>
            </div>
            <span className="version-chip">Method v1</span>
          </div>
          <div className="shariah-condition-list">
            {conditions.map(([name, status, evidence], index) => (
              <article key={name}>
                <span className={status === 'Satisfied' ? 'is-complete' : 'is-due'}>
                  {status === 'Satisfied' ? <Icon name="check" size={15} /> : '!'}
                </span>
                <div>
                  <div>
                    <strong>{name}</strong>
                    <span>{status}</span>
                  </div>
                  <p>{evidence}</p>
                  <small>
                    Condition SHR-C{String(index + 1).padStart(2, '0')} · Evidence bundle v1
                  </small>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="shariah-independence-panel">
          <p className="eyebrow">Independence record</p>
          <h2>Authority remains separate.</h2>
          <ul>
            <li>
              <Icon name="check" size={17} />
              <span>
                <strong>Conflict declaration</strong>No commercial origination role held
              </span>
            </li>
            <li>
              <Icon name="check" size={17} />
              <span>
                <strong>Documents reviewed</strong>11 exact versions recorded
              </span>
            </li>
            <li>
              <Icon name="check" size={17} />
              <span>
                <strong>Decision scope</strong>Structure and conditions only
              </span>
            </li>
            <li>
              <Icon name="lock" size={17} />
              <span>
                <strong>Technical admin boundary</strong>Cannot alter the decision
              </span>
            </li>
          </ul>
          <div className="shariah-source-list">
            <span>Governance references</span>
            {sources.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                {label}
                <Icon name="arrow" size={14} />
              </a>
            ))}
          </div>
        </aside>
      </div>

      <section className="shariah-monitoring-panel">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Ongoing assurance</p>
            <h2>Test a lifecycle monitoring event</h2>
            <p>
              Rules identify the impact. Only an authorised independent human may decide the
              outcome.
            </p>
          </div>
          <span className="status-dot">Continuous monitoring</span>
        </div>
        <div className="shariah-monitoring-layout">
          <label>
            <span>Material-event scenario</span>
            <select
              value={scenario}
              onChange={(event) => {
                setScenario(event.target.value as ShariahMonitoringScenario);
                setReviewOpened(false);
              }}
            >
              <option value="operating_as_approved">Operating as approved</option>
              <option value="evidence_overdue">Insurance / takaful evidence overdue</option>
              <option value="asset_use_changed">Asset use materially changed</option>
              <option value="contract_terms_changed">Contract terms materially changed</option>
            </select>
          </label>
          <div
            className={`shariah-monitoring-result shariah-monitoring-result--${result.status}`}
            aria-live="polite"
          >
            <span>
              <Icon name={result.status === 'within_conditions' ? 'check' : 'shield'} size={22} />
            </span>
            <div>
              <small>System recommendation</small>
              <strong>{result.status.replaceAll('_', ' ')}</strong>
              <ul>
                {result.triggers.map((trigger) => (
                  <li key={trigger}>{trigger}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="shariah-human-gate">
            <Icon name="users" size={20} />
            <div>
              <strong>No automatic Shariah decision</strong>
              <span>
                The system can restrict and queue; an independent reviewer records the conclusion
                and rationale.
              </span>
            </div>
            <button
              className="button button--primary"
              type="button"
              disabled={result.status === 'within_conditions' || reviewOpened}
              onClick={() => setReviewOpened(true)}
            >
              {reviewOpened ? 'Review case opened' : 'Open impact assessment'}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
