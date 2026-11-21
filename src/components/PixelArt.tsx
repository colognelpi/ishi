import React from 'react';

export function PixelHeart({
  size = 40,
  color = '#60B5FF',
  highlight = '#DBEAFE',
  outline = '#0F2342',
  className = '',
}: {
  size?: number;
  color?: string;
  highlight?: string;
  outline?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Crisp 16x14 pixel art heart */}
      <rect x="2" y="0" width="4" height="1" fill={outline} />
      <rect x="10" y="0" width="4" height="1" fill={outline} />
      <rect x="1" y="1" width="1" height="1" fill={outline} />
      <rect x="6" y="1" width="1" height="1" fill={outline} />
      <rect x="9" y="1" width="1" height="1" fill={outline} />
      <rect x="14" y="1" width="1" height="1" fill={outline} />
      <rect x="0" y="2" width="1" height="4" fill={outline} />
      <rect x="7" y="2" width="2" height="1" fill={outline} />
      <rect x="15" y="2" width="1" height="4" fill={outline} />
      <rect x="1" y="6" width="1" height="2" fill={outline} />
      <rect x="14" y="6" width="1" height="2" fill={outline} />
      <rect x="2" y="8" width="1" height="1" fill={outline} />
      <rect x="13" y="8" width="1" height="1" fill={outline} />
      <rect x="3" y="9" width="1" height="1" fill={outline} />
      <rect x="12" y="9" width="1" height="1" fill={outline} />
      <rect x="4" y="10" width="1" height="1" fill={outline} />
      <rect x="11" y="10" width="1" height="1" fill={outline} />
      <rect x="5" y="11" width="1" height="1" fill={outline} />
      <rect x="10" y="11" width="1" height="1" fill={outline} />
      <rect x="6" y="12" width="1" height="1" fill={outline} />
      <rect x="9" y="12" width="1" height="1" fill={outline} />
      <rect x="7" y="13" width="2" height="1" fill={outline} />

      {/* Body fill */}
      <rect x="2" y="1" width="4" height="1" fill={color} />
      <rect x="10" y="1" width="4" height="1" fill={color} />
      <rect x="1" y="2" width="6" height="4" fill={color} />
      <rect x="9" y="2" width="6" height="4" fill={color} />
      <rect x="7" y="3" width="2" height="3" fill={color} />
      <rect x="2" y="6" width="12" height="2" fill={color} />
      <rect x="3" y="8" width="10" height="1" fill={color} />
      <rect x="4" y="9" width="8" height="1" fill={color} />
      <rect x="5" y="10" width="6" height="1" fill={color} />
      <rect x="6" y="11" width="4" height="1" fill={color} />
      <rect x="7" y="12" width="2" height="1" fill={color} />

      {/* Pixel specular shine */}
      <rect x="2" y="2" width="2" height="1" fill={highlight} />
      <rect x="2" y="3" width="1" height="2" fill={highlight} />
    </svg>
  );
}

export function PixelCloud({
  width = 110,
  className = '',
}: {
  width?: number;
  className?: string;
}) {
  return (
    <svg
      width={width}
      height={Math.round(width * 0.56)}
      viewBox="0 0 24 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ shapeRendering: 'crispEdges' }}
    >
      <rect x="6" y="2" width="6" height="2" fill="#EFF6FF" />
      <rect x="4" y="4" width="10" height="2" fill="#EFF6FF" />
      <rect x="14" y="5" width="5" height="2" fill="#DBEAFE" />
      <rect x="2" y="6" width="19" height="4" fill="#EFF6FF" />
      <rect x="1" y="8" width="22" height="3" fill="#DBEAFE" />
      <rect x="3" y="11" width="18" height="1" fill="#BCE3FF" />
    </svg>
  );
}

export function PixelCharacter({
  size = 64,
  mood = 'happy',
  className = '',
}: {
  size?: number;
  mood?: 'happy' | 'celebrating';
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      style={{ shapeRendering: 'crispEdges' }}
    >
      {/* Cute sky-blue star-hat pixel sprite */}
      <rect x="5" y="1" width="6" height="2" fill="#60B5FF" />
      <rect x="4" y="3" width="8" height="2" fill="#93C5FD" />
      <rect x="7" y="1" width="2" height="2" fill="#FFFFFF" />
      {/* Face */}
      <rect x="4" y="5" width="8" height="5" fill="#FFFDF9" />
      <rect x="3" y="6" width="1" height="3" fill="#FFFDF9" />
      <rect x="12" y="6" width="1" height="3" fill="#FFFDF9" />
      {/* Eyes */}
      {mood === 'celebrating' ? (
        <>
          <rect x="5" y="6" width="2" height="1" fill="#0F2342" />
          <rect x="9" y="6" width="2" height="1" fill="#0F2342" />
        </>
      ) : (
        <>
          <rect x="5" y="6" width="1" height="2" fill="#0F2342" />
          <rect x="10" y="6" width="1" height="2" fill="#0F2342" />
        </>
      )}
      {/* Cheeks (icy sky blue tint) */}
      <rect x="4" y="8" width="1" height="1" fill="#93C5FD" />
      <rect x="11" y="8" width="1" height="1" fill="#93C5FD" />
      {/* Smile */}
      <rect x="7" y="8" width="2" height="1" fill="#1E3A8A" />
      {/* Cozy sweater */}
      <rect x="4" y="10" width="8" height="4" fill="#3B82F6" />
      <rect x="6" y="11" width="4" height="2" fill="#DBEAFE" />
      {/* Arms */}
      {mood === 'celebrating' ? (
        <>
          <rect x="2" y="7" width="2" height="3" fill="#60B5FF" />
          <rect x="12" y="7" width="2" height="3" fill="#60B5FF" />
        </>
      ) : (
        <>
          <rect x="2" y="10" width="2" height="3" fill="#60B5FF" />
          <rect x="12" y="10" width="2" height="3" fill="#60B5FF" />
        </>
      )}
      {/* Shoes */}
      <rect x="4" y="14" width="3" height="2" fill="#0F2342" />
      <rect x="9" y="14" width="3" height="2" fill="#0F2342" />
    </svg>
  );
}

export function KeepsakeArtwork({
  variant,
}: {
  variant: 'late-call' | 'playlist' | 'arcade-ticket' | 'rainy-walk';
}) {
  if (variant === 'late-call') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Midnight sky illustration">
        <defs>
          <linearGradient id="callBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0B1B38" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#callBg)" />
        <circle cx="310" cy="72" r="28" fill="#EFF6FF" opacity="0.95" />
        <circle cx="322" cy="64" r="24" fill="#0F244A" />
        <circle cx="70" cy="60" r="2" fill="#BCE3FF" />
        <circle cx="130" cy="42" r="2.5" fill="#FFFFFF" />
        <circle cx="215" cy="80" r="2" fill="#93C5FD" />
        <circle cx="170" cy="120" r="1.5" fill="#FFFFFF" />
        <rect x="125" y="110" width="150" height="120" rx="18" fill="#0F2342" stroke="#60B5FF" strokeWidth="3" />
        <rect x="145" y="132" width="110" height="58" rx="10" fill="#1E3A8A" />
        <path d="M188 154 h8 v4 h8 v-4 h8 v10 h-4 v4 h-4 v4 h-8 v-4 h-4 v-4 h-4 z" fill="#93C5FD" />
        <rect x="172" y="204" width="56" height="8" rx="4" fill="#60B5FF" opacity="0.7" />
      </svg>
    );
  }

  if (variant === 'playlist') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Blue cassette illustration">
        <defs>
          <linearGradient id="tapeBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DBEAFE" />
            <stop offset="100%" stopColor="#93C5FD" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#tapeBg)" />
        <rect x="65" y="65" width="270" height="170" rx="16" fill="#0F2342" stroke="#FFFFFF" strokeWidth="3" />
        <rect x="85" y="85" width="230" height="88" rx="8" fill="#EFF6FF" />
        <rect x="85" y="85" width="230" height="24" rx="8" fill="#60B5FF" />
        <circle cx="145" cy="136" r="20" fill="#0F2342" stroke="#60B5FF" strokeWidth="4" />
        <circle cx="255" cy="136" r="20" fill="#0F2342" stroke="#60B5FF" strokeWidth="4" />
        <rect x="165" y="128" width="70" height="16" rx="4" fill="#1E3A8A" />
        <polygon points="110,218 290,218 275,192 125,192" fill="#1E3A8A" />
      </svg>
    );
  }

  if (variant === 'arcade-ticket') {
    return (
      <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Arcade ticket keepsake">
        <defs>
          <linearGradient id="ticketBg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1E3A8A" />
            <stop offset="100%" stopColor="#0B1933" />
          </linearGradient>
        </defs>
        <rect width="400" height="300" fill="url(#ticketBg)" />
        <g transform="rotate(-6 200 150)">
          <rect x="55" y="85" width="290" height="130" rx="12" fill="#EFF6FF" stroke="#60B5FF" strokeWidth="4" />
          <rect x="70" y="100" width="260" height="100" rx="6" fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="6 6" />
          <path d="M188 134 h8 v4 h8 v-4 h8 v10 h-4 v4 h-4 v4 h-8 v-4 h-4 v-4 h-4 z" fill="#2563EB" />
          <rect x="130" y="168" width="140" height="10" rx="5" fill="#93C5FD" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 300" className="w-full h-full" aria-label="Rainy blue clouds illustration">
      <defs>
        <linearGradient id="rainBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>
      </defs>
      <rect width="400" height="300" fill="url(#rainBg)" />
      <ellipse cx="160" cy="110" rx="65" ry="34" fill="#EFF6FF" />
      <ellipse cx="225" cy="102" rx="55" ry="30" fill="#EFF6FF" />
      <ellipse cx="265" cy="116" rx="45" ry="26" fill="#DBEAFE" />
      <rect x="130" y="160" width="4" height="22" rx="2" fill="#EFF6FF" opacity="0.8" />
      <rect x="175" y="176" width="4" height="26" rx="2" fill="#DBEAFE" opacity="0.8" />
      <rect x="220" y="158" width="4" height="24" rx="2" fill="#EFF6FF" opacity="0.8" />
      <rect x="262" y="182" width="4" height="22" rx="2" fill="#DBEAFE" opacity="0.8" />
      <path d="M190 226 h6 v3 h6 v-3 h6 v8 h-3 v3 h-3 v3 h-6 v-3 h-3 v-3 h-3 z" fill="#FFFFFF" />
    </svg>
  );
}
