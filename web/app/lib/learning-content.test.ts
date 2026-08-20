import { describe, expect, it } from 'vitest';
import { learningArticles } from './learning-content';

describe('learning content', () => {
  it('provides a substantial, uniquely addressable learning library', () => {
    expect(learningArticles.length).toBeGreaterThanOrEqual(8);
    expect(new Set(learningArticles.map((article) => article.slug)).size).toBe(
      learningArticles.length,
    );
  });

  it('keeps every note practical and linked to primary further reading', () => {
    for (const article of learningArticles) {
      expect(article.objectives.length).toBeGreaterThanOrEqual(3);
      expect(article.sections.length).toBeGreaterThanOrEqual(3);
      expect(article.checklist.length).toBeGreaterThanOrEqual(5);
      expect(article.sources.length).toBeGreaterThan(0);
      expect(article.platformHref).toMatch(/^\//);

      for (const source of article.sources) {
        expect(source.href).toMatch(/^https:\/\//);
        expect(source.publisher.length).toBeGreaterThan(2);
      }
    }
  });
});
