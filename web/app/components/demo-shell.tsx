import type { ReactNode } from 'react';
import Link from 'next/link';
import { Brand } from './brand';
import { Icon } from './icons';
import { RoleSwitcher } from './role-switcher';
import { PlatformSearch } from './platform-search';
import { workspaceProfiles, type WorkspaceRole } from '../lib/workspaces';

const overview = { label: 'Home', href: '/demo', icon: 'grid' as const };
const navigationByRole = {
  investor: [
    overview,
    { label: 'Opportunities', href: '/opportunities', icon: 'sun' as const },
    { label: 'Portfolio', href: '/portfolio', icon: 'portfolio' as const },
  ],
  sme: [overview, { label: 'Applications', href: '/applications', icon: 'document' as const }],
  originator: [
    overview,
    { label: 'Origination', href: '/origination', icon: 'building' as const },
    { label: 'Applications', href: '/applications?role=originator', icon: 'document' as const },
  ],
  operations: [
    overview,
    { label: 'Reviews', href: '/reviews', icon: 'check' as const },
    { label: 'Governance', href: '/governance', icon: 'shield' as const },
  ],
  compliance: [
    overview,
    { label: 'Reviews', href: '/reviews', icon: 'check' as const },
    { label: 'Governance', href: '/governance?role=compliance', icon: 'shield' as const },
  ],
  shariah: [
    overview,
    { label: 'Shariah assurance', href: '/shariah', icon: 'shield' as const },
    { label: 'Governance', href: '/governance?role=compliance', icon: 'check' as const },
  ],
  ownership: [
    overview,
    { label: 'Ownership', href: '/ownership', icon: 'users' as const },
    { label: 'Tokenisation', href: '/tokenisation', icon: 'layers' as const },
  ],
  admin: [
    overview,
    { label: 'Administration', href: '/admin', icon: 'users' as const },
    { label: 'Governance', href: '/governance', icon: 'shield' as const },
    { label: 'Tokenisation', href: '/tokenisation', icon: 'layers' as const },
  ],
} satisfies Record<
  WorkspaceRole,
  readonly { label: string; href: string; icon: Parameters<typeof Icon>[0]['name'] }[]
>;

export function DemoShell({
  active,
  eyebrow,
  title,
  description,
  action,
  children,
  workspaceRole = 'investor',
}: {
  active: string;
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  children: ReactNode;
  workspaceRole?: WorkspaceRole;
}) {
  const profile = workspaceProfiles[workspaceRole];
  const items = [
    ...navigationByRole[workspaceRole],
    { label: 'Learn', href: '/learn', icon: 'spark' as const },
  ];
  return (
    <div className="platform-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <aside className="platform-sidebar">
        <Link href="/" className="platform-sidebar__brand">
          <Brand inverse />
        </Link>
        <p className="platform-sidebar__section-label">{profile.label} workspace</p>
        <nav aria-label="Platform navigation">
          {items.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              aria-current={active === item.label ? 'page' : undefined}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="platform-sidebar__trust">
          <Icon name="lock" size={20} />
          <div>
            <strong>Controlled environment</strong>
            <span>No real money or customer data</span>
          </div>
        </div>
        <Link href="/" className="platform-sidebar__exit">
          ← Return to public site
        </Link>
      </aside>
      <div className="platform-main">
        <div className="demo-safety" role="note">
          <span>Controlled environment</span>
          Uses fictional records · no money, identity provider, custody or live digital assets
        </div>
        <header className="platform-topbar">
          <Link href="/demo" className="mobile-brand" aria-label="Mizant platform home">
            <Brand compact />
          </Link>
          <nav className="platform-mobile-nav" aria-label="Mobile platform navigation">
            {items.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                aria-current={active === item.label ? 'page' : undefined}
              >
                <Icon name={item.icon} size={17} />
                {item.label}
              </Link>
            ))}
          </nav>
          <PlatformSearch />
          <div className="workspace-context">
            <RoleSwitcher currentRole={workspaceRole} />
            <div className="demo-user">
              <div>
                <strong>{profile.name}</strong>
                <span>{profile.descriptor}</span>
              </div>
              <span className="demo-user__avatar">{profile.initials}</span>
            </div>
          </div>
        </header>
        <main id="main-content" className="platform-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            {action ? <div className="page-heading__action">{action}</div> : null}
          </section>
          {children}
        </main>
        <footer className="platform-footer">
          <span>Mizant · Governance-first real-asset infrastructure</span>
          <span>Not an offer, advice, legal opinion or Shariah ruling</span>
        </footer>
      </div>
    </div>
  );
}
