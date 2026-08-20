import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { ShariahAssuranceWorkspace } from '../components/shariah-assurance-workspace';

export default function ShariahPage() {
  return (
    <DemoShell
      active="Shariah assurance"
      workspaceRole="shariah"
      eyebrow="Independent Shariah assurance"
      title="Review the structure once. Monitor its conditions throughout the lifecycle."
      description="A dedicated workspace records methodology, independence, evidence, conditions, material changes and human decisions without treating a label as proof."
      action={
        <span className="locked-chip">
          <Icon name="shield" size={16} /> Independent reviewer access
        </span>
      }
    >
      <ShariahAssuranceWorkspace />
    </DemoShell>
  );
}
