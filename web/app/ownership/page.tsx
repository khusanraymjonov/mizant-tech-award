import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { OwnershipRegister } from '../components/ownership-register';

export default function OwnershipPage() {
  return (
    <DemoShell
      active="Ownership"
      workspaceRole="ownership"
      eyebrow="Ownership administration"
      title="Every holding points back to approved rights and evidence."
      description="A synthetic register view separates investor-facing references, canonical ownership administration and servicing records."
      action={
        <div className="heading-actions">
          <Link className="button button--primary" href="/tokenisation">
            Digital-unit controls <Icon name="arrow" size={16} />
          </Link>
          <span className="locked-chip">
            <Icon name="lock" size={16} /> Production issuance disabled
          </span>
        </div>
      }
    >
      <section className="portfolio-metrics ownership-metrics">
        <article>
          <span>Instrument</span>
          <strong>1</strong>
          <small>SYN-INST-001 · version 1</small>
        </article>
        <article>
          <span>Unit references</span>
          <strong>2,500</strong>
          <small>Fixed synthetic supply</small>
        </article>
        <article>
          <span>Recorded holders</span>
          <strong>2</strong>
          <small>Plus unallocated capacity</small>
        </article>
        <article>
          <span>Reconciliation</span>
          <strong>Balanced</strong>
          <small>2,500 of 2,500 accounted for</small>
        </article>
      </section>

      <div className="ownership-boundary">
        <Icon name="shield" size={20} />
        <div>
          <strong>Register administration is human-controlled.</strong>
          <span>
            Corrections, transfers and confirmations require attributable maker-checker review.
          </span>
        </div>
      </div>

      <OwnershipRegister />
    </DemoShell>
  );
}
