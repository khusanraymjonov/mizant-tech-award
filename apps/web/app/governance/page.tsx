import { DemoShell } from '../components/demo-shell';
import { GovernanceWorkspace } from '../components/governance-workspace';
import { Icon } from '../components/icons';

export default async function GovernancePage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const activeRole = params.role === 'compliance' ? 'compliance' : 'operations';

  return (
    <DemoShell
      active="Governance"
      workspaceRole={activeRole}
      eyebrow={
        activeRole === 'compliance' ? 'Independent checker workspace' : 'Operations workspace'
      }
      title="The platform can accelerate work. People retain authority."
      description="Independent approval lanes, enforced maker-checker separation, publication blocking and attributable audit history."
      action={
        <span className="locked-chip">
          <Icon name="lock" size={16} /> Live publication disabled
        </span>
      }
    >
      <GovernanceWorkspace activeRole={activeRole} />
    </DemoShell>
  );
}
