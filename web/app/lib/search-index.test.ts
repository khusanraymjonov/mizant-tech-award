import { describe, expect, it } from 'vitest';
import { learningArticles } from './learning-content';
import { searchEntries, searchIndex } from './search-index';

describe('platform search', () => {
  it('indexes every learning note and keeps addresses unique', () => {
    expect(new Set(searchIndex.map((entry) => entry.href)).size).toBe(searchIndex.length);

    for (const article of learningArticles) {
      expect(searchIndex.some((entry) => entry.href === `/learn/${article.slug}`)).toBe(true);
    }
  });

  it('finds useful pages using ordinary language', () => {
    expect(searchEntries('solar lease')[0]?.href).toBe('/opportunities/solar-ijarah');
    expect(searchEntries('maker checker').some((entry) => entry.href === '/governance')).toBe(true);
    expect(
      searchEntries('Shariah monitoring').some((entry) => entry.href.includes('/learn/')),
    ).toBe(true);
    expect(searchEntries('words-that-do-not-exist')).toEqual([]);
  });
});
