import { CreatorAccount, DesignSettings, SocialLink } from '../types/creator';

/**
 * Sanitizes input into a clean alphanumeric slug for influencer public URLs
 */
export function sanitizeSlug(input: string): string {
  if (!input) return '';
  return input
    .toLowerCase()
    .trim()
    .replace(/^@+/, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Filters social links by category and sorts them by featured status and order
 */
export function filterAndSortLinks(links: SocialLink[], categoryFilter?: string): SocialLink[] {
  if (!Array.isArray(links)) return [];
  
  return links
    .filter(link => {
      if (!link.isActive) return false;
      if (!categoryFilter || categoryFilter === 'all') return true;
      return link.category === categoryFilter;
    })
    .sort((a, b) => {
      // Featured links always come first
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return a.order - b.order;
    });
}

/**
 * Calculates aggregate link clicks across all links
 */
export function calculateTotalClicks(links: SocialLink[]): number {
  if (!Array.isArray(links)) return 0;
  return links.reduce((acc, curr) => acc + (curr.clicksCount || 0), 0);
}

/**
 * Resolves CSS font-family class based on design settings
 */
export function getFontFamilyClass(fontName: string): string {
  switch (fontName) {
    case 'Cormorant Garamond':
      return 'font-cormorant';
    case 'Playfair Display':
      return 'font-playfair';
    case 'Outfit':
      return 'font-outfit';
    case 'DM Sans':
      return 'font-dmsans';
    case 'Plus Jakarta Sans':
    default:
      return 'font-jakarta';
  }
}

/**
 * Returns Tailwind border-radius class from design setting
 */
export function getBorderRadiusClass(radius: DesignSettings['visual']['borderRadius']): string {
  switch (radius) {
    case 'none':
      return 'rounded-none';
    case 'sm':
      return 'rounded-sm';
    case 'md':
      return 'rounded-lg';
    case 'lg':
      return 'rounded-2xl';
    case 'full':
      return 'rounded-full';
    default:
      return 'rounded-xl';
  }
}

/**
 * Validates a creator profile for required fields
 */
export function validateCreatorAccount(account: Partial<CreatorAccount>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!account.profile?.username || sanitizeSlug(account.profile.username).length < 2) {
    errors.push('O nome de usuário deve ter pelo menos 2 caracteres.');
  }

  if (!account.profile?.displayName || account.profile.displayName.trim().length === 0) {
    errors.push('O nome de exibição é obrigatório.');
  }

  if (!account.user?.email || !account.user.email.includes('@')) {
    errors.push('E-mail válido é obrigatório.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
