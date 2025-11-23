import React, { useState } from 'react';
import './ReviewConfirmPage.css';

const ReviewConfirmPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    if (!agreed) return;
    setConfirmed(true);
    // simple confirmation action — redirect to home for now
    window.location.href = '/';
  };

  return (
    <div className="review-page">
      <div className="review-container">
        <h1 className="review-title">Competition Rules & Guidelines</h1>

        <ol className="rules-list">
          <li>
            <strong>Dress Code</strong>
            <p>Shraddha Institute T-shirt is optional. Participants from other cities/schools may wear any neat and comfortable outfit.</p>
          </li>

          <li>
            <strong>Reporting Time</strong>
            <p>All participants must report to the venue 30 minutes before the exam slot. Late entries may not be allowed.</p>
          </li>

          <li>
            <strong>Required Documents</strong>
            <p>Participants must carry any one of the following: Student ID Card or Parent Entry Coupon (After registration).</p>
          </li>

          <li>
            <strong>Registration Process</strong>
            <p>Shraddha Institute students will be registered by their Branch Educator. Parents registering independently must ensure that the online form is correctly filled and all details are verified.</p>
          </li>

          <li>
            <strong>Registration Fees</strong>
            <p>Registration fees are non-refundable. Please verify all details before completing the registration.</p>
          </li>

          <li>
            <strong>Materials to Bring</strong>
            <p>Participants must bring: Abacus Kit, Pencil &amp; Sharpener. No materials will be provided at the venue.</p>
          </li>

          <li>
            <strong>Examination Rules</strong>
            <p>Mobile phones, smartwatches, and calculators are strictly prohibited. Participants cannot leave the hall once the exam begins.</p>
          </li>

          <li>
            <strong>Multiple Categories</strong>
            <p>Participants may register for more than one category, if they meet the eligibility criteria.</p>
          </li>

          <li>
            <strong>Parental Entry, Safety & Time Management</strong>
            <p>Only two parents/guardians will be permitted inside the venue depending on capacity. Please cooperate with volunteers and ensure your child arrives on time.</p>
          </li>

          <li>
            <strong>Results, Ranking & Awards</strong>
            <p>Ranks will be awarded based on total marks. Trophies, medals, and certificates will be distributed according to rank and performance. Solved/answer papers will not be provided. All results and award decisions are final.</p>
          </li>

          <li>
            <strong>Purpose of the Competition</strong>
            <p>This competition is conducted to motivate students, build confidence, develop competitive spirit, and enhance Abacus &amp; Vedic Math skills.</p>
          </li>

          <li>
            <strong>Photography &amp; Videography</strong>
            <p>Event photographs and videos may be used for academic and promotional purposes.</p>
          </li>

          <li>
            <strong>Discipline &amp; Conduct</strong>
            <p>Students must maintain discipline at all times. Any misbehavior by participants or parents may lead to disqualification or removal from the event.</p>
          </li>
        </ol>

        <div className="acknowledgement">
          <label className="ack-label">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <span>I have thoroughly read and understood the syllabus, competition rules, and guidelines mentioned above. I agree to abide by all terms and conditions, and I understand that the organizers' decisions are final and binding.</span>
          </label>

          <button className="confirm-button" disabled={!agreed} onClick={handleConfirm}>
            Confirm &amp; Continue
          </button>

          {confirmed && <div className="confirmed-msg">Thank you — your acknowledgement has been recorded.</div>}
        </div>
      </div>
    </div>
  );
};

export default ReviewConfirmPage;
