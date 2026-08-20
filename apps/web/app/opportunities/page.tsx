import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { money, pipelineOpportunities, solarOpportunity } from '../lib/demo-data';

export default function OpportunitiesPage() {
  const progress = Math.round((solarOpportunity.committed / solarOpportunity.target) * 100);
  return (
    <DemoShell
      active="Opportunities"
      eyebrow="Investor portal"
      title="Productive assets, explained before they are fractionalised."
      description="Only the first reference opportunity is open for a synthetic commitment. Pipeline assets remain visibly gated while diligence is incomplete."
      action={
        <span className="eligibility-chip">
          <Icon name="check" size={16} /> Demo eligibility complete
        </span>
      }
    >
      <section className="opportunity-feature">
        <div className="opportunity-feature__art" aria-hidden="true">
          <div className="sun-disc" />
          <div className="solar-panel solar-panel--one" />
          <div className="solar-panel solar-panel--two" />
          <div className="solar-ground" />
          <span>Reference asset 01</span>
        </div>
        <div className="opportunity-feature__body">
          <div className="opportunity-feature__meta">
            <span className="status-dot">Synthetic showcase</span>
            <span>{solarOpportunity.reference}</span>
          </div>
          <h2>{solarOpportunity.title}</h2>
          <p>{solarOpportunity.summary}</p>
          <div className="opportunity-facts">
            <div>
              <span>Asset pool</span>
              <strong>{money(solarOpportunity.target)}</strong>
            </div>
            <div>
              <span>Term</span>
              <strong>{solarOpportunity.termMonths} months</strong>
            </div>
            <div>
              <span>Unit reference</span>
              <strong>{money(solarOpportunity.unitPrice)}</strong>
            </div>
          </div>
          <div className="funding-line funding-line--compact">
            <div>
              <span>Demo commitments</span>
              <strong>{progress}%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
          <div className="opportunity-feature__actions">
            <Link className="button button--primary" href="/opportunities/solar-ijarah">
              Review opportunity <Icon name="arrow" size={18} />
            </Link>
            <span>Illustrative only · not an offer</span>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <div className="demo-section__heading">
          <div>
            <p className="eyebrow">Originator pipeline</p>
            <h2>Other productive assets under review</h2>
          </div>
          <p>
            These cards demonstrate an asset-agnostic platform while keeping all non-approved
            opportunities unavailable.
          </p>
        </div>
        <div className="pipeline-grid">
          {pipelineOpportunities.map((item, index) => (
            <article key={item.reference}>
              <div className="pipeline-index">0{index + 2}</div>
              <p className="micro-label">
                {item.sector} · {item.location}
              </p>
              <h3>{item.title}</h3>
              <div className="pipeline-facts">
                <span>{money(item.target)} target</span>
                <span>{item.termMonths} month illustration</span>
              </div>
              <div className="locked-state">
                <Icon name="lock" size={17} /> {item.status}
              </div>
            </article>
          ))}
        </div>
      </section>
    </DemoShell>
  );
}
