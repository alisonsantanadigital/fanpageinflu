import React, { useState } from 'react';
import { CreatorAccount, GalleryItem, Post, SocialLink } from '../../types/creator';
import { filterAndSortLinks } from '../../utils/pureLogic';
import { 
  Sparkles, 
  Mail, 
  ExternalLink, 
  BookOpen, 
  ArrowRight, 
  Compass, 
  Share2, 
  Instagram, 
  Youtube, 
  Music,
  ShoppingBag,
  Award,
  ChevronRight
} from 'lucide-react';

interface TemplateProps {
  account: CreatorAccount;
  isPreview?: boolean;
  onOpenLetter: () => void;
  onOpenPost: (post: Post) => void;
  onOpenGalleryItem: (item: GalleryItem) => void;
  onLinkClick?: (link: SocialLink) => void;
  onShare?: () => void;
}

export const EditorialLuxuryTemplate: React.FC<TemplateProps> = ({
  account,
  isPreview = false,
  onOpenLetter,
  onOpenPost,
  onOpenGalleryItem,
  onLinkClick,
  onShare,
}) => {
  const { profile, design, links, gallery, posts, letter, products } = account;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredLinks = filterAndSortLinks(links, selectedCategory);

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'conteudos', label: 'Conteúdos' },
    { id: 'produtos', label: 'Produtos' },
    { id: 'redes', label: 'Redes' },
    { id: 'comunidade', label: 'Comunidade' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <div 
      className="min-h-screen text-stone-900 selection:bg-stone-300 selection:text-stone-900"
      style={{ backgroundColor: design.colors.background || '#FAF7F2' }}
    >
      {/* Editorial Top Bar */}
      <header className="sticky top-0 z-30 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-stone-200/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-cormorant text-2xl font-semibold tracking-wider uppercase text-stone-900">
              {profile.displayName}
            </span>
            <span className="text-xs uppercase tracking-widest text-stone-400 font-mono hidden sm:inline">
              · Edição Oficial
            </span>
          </div>

          <div className="flex items-center gap-3">
            {onShare && (
              <button
                onClick={onShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 hover:text-stone-950 bg-stone-200/60 hover:bg-stone-200 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Compartilhar</span>
              </button>
            )}

            <button
              onClick={onOpenLetter}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium text-white transition-all shadow-sm"
              style={{ backgroundColor: design.colors.primary || '#8F714B' }}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Carta aos Fãs</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. ABERTURA (HERO EDITORIAL) */}
      <section className="relative px-6 pt-10 pb-16 md:pt-16 md:pb-24 border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-stone-500 font-mono">
              <Compass className="w-3.5 h-3.5 text-stone-700" />
              <span>{profile.location || 'Paris & São Paulo'}</span>
              <span>·</span>
              <span>Fan Page & Revista</span>
            </div>

            <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] text-stone-950 tracking-tight">
              {profile.displayName}
            </h1>

            <p className="font-cormorant italic text-xl sm:text-2xl text-stone-700 font-light leading-relaxed">
              "{profile.tagline}"
            </p>

            <p className="text-sm sm:text-base text-stone-600 max-w-xl leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#links"
                className="px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium text-white shadow-md hover:opacity-90 transition-all flex items-center gap-2"
                style={{ backgroundColor: design.colors.buttonBg || '#1C1917' }}
              >
                <span>Explorar Links & Projetos</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={onOpenLetter}
                className="px-6 py-2.5 rounded-full text-xs uppercase tracking-wider font-medium text-stone-800 bg-white border border-stone-300 hover:bg-stone-50 transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Ler Carta Pessoal</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative group mx-auto max-w-sm">
              <div className="absolute -inset-2 rounded-2xl bg-stone-300/40 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
              <div className="relative rounded-xl overflow-hidden shadow-xl aspect-[3/4] bg-stone-200">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white text-xs font-mono tracking-wider uppercase opacity-90 flex justify-between items-center">
                  <span>{profile.displayName}</span>
                  <span>Estúdio Oficial</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CARTA AOS FÃS (ENVELOPE CALLOUT) */}
      <section className="px-6 py-12 bg-white/60 border-b border-stone-200/80">
        <div className="max-w-4xl mx-auto">
          <div className="border border-stone-300/80 rounded-2xl p-6 sm:p-8 bg-[#FAF7F2] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-stone-500 flex items-center justify-center md:justify-start gap-1.5">
                <Mail className="w-3.5 h-3.5 text-stone-700" />
                Correspondência Exclusiva
              </span>
              <h2 className="font-cormorant text-2xl sm:text-3xl font-normal text-stone-900">
                {letter.title}
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
                {letter.teaser}
              </p>
            </div>

            <button
              onClick={onOpenLetter}
              className="shrink-0 group flex items-center gap-3 px-5 py-3 rounded-xl bg-stone-900 text-white hover:bg-stone-800 transition-all shadow-md"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-inner"
                style={{ backgroundColor: letter.waxSealColor || '#8F714B' }}
              >
                {profile.displayName.charAt(0)}
              </div>
              <span className="text-xs uppercase tracking-wider font-medium">
                Abrir Envelope Digital
              </span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. BIOGRAFIA & TRAJETÓRIA */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-b border-stone-200/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500">
              01. Biografia Editorial
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-stone-950 leading-tight">
              Minha História & Trajetória
            </h2>
            <p className="text-sm text-stone-700 leading-relaxed font-serif">
              {profile.fullStory || profile.bio}
            </p>

            {/* Interesses & Hobbies */}
            <div className="pt-4">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-500 block mb-2">
                Áreas de Interesse & Universo
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white border border-stone-300 text-stone-800 px-3 py-1 rounded-full font-serif"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500 block mb-4">
              Linha do Tempo
            </span>
            <div className="space-y-6 border-l border-stone-300 pl-6 ml-2">
              {profile.trajectory?.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-stone-900 border-2 border-[#FAF7F2]" />
                  <span className="font-mono text-xs text-stone-500 font-semibold">{item.year}</span>
                  <h3 className="font-cormorant text-xl font-medium text-stone-900 mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. REVISTA PESSOAL (ARTIGOS & PUBLICAÇÕES) */}
      <section className="px-6 py-16 bg-white/70 border-b border-stone-200/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500 block mb-1">
                02. Revista Pessoal
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-stone-950">
                Ensaios & Reflexões
              </h2>
            </div>
            <p className="text-xs text-stone-500 font-serif italic max-w-xs">
              Artigos autorais, notas de ateliê e visões sobre o mundo contemporâneo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => onOpenPost(post)}
                className="group cursor-pointer bg-[#FAF7F2] rounded-xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {post.coverImage && (
                  <div className="aspect-[16/10] overflow-hidden bg-stone-200">
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
                    <div className="flex items-center gap-2 text-xs text-stone-500 mb-2 font-mono">
                      <span className="uppercase text-stone-800 font-semibold">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-cormorant text-2xl font-normal text-stone-950 group-hover:text-stone-700 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-stone-600 mt-2 line-clamp-3 leading-relaxed font-serif">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-200 flex items-center justify-between text-xs font-medium text-stone-900">
                    <span>Ler publicação completa</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GALERIA EDITORIAL */}
      <section className="px-6 py-16 max-w-5xl mx-auto border-b border-stone-200/80">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500 block mb-1">
              03. Acervo Fotográfico
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-stone-950">
              Momentos & Curadoria
            </h2>
          </div>
          <span className="text-xs text-stone-400 font-mono">Toque para ampliar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {gallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onOpenGalleryItem(item)}
              className="group relative rounded-xl overflow-hidden cursor-pointer aspect-square bg-stone-200 shadow-sm"
            >
              <img
                src={item.mediaUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
                  {item.category}
                </span>
                <p className="font-cormorant text-lg font-medium">{item.title}</p>
                <p className="text-xs text-stone-300 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. MEUS LINKS (LINKTREE AVANÇADO) */}
      <section id="links" className="px-6 py-16 bg-[#FAF7F2] border-b border-stone-200/80 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500 block mb-1">
              04. Conexões & Acesso
            </span>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-stone-950">
              Links Oficiais & Canais
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 font-serif">
              Acesse meus conteúdos, redes sociais e projetos em destaque.
            </p>

            {/* Category tabs */}
            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white font-medium shadow-sm'
                      : 'bg-white border border-stone-300 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => onLinkClick?.(link)}
                className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${
                  link.isFeatured
                    ? 'bg-white border-stone-400 shadow-md ring-1 ring-stone-900/5'
                    : 'bg-white/80 hover:bg-white border-stone-200 hover:border-stone-400 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: design.colors.primary || '#8F714B' }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-stone-900 truncate">
                        {link.title}
                      </span>
                      {link.isFeatured && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          Destaque
                        </span>
                      )}
                    </div>
                    {link.description && (
                      <p className="text-xs text-stone-500 truncate mt-0.5 font-serif">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3 text-stone-400 group-hover:text-stone-900 transition-colors shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRODUTOS & CURADORIA */}
      {products && products.length > 0 && (
        <section className="px-6 py-16 max-w-5xl mx-auto border-b border-stone-200/80">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-stone-500 block mb-1">
                05. Loja & Produtos Autorais
              </span>
              <h2 className="font-cormorant text-3xl sm:text-4xl font-normal text-stone-950">
                Coleção & Criações
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-mono">
              <ShoppingBag className="w-4 h-4 text-stone-800" />
              <span>Checkout Oficial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {prod.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-mono uppercase font-semibold bg-stone-900 text-white px-2.5 py-1 rounded-md">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-cormorant text-2xl font-medium text-stone-950">
                        {prod.title}
                      </h3>
                      {prod.price && (
                        <span className="font-mono text-base font-bold text-stone-900">
                          {prod.price}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-serif mb-4">
                      {prod.description}
                    </p>

                    {prod.benefits && prod.benefits.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-stone-600 border-t border-stone-100 pt-3 mb-4">
                        {prod.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
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
                    className="w-full py-3 rounded-xl text-xs uppercase tracking-wider font-semibold text-white text-center block transition-all hover:opacity-90 shadow-sm"
                    style={{ backgroundColor: design.colors.buttonBg || '#1C1917' }}
                  >
                    Adquirir no Site Parceiro
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Editorial */}
      <footer className="px-6 py-12 text-center text-xs text-stone-500 font-serif">
        <p className="font-cormorant text-xl text-stone-900 font-medium mb-1">
          {profile.displayName}
        </p>
        <p className="text-stone-400 font-mono text-[11px] mb-4">
          Fan Page Premium construída na Creator World
        </p>
        <div className="flex items-center justify-center gap-4 text-stone-600">
          <span>@{profile.username}</span>
          <span>·</span>
          <span>Todos os direitos reservados</span>
        </div>
      </footer>
    </div>
  );
};
