import React from "react";

export function ResumeIcon({ size = 28, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: "inline-block", verticalAlign: "middle" }}
    >
      <defs>
        <filter id="shadow" x="0" y="0" width="100" height="100" filterUnits="userSpaceOnUse">
          <feDropShadow dx="3" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Underneath Offset Sheet */}
      <rect x="26" y="16" width="54" height="72" rx="3" fill="#2563eb" filter="url(#shadow)" />

      {/* Main Top Resume Sheet */}
      <rect x="18" y="8" width="54" height="72" rx="3" fill="#3b82f6" />

      {/* Paperclip */}
      <path
        d="M 27 6 L 27 22 A 4 4 0 0 0 35 22 L 35 11 A 2.5 2.5 0 0 0 30 11 L 30 20"
        stroke="#475569"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* "RESUME" Title */}
      <text x="36" y="22" fill="#ffffff" fontSize="8.5" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.8">
        RESUME
      </text>

      {/* Top Left Bar Lines */}
      <rect x="24" y="27" width="22" height="3" rx="1.5" fill="#ffffff" />
      <rect x="24" y="32" width="22" height="3" rx="1.5" fill="#ffffff" />
      <rect x="24" y="37" width="22" height="3" rx="1.5" fill="#ffffff" />

      {/* Avatar Headshot Box */}
      <rect x="50" y="24" width="18" height="20" fill="#ffffff" rx="1" />
      {/* Avatar Head */}
      <circle cx="59" cy="31" r="4" fill="#332f2c" />
      {/* Avatar Bust */}
      <path d="M 52 42 C 52 37 66 37 66 42 Z" fill="#332f2c" />

      {/* Middle & Lower Text Lines */}
      <rect x="24" y="50" width="44" height="3" rx="1.5" fill="#ffffff" />
      <rect x="24" y="55" width="44" height="3" rx="1.5" fill="#ffffff" />
      <rect x="24" y="60" width="18" height="3" rx="1.5" fill="#ffffff" />
      <rect x="24" y="65" width="44" height="3" rx="1.5" fill="#ffffff" />
      <rect x="24" y="70" width="44" height="3" rx="1.5" fill="#ffffff" />
      <rect x="24" y="75" width="30" height="3" rx="1.5" fill="#ffffff" />

      {/* Pen Angled Across Bottom Right */}
      <g transform="translate(68, 56) rotate(-38)">
        {/* Pen Shaft */}
        <rect x="-4" y="-30" width="8" height="38" rx="1" fill="#44403c" />
        {/* Pen Clip */}
        <rect x="-1" y="-28" width="2" height="14" fill="#a8a29e" />
        {/* Pen Grip Band */}
        <rect x="-4" y="2" width="8" height="6" fill="#292524" />
        {/* Pen Tip Cone */}
        <polygon points="-4,8 4,8 0,16" fill="#1c1917" />
        {/* Fine Nib Point */}
        <polygon points="-1,16 1,16 0,19" fill="#000000" />
      </g>
    </svg>
  );
}
