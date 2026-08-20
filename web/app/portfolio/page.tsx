import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { money, solarOpportunity } from '../lib/demo-data';

const schedule = [
  ['30 Sep 2026', 'Illustrative rental receipt', '$24.80', 'Scheduled'],
  ['31 Dec 2026', 'Illustrative rental receipt', '$24.80', 'Scheduled'],
  ['31 Mar 2027', 'Illustrative rental receipt', '$24.80', 'Scheduled'],
] as const;

export default function PortfolioPage() {
  return (
    <DemoShell
      active="Portfolio"
      eyebrow="Investor portfolio"
      title="Your assets, rights and evidence in one place."
      description="A synthetic servicing view that avoids implying a live market price and distinguishes committed capital, ownership records and illustrative cash flows."
      action={
        <Link className="button button--secondary" href="/opportunities">
          Explore opportunities
        </Link>
      }
    >
      <section className="portfolio-metrics">
        <article>
          <span>Simulated commitments</span>
          <strong>{money(1_000)}</strong>
          <small>Across 1 synthetic opportunity</small>
        </article>
        <article>
          <span>Digital-unit references</span>
          <strong>10</strong>
          <small>Pending mock allocation confirmation</small>
        </article>
        <article>
          <span>Illustrative cash received</span>
          <strong>$0</strong>
          <small>No real cash-flow events</small>
        </article>
        <article>
          <span>Next evidence review</span>
          <strong>28 days</strong>
          <small>Asset performance update</small>
        </article>
      </section>

      <section className="holding-card">
        <div className="holding-card__identity">
          <span className="icon-tile">
            <Icon name="sun" size={23} />
          </span>
          <div>
            <p className="micro-label">Productive equipment · {solarOpportunity.reference}</p>
            <h2>{solarOpportunity.title}</h2>
            <p>{solarOpportunity.location}</p>
          </div>
        </div>
        <div className="holding-card__values">
          <div>
            <span>Committed</span>
            <strong>{money(1_000)}</strong>
          </div>
          <div>
            <span>References</span>
            <strong>10 units</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className="positive-text">Simulation recorded</strong>
          </div>
        </div>
        <div className="holding-card__actions">
          <Link href="/opportunities/solar-ijarah">
            View asset <Icon name="arrow" size={16} />
          </Link>
          <Link href="/governance">
            View evidence trail <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>

      <div className="portfolio-grid">
        <section className="portfolio-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Servicing schedule</p>
              <h2>Upcoming illustrative events</h2>
            </div>
            <span className="status-dot">No money movement</span>
          </div>
          <div className="schedule-list">
            {schedule.map(([date, event, amount, status]) => (
              <article key={date}>
                <time>{date}</time>
                <div>
                  <strong>{event}</strong>
                  <span>Subject to approved terms and evidence</span>
                </div>
                <b>{amount}</b>
                <span className="schedule-status">{status}</span>
              </article>
            ))}
          </div>
        </section>
        <section className="portfolio-panel evidence-panel">
          <p className="eyebrow">Evidence health</p>
          <h2>Asset monitoring</h2>
          <div className="evidence-score">
            <span>92</span>
            <small>/100</small>
          </div>
          <p>
            All core synthetic asset evidence is current. Insurance/takaful remains a
            professional-policy placeholder.
          </p>
          <ul>
            <li>
              <Icon name="check" size={16} /> Equipment evidence recorded
            </li>
            <li>
              <Icon name="check" size={16} /> Installation acceptance recorded
            </li>
            <li>
              <Icon name="check" size={16} /> Performance update scheduled
            </li>
          </ul>
        </section>
      </div>
    </DemoShell>
  );
}
