import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { IssuanceOrchestrator } from '../components/issuance-orchestrator';
import { TokenisationWorkbench } from '../components/tokenisation-workbench';

const lifecycle = [
  ['01', 'Instrument approved', 'Exact legal rights and supply version are locked'],
  ['02', 'Units prepared', 'An idempotent instruction references the canonical register'],
  ['03', 'Pre-flight checked', 'Identity, eligibility, balance and policy rules are evaluated'],
  ['04', 'Human approved', 'A separate checker approves or rejects the exact instruction'],
  ['05', 'Register reconciled', 'Every resulting position is attributable and balanced'],
] as const;

export default function TokenisationPage() {
  return (
    <DemoShell
      active="Tokenisation"
      workspaceRole="ownership"
      eyebrow="Digital-unit control centre"
      title="Move from verified asset to reconciled digital units—without losing human control."
      description="Complete the governed issuance procedure, inspect every canonical record, record independent approvals and reconcile the fixed off-chain supply."
      action={
        <Link className="button button--secondary" href="/ownership">
          Open canonical register <Icon name="arrow" size={17} />
        </Link>
      }
    >
      <section className="workspace-kpis token-kpis" aria-label="Digital-unit control summary">
        <article>
          <span>Instrument</span>
          <strong>SYN-INST-001</strong>
          <small>Restricted participation units · v1</small>
        </article>
        <article>
          <span>Fixed supply</span>
          <strong>2,500</strong>
          <small>Issuance available after all gates pass</small>
        </article>
        <article>
          <span>Register state</span>
          <strong>Balanced</strong>
          <small>2,500 of 2,500 accounted for</small>
        </article>
        <article>
          <span>Execution mode</span>
          <strong>Off-chain</strong>
          <small>No contract or network submission</small>
        </article>
      </section>

      <div className="token-boundary">
        <Icon name="layers" size={23} />
        <div>
          <strong>
            A digital unit is a restricted representation—not the asset or legal register.
          </strong>
          <span>
            The asset, legal structure, investor rights, register and servicing records remain
            separate governed objects.
          </span>
        </div>
      </div>

      <IssuanceOrchestrator />

      <details className="preflight-lab">
        <summary>
          <span>
            <Icon name="shield" size={19} /> Test transfer-policy edge cases
          </span>
          <small>Identity expiry · restricted jurisdiction · paused instrument</small>
        </summary>
        <TokenisationWorkbench />
      </details>

      <section className="token-lifecycle" aria-labelledby="token-lifecycle-title">
        <div className="section-heading section-heading--inline">
          <div>
            <p className="eyebrow">Controlled lifecycle</p>
            <h2 id="token-lifecycle-title">From approved rights to reconciled records</h2>
          </div>
          <p>Each step is versioned, attributable and reversible through a governed correction.</p>
        </div>
        <ol>
          {lifecycle.map(([number, title, description]) => (
            <li key={number}>
              <span>{number}</span>
              <strong>{title}</strong>
              <p>{description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="token-control-grid" aria-label="Digital-unit operating controls">
        <article>
          <Icon name="users" size={22} />
          <strong>Verified holders</strong>
          <p>Recipient identity and eligibility must be current before allocation or transfer.</p>
        </article>
        <article>
          <Icon name="shield" size={22} />
          <strong>Policy pre-check</strong>
          <p>
            Every action is checked against the exact instrument and restriction-policy version.
          </p>
        </article>
        <article>
          <Icon name="lock" size={22} />
          <strong>Pause and freeze</strong>
          <p>Authorised administrators can prepare controlled restrictions and recovery actions.</p>
        </article>
        <article>
          <Icon name="document" size={22} />
          <strong>Attributable history</strong>
          <p>Maker, checker, reason, evidence and resulting register version remain auditable.</p>
        </article>
      </section>
    </DemoShell>
  );
}
