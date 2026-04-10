import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1a1f36]';

  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="34" viewBox="0 0 30 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Circle ring — centered on crossbar level, A's peak breaks above */}
        <circle cx="15" cy="19" r="13" stroke="#e85d3a" strokeOpacity="0.3" strokeWidth="1.5" />
        {/* Geometric A — tall, narrow, arrow-like */}
        <path
          d="M15 1L22 28H18.2L16.4 22H13.6L11.8 28H8L15 1Z"
          fill="#e85d3a"
        />
        {/* Crossbar */}
        <rect x="12.2" y="19.5" width="5.6" height="1.8" rx="0.4" fill="white" fillOpacity="0.95" />
        {/* Needle-point diamond at apex */}
        <path d="M15 0L16 2L15 3.5L14 2Z" fill="#e85d3a" />
      </svg>
      <span className={`text-xl font-bold tracking-tight ${textColor}`}>
        Admitly
      </span>
    </Link>
  );
}
