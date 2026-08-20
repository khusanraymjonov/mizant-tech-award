import Link from 'next/link';
import { AccessOnboarding } from '../components/access-onboarding';
import { Brand } from '../components/brand';
import { Icon } from '../components/icons';

export default function StartPage() {
  return (
    <div className="start-page">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="start-header">
        <Link href="/" aria-label="Mizant home">
          <Brand />
        </Link>
        <div>
          <span>
            <Icon name="lock" size={16} /> Controlled preview
          </span>
          <Link href="/demo">Already exploring? Open platform</Link>
        </div>
      </header>
      <main id="main-content" className="start-main">
        <section className="start-intro">
          <div>
            <p className="eyebrow">Welcome to Mizant</p>
            <h1>Start with the workspace built for your role.</h1>
          </div>
          <p>
            Request controlled preview access, then follow a practical journey with clear next
            actions, responsibilities and approval boundaries.
          </p>
        </section>
        <AccessOnboarding />
        <section className="start-trust-strip" aria-label="Access safeguards">
          <span>
            <Icon name="shield" size={20} />
            <strong>Scoped roles</strong>Only relevant workspaces are granted
          </span>
          <span>
            <Icon name="users" size={20} />
            <strong>Human review</strong>Administrators confirm access
          </span>
          <span>
            <Icon name="document" size={20} />
            <strong>Audit history</strong>Changes remain attributable
          </span>
        </section>
      </main>
    </div>
  );
}
