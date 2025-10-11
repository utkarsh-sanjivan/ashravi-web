import React, { forwardRef, InputHTMLAttributes } from 'react';
import { CheckmarkIcon } from '@/components/icons';
import './index.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string | React.ReactNode; // Changed to accept both string and ReactNode
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="checkbox-wrapper">
        <label className="checkbox-label">
          <input
            ref={ref}
            type="checkbox"
            className="checkbox-input"
            {...props}
          />
          <span className="checkbox-custom">
            <CheckmarkIcon className="checkbox-icon" />
          </span>
          {label && <span className="checkbox-text">{label}</span>}
        </label>
        {error && <span className="checkbox-error">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
