'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Icon } from './icons';
import {
  parseBrowserApplicationRecords,
  submittedApplicationsStorageKey,
  type BrowserApplicationRecord,
} from '../lib/browser-workflow';

const money = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);

export function RecentBrowserApplications() {
  const [records, setRecords] = useState<BrowserApplicationRecord[]>([]);

  useEffect(() => {
    setRecords(
      parseBrowserApplicationRecords(window.localStorage.getItem(submittedApplicationsStorageKey)),
    );
  }, []);

  if (records.length === 0) return null;

  return (
    <section className="recent-submissions" aria-labelledby="recent-submissions-title">
      <div className="section-heading section-heading--inline">
        <div>
          <p className="eyebrow">Recent work on this device</p>
          <h2 id="recent-submissions-title">Your recent submissions</h2>
          <p>Applications completed in this browser are ready for the next human-review step.</p>
        </div>
        <Link className="button button--secondary" href="/reviews">
          Open review queue <Icon name="arrow" size={17} />
        </Link>
      </div>
      <div className="recent-submission-list">
        {records.map((record) => (
          <article key={record.reference}>
            <div>
              <span className="micro-label">{record.reference}</span>
              <strong>{record.legalName}</strong>
              <small>
                {record.location} · {record.assetNeed}
              </small>
            </div>
            <div>
              <span>Asset value</span>
              <strong>{money(record.assetPrice)}</strong>
            </div>
            <div>
              <span>Evidence</span>
              <strong>
                {record.evidenceCount}/{record.evidenceTotal} ready
              </strong>
            </div>
            <span className="application-state application-state--neutral">
              {record.status.replaceAll('_', ' ')}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
