import React from 'react';

interface LogoProps {
  variant?: 'white' | 'color';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Logo({ variant = 'color', size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { height: 40, fontSize: 22, taglineSize: 9 },
    md: { height: 56, fontSize: 28, taglineSize: 11 },
    lg: { height: 72, fontSize: 36, taglineSize: 13 }
  };

  const currentSize = sizes[size];
  const isWhite = variant === 'white';

  return (
    <svg
      width="auto"
      height={currentSize.height}
      viewBox="0 0 320 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Gradient for truck body */}
        <linearGradient id="truckBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#3B82F6'} />
          <stop offset="50%" stopColor={isWhite ? '#F0F0F0' : '#6366F1'} />
          <stop offset="100%" stopColor={isWhite ? '#E0E0E0' : '#8B5CF6'} />
        </linearGradient>
        
        {/* Gradient for text */}
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#1E40AF'} />
          <stop offset="50%" stopColor={isWhite ? '#FFFFFF' : '#4F46E5'} />
          <stop offset="100%" stopColor={isWhite ? '#FFFFFF' : '#7C3AED'} />
        </linearGradient>

        {/* Shadow gradient */}
        <radialGradient id="shadowGradient">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Truck Icon - More Realistic */}
      <g>
        {/* Shadow under truck */}
        <ellipse cx="36" cy="54" rx="28" ry="4" fill="url(#shadowGradient)" opacity={isWhite ? '0.2' : '0.3'} />
        
        {/* Main cargo box */}
        <rect
          x="12"
          y="24"
          width="32"
          height="22"
          rx="2"
          fill="url(#truckBodyGradient)"
          stroke={isWhite ? 'rgba(255,255,255,0.3)' : '#1E40AF'}
          strokeWidth="1"
        />
        
        {/* Cargo box panels (detail lines) */}
        <line x1="20" y1="24" x2="20" y2="46" stroke={isWhite ? 'rgba(255,255,255,0.4)' : 'rgba(30,64,175,0.3)'} strokeWidth="1" />
        <line x1="28" y1="24" x2="28" y2="46" stroke={isWhite ? 'rgba(255,255,255,0.4)' : 'rgba(30,64,175,0.3)'} strokeWidth="1" />
        <line x1="36" y1="24" x2="36" y2="46" stroke={isWhite ? 'rgba(255,255,255,0.4)' : 'rgba(30,64,175,0.3)'} strokeWidth="1" />
        
        {/* Cabin */}
        <path
          d="M44 30 L44 46 L56 46 L56 34 L50 30 Z"
          fill="url(#truckBodyGradient)"
          stroke={isWhite ? 'rgba(255,255,255,0.3)' : '#1E40AF'}
          strokeWidth="1"
        />
        
        {/* Window */}
        <path
          d="M46 32 L46 38 L52 38 L50 32 Z"
          fill={isWhite ? 'rgba(255,255,255,0.5)' : 'rgba(96,165,250,0.4)'}
          stroke={isWhite ? 'rgba(255,255,255,0.6)' : '#60A5FA'}
          strokeWidth="0.5"
        />
        
        {/* Window reflection */}
        <path
          d="M46 32 L48 32 L48 36 L46 35 Z"
          fill={isWhite ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.4)'}
        />
        
        {/* Front bumper */}
        <rect
          x="54"
          y="42"
          width="3"
          height="4"
          rx="0.5"
          fill={isWhite ? 'rgba(255,255,255,0.7)' : '#1E3A8A'}
        />
        
        {/* Headlight */}
        <circle
          cx="55.5"
          cy="40"
          r="1.5"
          fill={isWhite ? 'rgba(255,255,255,0.9)' : '#FCD34D'}
          opacity="0.9"
        />
        
        {/* Wheels - More realistic with rims */}
        <g>
          {/* Wheel 1 - Back */}
          <circle cx="22" cy="47" r="5" fill={isWhite ? 'rgba(50,50,50,0.8)' : '#1F2937'} />
          <circle cx="22" cy="47" r="3.5" fill={isWhite ? 'rgba(100,100,100,0.6)' : '#374151'} />
          <circle cx="22" cy="47" r="2" fill={isWhite ? 'rgba(150,150,150,0.8)' : '#6B7280'} />
          <circle cx="22" cy="47" r="1" fill={isWhite ? 'rgba(200,200,200,1)' : '#9CA3AF'} />
          
          {/* Wheel 2 - Front */}
          <circle cx="48" cy="47" r="5" fill={isWhite ? 'rgba(50,50,50,0.8)' : '#1F2937'} />
          <circle cx="48" cy="47" r="3.5" fill={isWhite ? 'rgba(100,100,100,0.6)' : '#374151'} />
          <circle cx="48" cy="47" r="2" fill={isWhite ? 'rgba(150,150,150,0.8)' : '#6B7280'} />
          <circle cx="48" cy="47" r="1" fill={isWhite ? 'rgba(200,200,200,1)' : '#9CA3AF'} />
        </g>
        
        {/* Motion lines behind truck */}
        <g opacity={isWhite ? '0.4' : '0.5'}>
          <line x1="4" y1="28" x2="10" y2="28" stroke={isWhite ? '#FFFFFF' : '#60A5FA'} strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="34" x2="10" y2="34" stroke={isWhite ? '#FFFFFF' : '#60A5FA'} strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="40" x2="10" y2="40" stroke={isWhite ? '#FFFFFF' : '#60A5FA'} strokeWidth="2" strokeLinecap="round" />
        </g>
        
        {/* Arrow for movement */}
        <path
          d="M60 36 L66 36 L66 33 L72 38 L66 43 L66 40 L60 40 Z"
          fill={isWhite ? 'rgba(255,255,255,0.7)' : '#3B82F6'}
          opacity="0.8"
        />
      </g>

      {/* Text: ShiftMyHome - Larger and Bold */}
      <g>
        {/* Shift */}
        <text
          x="82"
          y="38"
          fontSize={currentSize.fontSize}
          fontWeight="800"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fill="url(#textGradient)"
          letterSpacing="-0.03em"
        >
          Shift
        </text>
        
        {/* My */}
        <text
          x="82"
          y="38"
          dx="70"
          fontSize={currentSize.fontSize}
          fontWeight="800"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fill="url(#textGradient)"
          letterSpacing="-0.03em"
        >
          My
        </text>
        
        {/* Home */}
        <text
          x="82"
          y="38"
          dx="118"
          fontSize={currentSize.fontSize}
          fontWeight="800"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fill="url(#textGradient)"
          letterSpacing="-0.03em"
        >
          Home
        </text>

        {/* Tagline - Larger */}
        <text
          x="82"
          y="54"
          fontSize={currentSize.taglineSize}
          fontWeight="500"
          fontFamily="Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fill={isWhite ? 'rgba(255,255,255,0.75)' : '#64748B'}
          letterSpacing="0.08em"
        >
          Your move, made simple.
        </text>
      </g>
    </svg>
  );
}
