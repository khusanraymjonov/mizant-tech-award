'use client';

import { useMemo, useState } from 'react';
import {
  evaluateDigitalUnitOperation,
  reconcileDigitalUnitRegister,
  type DigitalUnitAccountState,
  type DigitalUnitInstrumentState,
} from '@mizant/domain/tokenisation';
import { Icon } from './icons';

type Scenario = 'eligible' | 'identity_expired' | 'jurisdiction_restricted' | 'instrument_paused';

const baseInstrument: DigitalUnitInstrumentState = {
  instrumentId: 'SYN-INST-001',
  registerAuthority: 'Synthetic issuer register',
  targetUnits: 2_500n,
  paused: false,
  policyVersion: 1,
  policyActive: true,
  mode: 'off_chain_simulation',
};

const sourceAccount: DigitalUnitAccountState = {
  reference: 'SYN-POOL-001',
  availableUnits: 800n,
  frozenUnits: 0n,
  status: 'active',
  identityStatus: 'verified',
  jurisdictionAllowed: true,
};

const destinationAccount: DigitalUnitAccountState = {
  reference: 'SYN-HLD-001',
  availableUnits: 10n,
  frozenUnits: 0n,
  status: 'active',
  identityStatus: 'verified',
  jurisdictionAllowed: true,
};

const reconciliation = reconcileDigitalUnitRegister(2_500n, [
  { accountReference: 'SYN-HLD-001', units: 10n },
  { accountReference: 'SYN-HLD-002', units: 1_690n },
  { accountReference: 'SYN-POOL-001', units: 800n },
]);

const scenarioLabels: Record<Scenario, string> = {
  eligible: 'Verified eligible holder',
  identity_expired: 'Identity verification expired',
  jurisdiction_restricted: 'Jurisdiction restricted',
  instrument_paused: 'Instrument paused',
};

export function TokenisationWorkbench() {
  const [scenario, setScenario] = useState<Scenario>('eligible');
  const [quantity, setQuantity] = useState('10');

  const result = useMemo(() => {
    const instrument =
      scenario === 'instrument_paused' ? { ...baseInstrument, paused: true } : baseInstrument;
    const destination =
      scenario === 'identity_expired'
        ? { ...destinationAccount, identityStatus: 'expired' as const }
        : scenario === 'jurisdiction_restricted'
          ? { ...destinationAccount, jurisdictionAllowed: false }
          : destinationAccount;
    const parsedQuantity = /^\d+$/.test(quantity) ? BigInt(quantity) : 0n;

    return evaluateDigitalUnitOperation(instrument, reconciliation, {
      reference: 'SYN-UNIT-OP-001',
      operation: 'allocate',
      quantity: parsedQuantity,
      makerId: 'ownership-maker-01',
      source: sourceAccount,
      destination,
    });
  }, [quantity, scenario]);

  return (
    <div className="token-workbench-grid">
      <section className="token-preflight" aria-labelledby="preflight-title">
        <div className="panel-heading">
          <div>
            <p className="eyebrow">Operation pre-flight</p>
            <h2 id="preflight-title">Test a restricted allocation</h2>
            <p>Change the case to see why an operation is prepared or blocked.</p>
          </div>
          <span className="version-chip">Policy v1</span>
        </div>

        <div className="token-inputs">
          <label>
            <span>Recipient scenario</span>
            <select
              value={scenario}
              onChange={(event) => setScenario(event.target.value as Scenario)}
            >
              {(Object.entries(scenarioLabels) as [Scenario, string][]).map(([value, label]) => (
                <option value={value} key={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Unit quantity</span>
            <input
              inputMode="numeric"
              min="1"
              step="1"
              type="number"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
            />
          </label>
          <div>
            <span>Operation</span>
            <strong>Allocate from unallocated pool</strong>
          </div>
        </div>

        <div
          className={`preflight-result preflight-result--${result.decision === 'blocked' ? 'blocked' : 'ready'}`}
          role="status"
          aria-live="polite"
        >
          <div>
            <Icon name={result.decision === 'blocked' ? 'lock' : 'check'} size={22} />
            <div>
              <span>Pre-flight decision</span>
              <strong>
                {result.decision === 'blocked'
                  ? 'Blocked — resolve the failed checks'
                  : 'Ready for an independent checker'}
              </strong>
            </div>
          </div>
          <small>No allocation is executed by this demonstration.</small>
        </div>

        <ul className="preflight-checks" aria-label="Pre-flight checks">
          {result.checks.map((item) => {
            const pending = item.code === 'CHECKER_REQUIRED';
            return (
              <li
                className={!item.passed ? 'is-blocked' : pending ? 'is-pending' : ''}
                key={item.code}
              >
                <span>{!item.passed ? '!' : pending ? '2' : '✓'}</span>
                <div>
                  <strong>{item.label}</strong>
                  <small>
                    {!item.passed
                      ? 'Action required'
                      : pending
                        ? 'Human approval required'
                        : 'Passed'}
                  </small>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="token-operation-card">
        <span className="status-dot">Prepared instruction</span>
        <p className="micro-label">SYN-UNIT-OP-001</p>
        <h2>{quantity || '0'} unit allocation</h2>
        <dl>
          <div>
            <dt>Instrument</dt>
            <dd>SYN-INST-001 · v1</dd>
          </div>
          <div>
            <dt>From</dt>
            <dd>SYN-POOL-001</dd>
          </div>
          <div>
            <dt>To</dt>
            <dd>SYN-HLD-001</dd>
          </div>
          <div>
            <dt>Register</dt>
            <dd>2,500 / 2,500 balanced</dd>
          </div>
          <div>
            <dt>Network submission</dt>
            <dd>Disabled</dd>
          </div>
        </dl>
        <div className="safe-boundary">
          <Icon name="shield" size={19} />
          <div>
            <strong>Maker prepared · checker required</strong>
            <span>A different authorised person must approve the exact instruction version.</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
