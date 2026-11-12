import React, { useState } from 'react';
import { CreatorAccount, ProductItem } from '../../types/creator';
import { ShoppingBag, Plus, Trash2, Check, Save, ExternalLink } from 'lucide-react';

interface ProductsViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ account, onUpdate }) => {
  const [products, setProducts] = useState<ProductItem[]>(account.products || []);
  const [showModal, setShowModal] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('R$ ');
  const [newImageUrl, setNewImageUrl] = useState('/src/assets/images/luxury_product_bottle_1794505738842.jpg');
  const [newBuyUrl, setNewBuyUrl] = useState('');
  const [newBadge, setNewBadge] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [benefitsList, setBenefitsList] = useState<string[]>([]);

  const handleAddBenefit = () => {
    if (!newBenefit.trim()) return;
    setBenefitsList([...benefitsList, newBenefit.trim()]);
    setNewBenefit('');
  };

  const handleRemoveBenefit = (index: number) => {
    const updated = [...benefitsList];
    updated.splice(index, 1);
    setBenefitsList(updated);
  };

  const handleAddProduct = () => {
    if (!newTitle.trim() || !newBuyUrl.trim()) return;
    const newProd: ProductItem = {
      id: `prod_${Date.now()}`,
      title: newTitle.trim(),
      description: newDescription.trim(),
      price: newPrice.trim() || undefined,
      imageUrl: newImageUrl.trim() || '/src/assets/images/luxury_product_bottle_1794505738842.jpg',
      buyUrl: newBuyUrl.trim(),
      badge: newBadge.trim() || undefined,
      benefits: benefitsList,
      active: true,
    };
    setProducts([...products, newProd]);
    setShowModal(false);
    setNewTitle('');
    setNewDescription('');
    setNewPrice('R$ ');
    setNewBuyUrl('');
    setNewBadge('');
    setBenefitsList([]);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleSave = () => {
    onUpdate({ ...account, products });
    setStatusMsg('Produtos salvos com sucesso!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <span>Página de Produtos & Criações</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Cadastre seus produtos, cursos, e-books, perfumes ou mentorias com direcionamento para seu checkout externo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Produto</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
          >
            {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{statusMsg || 'Salvar Produtos'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-neutral-800 relative">
                <img
                  src={prod.imageUrl}
                  alt={prod.title}
                  className="w-full h-full object-cover"
                />
                {prod.badge && (
                  <span className="absolute top-2 right-2 text-[10px] font-mono uppercase bg-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded">
                    {prod.badge}
                  </span>
                )}
              </div>

              <div>
                <div className="flex justify-between items-baseline">
                  <h3 className="text-base font-semibold text-white">{prod.title}</h3>
                  <span className="font-mono text-sm font-bold text-amber-400">{prod.price}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{prod.description}</p>
              </div>

              {prod.benefits && prod.benefits.length > 0 && (
                <ul className="text-xs text-neutral-300 space-y-1">
                  {prod.benefits.map((b, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-800 flex items-center justify-between">
              <a
                href={prod.buyUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-medium text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Link do Checkout</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => handleDelete(prod.id)}
                className="p-1.5 text-neutral-500 hover:text-rose-400 transition-colors"
                title="Excluir produto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto space-y-4">
            <h3 className="text-base font-semibold text-white">Novo Produto</h3>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Nome do Produto *
              </label>
              <input
                type="text"
                placeholder="Ex: Mentoria Exclusiva de Imagem"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Preço (Ex: R$ 290,00)
                </label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Selo de Destaque
                </label>
                <input
                  type="text"
                  placeholder="Ex: Best Seller"
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Link de Compra Externo (Hotmart, Kiwify, Loja Virtual) *
              </label>
              <input
                type="url"
                placeholder="https://pay.hotmart.com/..."
                value={newBuyUrl}
                onChange={(e) => setNewBuyUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Descrição Curta
              </label>
              <textarea
                rows={2}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Benefícios Inclusos
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Ex: Acesso vitalício às aulas"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddBenefit()}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
                />
                <button
                  onClick={handleAddBenefit}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 text-amber-400 text-xs border border-neutral-700"
                >
                  +
                </button>
              </div>
              <div className="space-y-1">
                {benefitsList.map((b, i) => (
                  <div key={i} className="flex justify-between items-center text-xs text-neutral-300 bg-neutral-800/60 px-2 py-1 rounded">
                    <span>{b}</span>
                    <button onClick={() => handleRemoveBenefit(i)} className="text-neutral-500 hover:text-rose-400">
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddProduct}
                disabled={!newTitle || !newBuyUrl}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-50"
              >
                Salvar Produto
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
