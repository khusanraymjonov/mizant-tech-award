export type VideoGuide = Readonly<{
  slug: string;
  title: string;
  role: string;
  duration: string;
  summary: string;
  transcript?: string;
}>;

export const introVideo: VideoGuide = {
  slug: 'introducing-mizant',
  title: 'Introducing Mizant',
  role: 'Platform introduction',
  duration: '60 seconds',
  summary:
    'See how real assets, clear rights, independent review and controlled digital records connect across Mizant.',
  transcript:
    'Real-asset opportunities can be difficult to understand. Mizant connects SMEs, originators, investors and independent reviewers through one controlled lifecycle. Evidence begins with the asset. Legal, risk, compliance and Shariah decisions stay separate and attributable. Investors can review the rights, risks, cash-flow source and evidence status. Tokenisation follows human approval and maker-checker controls. Digital records then remain connected to the controlled ownership register and audit trail.',
};

export const investorWalkthroughVideo: VideoGuide = {
  slug: 'investor-platform-walkthrough',
  title: 'Investor platform walkthrough',
  role: 'Investor and professional adviser',
  duration: '2 minutes',
  summary:
    'Follow the complete path from workspace selection to opportunity evidence, risk review and a simulated commitment.',
};

export const onboardingVideos: readonly VideoGuide[] = [
  {
    slug: 'choosing-your-workspace',
    title: 'Choosing your Mizant workspace',
    role: 'Investor, SME and originator',
    duration: '30 seconds',
    summary: 'Choose the perspective that matches your task and see the correct next steps.',
  },
  {
    slug: 'demonstration-profile',
    title: 'Creating your demonstration profile',
    role: 'Investor, SME and originator',
    duration: '34 seconds',
    summary:
      'Use the fictional profile safely and understand how the preview access request works.',
  },
  {
    slug: 'dashboard-navigation',
    title: 'Finding your way around the dashboard',
    role: 'All roles',
    duration: '34 seconds',
    summary:
      'Recognise the next action, role-specific navigation and controlled-environment boundary.',
  },
  {
    slug: 'reviewing-an-opportunity',
    title: 'Finding and reviewing an opportunity',
    role: 'Investor and professional adviser',
    duration: '38 seconds',
    summary: 'Check status, key terms and evidence gates before opening the reference opportunity.',
  },
  {
    slug: 'documents-and-information',
    title: 'Reviewing documents and key information',
    role: 'Investor, adviser and reviewer',
    duration: '40 seconds',
    summary: 'Understand the asset, structure, risks, scenarios and document status in one view.',
  },
  {
    slug: 'investor-next-step',
    title: 'Completing the next investor step',
    role: 'Investor',
    duration: '38 seconds',
    summary:
      'Complete the comprehension flow and create a demonstration record without moving money.',
  },
  {
    slug: 'submitting-an-opportunity',
    title: 'Submitting an opportunity for human review',
    role: 'SME and originator',
    duration: '40 seconds',
    summary: 'Prepare fictional business, asset and evidence details for independent human review.',
  },
  {
    slug: 'guidance-and-status',
    title: 'Getting guidance and reading status indicators',
    role: 'All roles',
    duration: '34 seconds',
    summary:
      'Use the Learning Centre, status chips and audit references to understand what comes next.',
  },
] as const;
