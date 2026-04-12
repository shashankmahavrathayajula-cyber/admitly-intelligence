import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'default' | 'small';
  className?: string;
}

export default function Logo({ variant = 'dark', size = 'default', className = '' }: LogoProps) {
  const { isAuthenticated } = useAuth();
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1a1f36]';
  const destination = isAuthenticated ? '/dashboard' : '/';
  const textSize = size === 'small' ? 'text-base' : 'text-xl';

  return (
    <Link to={destination} className={`inline-flex items-center ${className}`}>
      <span className={`font-semibold tracking-tight ${textSize} ${textColor}`}>
        Admitly
      </span>
    </Link>
  );
}
