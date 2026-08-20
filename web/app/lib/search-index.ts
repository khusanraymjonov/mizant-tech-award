import { learningArticles } from './learning-content';

export type SearchEntry = Readonly<{
  title: string;
  description: string;
  href: string;
  type: 'Platform' | 'Learning';
  keywords: readonly string[];
}>;

const platformEntries = [
  {
    title: 'Workspace home',
    description: 'Choose a participant role and understand the overall opportunity lifecycle.',
    href: '/demo',
    type: 'Platform',
    keywords: ['dashboard', 'workspace', 'role', 'home'],
  },
  {
    title: 'Opportunities',
    description: 'Browse the available demonstration opportunity and its current review status.',
    href: '/opportunities',
    type: 'Platform',
    keywords: ['investor', 'asset', 'solar', 'ijarah'],
  },
  {
    title: 'Solar Ijarah opportunity',
    description: 'Review the asset, lease structure, documents, risks and investor next step.',
    href: '/opportunities/solar-ijarah',
    type: 'Platform',
    keywords: ['solar', 'equipment', 'lease', 'rent', 'investment'],
  },
  {
    title: 'Portfolio',
    description: 'Inspect an investor position, servicing status and ownership record.',
    href: '/portfolio',
    type: 'Platform',
    keywords: ['investor', 'holding', 'position', 'income', 'ownership'],
  },
  {
    title: 'Applications',
    description: 'Follow submitted SME cases, requirements, conditions and next actions.',
    href: '/applications',
    type: 'Platform',
    keywords: ['sme', 'submission', 'case', 'evidence'],
  },
  {
    title: 'New SME application',
    description: 'Build a demonstration equipment-finance request and evidence pack.',
    href: '/applications/new',
    type: 'Platform',
    keywords: ['sme', 'apply', 'asset', 'finance', 'documents'],
  },
  {
    title: 'Origination pipeline',
    description: 'Coordinate evidence gaps and hand a review-ready case to independent teams.',
    href: '/origination',
    type: 'Platform',
    keywords: ['originator', 'pipeline', 'sme', 'submission'],
  },
  {
    title: 'Review queues',
    description: 'Work through operational, compliance and independent decision queues.',
    href: '/reviews',
    type: 'Platform',
    keywords: ['review', 'operations', 'compliance', 'decision'],
  },
  {
    title: 'Governance workspace',
    description: 'Inspect version-bound approvals, conditions and the end-to-end audit trail.',
    href: '/governance',
    type: 'Platform',
    keywords: ['approval', 'audit', 'maker checker', 'legal', 'compliance'],
  },
  {
    title: 'Shariah assurance',
    description: 'Review independent decisions, conditions, monitoring and exceptions.',
    href: '/shariah',
    type: 'Platform',
    keywords: ['shariah', 'ijarah', 'review', 'monitoring', 'islamic finance'],
  },
  {
    title: 'Tokenisation workbench',
    description: 'Run the controlled journey from canonical records to reconciled digital units.',
    href: '/tokenisation',
    type: 'Platform',
    keywords: ['token', 'issue', 'ledger', 'supply', 'reconcile'],
  },
  {
    title: 'Ownership register',
    description: 'Inspect holder eligibility, balances, transfers and reconciliation status.',
    href: '/ownership',
    type: 'Platform',
    keywords: ['register', 'holder', 'transfer', 'ownership', 'beneficial'],
  },
] satisfies readonly SearchEntry[];

const learningEntries = learningArticles.map(
  (article): SearchEntry => ({
    title: article.title,
    description: article.summary,
    href: `/learn/${article.slug}`,
    type: 'Learning',
    keywords: [article.category, ...article.audiences, ...article.objectives],
  }),
);

export const searchIndex: readonly SearchEntry[] = [...platformEntries, ...learningEntries];

export function searchEntries(query: string, limit = searchIndex.length): readonly SearchEntry[] {
  const terms = query.toLocaleLowerCase('en-GB').trim().split(/\s+/).filter(Boolean);

  if (terms.length === 0) return [];

  return searchIndex
    .map((entry) => {
      const title = entry.title.toLocaleLowerCase('en-GB');
      const text = [entry.title, entry.description, ...entry.keywords]
        .join(' ')
        .toLocaleLowerCase('en-GB');
      const matches = terms.every((term) => text.includes(term));
      const score = terms.reduce(
        (total, term) => total + (title.startsWith(term) ? 4 : title.includes(term) ? 2 : 1),
        0,
      );

      return { entry, matches, score };
    })
    .filter((result) => result.matches)
    .sort(
      (left, right) =>
        right.score - left.score || left.entry.title.localeCompare(right.entry.title),
    )
    .slice(0, limit)
    .map((result) => result.entry);
}
