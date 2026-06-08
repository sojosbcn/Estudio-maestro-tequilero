import * as React from 'react';

interface TequilaLogoProps {
  className?: string;
  size?: number;
}

export default function TequilaLogo({ className = '', size = 48 }: TequilaLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform hover:scale-105 duration-500`}
      id="svg-tequila-master-logo"
    >
      <defs>
        {/* Glowing Amber Gradient */}
        <linearGradient id="amberGlow" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5A623" /> {/* Amber Primary */}
          <stop offset="50%" stopColor="#D97706" /> {/* Amber Secondary */}
          <stop offset="100%" stopColor="#92400E" /> {/* Deep Amber / Copper */}
        </linearGradient>
        
        {/* Soft Gold Shimmer */}
        <linearGradient id="goldShimmer" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>

        {/* Charcoal Dark Shadow Element */}
        <radialGradient id="charcoalShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1E1B18" stopOpacity="1" />
          <stop offset="100%" stopColor="#0B0908" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Styled Circle Background with Double Subtle Ring */}
      <circle cx="50" cy="50" r="46" fill="url(#charcoalShadow)" stroke="url(#amberGlow)" strokeWidth="1.5" strokeOpacity="0.6" />
      <circle cx="50" cy="50" r="41" stroke="#F5A623" strokeWidth="0.5" strokeOpacity="0.25" strokeDasharray="3 3" />

      {/* Geometric Stylized Agave Plant */}
      <g>
        {/* Outer Background Leaves (Symmetrical, Wider) */}
        <path
          d="M 22 55 C 32 50, 40 40, 42 28 C 42 41, 35 52, 28 59 Z"
          fill="url(#goldShimmer)"
          opacity="0.4"
        />
        <path
          d="M 78 55 C 68 50, 60 40, 58 28 C 58 41, 65 52, 72 59 Z"
          fill="url(#goldShimmer)"
          opacity="0.4"
        />

        {/* Mid-Row Leaves */}
        <path
          d="M 27 63 C 35 56, 42 43, 44 32 C 43 45, 37 57, 33 67 Z"
          fill="url(#amberGlow)"
          opacity="0.75"
        />
        <path
          d="M 73 63 C 65 56, 58 43, 56 32 C 57 45, 63 57, 67 67 Z"
          fill="url(#amberGlow)"
          opacity="0.75"
        />

        {/* Inner Main Symmetrical Agave Leaves */}
        {/* Left main leaf leaning outwards */}
        <path
          d="M 33 70 C 40 60, 46 44, 46 34 C 45 48, 41 62, 38 73 Z"
          fill="url(#amberGlow)"
        />
        {/* Right main leaf leaning outwards */}
        <path
          d="M 67 70 C 60 60, 54 44, 54 34 C 55 48, 59 62, 62 73 Z"
          fill="url(#amberGlow)"
        />

        {/* Center Majestic Upright Spindle / Spear leaf */}
        <path
          d="M 50 16 C 52 32, 53 45, 52.5 76 C 47.5 76, 48 32, 50 16 Z"
          fill="url(#goldShimmer)"
        />

        {/* Core Heart / Piña representation: Overlapping geometric lines */}
        <path
          d="M 42 76 C 45 68, 55 68, 58 76 L 50 82 Z"
          fill="url(#amberGlow)"
          stroke="#000000"
          strokeWidth="0.5"
        />

        {/* Distilled Elixir drop falling from center of the Agave */}
        <path
          d="M 50 80 C 51.5 80, 53 81.5, 53 83 C 53 84.5, 51.5 86, 50 86 C 48.5 86, 47 84.5, 47 83 C 47 81.5, 48.5 80, 50 80 Z"
          fill="#FBBF24"
          filter="drop-shadow(0px 1px 2px rgba(245, 166, 35, 0.5))"
        />

        {/* Base support elements (The soil/terroir geometry) */}
        <path
          d="M 35 77 L 65 77 C 60 81, 40 81, 35 77 Z"
          fill="#1E1B18"
          stroke="url(#amberGlow)"
          strokeWidth="0.75"
        />
      </g>
    </svg>
  );
}
