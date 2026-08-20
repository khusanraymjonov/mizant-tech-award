import { AdminConsole } from '../components/admin-console';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';

export default function AdminPage() {
  return (
    <DemoShell
      active="Administration"
      workspaceRole="admin"
      eyebrow="Platform administration"
      title="Control access, roles and operating safeguards from one place."
      description="Approve access requests, suspend or remove users, review role assignments and export an attributable administration history."
      action={
        <span className="locked-chip">
          <Icon name="shield" size={16} /> Administrator · scoped preview
        </span>
      }
    >
      <AdminConsole />
    </DemoShell>
  );
}
