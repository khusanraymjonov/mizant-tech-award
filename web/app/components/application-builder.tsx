'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from './icons';
import {
  applicationDraftCompletion,
  emptyApplicationDraft,
  requiredEvidence,
  validateApplicationDraft,
  type ApplicationDraftStep,
  type SyntheticApplicationDraft,
} from '../lib/application-draft';
import {
  createBrowserApplicationRecord,
  parseBrowserApplicationRecords,
  submittedApplicationsStorageKey,
} from '../lib/browser-workflow';

const draftStorageKey = 'mizant-synthetic-sme-draft-v1';

export function ApplicationBuilder() {
  const [step, setStep] = useState<ApplicationDraftStep>(1);
  const [draft, setDraft] = useState<SyntheticApplicationDraft>(emptyApplicationDraft);
  const [errors, setErrors] = useState<string[]>([]);
  const [saveMessage, setSaveMessage] = useState('');
  const [submissionReference, setSubmissionReference] = useState('');

  useEffect(() => {
    const savedDraft = window.localStorage.getItem(draftStorageKey);
    if (!savedDraft) return;
    try {
      setDraft(JSON.parse(savedDraft) as SyntheticApplicationDraft);
      setSaveMessage('A browser-only synthetic draft was restored.');
    } catch {
      window.localStorage.removeItem(draftStorageKey);
    }
  }, []);

  const update = <Key extends keyof SyntheticApplicationDraft>(
    key: Key,
    value: SyntheticApplicationDraft[Key],
  ) => setDraft((current) => ({ ...current, [key]: value }));

  const continueFrom = (currentStep: ApplicationDraftStep) => {
    const nextErrors = validateApplicationDraft(currentStep, draft);
    setErrors(nextErrors);
    if (nextErrors.length === 0 && currentStep < 3) {
      setStep((currentStep + 1) as ApplicationDraftStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const saveDraft = () => {
    window.localStorage.setItem(draftStorageKey, JSON.stringify(draft));
    setSaveMessage('Draft saved in this browser only.');
  };

  const submit = () => {
    const nextErrors = validateApplicationDraft(3, draft);
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;
    const reference = `SYN-APP-${String(Date.now()).slice(-6)}`;
    const record = createBrowserApplicationRecord(draft, reference, new Date().toISOString());
    const submissions = parseBrowserApplicationRecords(
      window.localStorage.getItem(submittedApplicationsStorageKey),
    );
    window.localStorage.setItem(
      submittedApplicationsStorageKey,
      JSON.stringify([record, ...submissions].slice(0, 20)),
    );
    setSubmissionReference(reference);
    window.localStorage.removeItem(draftStorageKey);
  };

  if (submissionReference) {
    return (
      <section className="application-builder application-builder--success" aria-live="polite">
        <span className="success-mark">
          <Icon name="check" size={31} />
        </span>
        <p className="eyebrow">Submission recorded</p>
        <h2>{submissionReference}</h2>
        <p>
          The synthetic application has been routed to separate legal, compliance/risk and
          independent Shariah review queues. It has not been approved.
        </p>
        <div className="submission-receipt">
          <div>
            <span>Applicant</span>
            <strong>{draft.legalName}</strong>
          </div>
          <div>
            <span>Asset request</span>
            <strong>{draft.assetNeed}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong>Awaiting human review</strong>
          </div>
        </div>
        <div className="flow-actions">
          <Link className="button button--primary" href="/applications">
            Return to applications <Icon name="arrow" size={18} />
          </Link>
          <button
            className="button button--secondary"
            type="button"
            onClick={() => {
              setDraft(emptyApplicationDraft);
              setStep(1);
              setSubmissionReference('');
            }}
          >
            Start another
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="application-builder">
      <div className="builder-progress">
        <div>
          <span>Application completeness</span>
          <strong>{applicationDraftCompletion(draft)}%</strong>
        </div>
        <div className="progress-track" aria-hidden="true">
          <span style={{ width: `${applicationDraftCompletion(draft)}%` }} />
        </div>
      </div>

      <ol className="stepper" aria-label="Application progress">
        {['Business', 'Asset request', 'Evidence & review'].map((label, index) => (
          <li key={label} className={step >= index + 1 ? 'is-active' : ''}>
            <span>{step > index + 1 ? <Icon name="check" size={15} /> : index + 1}</span>
            {label}
          </li>
        ))}
      </ol>

      <div className="synthetic-form-notice">
        <Icon name="lock" size={18} />
        <span>
          <strong>Use fictional information only.</strong> This form stores an optional draft in
          your browser and sends nothing to an external service.
        </span>
      </div>

      {errors.length > 0 ? (
        <div className="form-errors" role="alert">
          <strong>Check the following before continuing:</strong>
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {step === 1 ? (
        <div className="builder-panel">
          <div className="panel-heading-copy">
            <p className="eyebrow">Step 1 · Business identity</p>
            <h2>Tell us about the fictional operating business</h2>
            <p>These details establish who needs the asset and where it will be used.</p>
          </div>
          <div className="form-grid">
            <label className="form-field form-field--wide">
              <span>Legal business name</span>
              <input
                name="legalName"
                autoComplete="off"
                required
                value={draft.legalName}
                onChange={(event) => update('legalName', event.target.value)}
                placeholder="e.g. Synthetic Foods LLC"
              />
            </label>
            <label className="form-field">
              <span>Registration reference</span>
              <input
                name="registrationReference"
                autoComplete="off"
                required
                value={draft.registrationReference}
                onChange={(event) => update('registrationReference', event.target.value)}
                placeholder="SYN-REG-104"
              />
            </label>
            <label className="form-field">
              <span>Operating history</span>
              <div className="input-suffix">
                <input
                  name="operatingHistoryYears"
                  required
                  type="number"
                  min="0"
                  value={draft.operatingHistoryYears}
                  onChange={(event) => update('operatingHistoryYears', event.target.value)}
                />
                <span>years</span>
              </div>
            </label>
            <label className="form-field">
              <span>Location</span>
              <select
                name="location"
                required
                value={draft.location}
                onChange={(event) => update('location', event.target.value)}
              >
                <option value="">Choose a location</option>
                <option>Samarkand</option>
                <option>Tashkent</option>
                <option>Fergana</option>
                <option>Bukhara</option>
              </select>
            </label>
            <label className="form-field">
              <span>Business sector</span>
              <select
                name="sector"
                required
                value={draft.sector}
                onChange={(event) => update('sector', event.target.value)}
              >
                <option value="">Choose a sector</option>
                <option value="food_processing">Food processing</option>
                <option value="cold_storage_logistics">Cold-storage logistics</option>
                <option value="light_manufacturing">Light manufacturing</option>
              </select>
            </label>
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="builder-panel">
          <div className="panel-heading-copy">
            <p className="eyebrow">Step 2 · Productive asset request</p>
            <h2>Describe the equipment and operating need</h2>
            <p>The request remains asset-agnostic; solar equipment is only the first reference.</p>
          </div>
          <div className="form-grid">
            <label className="form-field form-field--wide">
              <span>Productive asset required</span>
              <input
                name="assetNeed"
                autoComplete="off"
                required
                value={draft.assetNeed}
                onChange={(event) => update('assetNeed', event.target.value)}
                placeholder="e.g. Commercial solar PV equipment"
              />
            </label>
            <label className="form-field">
              <span>Fictional supplier</span>
              <input
                name="supplier"
                autoComplete="off"
                required
                value={draft.supplier}
                onChange={(event) => update('supplier', event.target.value)}
                placeholder="Synthetic Supplier LLC"
              />
            </label>
            <label className="form-field">
              <span>Illustrative asset value (USD)</span>
              <input
                name="assetPrice"
                required
                type="number"
                min="25000"
                max="250000"
                step="1000"
                value={draft.assetPrice}
                onChange={(event) => update('assetPrice', event.target.value)}
                placeholder="120000"
              />
            </label>
            <label className="form-field">
              <span>Requested term</span>
              <select
                name="requestedTermMonths"
                required
                value={draft.requestedTermMonths}
                onChange={(event) => update('requestedTermMonths', event.target.value)}
              >
                <option value="24">24 months</option>
                <option value="36">36 months</option>
                <option value="48">48 months</option>
                <option value="60">60 months</option>
              </select>
            </label>
            <label className="form-field form-field--wide">
              <span>Business rationale</span>
              <textarea
                name="businessRationale"
                required
                rows={5}
                value={draft.businessRationale}
                onChange={(event) => update('businessRationale', event.target.value)}
                placeholder="Explain how the asset supports productive operations and resilience."
              />
            </label>
          </div>
        </div>
      ) : null}

      {step === 3 ? (
        <div className="builder-panel">
          <div className="panel-heading-copy">
            <p className="eyebrow">Step 3 · Evidence & review</p>
            <h2>Confirm the evidence pack and safe submission boundary</h2>
            <p>Each item represents synthetic evidence; no real documents are uploaded.</p>
          </div>
          <div className="evidence-checklist">
            {requiredEvidence.map(([id, label]) => (
              <label key={id}>
                <input
                  type="checkbox"
                  checked={draft.evidence[id]}
                  onChange={(event) =>
                    update('evidence', { ...draft.evidence, [id]: event.target.checked })
                  }
                />
                <span>
                  <strong>{label}</strong>
                  <small>Version 1 · browser-only placeholder</small>
                </span>
              </label>
            ))}
          </div>
          <label className="consent-check application-declaration">
            <input
              type="checkbox"
              checked={draft.declarationAccepted}
              onChange={(event) => update('declarationAccepted', event.target.checked)}
            />
            <span>
              I confirm this submission is synthetic and understand that legal, compliance/risk and
              independent Shariah reviewers must make separate human decisions.
            </span>
          </label>
        </div>
      ) : null}

      {saveMessage ? (
        <p className="draft-save-message" role="status">
          {saveMessage}
        </p>
      ) : null}
      <div className="flow-actions builder-actions">
        <button className="button button--secondary" type="button" onClick={saveDraft}>
          Save browser draft
        </button>
        <div>
          {step > 1 ? (
            <button
              className="button button--secondary"
              type="button"
              onClick={() => {
                setErrors([]);
                setStep((step - 1) as ApplicationDraftStep);
              }}
            >
              Back
            </button>
          ) : null}
          {step < 3 ? (
            <button
              className="button button--primary"
              type="button"
              onClick={() => continueFrom(step)}
            >
              Continue <Icon name="arrow" size={18} />
            </button>
          ) : (
            <button className="button button--primary" type="button" onClick={submit}>
              Submit for human review <Icon name="check" size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
