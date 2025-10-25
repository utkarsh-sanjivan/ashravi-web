import type { SVGProps } from 'react';

export default function QuizIcon(props: SVGProps<SVGSVGElement>) {
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
      <path d="M12 15.5v.01" />
      <path d="M11 6a3 3 0 0 1 5.67 1.2c0 2-3 2.5-3 4.3" />
      <path d="M12 2.75H8.5A2.25 2.25 0 0 0 6.25 5v14A2.25 2.25 0 0 0 8.5 21.25h7a2.25 2.25 0 0 0 2.25-2.25V12" />
    </svg>
  );
}
