import React from 'react';
import { GalleryItem } from '../../types/creator';
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';

interface GalleryLightboxModalProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: GalleryItem) => void;
}

export const GalleryLightboxModal: React.FC<GalleryLightboxModalProps> = ({
  item,
  items,
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen || !item) return null;

  const currentIndex = items.findIndex(i => i.id === item.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < items.length - 1;

  const handlePrev = () => {
    if (hasPrev) onSelect(items[currentIndex - 1]);
  };

  const handleNext = () => {
    if (hasNext) onSelect(items[currentIndex + 1]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <button
        onClick={onClose}
        aria-label="Fechar visualizador de mídia"
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={handlePrev}
          aria-label="Mídia anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={handleNext}
          aria-label="Próxima mídia"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Media display card */}
      <div className="relative z-10 max-w-5xl w-full max-h-[90vh] flex flex-col items-center">
        <div className="max-h-[70vh] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center bg-black/50">
          <img
            src={item.mediaUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            className="max-h-[70vh] max-w-full object-contain rounded-lg"
          />
        </div>

        {/* Caption & metadata */}
        <div className="w-full mt-4 text-center max-w-2xl px-4">
          <div className="flex items-center justify-center gap-3 text-xs text-neutral-400 mb-1">
            <span className="uppercase tracking-wider font-mono text-[10px] text-amber-400">
              {item.category}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {item.date}
            </span>
          </div>

          <h3 className="text-xl font-medium text-white mb-2">{item.title}</h3>
          {item.caption && <p className="text-sm text-neutral-300 mb-3">{item.caption}</p>}

          {/* Tags */}
          {item.tags && item.tags.length > 0 && (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {item.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-xs text-neutral-400 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md flex items-center gap-1"
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
