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
import {
  buildDefaultAccountSections,
  getDefaultDesignForTemplate,
  getTemplateDisplayName,
  resolveOriginalTemplateId,
  restoreAccountToDefault,
} from './templateDefaults';
import { CreatorAccount, SocialLink } from '../types/creator';

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

test('restoreAccountToDefault restores user-created account to original creation template and content', () => {
  const initialDefaults = buildDefaultAccountSections(
    'marinaandrade',
    'Marina Andrade',
    'marina@example.com',
    'dark-creator',
    'prof_marina',
    1000
  );

  const createdAccount: CreatorAccount = {
    id: 'creator_marina',
    initialTemplateId: 'dark-creator',
    initialUsername: 'marinaandrade',
    initialDisplayName: 'Marina Andrade',
    user: { id: 'usr_marina', email: 'marina@example.com', role: 'creator' },
    profile: initialDefaults.profile,
    design: initialDefaults.design,
    links: initialDefaults.links,
    gallery: initialDefaults.gallery,
    posts: initialDefaults.posts,
    letter: initialDefaults.letter,
    products: initialDefaults.products,
    analytics: {
      totalViews: 42,
      linkClicks: 7,
      letterOpens: 3,
      productViews: 5,
      dailyStats: [{ date: 'Hoje', views: 42 }],
    },
    isPublished: true,
    publishedUrl: initialDefaults.publishedUrl,
    seo: initialDefaults.seo,
  };

  // Simulate heavy editing: switch template, change colors, fonts, identity, links, and posts
  const modifiedAccount: CreatorAccount = {
    ...createdAccount,
    profile: {
      ...createdAccount.profile,
      displayName: 'Nome Editado',
      bio: 'Bio totalmente modificada',
    },
    design: {
      ...getDefaultDesignForTemplate('minimal-personal'),
      colors: {
        ...getDefaultDesignForTemplate('minimal-personal').colors,
        primary: '#FF0000',
      },
    },
    links: [],
    posts: [],
  };

  const restored = restoreAccountToDefault(modifiedAccount, []);

  assert.equal(restored.design.templateId, 'dark-creator');
  assert.equal(restored.design.colors.primary, '#8B5CF6');
  assert.equal(restored.design.fonts.titleFont, 'Outfit');
  assert.equal(restored.profile.displayName, 'Marina Andrade');
  assert.equal(restored.profile.bio, 'Bem-vindo(a) ao meu universo pessoal na Creator World.');
  assert.equal(restored.links.length, 2);
  assert.equal(restored.posts.length, 1);
  assert.equal(restored.analytics.totalViews, 42);
  assert.equal(getTemplateDisplayName(restored.design.templateId), '02. Dark Creator');
});

test('restoreAccountToDefault restores demo account using demo snapshot even if initialTemplateId was missing', () => {
  const demoDefaults = buildDefaultAccountSections(
    'helenavogue',
    'Helena Salles',
    'helena@voguecreators.com',
    'editorial-luxury',
    'prof_helena',
    1000
  );

  const demoAccount: CreatorAccount = {
    id: 'creator_helena_salles',
    initialTemplateId: 'editorial-luxury',
    initialUsername: 'helenavogue',
    initialDisplayName: 'Helena Salles',
    user: { id: 'usr_helena', email: 'helena@voguecreators.com', role: 'creator' },
    profile: demoDefaults.profile,
    design: demoDefaults.design,
    links: demoDefaults.links,
    gallery: demoDefaults.gallery,
    posts: demoDefaults.posts,
    letter: demoDefaults.letter,
    products: demoDefaults.products,
    analytics: {
      totalViews: 100,
      linkClicks: 10,
      letterOpens: 5,
      productViews: 2,
      dailyStats: [],
    },
    isPublished: true,
    publishedUrl: '/@helenavogue',
    seo: demoDefaults.seo,
  };

  // Legacy modified account without initialTemplateId field
  const modifiedLegacy: CreatorAccount = {
    ...demoAccount,
    initialTemplateId: undefined,
    design: getDefaultDesignForTemplate('dark-creator'),
    profile: {
      ...demoAccount.profile,
      displayName: 'Helena Alterada',
    },
    analytics: {
      totalViews: 999,
      linkClicks: 10,
      letterOpens: 5,
      productViews: 2,
      dailyStats: [],
    },
  };

  assert.equal(resolveOriginalTemplateId(modifiedLegacy, [demoAccount]), 'editorial-luxury');

  const restored = restoreAccountToDefault(modifiedLegacy, [demoAccount]);
  assert.equal(restored.design.templateId, 'editorial-luxury');
  assert.equal(restored.profile.displayName, 'Helena Salles');
  assert.equal(restored.analytics.totalViews, 999);
});

import {
  applyGeneratedAndInstagramToAccount,
  decodeHtmlEntities,
  generateFallbackCreator,
  parseInstagramOgProfile,
} from './creatorMapper';

test('applyGeneratedAndInstagramToAccount populates Instagram photos and AI-generated fields immediately', () => {
  const baseDefaults = buildDefaultAccountSections(
    'criador_teste',
    'Criador Teste',
    'criador@example.com',
    'editorial-luxury',
    'prof_teste',
    1000
  );

  const baseAccount: CreatorAccount = {
    id: 'creator_ig_test',
    initialTemplateId: 'editorial-luxury',
    initialUsername: 'criador_teste',
    initialDisplayName: 'Criador Teste',
    user: { id: 'usr_teste', email: 'criador@example.com', role: 'creator' },
    profile: baseDefaults.profile,
    design: baseDefaults.design,
    links: baseDefaults.links,
    gallery: baseDefaults.gallery,
    posts: baseDefaults.posts,
    letter: baseDefaults.letter,
    products: baseDefaults.products,
    analytics: {
      totalViews: 10,
      linkClicks: 2,
      letterOpens: 1,
      productViews: 0,
      dailyStats: [],
    },
    isPublished: true,
    publishedUrl: '/@criador_teste',
    seo: baseDefaults.seo,
  };

  const generated = generateFallbackCreator(
    'Produtor musical em São Paulo',
    'lucas_beats',
    'Lucas Beats'
  );

  const updated = applyGeneratedAndInstagramToAccount(baseAccount, generated, {
    username: 'Lucas.Beats!',
    profilePictureUrl: 'https://cdn.example.com/avatar.jpg',
    connectedAt: '2026-11-12',
    media: [
      {
        id: 'm1',
        media_type: 'IMAGE',
        media_url: 'https://cdn.example.com/photo1.jpg',
        caption: 'Noite no estúdio gravando sintetizadores',
        permalink: 'https://instagram.com/p/m1',
        timestamp: '2026-11-10T12:00:00.000Z',
      },
      {
        id: 'm2',
        media_type: 'IMAGE',
        media_url: 'https://cdn.example.com/photo2.jpg',
        caption: 'Novo live set em Lisboa',
        permalink: 'https://instagram.com/p/m2',
        timestamp: '2026-11-11T12:00:00.000Z',
      },
    ],
  });

  assert.equal(updated.profile.username, 'lucas-beats');
  assert.equal(updated.profile.instagramUsername, 'lucas.beats');
  assert.equal(updated.profile.displayName, 'Lucas Beats');
  assert.equal(updated.profile.avatarUrl, 'https://cdn.example.com/avatar.jpg');
  assert.equal(updated.profile.coverUrl, 'https://cdn.example.com/photo2.jpg');
  assert.equal(updated.gallery.length, 2);
  assert.equal(updated.gallery[0].mediaUrl, 'https://cdn.example.com/photo1.jpg');
  assert.equal(updated.gallery[0].title, 'Noite no estúdio gravando sintetizadores');
  assert.equal(updated.posts[0].coverImage, 'https://cdn.example.com/photo1.jpg');
  assert.equal(updated.letter.photoUrl, 'https://cdn.example.com/photo1.jpg');
  assert.equal(updated.seo?.ogImage, 'https://cdn.example.com/avatar.jpg');
  assert.equal(updated.publishedUrl, '/@lucas-beats');
  assert.equal(updated.instagramIntegration?.connected, true);
  assert.equal(updated.instagramIntegration?.handle, 'lucas.beats');
});

test('decodeHtmlEntities and parseInstagramOgProfile extract real profile metadata accurately', () => {
  assert.equal(
    decodeHtmlEntities('Prumo Creators | Parcerias e Influ&#xea;ncia (&#064;prumocreators) &amp; Co'),
    'Prumo Creators | Parcerias e Influência (@prumocreators) & Co'
  );

  const sampleHtml = `
    <html>
      <head>
        <meta property="og:title" content="Prumo Creators | Parcerias e Influ&#xea;ncia (&#064;prumocreators) &#x2022; Instagram photos and videos" />
        <meta property="og:image" content="https://scontent.cdninstagram.com/v/avatar.jpg?oh=123&amp;oe=456" />
        <meta property="og:description" content="119 Followers, 13 Following, 6 Posts - See Instagram photos and videos from Prumo Creators | Parcerias e Influ&#xea;ncia (&#064;prumocreators)" />
        <meta name="description" content="119 Followers, 13 Following, 6 Posts - Prumo Creators on Instagram: &quot;Conectando marcas e criadores.&quot;" />
      </head>
    </html>
  `;

  const parsed = parseInstagramOgProfile(sampleHtml, '@PrumoCreators');
  assert.equal(parsed.username, 'prumocreators');
  assert.equal(parsed.displayName, 'Prumo Creators | Parcerias e Influência');
  assert.equal(parsed.profilePictureUrl, 'https://scontent.cdninstagram.com/v/avatar.jpg?oh=123&oe=456');
  assert.equal(parsed.followersText, '119 Followers, 13 Following, 6 Posts');
  assert.equal(parsed.biography, 'Conectando marcas e criadores.');
});


