import React, { useState } from 'react';
import { CreatorAccount, GalleryItem, Post, SocialLink, FeaturedVideo } from '../../types/creator';
import { filterAndSortLinks } from '../../utils/pureLogic';
import { 
  Sparkles, 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  Share2, 
  Play, 
  Clock, 
  Eye, 
  BookOpen, 
  ShoppingBag, 
  CheckCircle2, 
  Star,
  ChevronRight,
  Video
} from 'lucide-react';

interface TemplateProps {
  account: CreatorAccount;
  isPreview?: boolean;
  onOpenLetter: () => void;
  onOpenPost: (post: Post) => void;
  onOpenGalleryItem: (item: GalleryItem) => void;
  onOpenVideo?: (video: FeaturedVideo) => void;
  onLinkClick?: (link: SocialLink) => void;
  onShare?: () => void;
}

export const UniversalCreatorTemplate: React.FC<TemplateProps> = ({
  account,
  isPreview = false,
  onOpenLetter,
  onOpenPost,
  onOpenGalleryItem,
  onOpenVideo,
  onLinkClick,
  onShare,
}) => {
  const { profile, design, links, gallery, posts, videos, letter, products } = account;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeVideoModal, setActiveVideoModal] = useState<FeaturedVideo | null>(null);

  const filteredLinks = filterAndSortLinks(links, selectedCategory);

  const templateId = design.templateId;

  // Determine template specific visual personalities
  const isDarkBase = ['dark-creator', 'fashion-portfolio', 'cinematic-story', 'bold-creator'].includes(templateId);
  const isSerif = ['editorial-luxury', 'minimal-personal', 'fashion-portfolio', 'cinematic-story', 'artistic-experience'].includes(templateId);

  const bgStyle = {
    backgroundColor: design.colors.background || (isDarkBase ? '#09090B' : '#FAF7F2'),
    color: design.colors.text || (isDarkBase ? '#F4F4F5' : '#1C1917'),
  };

  const categories = [
    { id: 'all', label: 'Todos os Links' },
    { id: 'conteudos', label: 'Conteúdos' },
    { id: 'produtos', label: 'Livros & Produtos' },
    { id: 'redes', label: 'Redes Sociais' },
    { id: 'comunidade', label: 'Comunidade' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <div className={`min-h-screen selection:bg-amber-400 selection:text-neutral-950 ${isSerif ? 'font-serif' : 'font-sans'}`} style={bgStyle}>
      {/* 1. TOP BAR */}
      <header className="sticky top-0 z-30 backdrop-blur-md px-6 py-4 border-b border-black/10 dark:border-white/10 bg-opacity-90" style={{ backgroundColor: design.colors.background }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl sm:text-2xl font-bold tracking-tight">
              {profile.displayName}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 hidden sm:inline">
              · Fan Page Oficial
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-current/20 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
            )}

            <button
              onClick={onOpenLetter}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: design.colors.primary,
                color: design.colors.buttonText || '#FFFFFF',
              }}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Carta aos Fãs</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. ABERTURA (HERO IMPACTANTE) */}
      <section className="px-6 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-current/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-70">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: design.colors.primary }} />
              <span>{profile.location || 'Brasil'}</span>
              <span>·</span>
              <span>{design.templateId.replace('-', ' ').toUpperCase()}</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-normal tracking-tight leading-[1.08]">
              {profile.displayName}
            </h1>

            <p className="text-lg sm:text-xl opacity-90 italic font-light leading-relaxed">
              "{profile.tagline}"
            </p>

            <p className="text-sm sm:text-base opacity-80 max-w-xl leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#links"
                className="px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                style={{
                  backgroundColor: design.colors.buttonBg,
                  color: design.colors.buttonText,
                }}
              >
                <span>Acessar Links & Projetos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenLetter}
                className="px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-medium border border-current/20 hover:bg-black/5 dark:hover:bg-white/10 transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Abrir Carta Pessoal</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative group mx-auto max-w-sm">
              <div 
                className="absolute -inset-2 rounded-2xl opacity-20 blur-lg transition-all group-hover:opacity-40"
                style={{ backgroundColor: design.colors.primary }}
              />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[3/4] border border-current/10">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono uppercase flex justify-between items-center opacity-90">
                  <span>{profile.displayName}</span>
                  <span className="font-semibold">Oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CARTA AOS FÃS (ENVELOPE CALLOUT) */}
      <section className="px-6 py-12 border-b border-current/10 bg-black/5 dark:bg-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-6 sm:p-8 border border-current/15 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest opacity-60 flex items-center justify-center md:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                Correspondência Especial do Criador
              </span>
              <h2 className="text-2xl sm:text-3xl font-normal">
                {letter.title}
              </h2>
              <p className="text-xs sm:text-sm opacity-75 max-w-xl">
                {letter.teaser}
              </p>
            </div>

            <button
              onClick={onOpenLetter}
              className="shrink-0 flex items-center gap-3 px-6 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all shadow-md hover:opacity-90"
              style={{
                backgroundColor: design.colors.buttonBg,
                color: design.colors.buttonText,
              }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                style={{ backgroundColor: letter.waxSealColor || design.colors.primary }}
              >
                {profile.displayName.charAt(0)}
              </div>
              <span>Abrir Envelope com Lacre</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. HISTÓRIA, TRAJETÓRIA & MANIFESTO */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-b border-current/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60">
              01 // Biografia & Filosofia
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal leading-tight">
              A História Por Trás da Marca
            </h2>
            <p className="text-sm opacity-80 leading-relaxed whitespace-pre-line">
              {profile.fullStory || profile.bio}
            </p>

            <div className="pt-4">
              <span className="text-xs font-mono uppercase tracking-wider opacity-60 block mb-2">
                Valores & Áreas de Atuação
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-full border border-current/20 bg-black/5 dark:bg-white/5"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-4">
              Marcos & Trajetória
            </span>
            <div className="space-y-6 border-l border-current/20 pl-6 ml-2">
              {profile.trajectory?.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div
                    className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-current shadow-sm"
                    style={{ backgroundColor: design.colors.primary }}
                  />
                  <span className="font-mono text-xs font-bold opacity-60">{item.year}</span>
                  <h3 className="text-xl font-medium mt-0.5">{item.title}</h3>
                  <p className="text-xs sm:text-sm opacity-75 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. VÍDEOS IMPORTANTES EM DESTAQUE */}
      {videos && videos.length > 0 && (
        <section className="px-6 py-16 max-w-5xl mx-auto border-b border-current/10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-1">
                02 // Conteúdos em Vídeo
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal">
                Vídeos & Produções Importantes
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs opacity-60 font-mono">
              <Video className="w-4 h-4" />
              <span>Alta Resolução</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => setActiveVideoModal(vid)}
                className="group cursor-pointer rounded-2xl border border-current/10 bg-black/5 dark:bg-white/5 overflow-hidden transition-all hover:shadow-xl hover:border-current/30 flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden bg-neutral-800">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <div 
                      className="w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: design.colors.primary }}
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>
                  {vid.duration && (
                    <span className="absolute bottom-3 right-3 text-[10px] font-mono font-bold bg-black/80 text-white px-2 py-0.5 rounded">
                      {vid.duration}
                    </span>
                  )}
                  {vid.category && (
                    <span className="absolute top-3 left-3 text-[10px] font-mono font-bold uppercase bg-black/80 text-white px-2 py-0.5 rounded">
                      {vid.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-semibold mb-1 group-hover:opacity-80 transition-opacity">
                    {vid.title}
                  </h3>
                  <p className="text-xs opacity-70 line-clamp-2 leading-relaxed">
                    {vid.description}
                  </p>
                  {vid.views && (
                    <div className="mt-3 flex items-center gap-1 text-[11px] font-mono opacity-60">
                      <Eye className="w-3.5 h-3.5" />
                      <span>{vid.views}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. REVISTA PESSOAL (ARTIGOS & BLOG) */}
      <section className="px-6 py-16 border-b border-current/10 bg-black/5 dark:bg-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-1">
                03 // Revista Pessoal & Blog
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal">
                Artigos & Reflexões Autoriais
              </h2>
            </div>
            <p className="text-xs opacity-70 italic max-w-xs">
              Ensaios profundos, lições de trajetória e ideias compartilhadas sem pressa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => onOpenPost(post)}
                className="group cursor-pointer rounded-2xl border border-current/15 bg-black/5 dark:bg-white/5 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {post.coverImage && (
                  <div className="aspect-[16/10] overflow-hidden bg-neutral-800">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs opacity-60 mb-2 font-mono">
                      <span className="font-semibold uppercase" style={{ color: design.colors.primary }}>
                        {post.category}
                      </span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-normal leading-snug group-hover:opacity-80 transition-opacity">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm opacity-70 mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-current/10 flex items-center justify-between text-xs font-medium">
                    <span>Ler publicação na íntegra</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEUS LINKS (LINKTREE PREMIUM DETALHADO) */}
      <section id="links" className="px-6 py-16 border-b border-current/10 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-1">
              04 // Central de Conexões
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal">
              Meus Links Oficiais & Canais
            </h2>
            <p className="text-xs sm:text-sm opacity-70 mt-1">
              Descubra todas as minhas plataformas, redes sociais e conteúdos recomendados.
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? 'font-bold shadow-sm'
                      : 'border border-current/20 opacity-70 hover:opacity-100'
                  }`}
                  style={selectedCategory === cat.id ? { backgroundColor: design.colors.buttonBg, color: design.colors.buttonText } : {}}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => onLinkClick?.(link)}
                className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
                  link.isFeatured
                    ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30 bg-black/5 dark:bg-white/10'
                    : 'border-current/15 bg-black/5 dark:bg-white/5 hover:border-current/30'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: design.colors.primary }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-semibold truncate">
                        {link.title}
                      </span>
                      {link.badge && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-500 font-bold shrink-0">
                          {link.badge}
                        </span>
                      )}
                    </div>
                    {link.description && (
                      <p className="text-xs opacity-75 truncate mt-0.5">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 8. LIVROS & PRODUTOS AUTORAIS */}
      {products && products.length > 0 && (
        <section className="px-6 py-16 max-w-5xl mx-auto border-b border-current/10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-1">
                05 // Livros, Criações & Loja
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal">
                Produtos & Coleções Exclusivas
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs opacity-60 font-mono">
              <ShoppingBag className="w-4 h-4" />
              <span>Checkout Oficial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="rounded-2xl border border-current/15 bg-black/5 dark:bg-white/5 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-neutral-800 overflow-hidden relative">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {prod.badge && (
                      <span 
                        className="absolute top-3 right-3 text-[10px] font-mono uppercase font-bold text-white px-3 py-1 rounded-md shadow-md"
                        style={{ backgroundColor: design.colors.primary }}
                      >
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="text-2xl font-medium">
                        {prod.title}
                      </h3>
                      {prod.price && (
                        <span className="font-mono text-base font-bold" style={{ color: design.colors.primary }}>
                          {prod.price}
                        </span>
                      )}
                    </div>

                    {prod.format && (
                      <span className="text-[11px] font-mono opacity-60 block mb-2">
                        {prod.format}
                      </span>
                    )}

                    <p className="text-xs sm:text-sm opacity-80 leading-relaxed mb-4">
                      {prod.description}
                    </p>

                    {prod.benefits && prod.benefits.length > 0 && (
                      <ul className="space-y-1.5 text-xs opacity-80 border-t border-current/10 pt-3 mb-4">
                        {prod.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <a
                    href={prod.buyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3.5 rounded-xl text-xs uppercase tracking-wider font-semibold text-center block transition-all shadow-md hover:opacity-90"
                    style={{
                      backgroundColor: design.colors.buttonBg,
                      color: design.colors.buttonText,
                    }}
                  >
                    Adquirir no Site Parceiro
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 9. ACERVO FOTOGRÁFICO */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-b border-current/10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest opacity-60 block mb-1">
              06 // Galeria Visual
            </span>
            <h2 className="text-3xl sm:text-4xl font-normal">
              Acervo de Momentos & Ensaios
            </h2>
          </div>
          <span className="text-xs opacity-60 font-mono">Toque para ampliar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenGalleryItem(item)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-square bg-neutral-800 shadow-sm border border-current/10"
            >
              <img
                src={item.mediaUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-mono opacity-80">
                  {item.category}
                </span>
                <p className="text-lg font-medium">{item.title}</p>
                <p className="text-xs text-neutral-300 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-12 text-center text-xs opacity-60">
        <p className="text-xl font-medium mb-1">{profile.displayName}</p>
        <p className="font-mono text-[11px] mb-3">
          Fan Page Premium construída no Creator World
        </p>
        <p>@{profile.username} · Todos os direitos reservados</p>
      </footer>

      {/* Video Modal Player */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full p-6 text-white space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase font-semibold">
                  {activeVideoModal.category}
                </span>
                <h3 className="text-xl font-bold">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              >
                &times;
              </button>
            </div>

            <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center relative">
              <img
                src={activeVideoModal.thumbnail}
                alt=""
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
                <Play className="w-12 h-12 text-amber-400 mb-2 fill-current" />
                <p className="text-sm font-semibold">Prévia de Vídeo Oficial</p>
                <p className="text-xs text-neutral-400 max-w-md mt-1">{activeVideoModal.description}</p>
                <a
                  href={activeVideoModal.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
                >
                  Assistir no Canal Oficial
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
