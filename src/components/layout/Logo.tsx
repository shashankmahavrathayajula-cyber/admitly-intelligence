import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1a1f36]';

  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      {/* Compass/target icon */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="14" r="12" stroke="#e85d3a" strokeWidth="2" fill="none" />
        <circle cx="14" cy="14" r="4" fill="#e85d3a" />
        <path d="M14 2V6" stroke="#e85d3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M14 22V26" stroke="#e85d3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 14H6" stroke="#e85d3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M22 14H26" stroke="#e85d3a" strokeWidth="2" strokeLinecap="round" />
        {/* Direction arrow - pointing upper right */}
        <path d="M18 7L21 4" stroke="#e85d3a" strokeWidth="2" strokeLinecap="round" />
        <path d="M21 4L17 5" stroke="#e85d3a" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M21 4L20 8" stroke="#e85d3a" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className={`text-xl font-bold tracking-tight font-sans ${textColor}`}>
        Admitly
      </span>
    </Link>
  );
}
