import './index.css';

export interface ProgressBarProps {
  value: number; // accepts 0–1 or 0–100
  ariaLabel?: string;
}

const clampPercent = (value: number): number => {
  if (!Number.isFinite(value)) {
    return 0;
  }
  const normalized = value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, normalized));
};

export default function ProgressBar({ value, ariaLabel = 'Progress' }: ProgressBarProps) {
  const percent = clampPercent(value);

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(percent)}
    >
      <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
    </div>
  );
}
