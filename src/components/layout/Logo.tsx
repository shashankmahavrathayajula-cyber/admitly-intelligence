import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoIcon from '@/assets/logo-icon.png';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export default function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const { isAuthenticated } = useAuth();
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1a1f36]';
  const destination = isAuthenticated ? '/dashboard' : '/';

  return (
    <Link to={destination} className={`inline-flex items-center ${className}`}>
      <img
        src={logoIcon}
        alt="Admitly logo"
        className="w-auto object-contain"
        style={{
          height: '40px',
          filter: 'brightness(0) saturate(100%) invert(38%) sepia(82%) saturate(1057%) hue-rotate(342deg) brightness(95%) contrast(91%)',
        }}
      />
    </Link>
  );
}
