import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1a1f36]';

  return (
    <Link to="/" className={`flex items-center gap-2.5 ${className}`}>
      {/* Stylized "A" compass needle inside circle ring */}
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Compass ring */}
        <circle cx="16" cy="16" r="14.5" stroke="#e85d3a" strokeOpacity="0.3" strokeWidth="1.5" />
        {/* Geometric A / compass needle pointing north */}
        <path
          d="M16 6L21.5 24H18.5L17 19H15L13.5 24H10.5L16 6Z"
          fill="#e85d3a"
        />
        {/* Crossbar of the A */}
        <rect x="13.5" y="17" width="5" height="1.5" rx="0.5" fill="#1a1f36" fillOpacity="0.9" />
      </svg>
      <span className={`text-xl font-bold tracking-tight ${textColor}`}>
        Admitly
      </span>
    </Link>
  );
}
