import React from 'react';
import { Post } from '../../types/creator';
import { X, Clock, Calendar, Share2, ArrowLeft } from 'lucide-react';

interface PostReaderModalProps {
  post: Post | null;
  creatorName: string;
  onClose: () => void;
  onShare?: () => void;
}

export const PostReaderModal: React.FC<PostReaderModalProps> = ({
  post,
  creatorName,
  onClose,
  onShare,
}) => {
  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <article className="relative z-10 w-full md:max-w-3xl h-full md:h-auto md:max-h-[92vh] bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 md:rounded-2xl shadow-2xl overflow-y-auto flex flex-col">
        {/* Sticky top action bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white/90 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Revista</span>
          </button>

          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={onShare}
                className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                title="Compartilhar publicação"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post content container */}
        <div className="p-6 md:p-10 flex-1">
          {/* Metadata header */}
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            <span className="font-medium text-amber-700 dark:text-amber-400 uppercase tracking-widest text-[11px]">
              {post.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {post.date}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>

          <h1 className="text-2xl md:text-4xl font-serif font-normal tracking-tight leading-snug mb-6 text-neutral-950 dark:text-white">
            {post.title}
          </h1>

          <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-300 italic mb-8 font-serif leading-relaxed border-l-2 border-amber-600/40 pl-4">
            {post.excerpt}
          </p>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="mb-8 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 aspect-[16/9] shadow-sm">
              <img
                src={post.coverImage}
                alt={post.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Body content */}
          <div className="prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-base md:text-lg leading-relaxed whitespace-pre-line font-serif space-y-4">
            {post.content}
          </div>

          {/* Author footer banner */}
          <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <div>
              <span className="block text-[11px] uppercase tracking-wider font-mono">Autor</span>
              <span className="text-sm font-medium text-neutral-900 dark:text-white">{creatorName}</span>
            </div>
            <span>Publicado na Creator World</span>
          </div>
        </div>
      </article>
    </div>
  );
};
