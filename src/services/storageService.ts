import { CreatorAccount } from '../types/creator';
import {
  buildDefaultAccountSections,
  restoreAccountToDefault,
} from '../utils/templateDefaults';

const STORAGE_KEY = 'creator_world_accounts_v1';
const ACTIVE_CREATOR_KEY = 'creator_world_active_creator_username';

export const INITIAL_DEMO_ACCOUNTS: CreatorAccount[] = [
  {
    id: 'creator_helena_salles',
    initialTemplateId: 'editorial-luxury',
    initialUsername: 'helenavogue',
    initialDisplayName: 'Helena Salles',
    user: {
      id: 'usr_helena',
      email: 'helena@voguecreators.com',
      role: 'creator',
    },
    profile: {
      id: 'prof_helena',
      username: 'helenavogue',
      displayName: 'Helena Salles',
      tagline: 'Diretora Criativa, Curadora de Estilo & Crítica de Moda',
      bio: 'Especialista em alta-costura, design editorial e estética contemporânea. Construo narrativas visuais entre Paris e São Paulo.',
      fullStory: 'Com mais de uma década atuando entre editoriais em Paris, semanas de moda em Milão e projetos especiais para grandes marcas globais, dedico meu espaço a celebrar o artesanato, a proporção e a arte de se vestir com propósito.',
      avatarUrl: '/src/assets/images/hero_helena_editorial_1794505735939.jpg',
      coverUrl: '/src/assets/images/editorial_art_magazine_1794505737351.jpg',
      location: 'Paris / São Paulo',
      interests: ['Alta-Costura', 'Arquitetura Brutalista', 'Fotografia Analógica', 'Cerâmica', 'Design Escandinavo'],
      trajectory: [
        { year: '2016', title: 'Graduação em Artes Visuais', description: 'Formação em Belas Artes com foco em história da indumentária e teoria da cor.' },
        { year: '2019', title: 'Paris Fashion Week Atelier', description: 'Atuação como assistente de styling em duas temporadas parisienses de alta-costura.' },
        { year: '2022', title: 'Lançamento do Studio Salles', description: 'Fundação do estúdio de consultoria de imagem e curadoria editorial.' },
        { year: '2025', title: 'Livro "Elegância Estruturada"', description: 'Best-seller independente com mais de 30 mil cópias vendidas na América Latina.' },
      ],
      instagramUsername: 'helenasalles.studio',
      tiktokUsername: 'helenasalles',
      youtubeUrl: 'https://youtube.com',
    },
    design: {
      templateId: 'editorial-luxury',
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
        titleSize: 'xl',
        titleWeight: 'normal',
        letterSpacing: 'wide',
      },
      visual: {
        borderRadius: 'sm',
        cardStyle: 'bordered',
        animationStyle: 'cinematic',
        enableGrain: true,
        enableGlow: false,
      },
    },
    links: [
      {
        id: 'link_h1',
        title: 'Editorial: O Novo Silêncio do Luxo',
        url: 'https://substack.com',
        description: 'Ensaio exclusivo publicado na minha newsletter mensal',
        icon: 'book-open',
        category: 'conteudos',
        isFeatured: true,
        isActive: true,
        order: 1,
        clicksCount: 1420,
      },
      {
        id: 'link_h2',
        title: 'Masterclass: Curadoria & Estilo Pessoal',
        url: 'https://hotmart.com',
        description: 'Vagas abertas para a turma de outono (últimas 12 vagas)',
        icon: 'sparkles',
        category: 'produtos',
        isFeatured: true,
        isActive: true,
        order: 2,
        clicksCount: 2890,
      },
      {
        id: 'link_h3',
        title: 'Instagram @helenasalles.studio',
        url: 'https://instagram.com',
        description: 'Bastidores diários, referências e insights de moda',
        icon: 'instagram',
        category: 'redes',
        isFeatured: false,
        isActive: true,
        order: 3,
        clicksCount: 840,
      },
      {
        id: 'link_h4',
        title: 'Clube dos Leitores & Fórum Privado',
        url: 'https://discord.com',
        description: 'Encontros quinzenais e debates com a comunidade',
        icon: 'users',
        category: 'comunidade',
        isFeatured: false,
        isActive: true,
        order: 4,
        clicksCount: 530,
      },
      {
        id: 'link_h5',
        title: 'Assessoria de Imprensa & Comercial',
        url: 'mailto:contato@helenasalles.com',
        description: 'Para parcerias, palestras e campanhas publicitárias',
        icon: 'mail',
        category: 'contato',
        isFeatured: false,
        isActive: true,
        order: 5,
        clicksCount: 310,
      },
    ],
    gallery: [
      {
        id: 'gal_h1',
        title: 'Atelier em Paris — Luz Matinal',
        type: 'photo',
        mediaUrl: '/src/assets/images/hero_helena_editorial_1794505735939.jpg',
        caption: 'Momentos de estudo e curadoria de tecidos antes do desfile.',
        tags: ['Paris', 'Atelier', 'Editorial'],
        category: 'Backstage',
        date: 'Outubro 2026',
        aspectRatio: '16:9',
      },
      {
        id: 'gal_h2',
        title: 'Campanha Silhueta Escultórica',
        type: 'photo',
        mediaUrl: '/src/assets/images/editorial_art_magazine_1794505737351.jpg',
        caption: 'Ensaio fotográfico explorando a harmonia entre corpo e concreto.',
        tags: ['Arquitetura', 'Campanha', 'Moda'],
        category: 'Campanhas',
        date: 'Setembro 2026',
        aspectRatio: '4:3',
      },
      {
        id: 'gal_h3',
        title: 'Fragrância Aurélia — Detalhe',
        type: 'photo',
        mediaUrl: '/src/assets/images/luxury_product_bottle_1794505738842.jpg',
        caption: 'Concepção do vidro em formato minimalista com tampa em nogueira.',
        tags: ['Design', 'Perfume', 'Criação'],
        category: 'Produtos',
        date: 'Agosto 2026',
        aspectRatio: '1:1',
      },
    ],
    posts: [
      {
        id: 'post_h1',
        slug: 'a-arte-da-silhueta-contemporanea',
        title: 'A Arte da Silhueta Contemporânea na Alta-Costura',
        excerpt: 'Como o minimalismo escultural e as fibras sustentáveis estão redefinindo as passarelas parisienses.',
        content: `A elegância nunca foi sobre excesso; pelo contrário, sempre foi sobre a coragem de subtrair. Quando observamos os mestres do corte clássico, como Cristobal Balenciaga e Madeleine Vionnet, percebemos que a maestria reside na gravidade e no caimento do tecido.\n\nNesta temporada, presenciei em primeira mão a transição de tecidos pesados para fibras inteligentes que respiram e se adaptam à iluminação natural. A moda é, acima de tudo, um espelho da sociedade que desejamos construir: atenta, consciente e duradoura.`,
        coverImage: '/src/assets/images/editorial_art_magazine_1794505737351.jpg',
        date: '10 de Novembro, 2026',
        readTime: '5 min de leitura',
        category: 'Editorial',
        published: true,
      },
      {
        id: 'post_h2',
        slug: 'diario-de-paris-haute-couture',
        title: 'Diário de Paris: Notas do Caderno de Desenho',
        excerpt: 'Bastidores, impressões íntimas e os detalhes que as câmeras dos grandes eventos deixam passar.',
        content: `Acordar às seis da manhã na Rue de Rivoli tem um ritmo particular. O aroma de café fresco misturado à neblina sobre o Sena dá o tom do dia.\n\nNos ateliês, as costureiras trabalham em silêncio absoluto. Cada prega feita à mão leva até quarenta horas de atenção minuciosa. Estar aqui é reaprender a valorizar o tempo humano.`,
        coverImage: '/src/assets/images/hero_helena_editorial_1794505735939.jpg',
        date: '28 de Outubro, 2026',
        readTime: '4 min de leitura',
        category: 'Diário',
        published: true,
      },
    ],
    letter: {
      id: 'letter_h1',
      title: 'Uma Carta Aberta aos Meus Queridos Leitores',
      teaser: 'Abra este envelope para ler minha mensagem pessoal de agradecimento e reflexão sobre este ano.',
      text: `Se você está lendo isso, saiba que cada palavra que compartilho aqui é escrita com o coração aberto.\n\nQuando criei este espaço independente, meu desejo era fugir do barulho dos algoritmos e construir um porto seguro para quem ainda acredita na beleza, na gentileza e no detalhe. Obrigado por acompanhar minha jornada, por comentar nos meus ensaios e por inspirar o meu olhar todos os dias.\n\nCom todo meu afeto e admiração,`,
      signature: 'Helena Salles',
      date: 'Novembro de 2026',
      waxSealColor: '#8F714B',
      envelopeStyle: 'classic',
    },
    products: [
      {
        id: 'prod_h1',
        title: 'Aurélia Eau de Parfum — 100ml',
        description: 'Fragrância autoral com notas de bergamota da Calábria, figo seco, cedro e flor de laranjeira.',
        price: 'R$ 480,00',
        benefits: ['Fragrância unissex de longa duração', 'Ingredientes botânicos de colheita sustentável', 'Vidro recarregável artesanal'],
        imageUrl: '/src/assets/images/luxury_product_bottle_1794505738842.jpg',
        buyUrl: 'https://exemplo.com/comprar/aurelia',
        badge: 'Edição Limitada',
        active: true,
      },
      {
        id: 'prod_h2',
        title: 'Livro de Arte: Elegância Estruturada',
        description: 'Edição de colecionador em capa dura com 240 páginas de fotografia editorial e textos reflexivos.',
        price: 'R$ 195,00',
        benefits: ['Papel couchê fosco 170g', 'Textos inéditos e ensaios fotográficos', 'Acompanha marca-páginas em linho'],
        imageUrl: '/src/assets/images/editorial_art_magazine_1794505737351.jpg',
        buyUrl: 'https://exemplo.com/comprar/livro',
        badge: 'Best Seller',
        active: true,
      },
    ],
    analytics: {
      totalViews: 48920,
      linkClicks: 5990,
      letterOpens: 3210,
      productViews: 4180,
      dailyStats: [
        { date: 'Seg', views: 4200 },
        { date: 'Ter', views: 5100 },
        { date: 'Qua', views: 6800 },
        { date: 'Qui', views: 7400 },
        { date: 'Sex', views: 8900 },
        { date: 'Sáb', views: 9200 },
        { date: 'Dom', views: 7320 },
      ],
    },
    isPublished: true,
    publishedUrl: '/@helenavogue',
    seo: {
      metaTitle: 'Helena Salles — Fan Page Oficial & Revista Editorial',
      metaDescription: 'Explore o universo de moda, arte, perfumaria e reflexões da diretora criativa Helena Salles.',
      ogImage: '/src/assets/images/hero_helena_editorial_1794505735939.jpg',
    },
    instagramIntegration: {
      connected: true,
      connectedAt: '2026-10-15',
      handle: 'helenasalles.studio',
      autoSync: false,
    },
  },

  {
    id: 'creator_lucas_vane',
    initialTemplateId: 'dark-creator',
    initialUsername: 'lucasneon',
    initialDisplayName: 'Lucas Vane',
    user: {
      id: 'usr_lucas',
      email: 'lucas@vaneaudio.io',
      role: 'creator',
    },
    profile: {
      id: 'prof_lucas',
      username: 'lucasneon',
      displayName: 'Lucas Vane',
      tagline: 'Produtor Musical, Sound Designer & Explorador Tecnológico',
      bio: 'Criando paisagens sonoras cinemáticas, sintetizadores modulares e explorando a interseção entre áudio e inteligência artificial.',
      fullStory: 'Trabalho na vanguarda da produção de áudio eletrônico há 8 anos. Meus trabalhos já embalaram trilhas sonoras de games independentes, mostras de arte imersiva e palcos de festivais de música eletrônica.',
      avatarUrl: '/src/assets/images/hero_lucas_dark_1794505736707.jpg',
      coverUrl: '/src/assets/images/hero_lucas_dark_1794505736707.jpg',
      location: 'São Paulo / Berlim',
      interests: ['Sintetizadores Modulares Eurorack', 'Sound Design Sci-Fi', 'Ableton Live 12', 'Filtros Analógicos', 'Game Audio'],
      trajectory: [
        { year: '2018', title: 'Primeiro Álbum Autoral', description: 'Lançamento do EP "Cybernetic Echoes" no Spotify e Bandcamp.' },
        { year: '2021', title: 'Trilha Sonora Indie Game', description: 'Premiação de melhor sound design no festival internacional de jogos independentes.' },
        { year: '2024', title: 'Comunidade Synth Lab', description: 'Criação do servidor Discord com mais de 15.000 produtores e entusiastas de áudio.' },
        { year: '2026', title: 'Turnê Audiovisual 360', description: 'Apresentações imersivas ao vivo utilizando sintetizadores e projeções generativas.' },
      ],
      instagramUsername: 'lucasvane.audio',
      tiktokUsername: 'lucasvane.sound',
      youtubeUrl: 'https://youtube.com',
      spotifyUrl: 'https://spotify.com',
    },
    design: {
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
        titleWeight: 'bold',
        letterSpacing: 'tight',
      },
      visual: {
        borderRadius: 'md',
        cardStyle: 'glass',
        animationStyle: 'snappy',
        enableGrain: false,
        enableGlow: true,
      },
    },
    links: [
      {
        id: 'link_l1',
        title: 'Novo Álbum no Spotify & Apple Music',
        url: 'https://spotify.com',
        description: 'Ouça "Neon Frequency", 12 faixas gravadas em sintetizadores analógicos',
        icon: 'disc',
        category: 'conteudos',
        isFeatured: true,
        isActive: true,
        order: 1,
        clicksCount: 3950,
      },
      {
        id: 'link_l2',
        title: 'Lucas Vane Modular Sound Pack Vol. 4',
        url: 'https://gumroad.com',
        description: 'Mais de 450 samples em 24-bit 96kHz + 60 presets para Vital e Serum',
        icon: 'music',
        category: 'produtos',
        isFeatured: true,
        isActive: true,
        order: 2,
        clicksCount: 1820,
      },
      {
        id: 'link_l3',
        title: 'Canal no YouTube (Tutoriais & Live Sets)',
        url: 'https://youtube.com',
        description: 'Vídeos semanais dissecando patches de áudio e fluxo de produção',
        icon: 'video',
        category: 'redes',
        isFeatured: false,
        isActive: true,
        order: 3,
        clicksCount: 2110,
      },
      {
        id: 'link_l4',
        title: 'Comunidade VIP no Discord',
        url: 'https://discord.com',
        description: 'Feedback de faixas, trocas de presets e lives exclusivas comigo',
        icon: 'message-circle',
        category: 'comunidade',
        isFeatured: false,
        isActive: true,
        order: 4,
        clicksCount: 940,
      },
    ],
    gallery: [
      {
        id: 'gal_l1',
        title: 'O Muro Modular de Eurorack',
        type: 'photo',
        mediaUrl: '/src/assets/images/hero_lucas_dark_1794505736707.jpg',
        caption: 'Meu setup de estúdio com mais de 30 módulos analógicos conectados.',
        tags: ['Studio', 'Eurorack', 'Analog'],
        category: 'Equipamentos',
        date: 'Novembro 2026',
        aspectRatio: '16:9',
      },
    ],
    posts: [
      {
        id: 'post_l1',
        slug: 'sintetizadores-modulares-e-o-futuro-do-audio',
        title: 'Por Que o Áudio Analógico Ficou Ainda Mais Relevante com a IA',
        excerpt: 'Em um mundo onde algoritmos geram músicas em segundos, a imprevisibilidade da voltagem real é pura poesia.',
        content: `Todos os dias me perguntam se tenho medo da IA generativa no áudio. Minha resposta é sempre não. A IA é maravilhosa para automações e para inspirar esboços rápidos, mas o que move o ouvinte humano é a imperfeição.\n\nQuando um módulo analógico esquenta e desafina 3 cents para cima, ele cria uma ressonância harmônica viva que nenhum modelo matemático congelado replica da mesma forma. A textura é humana.`,
        coverImage: '/src/assets/images/hero_lucas_dark_1794505736707.jpg',
        date: '05 de Novembro, 2026',
        readTime: '6 min de leitura',
        category: 'Produção',
        published: true,
      },
    ],
    letter: {
      id: 'letter_l1',
      title: 'Transmission #042 — Carta aos Colegas de Frequência',
      teaser: 'Toque para decodificar esta transmissão e ler meu recado para os criadores de som.',
      text: `Salve, pessoal do som!\n\nEste ano foi intenso. Terminamos a turnê, finalizamos 12 faixas e aprendi que a melhor mixagem é aquela que deixa espaço para o silêncio respirar. Se você está travado em uma música ou num projeto criativo hoje, desligue os plug-ins por 10 minutos, respire fundo e toque com os olhos fechados.\n\nObrigado por estarem na mesma frequência que eu. Tmj!`,
      signature: 'Lucas Vane // Modular Mind',
      date: 'Novembro de 2026',
      waxSealColor: '#8B5CF6',
      envelopeStyle: 'noir',
    },
    products: [
      {
        id: 'prod_l1',
        title: 'Cyberpunk & Modular Sample Pack Vol. 4',
        description: 'Pacote completo com 450+ samples gravados em fita cassete e sintetizadores analógicos.',
        price: 'R$ 147,00',
        benefits: ['100% Royalty Free para uso comercial', 'Kits de bateria, basslines e texturas granulares', 'Formato WAV 24-bit 96kHz'],
        imageUrl: '/src/assets/images/hero_lucas_dark_1794505736707.jpg',
        buyUrl: 'https://exemplo.com/comprar/modularpack',
        badge: 'Mais Vendido',
        active: true,
      },
    ],
    analytics: {
      totalViews: 62410,
      linkClicks: 8820,
      letterOpens: 4120,
      productViews: 5310,
      dailyStats: [
        { date: 'Seg', views: 6100 },
        { date: 'Ter', views: 7200 },
        { date: 'Qua', views: 8900 },
        { date: 'Qui', views: 9400 },
        { date: 'Sex', views: 11200 },
        { date: 'Sáb', views: 12500 },
        { date: 'Dom', views: 7110 },
      ],
    },
    isPublished: true,
    publishedUrl: '/@lucasneon',
    seo: {
      metaTitle: 'Lucas Vane — Sound Design, Beats & Synth Lab',
      metaDescription: 'Universo sonoro oficial de Lucas Vane: faixas, presets de áudio, cursos e comunidade VIP.',
      ogImage: '/src/assets/images/hero_lucas_dark_1794505736707.jpg',
    },
  },

  {
    id: 'creator_clara_martins',
    initialTemplateId: 'minimal-personal',
    initialUsername: 'claramar',
    initialDisplayName: 'Clara Martins',
    user: {
      id: 'usr_clara',
      email: 'clara@claralifestyle.com',
      role: 'creator',
    },
    profile: {
      id: 'prof_clara',
      username: 'claramar',
      displayName: 'Clara Martins',
      tagline: 'Escritora, Podcaster & Mentora de Vida Consciente',
      bio: 'Compartilhando práticas de desaceleração, diários reflexivos, bem-estar emocional e rotinas com mais presença.',
      fullStory: 'Deixei o ritmo frenético corporativo em 2020 para me dedicar à escrita terapêutica e aos encontros comunitários. Hoje guio milhares de mulheres a redescobrirem o prazer dos pequenos rituais.',
      avatarUrl: '/src/assets/images/hero_clara_minimal_1794505736987.jpg',
      coverUrl: '/src/assets/images/hero_clara_minimal_1794505736987.jpg',
      location: 'Florianópolis, SC',
      interests: ['Leitura Consciente', 'Chás Orgânicos', 'Cerâmica Manual', 'Meditação Guiada', 'Caminhadas na Praia'],
      trajectory: [
        { year: '2020', title: 'Primeiro Diário Digital', description: 'Início da newsletter semanal "Domingos com Clara".' },
        { year: '2022', title: 'Lançamento do Podcast "Tempo Presente"', description: 'Mais de 1 milhão de reproduções no Spotify e Apple Podcasts.' },
        { year: '2025', title: 'Retiro "Silêncio & Palavra"', description: 'Primeiro retiro presencial na Serra Catarinense para leitoras.' },
      ],
      instagramUsername: 'claramartins.vida',
      tiktokUsername: 'claramartins',
      youtubeUrl: 'https://youtube.com',
    },
    design: {
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
        bodyFont: 'DM Sans',
        titleSize: 'md',
        titleWeight: 'medium',
        letterSpacing: 'normal',
      },
      visual: {
        borderRadius: 'lg',
        cardStyle: 'minimal',
        animationStyle: 'smooth',
        enableGrain: false,
        enableGlow: false,
      },
    },
    links: [
      {
        id: 'link_c1',
        title: 'Assine a Newsletter "Domingos com Clara"',
        url: 'https://substack.com',
        description: 'Toda manhã de domingo, uma reflexão acolhedora na sua caixa de entrada',
        icon: 'mail',
        category: 'conteudos',
        isFeatured: true,
        isActive: true,
        order: 1,
        clicksCount: 4210,
      },
      {
        id: 'link_c2',
        title: 'Planner Intencional de Vida 2026',
        url: 'https://exemplo.com/planner',
        description: 'Ferramenta física de organização diária, gratidão e autocuidado',
        icon: 'calendar',
        category: 'produtos',
        isFeatured: true,
        isActive: true,
        order: 2,
        clicksCount: 3100,
      },
      {
        id: 'link_c3',
        title: 'Podcast "Tempo Presente" no Spotify',
        url: 'https://spotify.com',
        description: 'Episódios curtos de 15 minutos para ouvir tomando um chá',
        icon: 'mic',
        category: 'redes',
        isFeatured: false,
        isActive: true,
        order: 3,
        clicksCount: 1980,
      },
    ],
    gallery: [
      {
        id: 'gal_c1',
        title: 'Manhãs com Leitura e Luz Natural',
        type: 'photo',
        mediaUrl: '/src/assets/images/hero_clara_minimal_1794505736987.jpg',
        caption: 'O refúgio onde escrevo as cartas de domingo.',
        tags: ['Casa', 'Livros', 'Rotina'],
        category: 'Vida',
        date: 'Novembro 2026',
        aspectRatio: '16:9',
      },
    ],
    posts: [
      {
        id: 'post_c1',
        slug: 'o-habito-de-desacelerar',
        title: 'O Hábito de Desacelerar na Era da Notificação Constante',
        excerpt: 'Por que criar pausas intencionais ao longo do dia é um ato de preservação mental.',
        content: `Nós fomos condicionados a acreditar que tempo livre precisa ser preenchido por produtividade. Mas a criatividade verdadeira só nasce no espaço em branco.\n\nQuando permitimos que a mente descanse sem um celular na mão, nós começamos a ouvir nossos próprios pensamentos novamente. Experimente 15 minutos de silêncio hoje.`,
        coverImage: '/src/assets/images/hero_clara_minimal_1794505736987.jpg',
        date: '02 de Novembro, 2026',
        readTime: '4 min de leitura',
        category: 'Presença',
        published: true,
      },
    ],
    letter: {
      id: 'letter_c1',
      title: 'Um Bilhete Calmo para o Seu Dia',
      teaser: 'Toque para abrir esta cartinha que preparei para você com muito carinho.',
      text: `Olá, que bom que você está aqui.\n\nSeja bem-vindo(a) ao meu cantinho seguro na internet. Espero que este espaço te traga um respiro em meio à correria. Lembre-se: você não precisa dar conta de tudo ao mesmo tempo. Vá devagar, cuide do seu corpo e seja gentil consigo mesmo(a) hoje.\n\nUm abraço afetuoso,`,
      signature: 'Clara Martins',
      date: 'Novembro de 2026',
      waxSealColor: '#A16207',
      envelopeStyle: 'parchment',
    },
    products: [
      {
        id: 'prod_c1',
        title: 'Planner Intencional — Edição Linho Cru',
        description: 'Capa em linho bordado, papel pólen 90g, visão trimestral e rastreador de hábitos.',
        price: 'R$ 139,00',
        benefits: ['Estrutura não-datada (comece quando quiser)', 'Guias de reflexão de início e fim de mês', 'Frete grátis para todo o Brasil'],
        imageUrl: '/src/assets/images/hero_clara_minimal_1794505736987.jpg',
        buyUrl: 'https://exemplo.com/comprar/planner',
        badge: 'Favorito dos Fãs',
        active: true,
      },
    ],
    analytics: {
      totalViews: 38100,
      linkClicks: 5200,
      letterOpens: 3940,
      productViews: 2890,
      dailyStats: [
        { date: 'Seg', views: 3900 },
        { date: 'Ter', views: 4200 },
        { date: 'Qua', views: 5100 },
        { date: 'Qui', views: 5400 },
        { date: 'Sex', views: 6200 },
        { date: 'Sáb', views: 7100 },
        { date: 'Dom', views: 6200 },
      ],
    },
    isPublished: true,
    publishedUrl: '/@claramar',
    seo: {
      metaTitle: 'Clara Martins — Vida Consciente, Diários & Comunidade',
      metaDescription: 'Fan page oficial de Clara Martins: textos, podcast Tempo Presente, planner e reflexões.',
      ogImage: '/src/assets/images/hero_clara_minimal_1794505736987.jpg',
    },
  },
];

export function getStoredAccounts(): CreatorAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
      return INITIAL_DEMO_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
      return INITIAL_DEMO_ACCOUNTS;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading accounts from storage, restoring defaults', err);
    return INITIAL_DEMO_ACCOUNTS;
  }
}

export function saveStoredAccounts(accounts: CreatorAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.error('Error saving accounts to localStorage', err);
  }
}

export function getActiveCreatorUsername(): string {
  try {
    const active = localStorage.getItem(ACTIVE_CREATOR_KEY);
    if (active) return active;
  } catch {
    // ignore
  }
  return 'helenavogue';
}

export function setActiveCreatorUsername(username: string): void {
  try {
    localStorage.setItem(ACTIVE_CREATOR_KEY, username);
  } catch {
    // ignore
  }
}

export function getAccountByUsername(username: string): CreatorAccount | undefined {
  const accounts = getStoredAccounts();
  const clean = username.replace(/^@+/, '').toLowerCase();
  return accounts.find(acc => acc.profile.username.toLowerCase() === clean);
}

export function saveAccount(updatedAccount: CreatorAccount): void {
  const accounts = getStoredAccounts();
  const index = accounts.findIndex(acc => acc.id === updatedAccount.id);
  if (index >= 0) {
    accounts[index] = updatedAccount;
  } else {
    accounts.push(updatedAccount);
  }
  saveStoredAccounts(accounts);
}

export function createNewAccount(
  username: string,
  displayName: string,
  email: string,
  templateId: CreatorAccount['design']['templateId'] = 'editorial-luxury'
): CreatorAccount {
  const cleanSlug = username.replace(/^@+/, '').toLowerCase().trim();
  const timestamp = Date.now();
  const defaults = buildDefaultAccountSections(cleanSlug, displayName, email, templateId, undefined, timestamp);

  const newAccount: CreatorAccount = {
    id: `creator_${timestamp}_${Math.random().toString(36).substring(2, 7)}`,
    initialTemplateId: templateId,
    initialUsername: cleanSlug,
    initialDisplayName: displayName,
    user: {
      id: `usr_${timestamp}`,
      email,
      role: 'creator',
    },
    profile: defaults.profile,
    design: defaults.design,
    links: defaults.links,
    gallery: defaults.gallery,
    posts: defaults.posts,
    letter: defaults.letter,
    products: defaults.products,
    analytics: {
      totalViews: 1,
      linkClicks: 0,
      letterOpens: 0,
      productViews: 0,
      dailyStats: [
        { date: 'Hoje', views: 1 },
      ],
    },
    isPublished: true,
    publishedUrl: defaults.publishedUrl,
    seo: defaults.seo,
  };

  const accounts = getStoredAccounts();
  accounts.push(newAccount);
  saveStoredAccounts(accounts);
  setActiveCreatorUsername(cleanSlug);
  return newAccount;
}

export function restoreCreatorAccountToDefault(account: CreatorAccount): CreatorAccount {
  const restored = restoreAccountToDefault(account, INITIAL_DEMO_ACCOUNTS);
  saveAccount(restored);
  return restored;
}

export function recordPageView(username: string): void {
  const account = getAccountByUsername(username);
  if (!account) return;
  account.analytics.totalViews = (account.analytics.totalViews || 0) + 1;
  saveAccount(account);
}

export function recordLinkClick(username: string, linkId: string): void {
  const account = getAccountByUsername(username);
  if (!account) return;
  account.analytics.linkClicks = (account.analytics.linkClicks || 0) + 1;
  const link = account.links.find(l => l.id === linkId);
  if (link) {
    link.clicksCount = (link.clicksCount || 0) + 1;
  }
  saveAccount(account);
}

export function recordLetterOpen(username: string): void {
  const account = getAccountByUsername(username);
  if (!account) return;
  account.analytics.letterOpens = (account.analytics.letterOpens || 0) + 1;
  saveAccount(account);
}

export function resetToDemoData(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_ACCOUNTS));
  setActiveCreatorUsername('helenavogue');
}

export function exportDatabaseJSON(): string {
  const accounts = getStoredAccounts();
  return JSON.stringify({
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    accounts,
  }, null, 2);
}

export function importDatabaseJSON(jsonStr: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonStr);
    if (!data.accounts || !Array.isArray(data.accounts)) {
      return { success: false, message: 'Estrutura JSON inválida. Campo "accounts" não encontrado.' };
    }
    saveStoredAccounts(data.accounts);
    return { success: true, message: `${data.accounts.length} contas importadas com sucesso!` };
  } catch (err: any) {
    return { success: false, message: `Erro ao processar JSON: ${err.message}` };
  }
}
