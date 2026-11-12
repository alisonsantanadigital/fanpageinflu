import React, { useState } from 'react';
import { TemplateId } from '../../types/creator';
import { sanitizeSlug } from '../../utils/pureLogic';
import { X, Sparkles, User, Mail, Globe, Check } from 'lucide-react';

interface NewCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (username: string, displayName: string, email: string, templateId: TemplateId) => void;
}

export const NewCreatorModal: React.FC<NewCreatorModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [templateId, setTemplateId] = useState<TemplateId>('editorial-luxury');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNameChange = (val: string) => {
    setDisplayName(val);
    if (!username) {
      setUsername(sanitizeSlug(val));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = sanitizeSlug(username);
    if (!cleanUser || cleanUser.length < 2) {
      setError('O nome de usuário deve ter pelo menos 2 caracteres.');
      return;
    }
    if (!displayName.trim()) {
      setError('Por favor informe o nome do influenciador.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Informe um e-mail válido.');
      return;
    }

    onCreate(cleanUser, displayName.trim(), email.trim(), templateId);
    onClose();
  };

  const templates: { id: TemplateId; name: string; tag: string; desc: string }[] = [
    {
      id: 'editorial-luxury',
      name: '01. Editorial Luxury',
      tag: 'Revista & Luxo',
      desc: 'Fotografia ampla, Cormorant Garamond, sofisticação e tons quentes de marfim.',
    },
    {
      id: 'dark-creator',
      name: '02. Dark Creator',
      tag: 'Tech & Sound',
      desc: 'Interface escura, neon violeta/ciano, estilo cibernético e contemporâneo.',
    },
    {
      id: 'minimal-personal',
      name: '03. Minimal Personal',
      tag: 'Notion & Clean',
      desc: 'Design minimalista, foco na escrita reflexiva e proximidade com a audiência.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-neutral-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
            Nova Fan Page Premium
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight">
          Criar Espaço para Novo Influenciador
        </h2>
        <p className="text-xs text-neutral-400 mt-1 mb-6">
          Cada criador tem sua conta isolada, links próprios, revista pessoal e endereço exclusivo.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Nome do Criador ou Marca *
            </label>
            <input
              type="text"
              placeholder="Ex: Marina Andrade"
              value={displayName}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Nome de Usuário (Slug) *
              </label>
              <div className="flex items-center">
                <span className="px-2.5 py-2.5 bg-neutral-800 border border-r-0 border-neutral-700 rounded-l-xl text-xs font-mono text-neutral-400">
                  @
                </span>
                <input
                  type="text"
                  placeholder="marinaandrade"
                  value={username}
                  onChange={(e) => setUsername(sanitizeSlug(e.target.value))}
                  className="flex-1 px-3 py-2.5 rounded-r-xl bg-neutral-800 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                E-mail do Criador *
              </label>
              <input
                type="email"
                placeholder="contato@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Model selection */}
          <div className="pt-2">
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Escolha o Modelo Visual Inicial
            </label>
            <div className="space-y-2">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => setTemplateId(tmpl.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    templateId === tmpl.id
                      ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500/30'
                      : 'bg-neutral-800/40 border-neutral-700/60 hover:bg-neutral-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-white">{tmpl.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {tmpl.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400">{tmpl.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-md"
            >
              Criar Fan Page Oficial
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
