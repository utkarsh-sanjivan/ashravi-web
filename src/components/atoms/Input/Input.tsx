import React, { forwardRef, InputHTMLAttributes } from 'react';
import './index.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`input-wrapper ${fullWidth ? 'full-width' : ''}`}>
        {label && (
          <label className="input-label" htmlFor={props.id}>
            {label}
            {props.required && <span className="required-mark">*</span>}
          </label>
        )}
        <div className={`input-container ${error ? 'has-error' : ''}`}>
          {leftIcon && <div className="input-icon left-icon">{leftIcon}</div>}
          <input
            ref={ref}
            className={`input-field ${leftIcon ? 'has-left-icon' : ''} ${
              rightIcon ? 'has-right-icon' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && <div className="input-icon right-icon">{rightIcon}</div>}
        </div>
        {error && <span className="input-error">{error}</span>}
        {helperText && !error && <span className="input-helper">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
