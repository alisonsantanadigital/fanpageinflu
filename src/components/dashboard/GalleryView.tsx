import React, { useState } from 'react';
import { CreatorAccount, GalleryItem } from '../../types/creator';
import { Image, Plus, Trash2, Check, Save } from 'lucide-react';

interface GalleryViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ account, onUpdate }) => {
  const [gallery, setGallery] = useState<GalleryItem[]>(account.gallery || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newCategory, setNewCategory] = useState('Ensaios');

  const handleDelete = (id: string) => {
    setGallery(gallery.filter(item => item.id !== id));
  };

  const handleAddMedia = () => {
    if (!newTitle.trim() || !newMediaUrl.trim()) return;
    const newItem: GalleryItem = {
      id: `gal_${Date.now()}`,
      title: newTitle.trim(),
      type: 'photo',
      mediaUrl: newMediaUrl.trim(),
      caption: newCaption.trim(),
      category: newCategory.trim() || 'Geral',
      tags: ['Destaque', 'Oficial'],
      date: 'Recente',
      aspectRatio: '16:9',
    };
    setGallery([...gallery, newItem]);
    setShowAddModal(false);
    setNewTitle('');
    setNewMediaUrl('');
    setNewCaption('');
  };

  const handleSave = () => {
    onUpdate({ ...account, gallery });
    setStatusMsg('Galeria salva com sucesso!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Image className="w-5 h-5 text-amber-400" />
            <span>Acervo & Galeria Fotográfica</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Imagens, bastidores e registros fotográficos em alta resolução exibidos na sua fan page.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Foto</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
          >
            {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{statusMsg || 'Salvar Galeria'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
          >
            <div className="aspect-square bg-neutral-800 overflow-hidden relative">
              <img
                src={item.mediaUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white/80 hover:text-rose-400 hover:bg-black transition-colors"
                title="Excluir item"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="p-3 bg-neutral-900">
              <span className="text-[10px] uppercase font-mono text-amber-400 block">
                {item.category}
              </span>
              <p className="text-xs font-semibold text-white truncate">{item.title}</p>
              {item.caption && (
                <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{item.caption}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-semibold text-white">Adicionar Imagem à Galeria</h3>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Título da Imagem *
              </label>
              <input
                type="text"
                placeholder="Ex: Luz da Tarde no Ateliê"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                URL da Imagem *
              </label>
              <input
                type="url"
                placeholder="/assets/images/... ou URL HTTPS"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Legenda / Detalhes
              </label>
              <input
                type="text"
                placeholder="Ex: Bastidores da sessão de fotos"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Categoria
              </label>
              <input
                type="text"
                placeholder="Ex: Bastidores, Ensaio, Equipamentos"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddMedia}
                disabled={!newTitle || !newMediaUrl}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
