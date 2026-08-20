import Link from 'next/link';
import { DemoShell } from '../components/demo-shell';
import { Icon } from '../components/icons';
import { VideoGuide } from '../components/video-guide';
import { LearningLibrary } from '../components/learning-library';
import { introVideo, investorWalkthroughVideo, onboardingVideos } from '../lib/video-library';

const guides = [
  {
    role: 'Investor',
    time: '6 minutes',
    icon: 'users' as const,
    title: 'Understand before you commit',
    summary:
      'Learn what the units represent, how rental cash flows arise, the main risks and why liquidity may be limited.',
    steps: [
      'Complete the readiness checklist',
      'Review the asset, rights and parties',
      'Pass the comprehension prompts',
      'Simulate a commitment',
      'Open the resulting portfolio record',
    ],
    href: '/opportunities/solar-ijarah',
    action: 'Start investor walkthrough',
  },
  {
    role: 'SME / asset user',
    time: '8 minutes',
    icon: 'building' as const,
    title: 'Request productive equipment',
    summary:
      'Build an application, attach a versioned evidence checklist and follow the case through human assessment.',
    steps: [
      'Describe the business and asset need',
      'Complete required evidence',
      'Submit the exact application version',
      'Review conditions and next actions',
      'Follow rent and evidence obligations',
    ],
    href: '/applications/new',
    action: 'Start SME walkthrough',
  },
  {
    role: 'Originator',
    time: '5 minutes',
    icon: 'building' as const,
    title: 'Coordinate a review-ready case',
    summary:
      'Invite and support an SME, resolve missing evidence and hand the case to independent reviewers without self-approval.',
    steps: [
      'Review pipeline priorities',
      'Open a case',
      'Resolve evidence gaps',
      'Freeze the submission pack',
      'Hand off to governance',
    ],
    href: '/origination',
    action: 'Start originator walkthrough',
  },
  {
    role: 'Control reviewer',
    time: '7 minutes',
    icon: 'shield' as const,
    title: 'Review independently and record why',
    summary:
      'See how legal, compliance and Shariah reviews remain separate, version-bound and attributable.',
    steps: [
      'Claim the right queue',
      'Inspect evidence versions',
      'Record conditions or issues',
      'Complete a separate decision',
      'Export the audit trail',
    ],
    href: '/governance',
    action: 'Start governance walkthrough',
  },
  {
    role: 'Ownership administrator',
    time: '9 minutes',
    icon: 'layers' as const,
    title: 'Tokenise and reconcile approved rights',
    summary:
      'Complete all issuance gates, prepare one fixed-supply instruction and reconcile it with the controlled register.',
    steps: [
      'Verify canonical records',
      'Record three independent approvals',
      'Prepare the issuance instruction',
      'Obtain checker approval',
      'Confirm and reconcile the register',
    ],
    href: '/tokenisation',
    action: 'Start tokenisation walkthrough',
  },
  {
    role: 'Platform administrator',
    time: '5 minutes',
    icon: 'users' as const,
    title: 'Control people, roles and platform access',
    summary:
      'Approve access requests, suspend or remove users and inspect every administration event.',
    steps: [
      'Open pending access',
      'Check least-privilege scope',
      'Record an approval reason',
      'Suspend or reactivate a user',
      'Export the access audit',
    ],
    href: '/admin',
    action: 'Restricted to authorised administrators',
    restricted: true,
  },
] as const;

export default function LearningCentrePage() {
  return (
    <DemoShell
      active="Learn"
      workspaceRole="investor"
      eyebrow="Mizant learning centre"
      title="Learn the platform by completing real workflow steps."
      description="Choose a role, follow its short guided procedure and understand who is responsible at every hand-off."
      action={
        <Link className="button button--primary" href="/start">
          Choose a workspace <Icon name="arrow" size={17} />
        </Link>
      }
    >
      <section className="learning-intro-card">
        <div>
          <span>
            <Icon name="spark" size={24} />
          </span>
          <div>
            <p className="eyebrow">Start here</p>
            <h2>Every guide ends with an observable result.</h2>
            <p>
              No specialist knowledge is assumed. Key terms are explained at the point where they
              matter.
            </p>
          </div>
        </div>
        <ol>
          <li>
            <strong>Choose</strong>
            <span>the role you want to understand</span>
          </li>
          <li>
            <strong>Follow</strong>
            <span>one next action at a time</span>
          </li>
          <li>
            <strong>Verify</strong>
            <span>the resulting record or audit event</span>
          </li>
        </ol>
      </section>
      <LearningLibrary />
      <section className="learning-video-suite" aria-labelledby="video-learning-title">
        <div className="learning-video-suite__intro">
          <div>
            <p className="eyebrow">Watch the real platform</p>
            <h2 id="video-learning-title">
              Start with the overview, then complete one focused task.
            </h2>
          </div>
          <p>
            Every video uses the current Mizant interface and fictional records. The guides are
            completely silent, with concise on-screen explanations and English subtitles enabled by
            default.
          </p>
        </div>
        <div className="learning-video-featured">
          <VideoGuide guide={introVideo} featured preload="metadata" />
          <VideoGuide guide={investorWalkthroughVideo} featured preload="metadata" />
        </div>
        <section className="learning-video-grid" aria-label="Short onboarding videos">
          {onboardingVideos.map((video) => (
            <VideoGuide key={video.slug} guide={video} />
          ))}
        </section>
      </section>
      <section className="learning-guide-grid" aria-label="Role walkthroughs">
        {guides.map((guide) => (
          <article key={guide.role}>
            <div className="learning-guide__head">
              <span>
                <Icon name={guide.icon} size={23} />
              </span>
              <div>
                <p className="micro-label">
                  {guide.role} · {guide.time}
                </p>
                <h2>{guide.title}</h2>
              </div>
            </div>
            <p>{guide.summary}</p>
            <ol>
              {guide.steps.map((step, index) => (
                <li key={step}>
                  <span>{index + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            {'restricted' in guide ? (
              <span className="learning-guide__restricted">
                {guide.action}
                <Icon name="lock" size={16} />
              </span>
            ) : (
              <Link href={guide.href}>
                {guide.action}
                <Icon name="arrow" size={16} />
              </Link>
            )}
          </article>
        ))}
      </section>
      <section className="learning-glossary">
        <div>
          <p className="eyebrow">Plain-language essentials</p>
          <h2>Eight terms worth knowing before you act.</h2>
        </div>
        <dl>
          <div>
            <dt>Asset</dt>
            <dd>The productive equipment or other real-world property being financed.</dd>
          </div>
          <div>
            <dt>Legal rights</dt>
            <dd>The enforceable contractual or beneficial interest approved for the structure.</dd>
          </div>
          <div>
            <dt>Register</dt>
            <dd>
              The authoritative record of registered and, where relevant, beneficial ownership.
            </dd>
          </div>
          <div>
            <dt>Digital unit</dt>
            <dd>
              A restricted digital representation used to administer approved rights; not the asset
              itself.
            </dd>
          </div>
          <div>
            <dt>Ijarah</dt>
            <dd>
              A lease in which the right to use an identified asset is provided for agreed rent.
            </dd>
          </div>
          <div>
            <dt>Canonical record</dt>
            <dd>The approved version of facts and documents on which controlled actions rely.</dd>
          </div>
          <div>
            <dt>Maker-checker</dt>
            <dd>Separation between the person preparing an action and the person approving it.</dd>
          </div>
          <div>
            <dt>Reconciliation</dt>
            <dd>A check that the register, approved supply and digital balances agree.</dd>
          </div>
        </dl>
      </section>
    </DemoShell>
  );
}
