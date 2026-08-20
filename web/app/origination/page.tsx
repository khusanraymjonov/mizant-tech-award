import Link from 'next/link';
import { assessApplication } from '@mizant/domain/sme-submission';
import {
  provisionalUzbekistanPilotPolicy,
  syntheticSmeApplications,
} from '@mizant/testing/sme-applications';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';

const statusLabel = {
  draft: 'Evidence incomplete',
  submitted: 'Ready for hand-off',
  manual_review: 'Clarification required',
  approved_for_governance: 'Governance ready',
  blocked: 'Blocked',
} as const;

export default function OriginationPage() {
  return (
    <DemoShell
      active="Origination"
      workspaceRole="originator"
      eyebrow="Originator workspace"
      title="Move each business case forward with a clear next action."
      description="Coordinate the SME, asset evidence and submission pack without crossing into independent approval decisions."
      action={
        <Link className="button button--primary" href="/applications/new?role=originator">
          Start a guided case <Icon name="arrow" size={17} />
        </Link>
      }
    >
      <section className="workspace-kpis" aria-label="Origination summary">
        <article>
          <span>Active SME cases</span>
          <strong>3</strong>
          <small>Across one controlled pipeline</small>
        </article>
        <article>
          <span>Ready for hand-off</span>
          <strong>1</strong>
          <small>All mandatory evidence present</small>
        </article>
        <article>
          <span>Needs SME action</span>
          <strong>1</strong>
          <small>Three evidence items missing</small>
        </article>
        <article>
          <span>Human clarification</span>
          <strong>1</strong>
          <small>Beneficial ownership mismatch</small>
        </article>
      </section>

      <div className="workbench-grid">
        <section className="workbench-panel" aria-labelledby="originator-priority-title">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Priority queue</p>
              <h2 id="originator-priority-title">What needs attention now</h2>
            </div>
            <span className="version-chip">Policy v1</span>
          </div>
          <div className="work-queue">
            {syntheticSmeApplications.map((application) => {
              const assessment = assessApplication(application, provisionalUzbekistanPilotPolicy);
              const nextAction =
                application.status === 'draft'
                  ? `Collect ${assessment.outstandingItems.length} missing evidence items`
                  : application.status === 'manual_review'
                    ? 'Clarify beneficial-owner records with the SME'
                    : 'Confirm the pack and hand it to independent review';
              return (
                <article key={application.id}>
                  <div className="work-queue__identity">
                    <span className="micro-label">{application.reference}</span>
                    <strong>{application.identity.legalName}</strong>
                    <small>{application.rationale.productiveAssetNeed}</small>
                  </div>
                  <div className="work-queue__status">
                    <span>{statusLabel[application.status]}</span>
                    <strong>{nextAction}</strong>
                  </div>
                  <Link
                    href={`/applications?role=originator#${application.reference}`}
                    aria-label={`Open ${application.identity.legalName}`}
                  >
                    Open case <Icon name="arrow" size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <aside className="next-action-card">
          <span className="status-dot">Recommended next</span>
          <h2>Complete the cold-chain evidence pack</h2>
          <p>
            Samarkand Cold Chain is missing site consent, a current bank statement and the final
            technical specification.
          </p>
          <dl>
            <div>
              <dt>Owner</dt>
              <dd>Farida Rasulova</dd>
            </div>
            <div>
              <dt>SME contact</dt>
              <dd>Nodira Karimova</dd>
            </div>
            <div>
              <dt>Target response</dt>
              <dd>Within 2 working days</dd>
            </div>
          </dl>
          <Link
            className="button button--secondary"
            href="/applications?role=originator#SYN-UZ-SME-002"
          >
            Review missing items
          </Link>
        </aside>
      </div>

      <section className="responsibility-grid" aria-labelledby="originator-boundaries-title">
        <div>
          <p className="eyebrow">Clear responsibilities</p>
          <h2 id="originator-boundaries-title">
            Coordinate the case. Never approve your own work.
          </h2>
        </div>
        <article>
          <Icon name="check" size={21} />
          <strong>You can</strong>
          <p>
            Invite an SME, explain required evidence, prepare the submission and answer questions.
          </p>
        </article>
        <article>
          <Icon name="lock" size={21} />
          <strong>You cannot</strong>
          <p>Approve eligibility, legal structure, compliance, Shariah status or publication.</p>
        </article>
      </section>
    </DemoShell>
  );
}
