'use client';

import { useMemo, useState } from 'react';
import { Icon } from './icons';

const registerEntries = [
  {
    reference: 'SYN-HLD-001',
    holder: 'Alex Morgan',
    type: 'Individual investor',
    units: 10,
    status: 'Pending confirmation',
    evidence: 'Commitment receipt and disclosure consent v1',
  },
  {
    reference: 'SYN-HLD-002',
    holder: 'Synthetic Investor Cohort A',
    type: 'Demonstration cohort',
    units: 1_690,
    status: 'Reference recorded',
    evidence: 'Synthetic allocation batch v1',
  },
  {
    reference: 'SYN-POOL-001',
    holder: 'Unallocated capacity',
    type: 'Instrument pool',
    units: 800,
    status: 'Available',
    evidence: 'Instrument terms SYN-INST-001 v1',
  },
] as const;

export function OwnershipRegister() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All statuses');
  const [selectedReference, setSelectedReference] = useState<string>(registerEntries[0].reference);

  const filteredEntries = useMemo(
    () =>
      registerEntries.filter(
        (entry) =>
          (status === 'All statuses' || entry.status === status) &&
          `${entry.reference} ${entry.holder} ${entry.type}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [query, status],
  );
  const selectedEntry =
    registerEntries.find((entry) => entry.reference === selectedReference) ?? registerEntries[0];

  const exportRegister = () => {
    const rows = [
      ['Reference', 'Holder', 'Type', 'Units', 'Status', 'Evidence'],
      ...registerEntries.map((entry) => [
        entry.reference,
        entry.holder,
        entry.type,
        String(entry.units),
        entry.status,
        entry.evidence,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mizant-synthetic-ownership-register.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ownership-layout">
      <section className="ownership-register-panel">
        <div className="panel-heading ownership-toolbar-heading">
          <div>
            <p className="eyebrow">Canonical register</p>
            <h2>Holder and allocation references</h2>
          </div>
          <button
            className="button button--secondary button--compact"
            type="button"
            onClick={exportRegister}
          >
            Export synthetic CSV
          </button>
        </div>
        <div className="register-filters">
          <label>
            <span>Search register</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Holder or reference"
            />
          </label>
          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option>All statuses</option>
              {registerEntries.map((entry) => (
                <option key={entry.status}>{entry.status}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="register-table-wrap">
          <table className="register-table">
            <caption>Synthetic holder and allocation references for MZT-SYN-001</caption>
            <thead>
              <tr>
                <th>Reference</th>
                <th>Holder</th>
                <th>Units</th>
                <th>Status</th>
                <th aria-label="Open record" />
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr
                  key={entry.reference}
                  className={selectedReference === entry.reference ? 'is-selected' : ''}
                >
                  <td>{entry.reference}</td>
                  <td>
                    <strong>{entry.holder}</strong>
                    <small>{entry.type}</small>
                  </td>
                  <td>{entry.units.toLocaleString()}</td>
                  <td>
                    <span className="register-status">{entry.status}</span>
                  </td>
                  <td>
                    <button type="button" onClick={() => setSelectedReference(entry.reference)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredEntries.length === 0 ? (
            <p className="empty-register">No synthetic records match those filters.</p>
          ) : null}
        </div>
      </section>

      <aside className="register-detail-panel" aria-live="polite">
        <span className="status-dot">Selected record</span>
        <p className="micro-label">{selectedEntry.reference}</p>
        <h2>{selectedEntry.holder}</h2>
        <dl>
          <div>
            <dt>Record type</dt>
            <dd>{selectedEntry.type}</dd>
          </div>
          <div>
            <dt>Unit references</dt>
            <dd>{selectedEntry.units.toLocaleString()}</dd>
          </div>
          <div>
            <dt>Register status</dt>
            <dd>{selectedEntry.status}</dd>
          </div>
          <div>
            <dt>Supporting evidence</dt>
            <dd>{selectedEntry.evidence}</dd>
          </div>
        </dl>
        <div className="safe-boundary">
          <Icon name="lock" size={19} />
          <div>
            <strong>No legal ownership is created</strong>
            <span>These records demonstrate administration and reconciliation only.</span>
          </div>
        </div>
      </aside>
    </div>
  );
}
