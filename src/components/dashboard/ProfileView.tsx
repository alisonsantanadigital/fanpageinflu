import React, { useState } from 'react';
import { CreatorAccount, TrajectoryItem } from '../../types/creator';
import { Save, Plus, Trash2, Check, User, MapPin } from 'lucide-react';

interface ProfileViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ account, onUpdate }) => {
  const [profile, setProfile] = useState(account.profile);
  const [newInterest, setNewInterest] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleAddTrajectory = () => {
    const newItem: TrajectoryItem = {
      year: new Date().getFullYear().toString(),
      title: 'Novo Marco',
      description: 'Descrição do marco ou conquista.',
    };
    setProfile({
      ...profile,
      trajectory: [...(profile.trajectory || []), newItem],
    });
  };

  const handleRemoveTrajectory = (index: number) => {
    const updated = [...(profile.trajectory || [])];
    updated.splice(index, 1);
    setProfile({ ...profile, trajectory: updated });
  };

  const handleTrajectoryChange = (index: number, field: keyof TrajectoryItem, value: string) => {
    const updated = [...(profile.trajectory || [])];
    updated[index] = { ...updated[index], [field]: value };
    setProfile({ ...profile, trajectory: updated });
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    setProfile({
      ...profile,
      interests: [...(profile.interests || []), newInterest.trim()],
    });
    setNewInterest('');
  };

  const handleRemoveInterest = (idx: number) => {
    const updated = [...(profile.interests || [])];
    updated.splice(idx, 1);
    setProfile({ ...profile, interests: updated });
  };

  const handleSave = () => {
    const updatedAccount = { ...account, profile };
    onUpdate(updatedAccount);
    setStatusMsg('Perfil atualizado com sucesso!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Meu Perfil & Biografia Editorial</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Personalize quem você é, sua história completa e os marcos da sua carreira.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
        >
          {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{statusMsg || 'Salvar Perfil'}</span>
        </button>
      </div>

      {/* Main Info */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h2 className="text-sm font-semibold text-white">Dados Principais</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={profile.displayName}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Localização / Base
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.location || ''}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                placeholder="Ex: Paris & São Paulo"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
              <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Frase de Apresentação (Tagline)
          </label>
          <input
            type="text"
            value={profile.tagline}
            onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Biografia Curta
          </label>
          <textarea
            rows={2}
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            História Completa (Seção Quem Sou)
          </label>
          <textarea
            rows={4}
            value={profile.fullStory}
            onChange={(e) => setProfile({ ...profile, fullStory: e.target.value })}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Trajectory Timeline */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Trajetória & Linha do Tempo</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Conte os marcos importantes da sua carreira para seus fãs.
            </p>
          </div>
          <button
            onClick={handleAddTrajectory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors border border-neutral-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar Marco</span>
          </button>
        </div>

        <div className="space-y-3">
          {profile.trajectory?.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex items-start gap-4"
            >
              <div className="w-20 shrink-0">
                <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                  Ano
                </label>
                <input
                  type="text"
                  value={item.year}
                  onChange={(e) => handleTrajectoryChange(idx, 'year', e.target.value)}
                  className="w-full px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-white text-center"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Título do Marco
                  </label>
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) => handleTrajectoryChange(idx, 'title', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-neutral-400 mb-1">
                    Detalhes
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleTrajectoryChange(idx, 'description', e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-300"
                  />
                </div>
              </div>

              <button
                onClick={() => handleRemoveTrajectory(idx)}
                className="p-1.5 rounded-lg text-neutral-500 hover:text-rose-400 hover:bg-neutral-900 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Interests / Personalidade */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Interesses & Universo Pessoal</h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Hobbies, temas favoritos e paixões que definem sua essência.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.interests?.map((interest, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-neutral-800 border border-neutral-700 text-neutral-200"
            >
              <span>{interest}</span>
              <button
                onClick={() => handleRemoveInterest(idx)}
                className="text-neutral-500 hover:text-rose-400"
              >
                &times;
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 max-w-sm pt-2">
          <input
            type="text"
            placeholder="Ex: Fotografia Analógica"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddInterest()}
            className="flex-1 px-3 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleAddInterest}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold border border-neutral-700 transition-colors"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
};
