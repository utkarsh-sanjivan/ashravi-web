import type { SVGProps } from 'react';

export default function DocumentIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6 2.75h8.5L20.25 8v13a1.25 1.25 0 0 1-1.25 1.25H6A2.25 2.25 0 0 1 3.75 20V5A2.25 2.25 0 0 1 6 2.75Z" />
      <path d="M14.5 2.75V7a1 1 0 0 0 1 1h4.75" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h7" />
      <path d="M8.5 20h4" />
    </svg>
  );
}
