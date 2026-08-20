'use client';

import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from './icons';
import { searchEntries } from '../lib/search-index';

export function PlatformSearch({ variant = 'platform' }: { variant?: 'platform' | 'public' }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchEntries(query, 6), [query]);
  const hasQuery = query.trim().length > 0;

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const first = results[0];
    if (first) router.push(first.href);
  }

  return (
    <form
      className={`platform-search platform-search--${variant}`}
      role="search"
      aria-label="Search Mizant"
      onSubmit={submitSearch}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setQuery('');
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setQuery('');
          event.currentTarget.querySelector('input')?.blur();
        }
      }}
    >
      <Icon name="search" size={17} />
      <label className="sr-only" htmlFor={`mizant-search-${variant}`}>
        Search pages and learning resources
      </label>
      <input
        id={`mizant-search-${variant}`}
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={variant === 'public' ? 'Search Mizant' : 'Search pages and learning'}
        autoComplete="off"
        aria-controls={`mizant-search-results-${variant}`}
        aria-expanded={hasQuery}
      />
      {hasQuery ? (
        <div
          className="platform-search__results"
          id={`mizant-search-results-${variant}`}
          aria-live="polite"
        >
          <div className="platform-search__result-count">
            {results.length === 0
              ? 'No matching pages or resources'
              : `${results.length} best ${results.length === 1 ? 'match' : 'matches'}`}
          </div>
          {results.map((result) => (
            <Link
              href={result.href}
              key={`${result.type}-${result.href}`}
              onClick={() => setQuery('')}
            >
              <span>{result.type}</span>
              <strong>{result.title}</strong>
              <small>{result.description}</small>
            </Link>
          ))}
          {results.length === 0 ? (
            <Link href="/learn" onClick={() => setQuery('')}>
              <span>Learning</span>
              <strong>Browse the Learning Centre</strong>
              <small>Choose a topic, role or practical guide.</small>
            </Link>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}
