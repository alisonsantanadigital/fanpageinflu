import React, { useState } from 'react';
import { CreatorAccount, FanLetter } from '../../types/creator';
import { Mail, Save, Check, Sparkles, Heart } from 'lucide-react';
import { InteractiveLetterModal } from '../public/InteractiveLetterModal';

interface LetterViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
}

export const LetterView: React.FC<LetterViewProps> = ({ account, onUpdate }) => {
  const [letter, setLetter] = useState<FanLetter>(account.letter);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showTestModal, setShowTestModal] = useState(false);

  const handleSave = () => {
    onUpdate({ ...account, letter });
    setStatusMsg('Carta salva com sucesso!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-400" />
            <span>Carta aos Fãs com Lacre de Cera</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Crie uma experiência emocional única: o fã toca no envelope digital, rompe o lacre e lê sua carta pessoal.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowTestModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span>Testar Experiência</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
          >
            {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{statusMsg || 'Salvar Carta'}</span>
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-5">
        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Título da Carta *
          </label>
          <input
            type="text"
            value={letter.title}
            onChange={(e) => setLetter({ ...letter, title: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Texto Teaser do Envelope (Antes de abrir)
          </label>
          <input
            type="text"
            value={letter.teaser}
            onChange={(e) => setLetter({ ...letter, teaser: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Assinatura do Criador
            </label>
            <input
              type="text"
              value={letter.signature}
              onChange={(e) => setLetter({ ...letter, signature: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm font-serif italic text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Data de Envio
            </label>
            <input
              type="text"
              value={letter.date}
              onChange={(e) => setLetter({ ...letter, date: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Cor do Lacre de Cera
            </label>
            <div className="flex items-center gap-3 p-2 rounded-xl bg-neutral-800 border border-neutral-700">
              <input
                type="color"
                value={letter.waxSealColor || '#8F714B'}
                onChange={(e) => setLetter({ ...letter, waxSealColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-neutral-300 uppercase">
                {letter.waxSealColor || '#8F714B'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Estilo do Envelope
            </label>
            <select
              value={letter.envelopeStyle || 'classic'}
              onChange={(e) => setLetter({ ...letter, envelopeStyle: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="classic">Clássico Marfim (Editorial)</option>
              <option value="noir">Noir Cyberpunk (Escuro)</option>
              <option value="parchment">Pergaminho Natural (Minimalista)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Texto Completo da Carta aos Fãs
          </label>
          <textarea
            rows={8}
            value={letter.text}
            onChange={(e) => setLetter({ ...letter, text: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white font-serif leading-relaxed focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Interactive Letter Modal Test */}
      <InteractiveLetterModal
        letter={letter}
        creatorName={account.profile.displayName}
        isOpen={showTestModal}
        onClose={() => setShowTestModal(false)}
      />
    </div>
  );
};
