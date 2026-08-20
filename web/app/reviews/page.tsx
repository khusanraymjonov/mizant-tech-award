import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { ReviewQueue } from '../components/review-queue';

export default function ReviewsPage() {
  return (
    <DemoShell
      active="Reviews"
      workspaceRole="compliance"
      eyebrow="Independent review workspace"
      title="Review what is ready. Escalate what is not."
      description="A controlled queue keeps evidence requests, reviewer ownership and decision history clear before any approval can progress."
      action={
        <Link className="button button--secondary" href="/governance?role=compliance">
          Open governance controls <Icon name="arrow" size={17} />
        </Link>
      }
    >
      <ReviewQueue />
    </DemoShell>
  );
}
