'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Icon } from './icons';
import { learningArticles, learningAudiences, learningCategories } from '../lib/learning-content';

export function LearningLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<(typeof learningCategories)[number]>('All topics');
  const [audience, setAudience] = useState<(typeof learningAudiences)[number]>('All roles');

  const results = useMemo(() => {
    const terms = query.toLocaleLowerCase('en-GB').trim().split(/\s+/).filter(Boolean);

    return learningArticles.filter((article) => {
      const searchable = [
        article.title,
        article.summary,
        article.category,
        ...article.audiences,
        ...article.objectives,
      ]
        .join(' ')
        .toLocaleLowerCase('en-GB');

      return (
        (category === 'All topics' || article.category === category) &&
        (audience === 'All roles' || article.audiences.includes(audience)) &&
        terms.every((term) => searchable.includes(term))
      );
    });
  }, [audience, category, query]);

  function resetFilters() {
    setQuery('');
    setCategory('All topics');
    setAudience('All roles');
  }

  return (
    <section className="learning-library" aria-labelledby="learning-library-title">
      <div className="learning-library__intro">
        <div>
          <p className="eyebrow">Knowledge library</p>
          <h2 id="learning-library-title">Learn the principles, then practise the workflow.</h2>
        </div>
        <p>
          Original Mizant learning notes turn complex subjects into useful questions, checklists and
          next actions. Each note links to the primary sources used for further reading.
        </p>
      </div>
      <div className="learning-library__toolbar">
        <label className="learning-library__search">
          <span className="sr-only">Search learning resources</span>
          <Icon name="search" size={18} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search Ijarah, risk, ownership, tokenisation…"
          />
        </label>
        <label>
          <span>Topic</span>
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as (typeof learningCategories)[number])
            }
          >
            {learningCategories.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Useful for</span>
          <select
            value={audience}
            onChange={(event) =>
              setAudience(event.target.value as (typeof learningAudiences)[number])
            }
          >
            {learningAudiences.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="learning-library__status" aria-live="polite">
        <strong>
          {results.length} {results.length === 1 ? 'resource' : 'resources'}
        </strong>
        <span>Educational information only—not investment, legal, tax or Shariah advice.</span>
      </div>
      {results.length > 0 ? (
        <div className="learning-library__grid">
          {results.map((article, index) => (
            <article key={article.slug}>
              <div className="learning-library__card-meta">
                <span>{article.category}</span>
                <small>{article.readTime}</small>
              </div>
              <span className="learning-library__number" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <div className="learning-library__audiences">
                {article.audiences.slice(0, 3).map((role) => (
                  <span key={role}>{role}</span>
                ))}
              </div>
              <Link href={`/learn/${article.slug}`}>
                Read the learning note <Icon name="arrow" size={16} />
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="learning-library__empty">
          <Icon name="search" size={26} />
          <h3>No learning note matches those filters.</h3>
          <p>Try a broader term or return to the complete library.</p>
          <button type="button" onClick={resetFilters}>
            Clear search and filters
          </button>
        </div>
      )}
    </section>
  );
}
