import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import logoIcon from '@/assets/logo-icon.png';

interface LogoProps {
  variant?: 'light' | 'dark';
  size?: 'default' | 'small';
  className?: string;
}

export default function Logo({ variant = 'dark', size = 'default', className = '' }: LogoProps) {
  const { isAuthenticated } = useAuth();
  const textColor = variant === 'light' ? 'text-white' : 'text-[#1a1f36]';
  const destination = isAuthenticated ? '/dashboard' : '/';

  const iconH = size === 'small' ? '20px' : '26px';
  const mobileIconH = size === 'small' ? '20px' : '22px';
  const textSize = size === 'small' ? 'text-base' : 'text-lg md:text-lg text-base';

  return (
    <Link to={destination} className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src={logoIcon}
        alt="Admitly logo"
        className="w-auto object-contain md:hidden"
        style={{
          height: mobileIconH,
          filter: 'brightness(0) saturate(100%) invert(38%) sepia(82%) saturate(1057%) hue-rotate(342deg) brightness(95%) contrast(91%)',
        }}
      />
      <img
        src={logoIcon}
        alt="Admitly logo"
        className="w-auto object-contain hidden md:block"
        style={{
          height: iconH,
          filter: 'brightness(0) saturate(100%) invert(38%) sepia(82%) saturate(1057%) hue-rotate(342deg) brightness(95%) contrast(91%)',
        }}
      />
      <span className={`font-semibold tracking-tight ${textSize} ${textColor}`}>
        Admitly
      </span>
    </Link>
  );
}
