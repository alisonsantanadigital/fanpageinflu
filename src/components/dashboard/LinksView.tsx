import React, { useState } from 'react';
import { CreatorAccount, LinkCategory, SocialLink } from '../../types/creator';
import { 
  Link2, 
  Plus, 
  Trash2, 
  Star, 
  Eye, 
  EyeOff, 
  ExternalLink, 
  Check, 
  Save, 
  MoveUp, 
  MoveDown,
  MousePointerClick
} from 'lucide-react';

interface LinksViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
}

export const LinksView: React.FC<LinksViewProps> = ({ account, onUpdate }) => {
  const [links, setLinks] = useState<SocialLink[]>(account.links || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // New Link form state
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<LinkCategory>('conteudos');
  const [newIsFeatured, setNewIsFeatured] = useState(false);

  const handleToggleActive = (id: string) => {
    const updated = links.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l);
    setLinks(updated);
  };

  const handleToggleFeatured = (id: string) => {
    const updated = links.map(l => l.id === id ? { ...l, isFeatured: !l.isFeatured } : l);
    setLinks(updated);
  };

  const handleDelete = (id: string) => {
    const updated = links.filter(l => l.id !== id);
    setLinks(updated);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= links.length) return;
    const copy = [...links];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    copy.forEach((item, idx) => {
      item.order = idx + 1;
    });
    setLinks(copy);
  };

  const handleAddLink = () => {
    if (!newTitle.trim() || !newUrl.trim()) return;
    const created: SocialLink = {
      id: `link_${Date.now()}`,
      title: newTitle.trim(),
      url: newUrl.trim(),
      description: newDescription.trim() || undefined,
      icon: 'sparkles',
      category: newCategory,
      isFeatured: newIsFeatured,
      isActive: true,
      order: links.length + 1,
      clicksCount: 0,
    };
    const updated = [...links, created];
    setLinks(updated);
    setShowAddModal(false);
    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
    setNewIsFeatured(false);
  };

  const handleSave = () => {
    const updatedAccount = { ...account, links };
    onUpdate(updatedAccount);
    setStatusMsg('Links salvos com sucesso!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Link2 className="w-5 h-5 text-amber-400" />
            <span>Gerenciador de Links Avançado</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Estilo Linktree premium com categorias, links em destaque, ordem personalizada e métricas de cliques.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Link</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
          >
            {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{statusMsg || 'Salvar Alterações'}</span>
          </button>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link, idx) => (
          <div
            key={link.id}
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all ${
              link.isActive
                ? 'bg-neutral-900 border-neutral-800'
                : 'bg-neutral-900/40 border-neutral-800/40 opacity-60'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {/* Reorder arrows */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1 text-neutral-500 hover:text-white disabled:opacity-20"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === links.length - 1}
                  className="p-1 text-neutral-500 hover:text-white disabled:opacity-20"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white truncate">
                    {link.title}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {link.category}
                  </span>
                  {link.isFeatured && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-semibold flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Destaque
                    </span>
                  )}
                </div>
                {link.description && (
                  <p className="text-xs text-neutral-400 truncate mt-0.5">{link.description}</p>
                )}
                <span className="text-[11px] font-mono text-neutral-500 truncate block mt-0.5">
                  {link.url}
                </span>
              </div>
            </div>

            {/* Actions: Clicks, Feature, Active, Delete */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Click Counter */}
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-mono">
                <MousePointerClick className="w-3 h-3 text-amber-400" />
                <span>{link.clicksCount || 0} cliques</span>
              </div>

              <button
                onClick={() => handleToggleFeatured(link.id)}
                className={`p-2 rounded-lg transition-colors ${
                  link.isFeatured
                    ? 'text-amber-400 bg-amber-500/10'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
                title={link.isFeatured ? 'Remover dos destaques' : 'Destacar no topo'}
              >
                <Star className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleToggleActive(link.id)}
                className="p-2 rounded-lg text-neutral-400 hover:text-white transition-colors"
                title={link.isActive ? 'Desativar link' : 'Ativar link'}
              >
                {link.isActive ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-neutral-500" />}
              </button>

              <button
                onClick={() => handleDelete(link.id)}
                className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 transition-colors"
                title="Excluir link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Link Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-semibold text-white">Adicionar Novo Link</h3>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Título do Link *
              </label>
              <input
                type="text"
                placeholder="Ex: Novo Álbum no Spotify"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                URL de Destino *
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Descrição Curta (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Ouça com exclusividade"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Categoria
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="conteudos">Conteúdos</option>
                <option value="produtos">Produtos & Serviços</option>
                <option value="redes">Redes Sociais</option>
                <option value="comunidade">Comunidade</option>
                <option value="contato">Contato</option>
                <option value="parcerias">Parcerias</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-xs text-neutral-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={newIsFeatured}
                onChange={(e) => setNewIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-amber-500 focus:ring-0"
              />
              <span>Destacar link com borda especial no topo</span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddLink}
                disabled={!newTitle || !newUrl}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-50"
              >
                Adicionar Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
