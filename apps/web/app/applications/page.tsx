import Link from 'next/link';
import { assessApplication } from '@mizant/domain/sme-submission';
import {
  provisionalUzbekistanPilotPolicy,
  syntheticSmeApplications,
} from '@mizant/testing/sme-applications';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { RecentBrowserApplications } from '../components/recent-browser-applications';

const money = (minor: bigint) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(minor) / 100);

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const originatorView = params.role === 'originator';
  return (
    <DemoShell
      active="Applications"
      eyebrow={originatorView ? 'Originator case view' : 'SME application workspace'}
      title="Every application shows what is ready—and what still needs people."
      description="Three fictional SMEs demonstrate a complete submission, an incomplete draft and a beneficial-ownership case routed to manual review."
      workspaceRole={originatorView ? 'originator' : 'sme'}
      action={
        <div className="heading-actions">
          <Link
            className="button button--primary"
            href={originatorView ? '/applications/new?role=originator' : '/applications/new'}
          >
            Start an application <Icon name="arrow" size={17} />
          </Link>
          <span className="policy-chip">
            <Icon name="shield" size={16} /> Provisional pilot policy · v1
          </span>
        </div>
      }
    >
      <section className="application-summary-strip">
        <div>
          <span>Reference cases</span>
          <strong>3</strong>
          <small>Controlled journeys</small>
        </div>
        <div>
          <span>Submitted</span>
          <strong>1</strong>
          <small>Ready for human review</small>
        </div>
        <div>
          <span>Incomplete</span>
          <strong>1</strong>
          <small>3 evidence items missing</small>
        </div>
        <div>
          <span>Manual review</span>
          <strong>1</strong>
          <small>Ownership discrepancy</small>
        </div>
      </section>

      <RecentBrowserApplications />

      <div className="provisional-banner">
        <Icon name="shield" size={20} />
        <div>
          <strong>{provisionalUzbekistanPilotPolicy.label}</strong>
          <span>
            Established incorporated SMEs · USD 25,000–250,000 · normally 2+ years · never automatic
            approval
          </span>
        </div>
      </div>

      <section className="application-grid">
        {syntheticSmeApplications.map((application, index) => {
          const assessment = assessApplication(application, provisionalUzbekistanPilotPolicy);
          const evidencePresent = application.evidence.filter(
            (item) => item.status === 'present',
          ).length;
          const evidenceTotal = application.evidence.length;
          const tone =
            application.status === 'submitted'
              ? 'positive'
              : application.status === 'manual_review'
                ? 'warning'
                : 'neutral';
          return (
            <article
              className={`application-card application-card--${tone}`}
              id={application.reference}
              key={application.id}
            >
              <div className="application-card__index">0{index + 1}</div>
              <div className="application-card__main">
                <div className="application-card__head">
                  <div>
                    <p className="micro-label">
                      {application.reference} · {application.identity.sector.replaceAll('_', ' ')}
                    </p>
                    <h2>{application.identity.legalName}</h2>
                    <p>
                      {application.identity.location} · {application.identity.operatingHistoryYears}{' '}
                      years trading
                    </p>
                  </div>
                  <span className={`application-state application-state--${tone}`}>
                    {application.status.replaceAll('_', ' ')}
                  </span>
                </div>
                <div className="application-facts">
                  <div>
                    <span>Productive asset need</span>
                    <strong>{application.rationale.productiveAssetNeed}</strong>
                  </div>
                  <div>
                    <span>Illustrative cost</span>
                    <strong>{money(application.asset.priceMinor)}</strong>
                  </div>
                  <div>
                    <span>Requested term</span>
                    <strong>{application.structure.requestedTermMonths} months</strong>
                  </div>
                  <div>
                    <span>Evidence health</span>
                    <strong>
                      {evidencePresent} of {evidenceTotal} present
                    </strong>
                  </div>
                </div>
                <div className={`application-outcome application-outcome--${tone}`}>
                  <span>
                    {tone === 'positive' ? (
                      <Icon name="check" size={18} />
                    ) : tone === 'warning' ? (
                      '!'
                    ) : (
                      <Icon name="document" size={18} />
                    )}
                  </span>
                  <div>
                    <strong>Current outcome</strong>
                    <p>{assessment.explanation}</p>
                  </div>
                </div>
                <details>
                  <summary>
                    View evidence and review detail <span>+</span>
                  </summary>
                  <div className="application-detail-grid">
                    <div>
                      <h3>Outstanding evidence</h3>
                      {assessment.outstandingItems.length ? (
                        <ul>
                          {assessment.outstandingItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="positive-text">
                          All mandatory evidence is present for this stage.
                        </p>
                      )}
                    </div>
                    <div>
                      <h3>Human review reasons</h3>
                      {assessment.manualReviewReasons.length ? (
                        <ul>
                          {assessment.manualReviewReasons.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : (
                        <p>No additional manual-review trigger recorded.</p>
                      )}
                    </div>
                    <div>
                      <h3>Mandatory review queues</h3>
                      <ul>
                        {application.reviews.map((review) => (
                          <li key={review.lane}>
                            {review.lane.replaceAll('_', ' ')} — {review.decision}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </details>
              </div>
            </article>
          );
        })}
      </section>
    </DemoShell>
  );
}
