import test from 'node:test';
import assert from 'node:assert/strict';
import {
  sanitizeSlug,
  filterAndSortLinks,
  calculateTotalClicks,
  getFontFamilyClass,
  getBorderRadiusClass,
  validateCreatorAccount,
} from './pureLogic';
import { SocialLink } from '../types/creator';

test('sanitizeSlug cleans input and removes leading @ and special characters', () => {
  assert.equal(sanitizeSlug('@Helena_Vogue'), 'helena_vogue');
  assert.equal(sanitizeSlug('  @Lucas Neon Art!! '), 'lucas-neon-art');
  assert.equal(sanitizeSlug('Clara--Marítima'), 'clara-maritima');
});

test('filterAndSortLinks correctly prioritizes featured links and respects category filter', () => {
  const mockLinks: SocialLink[] = [
    {
      id: '1',
      title: 'YouTube',
      url: 'https://youtube.com',
      icon: 'youtube',
      category: 'redes',
      isFeatured: false,
      isActive: true,
      order: 1,
      clicksCount: 10,
    },
    {
      id: '2',
      title: 'Livro Novo',
      url: 'https://amazon.com',
      icon: 'book',
      category: 'produtos',
      isFeatured: true,
      isActive: true,
      order: 3,
      clicksCount: 50,
    },
    {
      id: '3',
      title: 'Instagram',
      url: 'https://instagram.com',
      icon: 'instagram',
      category: 'redes',
      isFeatured: false,
      isActive: false, // Inactive
      order: 0,
      clicksCount: 5,
    },
    {
      id: '4',
      title: 'Podcast',
      url: 'https://spotify.com',
      icon: 'mic',
      category: 'conteudos',
      isFeatured: false,
      isActive: true,
      order: 2,
      clicksCount: 20,
    },
  ];

  // Inactive links must be excluded
  const activeAll = filterAndSortLinks(mockLinks);
  assert.equal(activeAll.length, 3);
  // Featured link comes first
  assert.equal(activeAll[0].id, '2');

  // Filter by category
  const filteredRedes = filterAndSortLinks(mockLinks, 'redes');
  assert.equal(filteredRedes.length, 1);
  assert.equal(filteredRedes[0].title, 'YouTube');
});

test('calculateTotalClicks sums all clicks properly', () => {
  const mockLinks: SocialLink[] = [
    { id: '1', title: 'A', url: '', icon: '', category: 'redes', isFeatured: false, isActive: true, order: 1, clicksCount: 12 },
    { id: '2', title: 'B', url: '', icon: '', category: 'redes', isFeatured: false, isActive: true, order: 2, clicksCount: 88 },
  ];
  assert.equal(calculateTotalClicks(mockLinks), 100);
});

test('getFontFamilyClass and getBorderRadiusClass map correctly', () => {
  assert.equal(getFontFamilyClass('Cormorant Garamond'), 'font-cormorant');
  assert.equal(getFontFamilyClass('Outfit'), 'font-outfit');
  assert.equal(getBorderRadiusClass('lg'), 'rounded-2xl');
  assert.equal(getBorderRadiusClass('none'), 'rounded-none');
});

test('validateCreatorAccount catches missing required fields', () => {
  const invalid = validateCreatorAccount({
    profile: { username: '', displayName: '' } as any,
    user: { email: 'bademail' } as any,
  });
  assert.equal(invalid.valid, false);
  assert.equal(invalid.errors.length, 3);

  const valid = validateCreatorAccount({
    profile: { username: 'mariacreator', displayName: 'Maria Creator' } as any,
    user: { email: 'maria@example.com' } as any,
  });
  assert.equal(valid.valid, true);
  assert.equal(valid.errors.length, 0);
});
