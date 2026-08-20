import Link from 'next/link';
import { Brand } from './brand';
import { PlatformSearch } from './platform-search';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="site-header__brand" href="/" aria-label="Mizant home">
        <Brand />
      </Link>
      <nav aria-label="Public navigation">
        <a href="/#model">How it works</a>
        <a href="/#participants">Who it serves</a>
        <a href="/#governance-story">Governance</a>
      </nav>
      <div className="site-header__actions">
        <PlatformSearch variant="public" />
        <Link className="text-link" href="/learn">
          How the platform works
        </Link>
        <Link className="button button--primary button--small" href="/start">
          Get started
        </Link>
      </div>
    </header>
  );
}
