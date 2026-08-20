export type LearningSource = Readonly<{
  label: string;
  publisher: string;
  href: string;
}>;

export type LearningSection = Readonly<{
  heading: string;
  paragraphs: readonly string[];
  points?: readonly string[];
}>;

export type LearningArticle = Readonly<{
  slug: string;
  title: string;
  category: string;
  audiences: readonly string[];
  readTime: string;
  summary: string;
  objectives: readonly string[];
  sections: readonly LearningSection[];
  checklist: readonly string[];
  sources: readonly LearningSource[];
  platformHref: string;
  platformAction: string;
}>;

const sources = {
  aaoifiStandards: {
    label: 'Shari’ah Standards, including Standard 9 on Ijarah',
    publisher: 'AAOIFI',
    href: 'https://aaoifi.com/shariah-standards-3/?lang=en',
  },
  ifsbInvestorProtection: {
    label: 'IFSB-24: Investor Protection in Islamic Capital Markets',
    publisher: 'Islamic Financial Services Board',
    href: 'https://www.ifsb.org/wp-content/uploads/2023/10/IFSB-24_En.pdf',
  },
  ifsbShariahGovernance: {
    label: 'IFSB-31: Effective Supervision of Shariah Governance',
    publisher: 'Islamic Financial Services Board',
    href: 'https://www.ifsb.org/wp-content/uploads/2025/07/IFSB-31-Guiding-Principles-for-Effective-Supervision-of-Shariah-Governance.pdf',
  },
  fcaTokenisation: {
    label: 'Fund tokenisation',
    publisher: 'Financial Conduct Authority',
    href: 'https://www.fca.org.uk/firms/cryptoassets-our-work/fund-tokenisation',
  },
  fcaPolicy: {
    label: 'PS26/7: Progressing fund tokenisation',
    publisher: 'Financial Conduct Authority',
    href: 'https://www.fca.org.uk/publications/policy-statements/ps26-7-progressing-fund-tokenisation',
  },
  lawCommission: {
    label: 'Digital assets project and final report',
    publisher: 'Law Commission of England and Wales',
    href: 'https://lawcom.gov.uk/project/digital-assets/',
  },
  bisTokenisation: {
    label: 'Tokenisation in the context of money and other assets',
    publisher: 'BIS Committee on Payments and Market Infrastructures',
    href: 'https://www.bis.org/cpmi/publ/d225.htm',
  },
  fatfVirtualAssets: {
    label: 'Virtual assets and the risk-based approach',
    publisher: 'Financial Action Task Force',
    href: 'https://www.fatf-gafi.org/en/topics/virtual-assets.html',
  },
  erc3643: {
    label: 'ERC-3643: Permissioned token specification',
    publisher: 'Ethereum Improvement Proposals',
    href: 'https://eips.ethereum.org/EIPS/eip-3643',
  },
} satisfies Record<string, LearningSource>;

export const learningArticles = [
  {
    slug: 'asset-rights-register-and-digital-units',
    title: 'Asset, legal rights, register and digital units: keep the four layers clear',
    category: 'Foundations',
    audiences: ['Everyone', 'Investor', 'SME / originator'],
    readTime: '6 min read',
    summary:
      'A plain-English map of what is physical, what is contractual, what proves ownership and what a digital unit represents.',
    objectives: [
      'Distinguish the productive asset from the legal rights created around it.',
      'Understand why a digital unit is a representation, not the physical asset itself.',
      'Know which record should be treated as authoritative when records disagree.',
    ],
    sections: [
      {
        heading: '1. Start with the real asset',
        paragraphs: [
          'The asset is the identifiable productive property at the centre of the transaction—for the reference journey, solar equipment installed for an SME. Its specification, supplier, ownership, location, condition and insurance evidence must be capable of verification.',
          'A label in software does not establish that the asset exists or that the right party owns it. Those conclusions depend on legal documents and reliable evidence.',
        ],
      },
      {
        heading: '2. Identify the legal rights',
        paragraphs: [
          'Contracts determine who owns the asset, who may use it, who owes rent, what happens after default and whether any beneficial interest is created for participants. The rights must be described before a digital representation is designed.',
          'The legal analysis is jurisdiction- and structure-specific. It cannot be replaced by code, a token balance or marketing language.',
        ],
      },
      {
        heading: '3. Name the authoritative register',
        paragraphs: [
          'The controlled register records who is recognised as holding the approved interest. Mizant’s reference workflow keeps an explicit register and reconciles digital-unit balances against it.',
          'The governing documents should state which record is authoritative, how corrections are made and who may approve a transfer.',
        ],
      },
      {
        heading: '4. Define the digital unit last',
        paragraphs: [
          'A digital unit can make an approved interest easier to administer, reconcile and restrict. It should point back to a defined legal right and a canonical record set.',
          'Tokenisation does not remove asset, counterparty, legal, liquidity, technology or regulatory risk. It changes how records and controls may be operated.',
        ],
      },
    ],
    checklist: [
      'Can I identify the physical asset and its evidence?',
      'Can I state the exact legal right represented in one sentence?',
      'Do the documents name an authoritative ownership record?',
      'Is the digital-unit supply reconciled to that record?',
      'Is there a controlled correction and exception process?',
    ],
    sources: [sources.lawCommission, sources.bisTokenisation, sources.fcaTokenisation],
    platformHref: '/tokenisation',
    platformAction: 'Open the tokenisation workbench',
  },
  {
    slug: 'ijarah-solar-equipment-lifecycle',
    title: 'Ijarah in practice: the solar-equipment lifecycle',
    category: 'Islamic finance',
    audiences: ['Everyone', 'SME / originator', 'Investor'],
    readTime: '7 min read',
    summary:
      'Follow the reference transaction from an SME’s equipment need through acquisition, lease, rent and ongoing evidence.',
    objectives: [
      'Understand the commercial purpose and core parties in an Ijarah.',
      'See why ownership, possession, rent and maintenance responsibilities require evidence.',
      'Recognise that each structure requires independent legal and Shariah approval.',
    ],
    sections: [
      {
        heading: '1. A productive need is identified',
        paragraphs: [
          'The SME explains the equipment required, how it supports the business and how rent could be serviced. The asset should be sufficiently specified and suitable for a lease.',
          'The originator helps assemble evidence but does not approve its own case.',
        ],
      },
      {
        heading: '2. The lessor acquires the asset',
        paragraphs: [
          'In an Ijarah, rent relates to the use of an asset. The transaction therefore needs a credible acquisition and ownership path before lease income is treated as arising.',
          'Supplier documentation, payment evidence, title and acceptance records should form one version-controlled evidence pack.',
        ],
      },
      {
        heading: '3. Use is leased on agreed terms',
        paragraphs: [
          'The lease should identify the asset, term, rent, permitted use, responsibilities, events of default and end-of-term position. Responsibility for ownership-related and use-related costs should be reviewed carefully.',
          'Mizant records conditions and approvals; it does not itself issue a Shariah ruling.',
        ],
      },
      {
        heading: '4. Performance is monitored',
        paragraphs: [
          'After activation, rent status, asset evidence, insurance, incidents and Shariah conditions need ongoing monitoring. A one-time approval is not a substitute for continued assurance.',
          'Any restructuring, missed payment or material asset change should enter a controlled exception workflow.',
        ],
      },
    ],
    checklist: [
      'The asset and permitted use are clearly described.',
      'Acquisition and ownership evidence precede lease activation.',
      'Rent and the lease term are clear and reviewable.',
      'Maintenance, insurance and loss responsibilities are allocated.',
      'Independent legal, compliance and Shariah reviews are recorded.',
      'Post-activation monitoring and exceptions have named owners.',
    ],
    sources: [sources.aaoifiStandards, sources.ifsbInvestorProtection],
    platformHref: '/opportunities/solar-ijarah',
    platformAction: 'Explore the solar Ijarah opportunity',
  },
  {
    slug: 'how-to-review-an-opportunity',
    title: 'How to review a real-asset opportunity',
    category: 'Investor essentials',
    audiences: ['Investor', 'Adviser'],
    readTime: '8 min read',
    summary:
      'A disciplined reading order for the asset, parties, cash flows, documents, risks, controls and next action.',
    objectives: [
      'Review substance before projected outcomes.',
      'Connect each important statement to evidence and a responsible party.',
      'Identify unanswered questions before expressing interest.',
    ],
    sections: [
      {
        heading: '1. Understand the structure before the figures',
        paragraphs: [
          'Identify the asset, lessor, asset user, originator, service providers and the legal interest offered. If you cannot explain how rent moves from asset use to the holder’s entitlement, pause and ask for clarification.',
        ],
        points: [
          'What exactly is being acquired or represented?',
          'Who owns, uses and services the asset?',
          'Which agreement creates the participant’s rights?',
        ],
      },
      {
        heading: '2. Read evidence and conditions together',
        paragraphs: [
          'A document list is not the same as completed due diligence. Check versions, dates, counterparties, open conditions and whether reviewers relied on the same frozen submission pack.',
        ],
      },
      {
        heading: '3. Test the downside',
        paragraphs: [
          'Consider delayed rent, asset damage, underperformance, early termination, insolvency, disputes, restricted transfer and a lack of buyers. Tokenisation does not make an illiquid underlying interest liquid.',
        ],
      },
      {
        heading: '4. Treat the next action as a controlled step',
        paragraphs: [
          'In this demonstration, expressing interest or simulating a commitment records an intention; it does not transfer money, complete an investment or provide advice. A live service would require eligibility, disclosures, agreements and regulated processes appropriate to the jurisdiction.',
        ],
      },
    ],
    checklist: [
      'I understand the asset, legal right and payment path.',
      'I have read the latest documents and outstanding conditions.',
      'I can describe the main counterparty, asset and liquidity risks.',
      'I know what ongoing reporting I should receive.',
      'I understand that projected or target outcomes are not guaranteed.',
      'I know what my next action does—and does not—complete.',
    ],
    sources: [sources.ifsbInvestorProtection, sources.bisTokenisation, sources.fcaTokenisation],
    platformHref: '/opportunities/solar-ijarah',
    platformAction: 'Practise on the reference opportunity',
  },
  {
    slug: 'evidence-ready-sme-application',
    title: 'Build an evidence-ready SME asset application',
    category: 'Origination',
    audiences: ['SME / originator'],
    readTime: '7 min read',
    summary:
      'Turn an equipment request into a specific, reviewable case without hiding gaps or mixing draft versions.',
    objectives: [
      'Describe the business need and asset in decision-useful terms.',
      'Prepare evidence that independent reviewers can trace and challenge.',
      'Understand submission freeze, conditions and resubmission.',
    ],
    sections: [
      {
        heading: '1. Explain the need, not just the amount',
        paragraphs: [
          'State what the asset will do, where it will operate, why it is needed now and which business cash flows are expected to support rent. Separate evidence from estimates and assumptions.',
        ],
      },
      {
        heading: '2. Specify the asset and supplier',
        paragraphs: [
          'Capture model, quantity, price, installation, warranty, delivery, useful life and ownership evidence. Comparable quotations and supplier checks make the case easier to assess.',
        ],
      },
      {
        heading: '3. Make financial information internally consistent',
        paragraphs: [
          'Management accounts, bank information, forecasts and tax records should cover coherent periods and reconcile where appropriate. Explain unusual movements rather than leaving reviewers to infer them.',
        ],
      },
      {
        heading: '4. Freeze the version submitted for review',
        paragraphs: [
          'Reviewers need to know exactly which fields and documents they approved. Later changes should create a new version and, when material, return to the relevant review gates.',
        ],
      },
    ],
    checklist: [
      'Business identity, ownership and authorised contacts are complete.',
      'Asset purpose, specification, location and supplier are evidenced.',
      'Historic financial information and forecasts cover consistent periods.',
      'The proposed rent can be stress-tested against cash flow.',
      'Material assumptions, gaps and conflicts are disclosed.',
      'The submitted pack has a fixed version and timestamp.',
    ],
    sources: [sources.ifsbInvestorProtection],
    platformHref: '/applications/new',
    platformAction: 'Build a demonstration application',
  },
  {
    slug: 'independent-shariah-review-and-monitoring',
    title: 'Independent Shariah review: approval, conditions and ongoing monitoring',
    category: 'Islamic finance',
    audiences: ['Everyone', 'Reviewer', 'Adviser'],
    readTime: '8 min read',
    summary:
      'What a credible governance process should evidence before launch and continue to monitor afterwards.',
    objectives: [
      'Separate product design, independent review and operational monitoring.',
      'Understand why approval must be tied to exact documents and conditions.',
      'Recognise the role of ex-ante and ex-post assurance.',
    ],
    sections: [
      {
        heading: '1. Independence is a control, not a label',
        paragraphs: [
          'The people originating or commercially sponsoring a transaction should not be able to give it final Shariah approval. Conflicts, reviewer competence and decision authority need explicit governance.',
        ],
      },
      {
        heading: '2. The decision must bind to a version',
        paragraphs: [
          'A review should identify the structure, contracts, evidence and assumptions examined. Conditions should have owners, due dates and closure evidence. A material amendment may require re-review.',
        ],
      },
      {
        heading: '3. Monitoring continues after activation',
        paragraphs: [
          'Ongoing assurance may cover actual contract execution, asset ownership, use of proceeds, income treatment, late-payment handling, restructurings and any required remediation or purification process.',
          'Mizant demonstrates the workflow and audit trail. A qualified Shariah board or adviser must make the substantive determination for a live transaction.',
        ],
      },
      {
        heading: '4. Report exceptions transparently',
        paragraphs: [
          'An exception should not disappear into email. Record the issue, impact, interim control, decision, remediation and closure evidence so oversight remains continuous and attributable.',
        ],
      },
    ],
    checklist: [
      'Reviewer independence and authority are documented.',
      'The decision names the exact structure and document versions reviewed.',
      'Conditions have owners, deadlines and closure evidence.',
      'Material changes trigger a defined re-review test.',
      'Post-activation monitoring has a schedule and accountable owner.',
      'Exceptions and remediation remain visible in the audit trail.',
    ],
    sources: [
      sources.aaoifiStandards,
      sources.ifsbShariahGovernance,
      sources.ifsbInvestorProtection,
    ],
    platformHref: '/shariah',
    platformAction: 'Open Shariah assurance',
  },
  {
    slug: 'controlled-tokenisation-from-rights-to-units',
    title: 'Controlled tokenisation: from approved rights to reconciled units',
    category: 'Tokenisation',
    audiences: ['Everyone', 'Ownership administrator', 'Reviewer'],
    readTime: '9 min read',
    summary:
      'A practical issuance sequence that keeps legal, compliance, Shariah, technology and register controls aligned.',
    objectives: [
      'See token issuance as the final stage of an approved record process.',
      'Understand eligibility, transfer controls, supply discipline and reconciliation.',
      'Know why technology cannot replace legal and regulatory analysis.',
    ],
    sections: [
      {
        heading: '1. Define what the unit represents',
        paragraphs: [
          'Begin with a legal characterisation and approved governing documents. Record the unit denominator, holder rights, restrictions and authoritative register. Do not let the smart contract become the first place these matters are defined.',
        ],
      },
      {
        heading: '2. Complete the human gates',
        paragraphs: [
          'Legal, compliance and Shariah decisions should be separately attributable and tied to the same canonical record set. A maker prepares the issuance instruction; a different checker approves it.',
        ],
      },
      {
        heading: '3. Apply eligibility and transfer rules',
        paragraphs: [
          'A controlled design may restrict who can hold or receive units, pre-check transfers, pause activity, freeze balances or support recovery. The required controls depend on the legal and regulatory analysis, not on a technology preference.',
        ],
      },
      {
        heading: '4. Issue once and reconcile continuously',
        paragraphs: [
          'The approved supply, digital-unit ledger and ownership register should agree. Exceptions need blocking controls, investigation and dual-authorised correction. An idempotent instruction helps prevent an accidental duplicate issue.',
        ],
      },
    ],
    checklist: [
      'The represented legal right and authoritative record are defined.',
      'All required human approvals refer to the same canonical version.',
      'Holder eligibility and transfer restrictions are testable before transfer.',
      'Maker and checker are different authorised people.',
      'Supply cannot exceed the approved instruction.',
      'Digital balances and the ownership register reconcile to zero difference.',
      'Pause, recovery, exception and incident procedures are documented.',
    ],
    sources: [sources.fcaPolicy, sources.bisTokenisation, sources.erc3643, sources.lawCommission],
    platformHref: '/tokenisation',
    platformAction: 'Run the controlled issuance demonstration',
  },
  {
    slug: 'risk-liquidity-and-servicing',
    title: 'Asset, servicing and liquidity risk: questions to ask',
    category: 'Investor essentials',
    audiences: ['Investor', 'Adviser', 'Reviewer'],
    readTime: '7 min read',
    summary:
      'A grounded risk framework for assets that generate contractual cash flows but may be hard to sell or transfer.',
    objectives: [
      'Identify risks arising from the asset, parties, contracts and technology.',
      'Avoid assuming that digital units guarantee liquidity.',
      'Connect each material risk to monitoring and a response owner.',
    ],
    sections: [
      {
        heading: '1. Asset risk',
        paragraphs: [
          'The equipment may underperform, become damaged, be incorrectly specified or lose value faster than expected. Review inspection, warranty, maintenance, insurance and replacement arrangements.',
        ],
      },
      {
        heading: '2. Counterparty and servicing risk',
        paragraphs: [
          'The asset user may pay late or default; a supplier, servicer or administrator may fail. Understand who performs each task, how performance is measured and what happens when a provider must be replaced.',
        ],
      },
      {
        heading: '3. Liquidity and transfer risk',
        paragraphs: [
          'A smaller unit size does not create a buyer. Transfers may be restricted by contract, eligibility, regulation, technology or the absence of a market. The time and price needed to exit can therefore be uncertain.',
        ],
      },
      {
        heading: '4. Technology and record risk',
        paragraphs: [
          'Key loss, software defects, cyber incidents, incorrect data and disagreement between records can interrupt administration. Recovery, reconciliation, access control and incident response are therefore core operating controls.',
        ],
      },
    ],
    checklist: [
      'Each material risk has an owner and monitoring indicator.',
      'The downside case includes delay, default and asset underperformance.',
      'Exit assumptions do not rely on an unproven secondary market.',
      'Service-provider failure and replacement are planned for.',
      'Register, wallet and key recovery procedures are clear.',
      'Risk information is updated when circumstances materially change.',
    ],
    sources: [sources.bisTokenisation, sources.ifsbInvestorProtection, sources.fatfVirtualAssets],
    platformHref: '/opportunities/solar-ijarah',
    platformAction: 'Review opportunity risks in context',
  },
  {
    slug: 'ownership-register-and-controlled-transfers',
    title: 'Ownership records and controlled transfers',
    category: 'Tokenisation',
    audiences: ['Ownership administrator', 'Investor', 'Reviewer'],
    readTime: '7 min read',
    summary:
      'How eligibility, transfer approval, register updates and digital balances should move together.',
    objectives: [
      'Understand the end-to-end controlled transfer sequence.',
      'Know why register updates and digital movements must reconcile.',
      'Recognise exceptions that require human intervention.',
    ],
    sections: [
      {
        heading: '1. Validate the instruction and parties',
        paragraphs: [
          'Confirm the transferor, transferee, amount, authority, eligibility and any contractual restriction. A transfer request should have a unique reference and an attributable initiator.',
        ],
      },
      {
        heading: '2. Pre-check before changing records',
        paragraphs: [
          'Check available balance, frozen amounts, holder status, product rules and required approvals before execution. A failed pre-check should stop the sequence without a partial update.',
        ],
      },
      {
        heading: '3. Update and reconcile',
        paragraphs: [
          'The digital-unit movement and ownership-register update should form one controlled business event. Reconciliation detects a missing, duplicated or inconsistent entry.',
        ],
      },
      {
        heading: '4. Preserve correction history',
        paragraphs: [
          'Corrections should not erase the original event. Record the reason, evidence, approvers and linked correcting entries so a reviewer can reconstruct the history.',
        ],
      },
    ],
    checklist: [
      'The parties, amount, authority and eligibility are verified.',
      'Restrictions and available balance are pre-checked.',
      'The event has a unique, reusable-safe instruction reference.',
      'Register and digital balances update consistently.',
      'Post-event reconciliation reports zero difference.',
      'Corrections preserve the original history and dual approval.',
    ],
    sources: [sources.fcaPolicy, sources.erc3643, sources.lawCommission],
    platformHref: '/ownership',
    platformAction: 'Inspect the ownership register',
  },
  {
    slug: 'maker-checker-and-audit-trail',
    title: 'Maker-checker approvals and the audit trail',
    category: 'Governance',
    audiences: ['Everyone', 'Reviewer', 'Ownership administrator'],
    readTime: '6 min read',
    summary:
      'Why important platform actions need separation of duties, clear evidence and a reconstruction-ready history.',
    objectives: [
      'Understand what maker-checker separation prevents.',
      'Recognise the minimum information in a useful approval event.',
      'Apply proportional controls without turning every task into bureaucracy.',
    ],
    sections: [
      {
        heading: '1. Separate preparation from approval',
        paragraphs: [
          'The maker assembles or initiates the instruction. An authorised checker independently reviews the same version and either approves, rejects or returns it with reasons. The same person should not occupy both roles for a controlled event.',
        ],
      },
      {
        heading: '2. Bind the decision to evidence',
        paragraphs: [
          'A useful approval records who acted, when, in which role, on what record version, with which outcome and rationale. Conditions and attachments should remain linked rather than being scattered across messages.',
        ],
      },
      {
        heading: '3. Apply controls according to risk',
        paragraphs: [
          'High-impact actions—such as role grants, final approvals, issuance, register correction and suspension—deserve stronger separation and re-authentication than routine drafting or navigation.',
        ],
      },
      {
        heading: '4. Make the history reviewable',
        paragraphs: [
          'An auditor should be able to reconstruct the sequence without asking participants to remember it. Append-only events, timestamps, version references and exports support that outcome.',
        ],
      },
    ],
    checklist: [
      'Controlled actions name a maker and a different checker.',
      'Both people have an appropriate active role.',
      'The decision points to the exact record version reviewed.',
      'The rationale and any conditions are captured.',
      'Rejected and superseded events remain visible.',
      'Audit records can be searched and exported.',
    ],
    sources: [sources.ifsbShariahGovernance, sources.bisTokenisation],
    platformHref: '/governance',
    platformAction: 'See independent review gates',
  },
] satisfies readonly LearningArticle[];

export const learningCategories = [
  'All topics',
  ...Array.from(new Set(learningArticles.map((article) => article.category))),
] as const;

export const learningAudiences = [
  'All roles',
  ...Array.from(new Set(learningArticles.flatMap((article) => article.audiences))),
] as const;

export function getLearningArticle(slug: string): LearningArticle | undefined {
  return learningArticles.find((article) => article.slug === slug);
}
