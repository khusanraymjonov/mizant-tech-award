import Link from 'next/link';
import { DemoShell } from '../../components/demo-shell';
import { Icon } from '../../components/icons';
import { money, solarOpportunity } from '../../lib/demo-data';

const milestones = [
  ['Asset verified', 'Equipment description, supplier quote and site evidence recorded.'],
  ['Structure mapped', 'Project vehicle, asset ownership and investor-rights layers separated.'],
  [
    'Review lanes evidenced',
    'Legal, risk and Shariah decisions shown as synthetic controlled outcomes.',
  ],
  ['Servicing plan ready', 'Rent schedule, evidence refresh and exception ownership defined.'],
] as const;

const risks = [
  [
    'Operating performance',
    'The SME may experience lower revenue or higher costs and struggle to meet rental obligations.',
  ],
  [
    'Asset performance',
    'Equipment output, condition or installation may differ from the illustration.',
  ],
  [
    'Limited liquidity',
    'There is no public secondary market or promise that a holder can exit early.',
  ],
  [
    'Structure and regulatory risk',
    'The legal, tax, regulatory and Shariah treatment requires jurisdiction-specific approval.',
  ],
] as const;

const cashFlowScenarios = [
  [
    'Scheduled rent received',
    '$24.80',
    'Gross pro-rata receipt before any approved fees or reserves',
  ],
  [
    'Rent delayed by 30 days',
    '$0.00 on due date',
    'Receipt remains outstanding and servicing follow-up begins',
  ],
  [
    '25% payment shortfall',
    '$18.60',
    'Shortfall is recorded; no platform-funded top-up is assumed',
  ],
  ['Payment default', '$0.00', 'Human-led recovery, asset and legal options require review'],
] as const;

const documents = [
  [
    'Asset evidence pack',
    'Recorded',
    'Supplier quote, equipment specification and site record · v1',
  ],
  ['Investor rights summary', 'Draft', 'Plain-language contractual rights summary · v1'],
  ['Risk disclosure', 'Recorded', 'Operating, asset, liquidity and structure risks · v1'],
  [
    'Independent Shariah review',
    'Conditional',
    'Adviser appointment and final review still required',
  ],
] as const;

export default function SolarOpportunityPage() {
  return (
    <DemoShell
      active="Opportunities"
      eyebrow={`${solarOpportunity.reference} · Synthetic opportunity`}
      title={solarOpportunity.title}
      description="A clear illustration of how Mizant brings the asset, structure, rights, evidence and ongoing obligations into one understandable view."
      action={
        <Link className="button button--primary" href="/subscribe">
          Simulate a commitment <Icon name="arrow" size={18} />
        </Link>
      }
    >
      <div className="opportunity-detail-grid">
        <div className="opportunity-detail-main">
          <section className="decision-data-strip" aria-label="Opportunity data provenance">
            <div>
              <span>Information date</span>
              <strong>14 Aug 2026</strong>
            </div>
            <div>
              <span>Evidence basis</span>
              <strong>Synthetic supplier and SME pack · v1</strong>
            </div>
            <div>
              <span>Calculation method</span>
              <strong>SYNTH-IJARAH-RENT-V1</strong>
            </div>
          </section>
          <section className="asset-hero">
            <div className="asset-hero__visual" aria-hidden="true">
              <div className="sun-disc" />
              <div className="solar-panel solar-panel--one" />
              <div className="solar-panel solar-panel--two" />
              <div className="solar-ground" />
            </div>
            <div className="asset-hero__caption">
              <span>
                <Icon name="sun" size={18} /> Commercial solar PV equipment
              </span>
              <span>{solarOpportunity.location}</span>
            </div>
          </section>

          <section className="detail-section">
            <p className="eyebrow">Why this asset exists</p>
            <h2>Productive equipment serving a real operating need</h2>
            <p>
              The fictional SME uses energy-intensive processing equipment. The proposed solar PV
              system is intended to reduce exposure to grid costs and improve operating resilience.
              Investors do not earn from money sitting idle: the illustration links permitted cash
              flows to the SME’s use of an identifiable productive asset.
            </p>
            <div className="plain-language-callout">
              <Icon name="spark" size={20} />
              <div>
                <strong>Plain-language summary</strong>
                <p>
                  A project vehicle would acquire the equipment, lease it to the SME and administer
                  approved rental cash flows. Exact rights depend on final legal documents.
                </p>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <p className="eyebrow">How the structure works</p>
            <h2>Rights and cash flows remain connected to the asset</h2>
            <div className="transaction-flow">
              <article>
                <span>01</span>
                <Icon name="users" size={23} />
                <strong>Eligible investors</strong>
                <p>Complete checks and simulate a subscription.</p>
              </article>
              <span className="transaction-arrow">→</span>
              <article className="transaction-flow__core">
                <span>02</span>
                <Icon name="shield" size={23} />
                <strong>Project vehicle</strong>
                <p>Owns equipment and defines investor rights.</p>
              </article>
              <span className="transaction-arrow">→</span>
              <article>
                <span>03</span>
                <Icon name="building" size={23} />
                <strong>Operating SME</strong>
                <p>Uses equipment and pays agreed rent.</p>
              </article>
            </div>
            <div className="return-rail">
              <span>Asset acquisition</span>
              <span>Lease and productive use</span>
              <span>Rent, reserves and servicing</span>
              <span>Pro-rata distribution</span>
            </div>
          </section>

          <section className="detail-section">
            <p className="eyebrow">Evidence & control milestones</p>
            <h2>A status is meaningful only when its evidence is visible</h2>
            <div className="milestone-list">
              {milestones.map(([title, copy], index) => (
                <article key={title}>
                  <span>
                    <Icon name="check" size={17} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{copy}</p>
                  </div>
                  <small>0{index + 1}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="detail-section risk-section">
            <p className="eyebrow">What could go wrong</p>
            <h2>Risk honesty comes before return promotion</h2>
            <div className="risk-grid">
              {risks.map(([title, copy]) => (
                <article key={title}>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="detail-section">
            <p className="eyebrow">Illustrative cash-flow scenarios</p>
            <h2>See how different payment outcomes affect a 10-unit reference holding</h2>
            <p>
              These figures illustrate gross quarterly rent only. They are not a forecast, promise
              or approved return, and exclude any fees, reserves, tax or recovery costs.
            </p>
            <div className="scenario-table-wrap">
              <table className="scenario-table">
                <caption>Illustrative quarterly cash-flow outcomes for ten unit references</caption>
                <thead>
                  <tr>
                    <th>Scenario</th>
                    <th>Illustrative receipt</th>
                    <th>What happens next</th>
                  </tr>
                </thead>
                <tbody>
                  {cashFlowScenarios.map(([scenario, receipt, explanation]) => (
                    <tr key={scenario}>
                      <td>{scenario}</td>
                      <td>
                        <strong>{receipt}</strong>
                      </td>
                      <td>{explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="fee-clarity">
              <Icon name="document" size={20} />
              <div>
                <strong>Fees are not yet approved</strong>
                <p>
                  Origination, servicing, administration and exit charges remain professional-policy
                  decisions. The platform does not present a net return until an approved fee
                  version exists.
                </p>
              </div>
            </div>
          </section>

          <section className="detail-section">
            <p className="eyebrow">Document room</p>
            <h2>Know which evidence is recorded, draft or still conditional</h2>
            <div className="document-room-list">
              {documents.map(([title, status, description]) => (
                <article key={title}>
                  <Icon name="document" size={20} />
                  <div>
                    <strong>{title}</strong>
                    <p>{description}</p>
                  </div>
                  <span>{status}</span>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="commitment-card">
          <span className="status-dot">Reference case</span>
          <h2>Opportunity snapshot</h2>
          <dl>
            <div>
              <dt>Illustrative asset pool</dt>
              <dd>{money(solarOpportunity.target)}</dd>
            </div>
            <div>
              <dt>Digital-unit references</dt>
              <dd>{solarOpportunity.totalUnits.toLocaleString()}</dd>
            </div>
            <div>
              <dt>Unit reference</dt>
              <dd>{money(solarOpportunity.unitPrice)}</dd>
            </div>
            <div>
              <dt>Proposed lease term</dt>
              <dd>{solarOpportunity.termMonths} months</dd>
            </div>
            <div>
              <dt>Asset class</dt>
              <dd>Productive equipment</dd>
            </div>
            <div>
              <dt>Availability</dt>
              <dd>Controlled environment</dd>
            </div>
          </dl>
          <div className="funding-line funding-line--compact">
            <div>
              <span>Simulated commitments</span>
              <strong>68%</strong>
            </div>
            <div className="progress-track">
              <span style={{ width: '68%' }} />
            </div>
            <small>{money(80_000)} capacity remains</small>
          </div>
          <Link className="button button--primary button--wide" href="/subscribe">
            Continue to commitment review <Icon name="arrow" size={18} />
          </Link>
          <p className="commitment-card__note">
            <Icon name="lock" size={15} /> No payment is collected. No investment or ownership is
            created.
          </p>
        </aside>
      </div>
    </DemoShell>
  );
}
