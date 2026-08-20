import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { money, solarOpportunity } from '../lib/demo-data';

const journeyCards = [
  {
    step: '01',
    label: 'Investor journey',
    title: 'Discover and understand a productive asset',
    copy: 'Review the asset, rights, risks and Shariah basis before simulating a commitment.',
    href: '/opportunities',
    action: 'Begin as investor',
    icon: 'users' as const,
  },
  {
    step: '02',
    label: 'SME journey',
    title: 'Request productive equipment step by step',
    copy: 'Describe the business need, prepare evidence and track what happens after submission.',
    href: '/applications',
    action: 'Open SME workspace',
    icon: 'building' as const,
  },
  {
    step: '03',
    label: 'Originator journey',
    title: 'Coordinate a clear, review-ready case',
    copy: 'Prioritise missing evidence, support the SME and hand off without self-approving.',
    href: '/origination',
    action: 'Open originator workspace',
    icon: 'building' as const,
  },
  {
    step: '04',
    label: 'Operations & compliance journey',
    title: 'See how governance controls publication',
    copy: 'Inspect independent review lanes, maker-checker separation and attributable audit events.',
    href: '/governance',
    action: 'Open control centre',
    icon: 'shield' as const,
  },
  {
    step: '05',
    label: 'Ownership administration',
    title: 'Reconcile every reference to the governed register',
    copy: 'Search holder records, inspect their evidence and confirm the fixed synthetic supply remains balanced.',
    href: '/ownership',
    action: 'Open ownership register',
    icon: 'users' as const,
  },
  {
    step: '06',
    label: 'Independent Shariah assurance',
    title: 'Monitor structure conditions throughout the lifecycle',
    copy: 'Review methodology, evidence, conditions and material changes without automating a Shariah decision.',
    href: '/shariah',
    action: 'Open Shariah assurance',
    icon: 'shield' as const,
  },
  {
    step: '07',
    label: 'Platform administration',
    title: 'Control people, roles and access decisions',
    copy: 'Approve requests, suspend or remove users and inspect the attributable access history.',
    href: '/admin',
    action: 'Restricted administration',
    icon: 'users' as const,
    restricted: true,
  },
] as const;

export default function DemoOverviewPage() {
  return (
    <DemoShell
      active="Home"
      eyebrow="Public platform demo · investor workspace"
      title="Good morning, Alex. Continue where you left off."
      description="Review your next action, understand the opportunity and keep every decision connected to its evidence."
      action={
        <Link className="button button--primary" href="/opportunities/solar-ijarah">
          Continue opportunity review <Icon name="arrow" size={18} />
        </Link>
      }
    >
      <section className="home-priority-grid" aria-label="Investor next actions">
        <article className="home-next-action">
          <div>
            <span className="status-dot">Next action · about 5 minutes</span>
            <p className="micro-label">MZT-SYN-001</p>
            <h2>Understand the rights before choosing an amount</h2>
            <p>
              Review who owns the equipment, where rental cash flows come from and what happens if
              the SME cannot pay.
            </p>
          </div>
          <Link className="button button--secondary" href="/opportunities/solar-ijarah">
            Review rights and risks <Icon name="arrow" size={17} />
          </Link>
        </article>
        <aside className="home-readiness">
          <div>
            <span>Investor readiness</span>
            <strong>3 of 4</strong>
          </div>
          <ol>
            <li className="is-complete">Profile details recorded</li>
            <li className="is-complete">Eligibility scenario completed</li>
            <li className="is-complete">Risk notice acknowledged</li>
            <li>Opportunity comprehension check</li>
          </ol>
        </aside>
      </section>

      <section className="demo-hero-card">
        <div className="demo-hero-card__copy">
          <span className="status-dot status-dot--inverse">
            Reference transaction · {solarOpportunity.reference}
          </span>
          <h2>{solarOpportunity.title}</h2>
          <p>{solarOpportunity.summary}</p>
          <div className="demo-case-stats">
            <div>
              <span>Asset pool</span>
              <strong>{money(solarOpportunity.target)}</strong>
            </div>
            <div>
              <span>Digital-unit references</span>
              <strong>{solarOpportunity.totalUnits.toLocaleString()}</strong>
            </div>
            <div>
              <span>Proposed term</span>
              <strong>{solarOpportunity.termMonths} months</strong>
            </div>
          </div>
        </div>
        <div
          className="demo-hero-card__diagram"
          aria-label="Investors, project vehicle and SME connected by the Mizant workflow"
        >
          <div>
            <Icon name="users" size={23} />
            <span>Eligible investors</span>
          </div>
          <span className="diagram-line">Defined rights</span>
          <div className="diagram-core">
            <Icon name="shield" size={24} />
            <span>Mizant governance</span>
          </div>
          <span className="diagram-line">Asset & rent</span>
          <div>
            <Icon name="building" size={23} />
            <span>Productive SME</span>
          </div>
        </div>
      </section>

      <section className="demo-section">
        <div className="demo-section__heading">
          <div>
            <p className="eyebrow">Seven connected workspaces</p>
            <h2>Explore the platform by role</h2>
          </div>
          <p>
            Switch roles at any time to understand who does what and which actions remain
            independent.
          </p>
        </div>
        <div className="journey-choice-grid">
          {journeyCards.map((card) => {
            const content = (
              <>
                <div className="journey-choice__top">
                  <span>{card.step}</span>
                  <Icon name={card.icon} size={25} />
                </div>
                <p className="micro-label">{card.label}</p>
                <h3>{card.title}</h3>
                <p>{card.copy}</p>
                <strong>
                  {card.action}
                  {'restricted' in card ? (
                    <Icon name="lock" size={17} />
                  ) : (
                    <Icon name="arrow" size={17} />
                  )}
                </strong>
              </>
            );

            return 'restricted' in card ? (
              <article
                className="journey-choice journey-choice--restricted"
                key={card.step}
                aria-label={`${card.label}: restricted access`}
              >
                {content}
              </article>
            ) : (
              <Link href={card.href} className="journey-choice" key={card.step}>
                {content}
              </Link>
            );
          })}
        </div>
      </section>

      <section className="demo-section controls-summary">
        <div>
          <p className="eyebrow">Control snapshot</p>
          <h2>What the MVP already demonstrates</h2>
        </div>
        <div className="control-summary-grid">
          <article>
            <Icon name="document" size={22} />
            <strong>Versioned evidence</strong>
            <span>Every material record keeps its source and history.</span>
          </article>
          <article>
            <Icon name="users" size={22} />
            <strong>Role separation</strong>
            <span>Applicants cannot approve their own submissions.</span>
          </article>
          <article>
            <Icon name="shield" size={22} />
            <strong>Human gates</strong>
            <span>Legal, risk and Shariah lanes remain accountable.</span>
          </article>
          <article>
            <Icon name="lock" size={22} />
            <strong>Safe boundaries</strong>
            <span>No real money, identity data, custody or live token value.</span>
          </article>
        </div>
      </section>
    </DemoShell>
  );
}
