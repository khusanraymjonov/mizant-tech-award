import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DemoShell } from '../../components/demo-shell';
import { Icon } from '../../components/icons';
import { getLearningArticle, learningArticles } from '../../lib/learning-content';

export function generateStaticParams() {
  return learningArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getLearningArticle(slug);

  if (!article) return { title: 'Learning note not found | Mizant' };

  return {
    title: `${article.title} | Mizant Learning Centre`,
    description: article.summary,
  };
}

export default async function LearningArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getLearningArticle(slug);
  if (!article) notFound();

  const related = learningArticles
    .filter(
      (candidate) => candidate.slug !== article.slug && candidate.category === article.category,
    )
    .slice(0, 3);

  return (
    <DemoShell
      active="Learn"
      workspaceRole="investor"
      eyebrow={`${article.category} · ${article.readTime}`}
      title={article.title}
      description={article.summary}
      action={
        <Link className="button button--secondary" href="/learn">
          ← Learning Centre
        </Link>
      }
    >
      <div className="learning-article-layout">
        <article className="learning-article">
          <div className="learning-article__audience">
            <span>Useful for</span>
            {article.audiences.map((audience) => (
              <strong key={audience}>{audience}</strong>
            ))}
          </div>
          <section className="learning-article__objectives" aria-labelledby="learning-objectives">
            <div>
              <Icon name="spark" size={22} />
              <h2 id="learning-objectives">What you will understand</h2>
            </div>
            <ul>
              {article.objectives.map((objective) => (
                <li key={objective}>
                  <Icon name="check" size={16} />
                  {objective}
                </li>
              ))}
            </ul>
          </section>
          <div className="learning-article__body">
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.points ? (
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          <section className="learning-article__checklist" aria-labelledby="learning-checklist">
            <p className="eyebrow">Practical tool</p>
            <h2 id="learning-checklist">Use this checklist</h2>
            <ul>
              {article.checklist.map((item) => (
                <li key={item}>
                  <span aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </article>
        <aside className="learning-article-aside" aria-label="Article resources">
          <section className="learning-article-aside__action">
            <span>Try it in Mizant</span>
            <h2>Turn the principle into a visible workflow.</h2>
            <Link href={article.platformHref}>
              {article.platformAction} <Icon name="arrow" size={16} />
            </Link>
          </section>
          <section>
            <span>Primary sources</span>
            <h2>Continue with authoritative guidance.</h2>
            <ul>
              {article.sources.map((source) => (
                <li key={source.href}>
                  <a href={source.href} target="_blank" rel="noreferrer">
                    <strong>{source.label}</strong>
                    <small>{source.publisher}</small>
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <section className="learning-article-aside__notice">
            <Icon name="shield" size={19} />
            <div>
              <strong>Educational information</strong>
              <p>
                This note is not investment, legal, tax or Shariah advice. Live transactions require
                qualified professional review and formal approval in the relevant jurisdiction.
              </p>
            </div>
          </section>
        </aside>
      </div>
      {related.length > 0 ? (
        <section className="learning-related" aria-labelledby="related-learning-title">
          <div>
            <p className="eyebrow">Continue learning</p>
            <h2 id="related-learning-title">
              Related {article.category.toLocaleLowerCase('en-GB')} notes
            </h2>
          </div>
          <div>
            {related.map((item) => (
              <Link href={`/learn/${item.slug}`} key={item.slug}>
                <span>{item.readTime}</span>
                <strong>{item.title}</strong>
                <Icon name="arrow" size={16} />
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </DemoShell>
  );
}
