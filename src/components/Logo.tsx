export default function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="PAGODA STUDIO logo"
    >
      {/* Pagoda roof */}
      <path
        d="M20 2L32 12H28L20 5L12 12H8L20 2Z"
        className="fill-[#22c55e]"
      />
      {/* Second tier roof */}
      <path
        d="M20 7L30 16H26L20 10L14 16H10L20 7Z"
        className="fill-[#22c55e]"
        fillOpacity="0.8"
      />
      {/* Third tier roof */}
      <path
        d="M20 12L28 20H24L20 15.5L16 20H12L20 12Z"
        className="fill-[#22c55e]"
        fillOpacity="0.6"
      />
      {/* Body/base */}
      <path
        d="M14 20H26L28 38H12L14 20Z"
        className="fill-white"
        fillOpacity="0.15"
      />
      {/* Door */}
      <path
        d="M17 32V26H23V32H17Z"
        className="fill-[#22c55e]"
        fillOpacity="0.5"
      />
      {/* Door arch */}
      <path
        d="M17 26C17 23 23 23 23 26"
        className="stroke-[#22c55e]"
        strokeWidth="0.8"
        fill="none"
        strokeOpacity="0.5"
      />
      {/* Bottom base line */}
      <path
        d="M10 38H30"
        className="stroke-[#22c55e]"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
