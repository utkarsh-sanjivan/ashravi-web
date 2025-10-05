import React from 'react';
import './index.css';

export default function AssessmentPreviewSection() {
  return (
    <section className="assessment-preview-section">
      <div className="assessment-container">
        <div className="assessment-header">
          <h2 className="assessment-title">
            Understanding Your Child Starts Here
          </h2>
          <p className="assessment-subtitle">
            Take our comprehensive assessment to get personalized parenting course recommendations for your family
          </p>
        </div>

        <div className="assessment-preview-card">
          <h3 className="preview-title">Sample Questions</h3>
          <div className="questions-list">
            <div className="question-item">
              <p className="question-text">
                1. How often does your child have emotional outbursts?
              </p>
              <div className="options-list">
                <label className="option-label">
                  <input type="radio" name="q1" className="option-input" />
                  <span>Rarely (once a month or less)</span>
                </label>
                <label className="option-label">
                  <input type="radio" name="q1" className="option-input" />
                  <span>Sometimes (1-3 times per week)</span>
                </label>
                <label className="option-label">
                  <input type="radio" name="q1" className="option-input" />
                  <span>Often (daily)</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="assessment-cta">
          <a href="/child" className="inline-block">
            <button className="btn btn-primary btn-lg">
              Complete Full Assessment (FREE)
            </button>
          </a>
        </div>
      </div>
    </section>
  );
}
