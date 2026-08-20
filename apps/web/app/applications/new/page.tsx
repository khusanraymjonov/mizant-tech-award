import { ApplicationBuilder } from '../../components/application-builder';
import { DemoShell } from '../../components/demo-shell';

export default async function NewApplicationPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const params = await searchParams;
  const originatorView = params.role === 'originator';
  return (
    <DemoShell
      active="Applications"
      workspaceRole={originatorView ? 'originator' : 'sme'}
      eyebrow={originatorView ? 'Originator-assisted application' : 'New application'}
      title="Build the case around the productive asset."
      description="A guided application captures business identity, the asset need and evidence readiness before any human review begins."
    >
      <ApplicationBuilder />
    </DemoShell>
  );
}
