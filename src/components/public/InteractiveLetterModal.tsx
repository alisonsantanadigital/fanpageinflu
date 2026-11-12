import React, { useState } from 'react';
import { FanLetter } from '../../types/creator';
import { X, Heart, MailOpen, Sparkles } from 'lucide-react';

interface InteractiveLetterModalProps {
  letter: FanLetter;
  creatorName: string;
  isOpen: boolean;
  onClose: () => void;
  onOpened?: () => void;
}

export const InteractiveLetterModal: React.FC<InteractiveLetterModalProps> = ({
  letter,
  creatorName,
  isOpen,
  onClose,
  onOpened,
}) => {
  const [isUnsealed, setIsUnsealed] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  if (!isOpen) return null;

  const handleOpenEnvelope = () => {
    setIsUnsealed(true);
    onOpened?.();
  };

  const handleClose = () => {
    setIsUnsealed(false);
    onClose();
  };

  const envelopeBg =
    letter.envelopeStyle === 'noir'
      ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
      : letter.envelopeStyle === 'parchment'
      ? 'bg-[#F4EFEA] border-[#E5DACF] text-neutral-800'
      : 'bg-[#FAF7F2] border-[#E8DFC8] text-neutral-900';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={handleClose} />

      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-2xl shadow-2xl transition-all duration-500">
        <button
          onClick={handleClose}
          aria-label="Fechar carta aos fãs"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-neutral-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isUnsealed ? (
          /* Sealed Envelope View */
          <div className={`p-8 md:p-12 rounded-2xl border text-center transition-all ${envelopeBg}`}>
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
              <MailOpen className="w-6 h-6 opacity-75" />
            </div>

            <p className="text-xs uppercase tracking-widest opacity-60 mb-2 font-medium">
              Correspondência Especial
            </p>
            <h2 className="text-2xl md:text-3xl font-serif font-normal tracking-tight mb-3">
              {letter.title}
            </h2>
            <p className="text-sm opacity-80 max-w-md mx-auto mb-8 leading-relaxed">
              {letter.teaser}
            </p>

            {/* Interactive Wax Seal */}
            <div className="flex flex-col items-center justify-center">
              <button
                onClick={handleOpenEnvelope}
                aria-label="Romper lacre de cera e abrir carta"
                style={{ backgroundColor: letter.waxSealColor || '#8F714B' }}
                className="group relative w-20 h-20 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform flex items-center justify-center cursor-pointer border-4 border-white/20"
              >
                <div className="text-white text-center">
                  <span className="block font-serif text-xl font-bold tracking-tighter">
                    {creatorName.charAt(0)}
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-mono opacity-90 block">
                    Abrir
                  </span>
                </div>
                <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors" />
              </button>
              <span className="mt-3 text-xs opacity-60 font-medium">
                Toque no lacre de cera para desdobrar a carta
              </span>
            </div>
          </div>
        ) : (
          /* Unfolded Letter View */
          <div className="bg-[#FAF7F2] text-neutral-900 border border-[#E8DFC8] rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
            {/* Elegant decorative top ribbon */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200/80 mb-6 text-xs text-neutral-500">
              <span className="uppercase tracking-widest font-medium font-mono text-[11px]">
                De: {creatorName}
              </span>
              <span>{letter.date}</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-serif font-normal text-neutral-900 mb-6 leading-tight">
              {letter.title}
            </h3>

            <div className="prose prose-neutral max-w-none text-base md:text-lg leading-relaxed font-serif text-neutral-800 whitespace-pre-line mb-8">
              {letter.text}
            </div>

            {/* Creator signature block */}
            <div className="pt-6 border-t border-neutral-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-1 font-mono text-[10px]">
                  Assinatura do Criador
                </p>
                <p className="font-serif italic text-xl md:text-2xl text-neutral-900 font-semibold tracking-tight">
                  {letter.signature || creatorName}
                </p>
              </div>

              <button
                onClick={() => setHasLiked(!hasLiked)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  hasLiked
                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                    : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${hasLiked ? 'fill-current text-rose-500' : ''}`} />
                <span>{hasLiked ? 'Mensagem guardada no coração' : 'Amei esta carta'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
