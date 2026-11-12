import React, { useState } from 'react';
import { CreatorAccount, GalleryItem, Post, SocialLink } from '../../types/creator';
import { filterAndSortLinks } from '../../utils/pureLogic';
import { 
  Sparkles, 
  Mail, 
  ExternalLink, 
  ArrowRight, 
  Share2, 
  Activity, 
  Zap, 
  ChevronRight,
  Disc,
  Radio,
  ShoppingBag
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

export const DarkCreatorTemplate: React.FC<TemplateProps> = ({
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
    { id: 'conteudos', label: 'Músicas & Áudio' },
    { id: 'produtos', label: 'Packs & Merch' },
    { id: 'redes', label: 'Canais' },
    { id: 'comunidade', label: 'Discord' },
    { id: 'contato', label: 'Booking' },
  ];

  return (
    <div 
      className="min-h-screen text-zinc-100 selection:bg-purple-600 selection:text-white"
      style={{ backgroundColor: design.colors.background || '#09090B' }}
    >
      {/* Dark Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[128px]" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-[128px]" />
      </div>

      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-[#09090B]/80 backdrop-blur-md border-b border-zinc-800/80 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-outfit text-lg font-bold tracking-tight text-white block">
                {profile.displayName}
              </span>
              <span className="text-[10px] font-mono text-purple-400 tracking-wider uppercase block">
                //@live_frequency
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenLetter}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.35)]"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Transmissão Fãs</span>
            </button>
          </div>
        </div>
      </header>

      {/* 1. HERO DARK IMPACTANTE */}
      <section className="relative z-10 px-6 pt-12 pb-16 md:pt-20 md:pb-24 border-b border-zinc-800/80">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span>{profile.location || 'Berlim & São Paulo'}</span>
              <span>·</span>
              <span className="text-zinc-400">Canal Ativo</span>
            </div>

            <h1 className="font-outfit text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
              {profile.displayName}
            </h1>

            <p className="text-lg text-purple-200/90 font-medium leading-relaxed">
              {profile.tagline}
            </p>

            <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
              {profile.bio}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#links"
                className="px-6 py-3 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-[0_0_25px_rgba(139,92,246,0.4)] flex items-center gap-2"
              >
                <span>Acessar Músicas & Links</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onOpenLetter}
                className="px-6 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 hover:text-white transition-all flex items-center gap-2"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Mensagem aos Fãs</span>
              </button>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative group mx-auto max-w-sm">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-500 opacity-30 group-hover:opacity-75 blur-md transition-opacity duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 aspect-square shadow-2xl">
                <img
                  src={profile.avatarUrl}
                  alt={profile.displayName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>AUDIO_CORE_V4</span>
                  </span>
                  <span className="text-purple-400 font-semibold">ONLINE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CARTA AOS FÃS (CYBER ENVELOPE) */}
      <section className="relative z-10 px-6 py-12 bg-zinc-950/60 border-b border-zinc-800/80">
        <div className="max-w-4xl mx-auto">
          <div className="border border-purple-500/20 rounded-2xl p-6 sm:p-8 bg-zinc-900/80 backdrop-blur shadow-[0_0_30px_rgba(139,92,246,0.1)] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[11px] font-mono uppercase tracking-wider text-purple-400 flex items-center justify-center md:justify-start gap-1.5">
                <Disc className="w-3.5 h-3.5 text-purple-400" />
                Transmissão Decodificada
              </span>
              <h2 className="font-outfit text-2xl sm:text-3xl font-bold text-white">
                {letter.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
                {letter.teaser}
              </p>
            </div>

            <button
              onClick={onOpenLetter}
              className="shrink-0 flex items-center gap-3 px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]"
            >
              <span>Decodificar Carta</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. BIOGRAFIA & TIMELINE */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto border-b border-zinc-800/80">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400">
              01 // ORIGEM & TRAJETÓRIA
            </span>
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-white">
              História & Filosofia
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {profile.fullStory || profile.bio}
            </p>

            <div className="pt-4">
              <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider block mb-2">
                Tech Stack & Universo
              </span>
              <div className="flex flex-wrap gap-2">
                {profile.interests?.map((interest, i) => (
                  <span
                    key={i}
                    className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-lg font-mono"
                  >
                    #{interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-7">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 block mb-4">
              Marcos & Lançamentos
            </span>
            <div className="space-y-6 border-l border-zinc-800 pl-6 ml-2">
              {profile.trajectory?.map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(139,92,246,0.8)] border-2 border-black" />
                  <span className="font-mono text-xs text-purple-400 font-bold">{item.year}</span>
                  <h3 className="font-outfit text-xl font-bold text-white mt-0.5">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. REVISTA & POSTS */}
      <section className="relative z-10 px-6 py-16 bg-zinc-950/40 border-b border-zinc-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 block mb-1">
                02 // ARTIGOS & LOGS
              </span>
              <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-white">
                Publicações & Tutoriais
              </h2>
            </div>
            <span className="text-xs text-zinc-500 font-mono hidden sm:inline">Sound & Tech</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                onClick={() => onOpenPost(post)}
                className="group cursor-pointer rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500/50 overflow-hidden transition-all flex flex-col hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]"
              >
                {post.coverImage && (
                  <div className="aspect-[16/10] overflow-hidden bg-zinc-800">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2 font-mono">
                      <span className="text-purple-400 font-bold">{post.category}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="font-outfit text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-2 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-zinc-800 flex items-center justify-between text-xs font-bold text-purple-400">
                    <span>Ler log completo</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 5. GALERIA */}
      <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto border-b border-zinc-800/80">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 block mb-1">
              03 // REGISTROS VISUAIS
            </span>
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-white">
              Galeria & Estúdio
            </h2>
          </div>
          <span className="text-xs text-zinc-500 font-mono">Toque para inspecionar</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {gallery.map((item) => (
            <div
              key={item.id}
              onClick={() => onOpenGalleryItem(item)}
              className="group relative rounded-xl overflow-hidden cursor-pointer aspect-square bg-zinc-900 border border-zinc-800 hover:border-purple-500/50"
            >
              <img
                src={item.mediaUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                  {item.category}
                </span>
                <p className="font-outfit text-lg font-bold text-white">{item.title}</p>
                <p className="text-xs text-zinc-300 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. LINKS */}
      <section id="links" className="relative z-10 px-6 py-16 bg-[#09090B] border-b border-zinc-800/80 scroll-mt-20">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 block mb-1">
              04 // HUB DE CONEXÕES
            </span>
            <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-white">
              Canais & Plataformas
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Links rápidos para streaming, presets e canais da comunidade.
            </p>

            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-xs rounded-lg font-mono transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-purple-600 text-white font-bold shadow-[0_0_15px_rgba(139,92,246,0.5)]'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white'
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
                    ? 'bg-zinc-900/90 border-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.25)]'
                    : 'bg-zinc-900/50 hover:bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white truncate">
                        {link.title}
                      </span>
                      {link.isFeatured && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-900 text-purple-300 font-bold">
                          PINNED
                        </span>
                      )}
                    </div>
                    {link.description && (
                      <p className="text-xs text-zinc-400 truncate mt-0.5">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3 text-zinc-500 group-hover:text-purple-400 transition-colors shrink-0">
                  <ExternalLink className="w-4 h-4" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* 7. PRODUTOS */}
      {products && products.length > 0 && (
        <section className="relative z-10 px-6 py-16 max-w-5xl mx-auto border-b border-zinc-800/80">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-purple-400 block mb-1">
                05 // SOUND STORE & GEAR
              </span>
              <h2 className="font-outfit text-3xl sm:text-4xl font-bold text-white">
                Packs & Produtos Digitais
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Checkout Seguro</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-purple-500/40 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[16/10] bg-zinc-800 overflow-hidden relative">
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {prod.badge && (
                      <span className="absolute top-3 right-3 text-[10px] font-mono font-bold bg-purple-600 text-white px-2.5 py-1 rounded-md">
                        {prod.badge}
                      </span>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-baseline justify-between mb-2">
                      <h3 className="font-outfit text-2xl font-bold text-white">
                        {prod.title}
                      </h3>
                      {prod.price && (
                        <span className="font-mono text-base font-bold text-purple-400">
                          {prod.price}
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-4">
                      {prod.description}
                    </p>

                    {prod.benefits && prod.benefits.length > 0 && (
                      <ul className="space-y-1.5 text-xs text-zinc-400 border-t border-zinc-800 pt-3 mb-4">
                        {prod.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
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
                    className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-500 text-center block transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                  >
                    Download / Comprar
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 text-center text-xs text-zinc-500 font-mono">
        <p className="font-outfit text-xl text-white font-bold mb-1">
          {profile.displayName}
        </p>
        <p className="text-zinc-500 text-[11px] mb-3">
          Fan Page construída na Creator World
        </p>
        <p>@{profile.username} · All frequencies reserved</p>
      </footer>
    </div>
  );
};
