'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { money, solarOpportunity } from '../lib/demo-data';

export default function SubscribePage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(1_000);
  const [confirmed, setConfirmed] = useState(false);
  const [understood, setUnderstood] = useState({
    rights: false,
    liquidity: false,
    cashFlow: false,
  });
  const units = Math.max(1, Math.floor(amount / solarOpportunity.unitPrice));
  const comprehensionComplete = Object.values(understood).every(Boolean);

  return (
    <DemoShell
      active="Opportunities"
      eyebrow="Synthetic commitment"
      title={
        step === 3 ? 'Your demonstration commitment is recorded.' : 'Review before you simulate.'
      }
      description={
        step === 3
          ? 'The platform has created an attributable, non-financial demo record. No money moved and no ownership was created.'
          : 'This short flow demonstrates amount selection, comprehension, exact-version consent and a safe non-live confirmation.'
      }
    >
      <div className="subscription-layout">
        <section className="subscription-flow">
          <ol className="stepper" aria-label="Commitment progress">
            {['Amount', 'Review & consent', 'Confirmation'].map((label, index) => (
              <li key={label} className={step >= index + 1 ? 'is-active' : ''}>
                <span>{step > index + 1 ? <Icon name="check" size={15} /> : index + 1}</span>
                {label}
              </li>
            ))}
          </ol>

          {step === 1 ? (
            <div className="flow-panel">
              <p className="eyebrow">Step 1 · Select an amount</p>
              <h2>How much would you like to simulate?</h2>
              <p>
                Units are illustrative digital references priced at{' '}
                {money(solarOpportunity.unitPrice)} each.
              </p>
              <label className="amount-field">
                <span>Commitment amount (USD)</span>
                <div>
                  <span>$</span>
                  <input
                    aria-label="Commitment amount in US dollars"
                    type="number"
                    min="100"
                    max="25000"
                    step="100"
                    value={amount}
                    onChange={(event) => setAmount(Number(event.target.value))}
                  />
                </div>
              </label>
              <div className="unit-result">
                <span>Illustrative units</span>
                <strong>{units}</strong>
                <small>{money(units * solarOpportunity.unitPrice)} simulated total</small>
              </div>
              <div className="flow-actions">
                <Link className="button button--secondary" href="/opportunities/solar-ijarah">
                  Back to opportunity
                </Link>
                <button
                  className="button button--primary"
                  onClick={() => setStep(2)}
                  disabled={amount < 100 || amount > 25_000}
                >
                  Continue to review <Icon name="arrow" size={18} />
                </button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="flow-panel">
              <p className="eyebrow">Step 2 · Review & consent</p>
              <h2>Make sure the key facts are clear</h2>
              <div className="comprehension-box">
                <strong>Check your understanding before continuing</strong>
                <p>
                  The reference asset can lose value, the SME may fail to pay rent, liquidity is not
                  promised, and the final structure requires professional approval.
                </p>
              </div>
              <fieldset className="comprehension-checklist">
                <legend>Key points I understand</legend>
                <label>
                  <input
                    type="checkbox"
                    checked={understood.rights}
                    onChange={(event) =>
                      setUnderstood((current) => ({ ...current, rights: event.target.checked }))
                    }
                  />
                  <span>
                    A unit reference represents defined contractual rights; it is not direct
                    ownership of the solar equipment.
                  </span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={understood.liquidity}
                    onChange={(event) =>
                      setUnderstood((current) => ({ ...current, liquidity: event.target.checked }))
                    }
                  />
                  <span>There is no public market, guaranteed buyer or promised early exit.</span>
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={understood.cashFlow}
                    onChange={(event) =>
                      setUnderstood((current) => ({ ...current, cashFlow: event.target.checked }))
                    }
                  />
                  <span>
                    Any distribution depends on rent actually received and approved fees, reserves
                    and servicing evidence.
                  </span>
                </label>
              </fieldset>
              <div className="review-lines">
                <div>
                  <span>Opportunity</span>
                  <strong>{solarOpportunity.title}</strong>
                </div>
                <div>
                  <span>Amount</span>
                  <strong>{money(units * solarOpportunity.unitPrice)}</strong>
                </div>
                <div>
                  <span>Illustrative units</span>
                  <strong>{units}</strong>
                </div>
                <div>
                  <span>Disclosure version</span>
                  <strong>SYN-DISC-001 · v1</strong>
                </div>
              </div>
              <label className="consent-check">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                />
                <span>
                  I understand this is synthetic, creates no ownership and does not represent an
                  approved offer or Shariah ruling.
                </span>
              </label>
              <div className="flow-actions">
                <button className="button button--secondary" onClick={() => setStep(1)}>
                  Back
                </button>
                <button
                  className="button button--primary"
                  onClick={() => setStep(3)}
                  disabled={!confirmed || !comprehensionComplete}
                >
                  Confirm simulation <Icon name="check" size={18} />
                </button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="flow-panel flow-success">
              <span className="success-mark">
                <Icon name="check" size={31} />
              </span>
              <p className="eyebrow">Simulation complete</p>
              <h2>Commitment reference MZT-DEMO-1042</h2>
              <p>
                Your synthetic commitment for {units} units has been added to the demo portfolio
                with its disclosure and consent versions.
              </p>
              <div className="audit-receipt">
                <div>
                  <span>Recorded amount</span>
                  <strong>{money(units * solarOpportunity.unitPrice)}</strong>
                </div>
                <div>
                  <span>Disclosure</span>
                  <strong>SYN-DISC-001 · v1</strong>
                </div>
                <div>
                  <span>Environment</span>
                  <strong>Controlled local environment</strong>
                </div>
              </div>
              <div className="flow-actions">
                <Link className="button button--primary" href="/portfolio">
                  View demo portfolio <Icon name="arrow" size={18} />
                </Link>
                <Link className="button button--secondary" href="/governance">
                  See the audit trail
                </Link>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="subscription-summary">
          <span className="status-dot">Controlled workflow</span>
          <p className="micro-label">{solarOpportunity.reference}</p>
          <h2>{solarOpportunity.title}</h2>
          <p>{solarOpportunity.location}</p>
          <dl>
            <div>
              <dt>Asset target</dt>
              <dd>{money(solarOpportunity.target)}</dd>
            </div>
            <div>
              <dt>Proposed term</dt>
              <dd>{solarOpportunity.termMonths} months</dd>
            </div>
            <div>
              <dt>Your simulation</dt>
              <dd>{money(units * solarOpportunity.unitPrice)}</dd>
            </div>
          </dl>
          <div className="safe-boundary">
            <Icon name="lock" size={19} />
            <div>
              <strong>Safe demonstration boundary</strong>
              <span>
                No bank details, payment instruction, wallet or identity provider is connected.
              </span>
            </div>
          </div>
        </aside>
      </div>
    </DemoShell>
  );
}
