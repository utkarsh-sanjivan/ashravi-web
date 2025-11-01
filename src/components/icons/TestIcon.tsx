import type { SVGProps } from 'react';

export default function TestIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="2.25" />
      <path d="M8 8h8" />
      <path d="M8 12h6" />
      <path d="m9 16 2 2 4-4" />
    </svg>
  );
}
