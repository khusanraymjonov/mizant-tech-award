'use client';

import { useEffect, useMemo, useState } from 'react';
import { syntheticSmeApplications } from '@mizant/testing/sme-applications';
import { Icon } from './icons';
import {
  applyBrowserReviewAction,
  createBrowserApplicationRecordFromSmeApplication,
  parseBrowserApplicationRecords,
  submittedApplicationsStorageKey,
  type BrowserApplicationRecord,
  type BrowserReviewAction,
} from '../lib/browser-workflow';

const referenceCases: BrowserApplicationRecord[] = syntheticSmeApplications
  .filter((application) => ['submitted', 'manual_review'].includes(application.status))
  .map(createBrowserApplicationRecordFromSmeApplication);

const reviewer = 'Daniel Reed';

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));

export function ReviewQueue() {
  const [records, setRecords] = useState<BrowserApplicationRecord[]>(referenceCases);
  const [selectedReference, setSelectedReference] = useState(referenceCases[0]?.reference ?? '');
  const [filter, setFilter] = useState('all');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const browserRecords = parseBrowserApplicationRecords(
      window.localStorage.getItem(submittedApplicationsStorageKey),
    );
    if (browserRecords.length > 0) {
      setRecords([...browserRecords, ...referenceCases]);
      setSelectedReference(browserRecords[0]?.reference ?? referenceCases[0]?.reference ?? '');
    }
  }, []);

  const visibleRecords = useMemo(
    () => (filter === 'all' ? records : records.filter((record) => record.status === filter)),
    [filter, records],
  );
  const selected =
    visibleRecords.find((record) => record.reference === selectedReference) ?? visibleRecords[0];

  const applyAction = (action: BrowserReviewAction) => {
    if (!selected) return;
    const updated = applyBrowserReviewAction(selected, action, reviewer, new Date().toISOString());
    if (updated === selected) return;

    setActionMessage(
      action === 'claim'
        ? `${selected.reference} is assigned to ${reviewer}.`
        : action === 'request_evidence'
          ? `An evidence request was recorded for ${selected.reference}.`
          : `The review record for ${selected.reference} is complete.`,
    );

    setRecords((current) =>
      current.map((record) => (record.reference === selected.reference ? updated : record)),
    );

    const stored = parseBrowserApplicationRecords(
      window.localStorage.getItem(submittedApplicationsStorageKey),
    );
    if (stored.some((record) => record.reference === selected.reference)) {
      window.localStorage.setItem(
        submittedApplicationsStorageKey,
        JSON.stringify(
          stored.map((record) => (record.reference === selected.reference ? updated : record)),
        ),
      );
    }
  };

  return (
    <section className="review-workspace">
      <div className="review-toolbar">
        <div>
          <span>Queue</span>
          <strong>{visibleRecords.length} cases</strong>
        </div>
        <label>
          <span>Filter review cases</span>
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="all">All statuses</option>
            <option value="awaiting_review">Awaiting review</option>
            <option value="manual_review">Manual review</option>
            <option value="in_review">In review</option>
            <option value="evidence_requested">Evidence requested</option>
            <option value="review_complete">Review complete</option>
          </select>
        </label>
      </div>

      {actionMessage ? (
        <div className="review-action-message" role="status">
          <Icon name="check" size={17} /> {actionMessage}
        </div>
      ) : null}

      <div className="review-grid">
        <div className="review-list" aria-label="Review cases">
          {visibleRecords.length > 0 ? (
            visibleRecords.map((record) => (
              <button
                type="button"
                key={record.reference}
                className={record.reference === selected?.reference ? 'is-selected' : ''}
                aria-pressed={record.reference === selected?.reference}
                onClick={() => setSelectedReference(record.reference)}
              >
                <div>
                  <span>{record.reference}</span>
                  <strong>{record.legalName}</strong>
                  <small>{record.assetNeed}</small>
                </div>
                <span className="application-state application-state--neutral">
                  {record.status.replaceAll('_', ' ')}
                </span>
              </button>
            ))
          ) : (
            <div className="review-empty">No cases match this filter.</div>
          )}
        </div>

        {selected ? (
          <article className="review-detail">
            <div className="review-detail__heading">
              <div>
                <p className="eyebrow">{selected.reference}</p>
                <h2>{selected.legalName}</h2>
                <p>
                  {selected.location} · {selected.operatingHistoryYears} years trading
                </p>
              </div>
              <span className="application-state application-state--neutral">
                {selected.status.replaceAll('_', ' ')}
              </span>
            </div>

            <div className="review-facts">
              <div>
                <span>Productive asset</span>
                <strong>{selected.assetNeed}</strong>
              </div>
              <div>
                <span>Evidence readiness</span>
                <strong>
                  {selected.evidenceCount} of {selected.evidenceTotal}
                </strong>
              </div>
              <div>
                <span>Assigned reviewer</span>
                <strong>{selected.assignedReviewer ?? 'Unassigned'}</strong>
              </div>
            </div>

            <div className="review-actions" aria-label="Case actions">
              <button
                className="button button--primary"
                type="button"
                disabled={selected.status === 'in_review' || selected.status === 'review_complete'}
                onClick={() => applyAction('claim')}
              >
                Claim case
              </button>
              <button
                className="button button--secondary"
                type="button"
                disabled={selected.status === 'review_complete'}
                onClick={() => applyAction('request_evidence')}
              >
                Request evidence
              </button>
              <button
                className="button button--secondary"
                type="button"
                disabled={selected.status !== 'in_review'}
                onClick={() => applyAction('complete')}
              >
                Record review complete <Icon name="check" size={17} />
              </button>
            </div>

            <div className="review-boundary">
              <Icon name="shield" size={19} />
              <p>
                Completing this queue record does not approve an offering. Legal, risk and
                independent Shariah decisions remain separate human controls.
              </p>
            </div>

            <div className="review-history">
              <h3>Case history</h3>
              <ol>
                {[...selected.history].reverse().map((event, index) => (
                  <li key={`${event.at}-${index}`}>
                    <span />
                    <div>
                      <strong>{event.action}</strong>
                      <small>
                        {event.actor} · {formatDate(event.at)}
                      </small>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
}
