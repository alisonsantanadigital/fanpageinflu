import { CreatorAccount, GalleryItem, Post, ProductItem, SocialLink, TemplateId } from '../types/creator';
import { sanitizeSlug } from './pureLogic';
import { getDefaultDesignForTemplate } from './templateDefaults';

export interface InstagramMediaInput {
  id?: string;
  caption?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM' | string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}

export interface InstagramAutofillPayload {
  username?: string;
  displayName?: string;
  biography?: string;
  profilePictureUrl?: string;
  followersCount?: number | string;
  media?: InstagramMediaInput[];
  promptNotes?: string;
}

export function generateFallbackCreator(
  briefing: string,
  handleOverride?: string,
  displayNameOverride?: string,
  bioOverride?: string
) {
  const lower = (briefing || '').toLowerCase();
  const isAudio =
    lower.includes('música') ||
    lower.includes('musica') ||
    lower.includes('áudio') ||
    lower.includes('audio') ||
    lower.includes('dj') ||
    lower.includes('sound');
  const isWellness =
    lower.includes('livro') ||
    lower.includes('escrit') ||
    lower.includes('bem-estar') ||
    lower.includes('podcast');

  const rawHandle = (handleOverride || '')
    .replace(/^@+/, '')
    .replace(/[^a-zA-Z0-9._]/g, '')
    .trim()
    .toLowerCase();
  const cleanHandle = handleOverride ? sanitizeSlug(handleOverride) : '';
  const cleanBioText = (bioOverride || '').trim();
  const safeBriefingBio =
    !briefing.includes('Instagram: @') && briefing.trim().length > 15
      ? briefing.trim().slice(0, 220)
      : '';

  if (isAudio) {
    const name = displayNameOverride || 'Matheus Kross';
    const user = cleanHandle || 'matheuskross';
    const igHandle = rawHandle || user;
    return {
      displayName: name,
      username: user,
      tagline: 'Produtor Musical, DJ & Engenheiro de Som',
      bio:
        cleanBioText ||
        safeBriefingBio ||
        'Explorando novas fronteiras entre música eletrônica analógica, sintetizadores modulares e inteligência sonora.',
      fullStory:
        'Iniciei minha jornada gravando em estúdios underground aos 17 anos. Hoje, minhas faixas e soundscapes tocam em palcos internacionais e compõem trilhas para documentários premiados.',
      location: 'São Paulo & Berlim',
      interests: [
        'Sintetizadores Modulares',
        'Sound Design Cinematográfico',
        'Gravação em Fita',
        'Música Imersiva',
      ],
      trajectory: [
        {
          year: '2019',
          title: 'Primeiro EP Independente',
          description: 'Mais de 2 milhões de streams orgânicos no Spotify.',
        },
        {
          year: '2022',
          title: 'Turnê Europeia de Live Sets',
          description: 'Apresentações em festivais em Amsterdã e Berlim.',
        },
        {
          year: '2026',
          title: 'Lançamento do Sound Pack Vol. 1',
          description: 'Banco de timbres analógicos para produtores.',
        },
      ],
      templateId: 'dark-creator',
      links: [
        {
          title: `Instagram @${igHandle}`,
          url: `https://instagram.com/${igHandle}`,
          description: 'Bastidores diários, stories e lançamentos',
          category: 'redes',
          isFeatured: true,
        },
        {
          title: 'Ouça no Spotify',
          url: 'https://spotify.com',
          description: 'Último single e discografia oficial',
          category: 'conteudos',
          isFeatured: true,
        },
        {
          title: 'Sound Pack Analógico 2026',
          url: 'https://exemplo.com/pack',
          description: 'Mais de 300 samples exclusivos',
          category: 'produtos',
          isFeatured: false,
        },
        {
          title: 'Comunidade no Discord',
          url: 'https://discord.com',
          description: 'Troca de presets e networking',
          category: 'comunidade',
          isFeatured: false,
        },
      ],
      posts: [
        {
          title: 'A Arte da Mixagem Imersiva com Sintetizadores',
          slug: 'mixagem-imersiva-sintetizadores',
          excerpt:
            'Como esculpir frequências para criar sensações de espaço tridimensional no ouvinte.',
          content:
            'O som é mais do que vibração de ar; é arquitetura emocional. Quando trabalhamos com filtros analógicos, cada ressonância gera calor harmônico que conecta com o sistema nervoso.',
          category: 'Produção',
          readTime: '5 min',
        },
      ],
      letter: {
        title: 'Mensagem aos Exploradores de Frequência',
        teaser: 'Toque para abrir minha carta sobre os desafios de viver da própria arte.',
        text: 'A todos vocês que apoiam cada lançamento e me mandam mensagens de incentivo: este som existe por causa de vocês. Obrigado por compartilharem essa jornada sonora comigo!',
        signature: name,
        waxSealColor: '#8B5CF6',
      },
      products: [
        {
          title: 'Kross Modular Sample Pack',
          description: '400+ loops e One-Shots capturados em sintetizadores modulares raros.',
          price: 'R$ 180,00',
          benefits: ['Royalty Free', '24-bit 96kHz WAV', 'Presets exclusivos para Serum'],
          buyUrl: 'https://exemplo.com/buy/pack',
          badge: 'Mais Vendido',
          format: 'Download Imediato',
        },
      ],
    };
  }

  const name = displayNameOverride || (rawHandle ? `@${rawHandle}` : cleanHandle ? `@${cleanHandle}` : 'Mariana Duarte');
  const user = cleanHandle || 'marianaduarte';
  const igHandle = rawHandle || user;

  return {
    displayName: name,
    username: user,
    tagline: displayNameOverride
      ? `Direção Criativa, Curadoria Visual & Comunidade (@${igHandle})`
      : 'Autora, Criadora Editorial & Pesquisadora Visual',
    bio:
      cleanBioText ||
      safeBriefingBio ||
      'Narrando histórias sobre estilo, rotina criativa, viagens e o poder dos detalhes cotidianos.',
    fullStory:
      'Construí minha comunidade compartilhando referências autênticas, bastidores sem filtro e projetos que conectam estética, propósito e vida real. Aqui reúno meu acervo visual, links principais, revista pessoal e novidades exclusivas.',
    location: 'São Paulo, Brasil',
    interests: [
      'Fotografia & Estética',
      'Curadoria Visual',
      'Comunidade',
      'Projetos Autorais',
      'Lifestyle',
    ],
    trajectory: [
      {
        year: '2022',
        title: 'Início da Comunidade no Instagram',
        description: 'Construção de audiência engajada compartilhando rotina e curadoria visual.',
      },
      {
        year: '2024',
        title: 'Lançamento de Projetos & Colabs',
        description: 'Parcerias criativas e lançamentos exclusivos com marcas alinhadas.',
      },
      {
        year: '2026',
        title: 'Estreia da Fan Page Oficial',
        description: 'Espaço independente com revista pessoal, galeria e links selecionados.',
      },
    ],
    templateId: isWellness ? 'minimal-personal' : 'editorial-luxury',
    links: [
      {
        title: `Instagram Oficial @${igHandle}`,
        url: `https://instagram.com/${igHandle}`,
        description: 'Acompanhe meus stories, reels e registros diários',
        category: 'redes',
        isFeatured: true,
      },
      {
        title: 'Novidades & Conteúdos Exclusivos',
        url: `https://instagram.com/${igHandle}`,
        description: 'Bastidores, ensaios e projetos recentes',
        category: 'conteudos',
        isFeatured: true,
      },
      {
        title: 'Produtos & Indicações Selecionadas',
        url: 'https://exemplo.com/produtos',
        description: 'Curadoria com meus itens e lançamentos favoritos',
        category: 'produtos',
        isFeatured: false,
      },
      {
        title: 'Contato para Parcerias & Publicidade',
        url: 'mailto:contato@exemplo.com',
        description: 'Assessoria comercial e convites para campanhas',
        category: 'parcerias',
        isFeatured: false,
      },
    ],
    posts: [
      {
        title: 'Bastidores dos Últimos Registros e Projetos',
        slug: 'bastidores-ultimos-registros',
        excerpt: 'Um olhar mais próximo sobre as referências visuais e ideias por trás do meu trabalho.',
        content:
          'Cada foto e história compartilhada nasce de observação cuidadosa do cotidiano. Este espaço existe para aprofundar o que muitas vezes passa rápido pelo feed.',
        category: 'Editorial',
        readTime: '4 min de leitura',
      },
    ],
    letter: {
      title: 'Uma Carta Aberta Para Quem Me Acompanha',
      teaser: 'Abra este envelope para ler a mensagem especial que preparei para você.',
      text: 'Muito obrigado por fazer parte dessa jornada! Este cantinho reúne tudo o que crio com mais carinho fora do ritmo acelerado das redes. Fique à vontade para explorar cada detalhe.',
      signature: name,
      waxSealColor: '#8F714B',
    },
    products: [
      {
        title: 'Curadoria & Guia Digital Exclusivo',
        description: 'Material autoral reunindo referências, recomendações e processos criativos.',
        price: 'R$ 89,00',
        benefits: ['Acesso imediato', 'Atualizações contínuas', 'Conteúdo exclusivo para fãs'],
        buyUrl: 'https://exemplo.com/comprar',
        badge: 'Destaque',
        format: 'Digital',
      },
    ],
  };
}

export function applyGeneratedAndInstagramToAccount(
  activeAccount: CreatorAccount,
  generated: Record<string, any>,
  instagram?: {
    username?: string;
    profilePictureUrl?: string;
    media?: InstagramMediaInput[];
    connectedAt?: string;
  }
): CreatorAccount {
  const timestamp = Date.now();
  const validTemplates: TemplateId[] = [
    'editorial-luxury',
    'dark-creator',
    'minimal-personal',
    'lifestyle-journal',
    'fashion-portfolio',
    'cinematic-story',
    'modern-magazine',
    'bold-creator',
    'professional-identity',
    'artistic-experience',
  ];

  const requestedTemplate = generated.templateId as TemplateId;
  const templateId = validTemplates.includes(requestedTemplate)
    ? requestedTemplate
    : activeAccount.design.templateId;

  const rawIgHandle = (instagram?.username || '')
    .replace(/^@+/, '')
    .replace(/[^a-zA-Z0-9._]/g, '')
    .trim()
    .toLowerCase();
  const updatedUsername =
    sanitizeSlug(rawIgHandle || generated.username || activeAccount.profile.username) ||
    activeAccount.profile.username;
  const effectiveIgHandle = rawIgHandle || updatedUsername;

  const mediaList = (instagram?.media || []).filter(
    (m) => Boolean(m.media_url || m.thumbnail_url)
  );

  const photoUrls = mediaList
    .map((m) => (m.media_type === 'VIDEO' ? m.thumbnail_url || m.media_url : m.media_url || m.thumbnail_url))
    .filter((u): u is string => Boolean(u));

  const resolvedAvatar =
    instagram?.profilePictureUrl ||
    photoUrls[0] ||
    activeAccount.profile.avatarUrl;

  const resolvedCover =
    photoUrls[1] ||
    photoUrls[0] ||
    instagram?.profilePictureUrl ||
    activeAccount.profile.coverUrl;

  const galleryItems: GalleryItem[] =
    mediaList.length > 0
      ? mediaList.map((item, idx) => {
          const isVideo = item.media_type === 'VIDEO';
          const url = (isVideo ? item.thumbnail_url || item.media_url : item.media_url || item.thumbnail_url) || resolvedCover;
          const cleanCaption = (item.caption || '').trim();
          const firstSentence = cleanCaption.split('\n')[0]?.slice(0, 56) || `Registro #${idx + 1}`;
          return {
            id: `gal_ig_${timestamp}_${idx}`,
            title: firstSentence,
            type: isVideo ? 'video' : 'photo',
            mediaUrl: url,
            thumbnail: item.thumbnail_url,
            caption: cleanCaption || `Publicação importada do Instagram @${effectiveIgHandle}.`,
            tags: ['Instagram', `@${effectiveIgHandle}`],
            category: 'Instagram',
            date: item.timestamp
              ? new Date(item.timestamp).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })
              : 'Recente',
            aspectRatio: idx === 0 ? '16:9' : '1:1',
          };
        })
      : activeAccount.gallery;

  const mappedPosts: Post[] =
    Array.isArray(generated.posts) && generated.posts.length > 0
      ? generated.posts.map((p: any, idx: number) => ({
          id: `post_ai_${timestamp}_${idx}`,
          slug: p.slug || `artigo-${timestamp}-${idx}`,
          title: p.title || 'Nova Publicação',
          excerpt: p.excerpt || '',
          content: p.content || '',
          coverImage: photoUrls[idx % Math.max(photoUrls.length, 1)] || resolvedCover,
          date: 'Recente',
          readTime: p.readTime || '4 min de leitura',
          category: p.category || 'Editorial',
          externalUrl: mediaList[idx]?.permalink,
          published: true,
        }))
      : activeAccount.posts;

  const mappedLinks: SocialLink[] =
    Array.isArray(generated.links) && generated.links.length > 0
      ? generated.links.map((l: any, idx: number) => ({
          id: `link_ai_${timestamp}_${idx}`,
          title: l.title || 'Link',
          url: l.url || `https://instagram.com/${effectiveIgHandle}`,
          description: l.description || '',
          icon: l.category === 'redes' ? 'instagram' : 'sparkles',
          category: l.category || 'conteudos',
          isFeatured: Boolean(l.isFeatured),
          isActive: true,
          order: idx + 1,
          clicksCount: 0,
        }))
      : activeAccount.links;

  const mappedProducts: ProductItem[] =
    Array.isArray(generated.products) && generated.products.length > 0
      ? generated.products.map((prod: any, idx: number) => ({
          id: `prod_ai_${timestamp}_${idx}`,
          title: prod.title || 'Produto Especial',
          description: prod.description || '',
          price: prod.price || 'R$ 149,00',
          benefits: Array.isArray(prod.benefits) ? prod.benefits : [],
          imageUrl: photoUrls[(idx + 2) % Math.max(photoUrls.length, 1)] || '/assets/images/luxury_product_bottle_1794505738842.jpg',
          buyUrl: prod.buyUrl || 'https://exemplo.com',
          badge: prod.badge,
          format: prod.format,
          active: true,
        }))
      : activeAccount.products;

  const displayName = generated.displayName || activeAccount.profile.displayName;
  const tagline = generated.tagline || activeAccount.profile.tagline;

  return {
    ...activeAccount,
    profile: {
      ...activeAccount.profile,
      username: updatedUsername,
      displayName,
      tagline,
      bio: generated.bio || activeAccount.profile.bio,
      fullStory: generated.fullStory || activeAccount.profile.fullStory,
      avatarUrl: resolvedAvatar,
      coverUrl: resolvedCover,
      location: generated.location || activeAccount.profile.location,
      interests:
        Array.isArray(generated.interests) && generated.interests.length > 0
          ? generated.interests
          : activeAccount.profile.interests,
      trajectory:
        Array.isArray(generated.trajectory) && generated.trajectory.length > 0
          ? generated.trajectory
          : activeAccount.profile.trajectory,
      instagramUsername: effectiveIgHandle,
    },
    design: getDefaultDesignForTemplate(templateId),
    links: mappedLinks,
    gallery: galleryItems,
    posts: mappedPosts,
    letter: generated.letter
      ? {
          ...activeAccount.letter,
          title: generated.letter.title || activeAccount.letter.title,
          teaser: generated.letter.teaser || activeAccount.letter.teaser,
          text: generated.letter.text || activeAccount.letter.text,
          signature: generated.letter.signature || displayName,
          waxSealColor: generated.letter.waxSealColor || activeAccount.letter.waxSealColor,
          photoUrl: photoUrls[0] || activeAccount.letter.photoUrl,
        }
      : activeAccount.letter,
    products: mappedProducts,
    publishedUrl: `/@${updatedUsername}`,
    seo: {
      metaTitle: `${displayName} — Fan Page Oficial`,
      metaDescription: tagline,
      ogImage: resolvedAvatar,
    },
    instagramIntegration: instagram?.username
      ? {
          connected: true,
          connectedAt: instagram.connectedAt || new Date().toISOString().split('T')[0],
          handle: effectiveIgHandle,
          autoSync: true,
        }
      : activeAccount.instagramIntegration,
  };
}

export function decodeHtmlEntities(input: string): string {
  if (!input) return '';
  return input
    .replace(/&#x([0-9a-fA-F]+);/g, (_m, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch {
        return '';
      }
    })
    .replace(/&#(\d+);/g, (_m, dec) => {
      try {
        return String.fromCodePoint(parseInt(dec, 10));
      } catch {
        return '';
      }
    })
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

export interface ParsedInstagramOgProfile {
  username: string;
  displayName: string;
  profilePictureUrl: string;
  biography: string;
  followersText: string;
}

export function parseInstagramOgProfile(html: string, handle: string): ParsedInstagramOgProfile {
  const cleanHandle = handle.replace(/^@+/, '').trim().toLowerCase();
  const extractMeta = (attrName: string, attrValue: string): string => {
    const regex1 = new RegExp(
      `<meta[^>]*${attrName}=["']${attrValue}["'][^>]*content=["']([^"']*)["'][^>]*>`,
      'i'
    );
    const regex2 = new RegExp(
      `<meta[^>]*content=["']([^"']*)["'][^>]*${attrName}=["']${attrValue}["'][^>]*>`,
      'i'
    );
    const raw = html.match(regex1)?.[1] || html.match(regex2)?.[1] || '';
    return decodeHtmlEntities(raw).trim();
  };

  const ogTitle = extractMeta('property', 'og:title');
  const ogImage = extractMeta('property', 'og:image');
  const ogDescription = extractMeta('property', 'og:description');
  const metaDescription = extractMeta('name', 'description');

  // Format: "Name (@handle) • Instagram photos and videos"
  let displayName = '';
  const titleMatch = ogTitle.match(/^(.*?)\s*\(@[^)]+\)/);
  if (titleMatch?.[1]) {
    displayName = titleMatch[1].trim();
  }

  let followersText = '';
  const followersMatch = ogDescription.match(/^([^-]+?)\s*-\s*See Instagram/i);
  if (followersMatch?.[1]) {
    followersText = followersMatch[1].trim();
  }

  // Extract bio quote if present in description ("... on Instagram: \"bio\"")
  let biography = '';
  const bioQuoteMatch = (metaDescription || ogDescription).match(/on Instagram:\s*["“]([\s\S]*?)["”]$/i);
  if (bioQuoteMatch?.[1]) {
    biography = bioQuoteMatch[1].trim();
  }

  return {
    username: cleanHandle,
    displayName,
    profilePictureUrl: ogImage,
    biography,
    followersText,
  };
}

