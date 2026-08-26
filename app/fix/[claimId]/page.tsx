"use client";

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { claims, codes, getUserForClaim, nudgeTemplates } from '../../../lib/data';

export default function Fix() {
  const { claimId } = useParams<{ claimId: string }>();
  const claim = claims[claimId as keyof typeof claims];
  if (!claim) return null;

  const code = codes[claim.rejectionCode as keyof typeof codes];
  const user = getUserForClaim(claim.id);
  const [completed, setCompleted] = useState<string[]>([]);
  const [showMessage, setShowMessage] = useState(false);
  const [resubmitted, setResubmitted] = useState(false);

  const template = nudgeTemplates[claim.rejectionCode as keyof typeof nudgeTemplates];
  const message = template && user
    ? template.body
        .replace('{employerContactOrHR}', 'HR team')
        .replace('{uan}', claim.uan)
        .replace('{claimId}', claim.id)
    : '';

  const currentEvent = resubmitted
    ? 'Resubmitted — under review'
    : claim.actor === 'employer'
      ? 'Waiting on employer'
      : 'Action needed';
  const timeline = [...claim.history, { date: 'Current', event: currentEvent }];

  function toggleStep(step: string) {
    setCompleted(items => items.includes(step) ? items.filter(item => item !== step) : [...items, step]);
  }

  return (
    <main className="shell">
      <p className="demo">Demo data — not connected to EPFO</p>
      <h1>{claim.actor === 'employer' ? `Waiting on ${user?.employerName ?? 'your employer'}` : 'Fix your bank details'}</h1>

      {code.fixSteps.map(step => (
        <label className="check" key={step}>
          <input type="checkbox" checked={completed.includes(step)} onChange={() => toggleStep(step)} />
          <span>{step}</span>
        </label>
      ))}

      {claim.actor === 'self' ? (
        <>
          <label>Correct bank account number<input placeholder="Enter account number" /></label>
          <label>Correct IFSC<input placeholder="Enter IFSC" /></label>
          <button onClick={() => setResubmitted(true)} disabled={completed.length !== code.fixSteps.length}>
            {resubmitted ? 'Resubmitted' : 'Resubmit claim'}
          </button>
          {resubmitted && <p className="card">Expected turnaround: {code.turnaround}</p>}
        </>
      ) : (
        <>
          <button onClick={() => setShowMessage(true)}>Draft a message to your employer</button>
          {showMessage && (
            <section className="card">
              <p className="demo">Demo data — not connected to EPFO</p>
              <textarea readOnly value={message} />
              <button onClick={() => navigator.clipboard.writeText(message)}>Copy</button>
            </section>
          )}
        </>
      )}

      <h2>Status tracker</h2>
      <section className="timeline">
        {timeline.map(item => (
          <div className="event" key={`${item.date}-${item.event}`}>
            <strong>{item.event}</strong><br />
            <span className="muted">{item.date}</span>
          </div>
        ))}
      </section>
    </main>
  );
}
