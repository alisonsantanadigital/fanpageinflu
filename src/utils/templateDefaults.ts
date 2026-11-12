import {
  CreatorAccount,
  CreatorProfile,
  DesignSettings,
  FanLetter,
  GalleryItem,
  Post,
  ProductItem,
  SocialLink,
  TemplateId,
} from '../types/creator';

export function getTemplateDisplayName(templateId: TemplateId): string {
  switch (templateId) {
    case 'editorial-luxury':
      return '01. Editorial Luxury';
    case 'dark-creator':
      return '02. Dark Creator';
    case 'minimal-personal':
      return '03. Minimal Personal';
    case 'lifestyle-journal':
      return '04. Lifestyle Journal';
    case 'fashion-portfolio':
      return '05. Fashion Portfolio';
    case 'cinematic-story':
      return '06. Cinematic Story';
    default:
      return templateId;
  }
}

export function getDefaultDesignForTemplate(templateId: TemplateId): DesignSettings {
  if (templateId === 'dark-creator') {
    return {
      templateId: 'dark-creator',
      colors: {
        primary: '#8B5CF6',
        secondary: '#06B6D4',
        background: '#09090B',
        text: '#F4F4F5',
        buttonBg: '#8B5CF6',
        buttonText: '#FFFFFF',
        accent: '#EC4899',
        cardBg: '#18181B',
      },
      fonts: {
        titleFont: 'Outfit',
        bodyFont: 'Plus Jakarta Sans',
        titleSize: 'lg',
        titleWeight: 'semibold',
        letterSpacing: 'normal',
      },
      visual: {
        borderRadius: 'md',
        cardStyle: 'glass',
        animationStyle: 'smooth',
        enableGrain: false,
        enableGlow: true,
      },
    };
  }

  if (templateId === 'minimal-personal') {
    return {
      templateId: 'minimal-personal',
      colors: {
        primary: '#3F3F46',
        secondary: '#71717A',
        background: '#FAF9F6',
        text: '#18181B',
        buttonBg: '#18181B',
        buttonText: '#FAF9F6',
        accent: '#A16207',
        cardBg: '#FFFFFF',
      },
      fonts: {
        titleFont: 'Playfair Display',
        bodyFont: 'Plus Jakarta Sans',
        titleSize: 'lg',
        titleWeight: 'semibold',
        letterSpacing: 'normal',
      },
      visual: {
        borderRadius: 'lg',
        cardStyle: 'minimal',
        animationStyle: 'smooth',
        enableGrain: false,
        enableGlow: false,
      },
    };
  }

  return {
    templateId: templateId || 'editorial-luxury',
    colors: {
      primary: '#8F714B',
      secondary: '#C5A880',
      background: '#FAF7F2',
      text: '#1C1917',
      buttonBg: '#1C1917',
      buttonText: '#FAF7F2',
      accent: '#B45309',
      cardBg: '#FFFFFF',
    },
    fonts: {
      titleFont: 'Cormorant Garamond',
      bodyFont: 'Plus Jakarta Sans',
      titleSize: 'lg',
      titleWeight: 'semibold',
      letterSpacing: 'normal',
    },
    visual: {
      borderRadius: 'sm',
      cardStyle: 'bordered',
      animationStyle: 'smooth',
      enableGrain: true,
      enableGlow: false,
    },
  };
}

export interface DefaultAccountSections {
  profile: CreatorProfile;
  design: DesignSettings;
  links: SocialLink[];
  gallery: GalleryItem[];
  posts: Post[];
  letter: FanLetter;
  products: ProductItem[];
  publishedUrl: string;
  seo: CreatorAccount['seo'];
}

export function buildDefaultAccountSections(
  username: string,
  displayName: string,
  email: string,
  templateId: TemplateId,
  existingProfileId?: string,
  seedTimestamp: number = Date.now()
): DefaultAccountSections {
  const cleanSlug = username.replace(/^@+/, '').toLowerCase().trim();

  const defaultAvatar =
    templateId === 'dark-creator'
      ? '/src/assets/images/hero_lucas_dark_1794505736707.jpg'
      : templateId === 'minimal-personal'
      ? '/src/assets/images/hero_clara_minimal_1794505736987.jpg'
      : '/src/assets/images/hero_helena_editorial_1794505735939.jpg';

  const defaultCover =
    templateId === 'dark-creator'
      ? '/src/assets/images/hero_lucas_dark_1794505736707.jpg'
      : templateId === 'minimal-personal'
      ? '/src/assets/images/hero_clara_minimal_1794505736987.jpg'
      : '/src/assets/images/editorial_art_magazine_1794505737351.jpg';

  return {
    profile: {
      id: existingProfileId || `prof_${seedTimestamp}`,
      username: cleanSlug,
      displayName,
      tagline: 'Criador de Conteúdo & Entusiasta Digital',
      bio: 'Bem-vindo(a) ao meu universo pessoal na Creator World.',
      fullStory: 'Minha história, trajetória e projetos reunidos em um só lugar.',
      avatarUrl: defaultAvatar,
      coverUrl: defaultCover,
      location: 'Brasil',
      interests: ['Criação Digital', 'Fotografia', 'Projetos Criativos'],
      trajectory: [
        {
          year: '2026',
          title: 'Estreia na Creator World',
          description: 'Lançamento oficial da minha fan page e revista pessoal.',
        },
      ],
      instagramUsername: cleanSlug,
    },
    design: getDefaultDesignForTemplate(templateId),
    links: [
      {
        id: `link_${seedTimestamp}_1`,
        title: 'Meu Perfil no Instagram',
        url: `https://instagram.com/${cleanSlug}`,
        description: 'Acompanhe as atualizações e bastidores diários',
        icon: 'instagram',
        category: 'redes',
        isFeatured: true,
        isActive: true,
        order: 1,
        clicksCount: 0,
      },
      {
        id: `link_${seedTimestamp}_2`,
        title: 'Contato Profissional & Parcerias',
        url: `mailto:${email}`,
        description: 'Entre em contato para propostas comerciais e colaborações',
        icon: 'mail',
        category: 'contato',
        isFeatured: false,
        isActive: true,
        order: 2,
        clicksCount: 0,
      },
    ],
    gallery: [
      {
        id: `gal_${seedTimestamp}_1`,
        title: 'Momento Especial',
        type: 'photo',
        mediaUrl: defaultAvatar,
        caption: 'Registro fotográfico em alta resolução.',
        tags: ['Destaque', 'Criador'],
        category: 'Geral',
        date: '2026',
        aspectRatio: '16:9',
      },
    ],
    posts: [
      {
        id: `post_${seedTimestamp}_1`,
        slug: 'boas-vindas-ao-meu-espaco',
        title: 'Boas-vindas ao Meu Novo Espaço Pessoal',
        excerpt: 'Aqui reunirei artigos, novidades, bastidores e cartas exclusivas para você.',
        content: `É uma alegria imensa inaugurar minha própria fan page na Creator World. Este ambiente foi pensado para aproximar nossa comunidade de forma autêntica e sem filtros.\n\nFique à vontade para explorar os links, ler minhas publicações e me enviar uma mensagem.`,
        coverImage: defaultCover,
        date: 'Recente',
        readTime: '2 min de leitura',
        category: 'Novidades',
        published: true,
      },
    ],
    letter: {
      id: `letter_${seedTimestamp}`,
      title: 'Uma Carta para Você',
      teaser: 'Toque para abrir e ler a mensagem pessoal que escrevi.',
      text: `Olá!\n\nMuito obrigado por visitar meu site. Este projeto é a realização de um grande sonho: ter um cantinho digital autônomo e especial para compartilhar o que amo com as pessoas mais incríveis da internet.\n\nUm forte abraço!`,
      signature: displayName,
      date: '2026',
      waxSealColor: templateId === 'dark-creator' ? '#8B5CF6' : templateId === 'minimal-personal' ? '#A16207' : '#8F714B',
      envelopeStyle: templateId === 'dark-creator' ? 'noir' : templateId === 'minimal-personal' ? 'parchment' : 'classic',
    },
    products: [
      {
        id: `prod_${seedTimestamp}_1`,
        title: 'Consultoria / Produto Especial',
        description: 'Acesso ao meu conteúdo exclusivo ou mentoria 1-on-1.',
        price: 'R$ 199,00',
        benefits: ['Acesso imediato', 'Suporte direto', 'Material complementar'],
        imageUrl: '/src/assets/images/luxury_product_bottle_1794505738842.jpg',
        buyUrl: 'https://exemplo.com/checkout',
        badge: 'Novo',
        active: true,
      },
    ],
    publishedUrl: `/@${cleanSlug}`,
    seo: {
      metaTitle: `${displayName} — Fan Page Oficial`,
      metaDescription: `Acesse a biografia, links, produtos e revista pessoal de ${displayName}.`,
      ogImage: defaultAvatar,
    },
  };
}

/**
 * Resolves the original template ID chosen when the creator account was created.
 */
export function resolveOriginalTemplateId(
  account: CreatorAccount,
  demoAccounts: CreatorAccount[] = []
): TemplateId {
  if (account.initialTemplateId) {
    return account.initialTemplateId;
  }
  const demoMatch = demoAccounts.find(d => d.id === account.id);
  if (demoMatch) {
    return demoMatch.design.templateId;
  }
  return account.design.templateId;
}

/**
 * Resets both layout (design/template) and page content back to the original template
 * chosen at account creation time, preserving account identity metadata and analytics.
 */
export function restoreAccountToDefault(
  account: CreatorAccount,
  demoAccounts: CreatorAccount[] = []
): CreatorAccount {
  const demoMatch = demoAccounts.find(d => d.id === account.id);

  if (demoMatch) {
    const clonedDemo: CreatorAccount = JSON.parse(JSON.stringify(demoMatch));
    return {
      ...clonedDemo,
      initialTemplateId: demoMatch.initialTemplateId || demoMatch.design.templateId,
      initialUsername: demoMatch.initialUsername || demoMatch.profile.username,
      initialDisplayName: demoMatch.initialDisplayName || demoMatch.profile.displayName,
      analytics: account.analytics,
      instagramIntegration: demoMatch.instagramIntegration || account.instagramIntegration,
    };
  }

  const originalTemplateId = resolveOriginalTemplateId(account, demoAccounts);
  const originalUsername = account.initialUsername || account.profile.username;
  const originalDisplayName = account.initialDisplayName || account.profile.displayName;

  const defaults = buildDefaultAccountSections(
    originalUsername,
    originalDisplayName,
    account.user.email,
    originalTemplateId,
    account.profile.id
  );

  return {
    ...account,
    initialTemplateId: originalTemplateId,
    initialUsername: originalUsername,
    initialDisplayName: originalDisplayName,
    profile: defaults.profile,
    design: defaults.design,
    links: defaults.links,
    gallery: defaults.gallery,
    posts: defaults.posts,
    letter: defaults.letter,
    products: defaults.products,
    publishedUrl: defaults.publishedUrl,
    seo: defaults.seo,
  };
}
