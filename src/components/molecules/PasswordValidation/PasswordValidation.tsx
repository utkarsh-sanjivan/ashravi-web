import React from 'react';
import { CheckCircleIcon, XCircleIcon } from '@/components/icons';
import './index.css';

export interface PasswordValidationProps {
  password: string;
  confirmPassword?: string;
  showConfirmMatchOnly?: boolean; // New prop for confirm password field
}

export default function PasswordValidation({
  password,
  confirmPassword = '',
  showConfirmMatchOnly = false,
}: PasswordValidationProps) {
  const hasMinLength = password.length >= 8;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  if (showConfirmMatchOnly) {
    return (
      <div className="password-validation password-validation-compact">
        <div className={`validation-item ${passwordsMatch ? 'valid' : 'invalid'}`}>
          {passwordsMatch ? (
            <CheckCircleIcon className="validation-icon valid-icon" />
          ) : (
            <XCircleIcon className="validation-icon invalid-icon" />
          )}
          <span className="validation-text">Passwords match</span>
        </div>
      </div>
    );
  }

  const validations = [
    { label: 'At least 8 characters', isValid: hasMinLength },
    { label: 'Contains lowercase letter', isValid: hasLowercase },
    { label: 'Contains uppercase letter', isValid: hasUppercase },
    { label: 'Contains number', isValid: hasNumber },
    { label: 'Contains special character', isValid: hasSpecialChar },
  ];

  return (
    <div className="password-validation">
      <div className="validation-title">Password Requirements:</div>
      <div className="validation-list">
        {validations.map((validation, index) => (
          <div
            key={index}
            className={`validation-item ${validation.isValid ? 'valid' : 'invalid'}`}
          >
            {validation.isValid ? (
              <CheckCircleIcon className="validation-icon valid-icon" />
            ) : (
              <XCircleIcon className="validation-icon invalid-icon" />
            )}
            <span className="validation-text">{validation.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
