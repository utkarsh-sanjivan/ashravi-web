import type { SVGProps } from 'react';

export default function VideoIcon(props: SVGProps<SVGSVGElement>) {
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
      <rect x="3" y="5" width="15" height="14" rx="2" />
      <path d="m18 8 4-2v12l-4-2" />
      <path d="M10 9.5 13.5 12 10 14.5v-5Z" fill="currentColor" stroke="none" />
    </svg>
  );
}
