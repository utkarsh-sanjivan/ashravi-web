import type { SVGProps } from 'react';

export default function PdfIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M6.25 2.75h8.25L18.5 6.75v14.5a1 1 0 0 1-1 1H6.25A1.75 1.75 0 0 1 4.5 20.5V4.5a1.75 1.75 0 0 1 1.75-1.75Z" />
      <path d="M14.5 2.75V7a1 1 0 0 0 1 1h3" />
      <path d="M8.5 12h3" />
      <path d="M8.5 16h7" />
      <path d="M8.5 20h4" />
      <path d="M12.5 11.5v2.5" />
      <path d="M12.5 14h1.75" />
    </svg>
  );
}
