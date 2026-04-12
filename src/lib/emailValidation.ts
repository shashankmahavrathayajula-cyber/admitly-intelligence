const BLOCKED_DOMAINS = new Set([
  'test.com', 'fake.com', 'example.com', 'asdf.com', 'none.com', 'noemail.com',
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'dispostable.com', 'maildrop.cc', '10minutemail.com', 'trashmail.com',
]);

const DOMAIN_SUGGESTIONS: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
  'hotmal.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'outllook.com': 'outlook.com',
  'outlok.com': 'outlook.com',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function getEmailDomain(email: string): string | null {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : null;
}

export function isBlockedDomain(email: string): boolean {
  const domain = getEmailDomain(email);
  if (!domain) return false;
  if (BLOCKED_DOMAINS.has(domain)) return true;
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) return true;
  if (!domain.includes('.')) return true;
  return false;
}

export function getSuggestedEmail(email: string): string | null {
  const domain = getEmailDomain(email);
  if (!domain) return null;
  const suggestion = DOMAIN_SUGGESTIONS[domain];
  if (!suggestion) return null;
  const localPart = email.split('@')[0];
  return `${localPart}@${suggestion}`;
}
