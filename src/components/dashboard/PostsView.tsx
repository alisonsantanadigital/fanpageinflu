import React, { useState } from 'react';
import { CreatorAccount, Post } from '../../types/creator';
import { FileText, Plus, Trash2, Check, Save, Edit3, Eye, Clock } from 'lucide-react';

interface PostsViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
}

export const PostsView: React.FC<PostsViewProps> = ({ account, onUpdate }) => {
  const [posts, setPosts] = useState<Post[]>(account.posts || []);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  const handleOpenNew = () => {
    setEditingPost({
      id: `post_${Date.now()}`,
      slug: `novo-artigo-${Date.now()}`,
      title: '',
      excerpt: '',
      content: '',
      coverImage: '/assets/images/editorial_art_magazine_1794505737351.jpg',
      date: 'Novembro 2026',
      readTime: '4 min de leitura',
      category: 'Editorial',
      published: true,
    });
    setShowModal(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost({ ...post });
    setShowModal(true);
  };

  const handleSaveModal = () => {
    if (!editingPost || !editingPost.title.trim()) return;
    const exists = posts.some(p => p.id === editingPost.id);
    let updated: Post[];
    if (exists) {
      updated = posts.map(p => p.id === editingPost.id ? editingPost : p);
    } else {
      updated = [editingPost, ...posts];
    }
    setPosts(updated);
    setShowModal(false);
    setEditingPost(null);
  };

  const handleSaveAll = () => {
    onUpdate({ ...account, posts });
    setStatusMsg('Publicações salvas com sucesso!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span>Revista Pessoal & Publicações</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Escreva artigos, reflexões e ensaios editoriais com capa, leitura imersiva e página exclusiva.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Publicação</span>
          </button>

          <button
            onClick={handleSaveAll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
          >
            {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{statusMsg || 'Salvar Tudo'}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row gap-5 items-start justify-between"
          >
            <div className="flex gap-4 min-w-0">
              {post.coverImage && (
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                  <img
                    src={post.coverImage}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
                  <span className="text-amber-400 font-mono text-[10px] uppercase font-semibold">
                    {post.category}
                  </span>
                  <span>·</span>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-white truncate">{post.title}</h3>
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              <button
                onClick={() => handleEdit(post)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar</span>
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="p-2 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 transition-colors"
                title="Excluir artigo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Article Modal */}
      {showModal && editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-semibold text-white">
              {editingPost.title ? 'Editar Publicação' : 'Criar Nova Publicação'}
            </h3>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Título do Artigo *
              </label>
              <input
                type="text"
                placeholder="Ex: A Arte da Silhueta Contemporânea"
                value={editingPost.title}
                onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Editorial, Moda, Música, Diário"
                  value={editingPost.category}
                  onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Tempo de Leitura
                </label>
                <input
                  type="text"
                  placeholder="Ex: 5 min de leitura"
                  value={editingPost.readTime}
                  onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                URL da Imagem de Capa
              </label>
              <input
                type="text"
                value={editingPost.coverImage}
                onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Resumo / Subtítulo (Excerpt)
              </label>
              <textarea
                rows={2}
                placeholder="Breve introdução atraente para o leitor..."
                value={editingPost.excerpt}
                onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Conteúdo Completo do Artigo
              </label>
              <textarea
                rows={8}
                placeholder="Escreva seu texto aqui..."
                value={editingPost.content}
                onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white font-serif leading-relaxed focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveModal}
                disabled={!editingPost.title}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-50"
              >
                Salvar Artigo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
