import React, { useState } from 'react';
import { CreatorAccount, GalleryItem, Post, SocialLink } from '../../types/creator';
import { filterAndSortLinks } from '../../utils/pureLogic';
import { 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  Share2, 
  BookOpen, 
  Coffee,
  Sparkles,
  ShoppingBag,
  Heart
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

export const MinimalPersonalTemplate: React.FC<TemplateProps> = ({
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
    { id: 'all', label: 'Tudo' },
    { id: 'conteudos', label: 'Textos' },
    { id: 'produtos', label: 'Livros & Planner' },
    { id: 'redes', label: 'Redes' },
    { id: 'contato', label: 'Contato' },
  ];

  return (
    <div 
      className="min-h-screen text-zinc-800 selection:bg-amber-100 selection:text-amber-900"
      style={{ backgroundColor: design.colors.background || '#FAF9F6' }}
    >
      {/* Top Bar Minimal */}
      <header className="sticky top-0 z-30 bg-[#FAF9F6]/90 backdrop-blur-sm border-b border-zinc-200/60 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <span className="font-playfair text-xl font-medium tracking-tight text-zinc-900">
            {profile.displayName}
          </span>

          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenLetter}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Bilhete do dia</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO MINIMAL */}
      <section className="px-6 pt-12 pb-16 md:pt-16 md:pb-20 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-36 h-36 md:w-44 md:h-44 rounded-full overflow-hidden shrink-0 shadow-sm border border-zinc-200 bg-zinc-100">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs text-zinc-500">
              <Coffee className="w-3.5 h-3.5" />
              <span>{profile.location || 'Brasil'}</span>
              <span>·</span>
              <span>Espaço Pessoal</span>
            </div>

            <h1 className="font-playfair text-3xl sm:text-5xl font-normal text-zinc-900 tracking-tight leading-tight">
              {profile.displayName}
            </h1>

            <p className="text-base sm:text-lg text-zinc-600 font-light leading-relaxed max-w-lg">
              {profile.tagline}
            </p>

            <p className="text-xs sm:text-sm text-zinc-500 max-w-lg leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <a
                href="#links"
                className="px-5 py-2.5 rounded-full text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 transition-colors"
              >
                Ver links & leituras
              </a>
              <button
                onClick={onOpenLetter}
                className="px-5 py-2.5 rounded-full text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Abrir carta aos leitores</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CARTA (PARCHMENT NOTE) */}
      <section className="px-6 py-8 max-w-3xl mx-auto">
        <div 
          onClick={onOpenLetter}
          className="group cursor-pointer rounded-2xl p-6 bg-white border border-zinc-200 shadow-sm hover:border-amber-400 transition-all flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-wider text-amber-800 font-medium">
                Carta Aberta
              </p>
              <h2 className="font-playfair text-xl font-normal text-zinc-900 group-hover:text-amber-800 transition-colors">
                {letter.title}
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">{letter.teaser}</p>
            </div>
          </div>
          <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-900 flex items-center gap-1 shrink-0">
            Ler <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </section>

      {/* 3. BIOGRAFIA & TRAJETÓRIA */}
      <section className="px-6 py-12 max-w-3xl mx-auto border-t border-zinc-200/60">
        <div className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">
            Sobre Mim
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-zinc-900">
            A jornada até aqui
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
            {profile.fullStory || profile.bio}
          </p>

          <div className="space-y-4 pt-2">
            {profile.trajectory?.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-baseline">
                <span className="font-mono text-xs font-semibold text-zinc-400 w-12 shrink-0">
                  {item.year}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
                  <p className="text-xs text-zinc-500 mt-0.5">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. REVISTA & TEXTOS */}
      <section className="px-6 py-12 max-w-3xl mx-auto border-t border-zinc-200/60">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
              Diário Digital
            </span>
            <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-zinc-900">
              Reflexões Recentes
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => onOpenPost(post)}
              className="group cursor-pointer p-6 rounded-2xl bg-white border border-zinc-200 hover:border-zinc-300 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
                <span className="text-amber-800 font-medium">{post.category}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-normal text-zinc-900 group-hover:text-amber-900 transition-colors">
                {post.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 mt-2 leading-relaxed">
                {post.excerpt}
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-zinc-900 mt-4 group-hover:translate-x-0.5 transition-transform">
                Continuar lendo <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </article>
          ))}
        </div>
      </section>

      {/* 5. MEUS LINKS */}
      <section id="links" className="px-6 py-12 max-w-2xl mx-auto border-t border-zinc-200/60 scroll-mt-20">
        <div className="text-center mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 block mb-1">
            Links Úteis
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl font-normal text-zinc-900">
            Onde me encontrar
          </h2>

          <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 text-white font-medium'
                    : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
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
                  ? 'bg-white border-zinc-400 shadow-sm'
                  : 'bg-white/70 hover:bg-white border-zinc-200'
              }`}
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-900 truncate">
                    {link.title}
                  </span>
                  {link.isFeatured && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold">
                      Destaque
                    </span>
                  )}
                </div>
                {link.description && (
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {link.description}
                  </p>
                )}
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-zinc-900 transition-colors shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {/* 6. PRODUTOS AUTORAIS */}
      {products && products.length > 0 && (
        <section className="px-6 py-12 max-w-3xl mx-auto border-t border-zinc-200/60">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-playfair text-2xl font-normal text-zinc-900">
              Criações & Publicações
            </h2>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Loja Oficial</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-zinc-200 p-5 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="aspect-[4/3] rounded-xl overflow-hidden bg-zinc-100 mb-4">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-playfair text-lg font-medium text-zinc-900">
                      {prod.title}
                    </h3>
                    {prod.price && (
                      <span className="font-mono text-xs font-bold text-zinc-700">
                        {prod.price}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                    {prod.description}
                  </p>
                </div>

                <a
                  href={prod.buyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-lg text-xs font-medium text-white bg-zinc-900 hover:bg-zinc-800 text-center block transition-colors"
                >
                  Conhecer Produto
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Minimal */}
      <footer className="px-6 py-12 text-center text-xs text-zinc-400 border-t border-zinc-200/60">
        <p className="text-zinc-600 font-medium mb-1">{profile.displayName}</p>
        <p className="mb-2">Feito com carinho na Creator World</p>
        <p>@{profile.username}</p>
      </footer>
    </div>
  );
};
