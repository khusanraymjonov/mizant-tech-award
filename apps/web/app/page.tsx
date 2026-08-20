import Link from 'next/link';
import { Brand } from './components/brand';
import { Icon } from './components/icons';
import { SiteHeader } from './components/site-header';
import { VideoGuide } from './components/video-guide';
import { money, solarOpportunity } from './lib/demo-data';
import { introVideo } from './lib/video-library';

const workflow = [
  ['01', 'Source & verify', 'Asset, originator, business need and evidence are captured together.'],
  [
    '02',
    'Structure clearly',
    'Rights, economics, responsibilities and risks are made understandable.',
  ],
  [
    '03',
    'Approve independently',
    'Legal, compliance, risk and Shariah gates stay human-controlled.',
  ],
  [
    '04',
    'Open access carefully',
    'Eligible investors see only the exact approved disclosure version.',
  ],
  ['05', 'Service & evidence', 'Cash flows, asset performance and decisions remain traceable.'],
] as const;

const participants = [
  {
    icon: 'building' as const,
    label: 'Originators & SMEs',
    title: 'A disciplined route to responsible capital',
    copy: 'Structure productive-asset needs, supply evidence once and follow every review from one workspace.',
    href: '/applications',
    action: 'Open SME workspace',
  },
  {
    icon: 'users' as const,
    label: 'Eligible investors',
    title: 'Understand the asset before the opportunity',
    copy: 'See what you may own, where returns may come from, the risks involved and who remains accountable.',
    href: '/opportunities',
    action: 'Explore opportunities',
  },
  {
    icon: 'shield' as const,
    label: 'Governance teams',
    title: 'Make every approval visible and attributable',
    copy: 'Coordinate evidence, independent reviews, maker-checker controls and audit history without weakening authority.',
    href: '/governance',
    action: 'View control centre',
  },
] as const;

export default function Home() {
  const funded = Math.round((solarOpportunity.committed / solarOpportunity.target) * 100);
  return (
    <div className="marketing-page">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      <main id="main-content">
        <section className="hero section-wrap">
          <div className="hero__copy">
            <p className="eyebrow">Governance-first real-asset investing</p>
            <h1>
              Real assets.
              <br />
              Clear rights.
              <br />
              <em>Ethical access.</em>
            </h1>
            <p className="hero__lead">
              Mizant connects productive businesses, accountable governance and eligible investors
              in one transparent platform—making fractional real-asset opportunities easier to
              understand and responsibly administer.
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" href="/start">
                Choose your workspace <Icon name="arrow" size={18} />
              </Link>
              <Link className="button button--secondary" href="/opportunities/solar-ijarah">
                View reference opportunity
              </Link>
            </div>
            <div className="hero__trust">
              <span>
                <Icon name="shield" size={17} /> Human approval at every material gate
              </span>
              <span>
                <Icon name="lock" size={17} /> Controlled synthetic environment
              </span>
            </div>
          </div>
          <div className="hero__visual">
            <div className="brand-geometry" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <article className="opportunity-preview">
              <div className="opportunity-preview__head">
                <span className="icon-tile">
                  <Icon name="sun" size={22} />
                </span>
                <span className="status-dot">Synthetic showcase</span>
              </div>
              <p className="micro-label">Productive asset · Ijarah reference journey</p>
              <h2>{solarOpportunity.title}</h2>
              <p>
                {solarOpportunity.location} · {solarOpportunity.sector}
              </p>
              <div className="preview-metrics">
                <div>
                  <span>Asset target</span>
                  <strong>{money(solarOpportunity.target)}</strong>
                </div>
                <div>
                  <span>Illustrative term</span>
                  <strong>{solarOpportunity.termMonths} months</strong>
                </div>
                <div>
                  <span>Unit reference</span>
                  <strong>{money(solarOpportunity.unitPrice)}</strong>
                </div>
              </div>
              <div className="funding-line">
                <div>
                  <span>Demo commitments</span>
                  <strong>{funded}%</strong>
                </div>
                <div className="progress-track">
                  <span style={{ width: `${funded}%` }} />
                </div>
                <small>
                  {money(solarOpportunity.committed)} of {money(solarOpportunity.target)} simulated
                </small>
              </div>
              <Link href="/opportunities/solar-ijarah" className="preview-link">
                Review asset and rights <Icon name="arrow" size={17} />
              </Link>
            </article>
          </div>
        </section>

        <section className="proof-strip" aria-label="Mizant principles">
          <div>
            <strong>01</strong>
            <span>Verified productive assets</span>
          </div>
          <div>
            <strong>02</strong>
            <span>Independent Shariah governance</span>
          </div>
          <div>
            <strong>03</strong>
            <span>Plain-language investor rights</span>
          </div>
          <div>
            <strong>04</strong>
            <span>Evidence across the lifecycle</span>
          </div>
        </section>

        <section className="video-story-section section-wrap" aria-labelledby="introducing-mizant">
          <div className="section-intro section-intro--split">
            <div>
              <p className="eyebrow">Mizant in one minute</p>
              <h2 id="introducing-mizant">See how the platform connects the full journey.</h2>
            </div>
            <p>
              Start with the asset and its purpose, then follow the evidence, independent reviews,
              investor understanding and controlled ownership records.
            </p>
          </div>
          <VideoGuide guide={introVideo} featured preload="metadata" />
        </section>

        <section className="model-section section-wrap" id="model">
          <div className="section-intro section-intro--split">
            <div>
              <p className="eyebrow">The Mizant operating layer</p>
              <h2>The governed workflow is the product.</h2>
            </div>
            <p>
              Technology widens access; it never replaces legal rights, Shariah integrity or human
              accountability. Every participant works from the same connected evidence trail.
            </p>
          </div>
          <div className="workflow-grid">
            {workflow.map(([number, title, copy], index) => (
              <article
                key={number}
                className={index === 2 ? 'workflow-card workflow-card--focus' : 'workflow-card'}
              >
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
          <div className="governance-rail">
            <span>
              <Icon name="spark" size={19} /> AI may assist evidence and explanation
            </span>
            <strong>Human decisions remain mandatory</strong>
            <span>
              <Icon name="lock" size={19} /> Legal authority and confidential data stay off-chain
            </span>
          </div>
        </section>

        <section className="participants-section section-wrap" id="participants">
          <div className="section-intro">
            <p className="eyebrow">One platform, clear responsibilities</p>
            <h2>Built around the people who make real assets investable.</h2>
            <p>
              Each role sees the information it needs—without inheriting another role’s authority.
            </p>
          </div>
          <div className="participant-grid">
            {participants.map((participant) => (
              <article key={participant.label}>
                <span className="participant-icon">
                  <Icon name={participant.icon} size={24} />
                </span>
                <p className="micro-label">{participant.label}</p>
                <h3>{participant.title}</h3>
                <p>{participant.copy}</p>
                <Link href={participant.href}>
                  {participant.action} <Icon name="arrow" size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="governance-story" id="governance-story">
          <div className="section-wrap governance-story__inner">
            <div>
              <p className="eyebrow eyebrow--gold">Governance before technology</p>
              <h2>Trust is designed into every decision—not added as a disclaimer.</h2>
              <p>
                Evidence, accountable reviewers and explicit release gates travel with the asset
                from first submission to servicing and reporting.
              </p>
              <Link className="button button--light" href="/governance">
                See governance in action <Icon name="arrow" size={18} />
              </Link>
            </div>
            <ol className="control-list">
              <li>
                <span>01</span>
                <div>
                  <strong>Rights before tokens</strong>
                  <p>Legal records define what investors hold.</p>
                </div>
                <Icon name="check" size={19} />
              </li>
              <li>
                <span>02</span>
                <div>
                  <strong>Evidence before claims</strong>
                  <p>Every status points back to a versioned source.</p>
                </div>
                <Icon name="check" size={19} />
              </li>
              <li>
                <span>03</span>
                <div>
                  <strong>Independent review</strong>
                  <p>Legal, risk and Shariah authority remain distinct.</p>
                </div>
                <Icon name="check" size={19} />
              </li>
              <li>
                <span>04</span>
                <div>
                  <strong>Continuous stewardship</strong>
                  <p>Monitoring continues after an opportunity closes.</p>
                </div>
                <Icon name="check" size={19} />
              </li>
            </ol>
          </div>
        </section>

        <section className="reference-section section-wrap">
          <div className="reference-card">
            <div>
              <p className="eyebrow">First reference journey</p>
              <h2>Solar equipment that serves a productive business.</h2>
              <p>
                The controlled Ijarah journey makes the full Mizant model tangible: identifiable
                equipment, clear ownership responsibilities, observable use, rental cash flows and
                ongoing evidence.
              </p>
              <div className="reference-facts">
                <span>
                  <strong>{money(solarOpportunity.target)}</strong> illustrative asset pool
                </span>
                <span>
                  <strong>{solarOpportunity.totalUnits.toLocaleString()}</strong> digital-unit
                  references
                </span>
                <span>
                  <strong>{solarOpportunity.termMonths} months</strong> proposed lease term
                </span>
              </div>
              <Link className="text-arrow" href="/opportunities/solar-ijarah">
                Explore the complete journey <Icon name="arrow" size={17} />
              </Link>
            </div>
            <div className="solar-illustration" aria-hidden="true">
              <div className="sun-disc" />
              <div className="solar-panel solar-panel--one" />
              <div className="solar-panel solar-panel--two" />
              <div className="solar-ground" />
              <Brand compact inverse />
            </div>
          </div>
        </section>

        <section className="closing-cta section-wrap">
          <div>
            <p className="eyebrow">Connected platform journey</p>
            <h2>See one governed asset move through the whole platform.</h2>
          </div>
          <Link className="button button--primary" href="/start">
            Start your guided journey <Icon name="arrow" size={18} />
          </Link>
        </section>
      </main>
      <footer className="site-footer">
        <div>
          <Brand inverse />
          <p>Real assets. Clear rights. Ethical access.</p>
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/demo">Platform demo</Link>
          <Link href="/opportunities">Opportunities</Link>
          <Link href="/applications">SME workspace</Link>
        </div>
        <div>
          <strong>Important</strong>
          <p>Synthetic demonstration only. Mizant is not conducting a live offering.</p>
        </div>
        <div className="site-footer__bottom">
          <span>© 2026 Mizant</span>
          <span>Governance-first real-asset investment infrastructure</span>
        </div>
      </footer>
    </div>
  );
}
