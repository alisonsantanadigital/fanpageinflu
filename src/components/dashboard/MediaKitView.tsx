import React, { useState } from 'react';
import { CreatorAccount, MediaKitData, CommercialPackage, SocialPlatformMetric } from '../../types/creator';
import { 
  Briefcase, 
  Save, 
  Check, 
  Plus, 
  Trash2, 
  TrendingUp, 
  Users, 
  Eye, 
  Instagram, 
  Video, 
  FileDown, 
  ExternalLink,
  Target,
  Sparkles,
  PhoneCall,
  Calendar,
  Layers
} from 'lucide-react';
import { MediaKitModal } from '../public/MediaKitModal';

interface MediaKitViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
}

const createDefaultMediaKit = (account: CreatorAccount): MediaKitData => ({
  tagline: 'Audiência qualificada. Resultado medido.',
  headline: 'Parcerias com posicionamento editorial e conversão.',
  quote: 'Marca não compra post. Compra confiança construída ao longo do tempo.',
  summary: account.profile.bio,
  totalFollowers: '100K+',
  monthlyInteractions: '1.2M',
  totalViews: '12M+',
  platforms: [
    {
      platform: 'instagram',
      handle: `@${account.profile.instagramUsername || account.profile.username}`,
      followers: '80K',
      totalViews: '850K',
      storyViews: '12K / story',
    },
  ],
  demographics: {
    femalePercentage: 68,
    malePercentage: 32,
    capitalsPercentage: 64,
    primaryAgeRange: '18–35 anos (72%)',
    keyHighlights: ['Alta taxa de salvamento e compartilhamento', 'Público concentrado nas principais capitais'],
  },
  contentPillars: [
    { title: 'Rotina & Bastidores', description: 'Conteúdo orgânico inserido no dia a dia com storytelling.' },
    { title: 'Curadoria Autoral', description: 'Recomendações de produtos e experiências com foco em qualidade.' },
  ],
  categoriesFit: ['Lifestyle', 'Educação', 'Tecnologia', 'Bem-estar'],
  packages: [
    {
      id: 'pkg_default_1',
      type: 'avulso',
      title: 'Combo Reels + Stories',
      description: '1 Reels autoral + sequência de 4 Stories com link direto.',
      price: 'Sob Consulta',
      deliverables: ['Roteiro colaborativo', 'Relatório de métricas após 7 dias'],
      popular: true,
    },
  ],
  commercialContact: {
    name: `Assessoria ${account.profile.displayName}`,
    email: account.user.email,
    whatsapp: '',
    availabilityNotice: 'Agenda aberta para este mês',
  },
});

export const MediaKitView: React.FC<MediaKitViewProps> = ({ account, onUpdate }) => {
  const [mediaKit, setMediaKit] = useState<MediaKitData>(account.mediaKit || createDefaultMediaKit(account));
  const [activeTab, setActiveTab] = useState<'metrics' | 'demographics' | 'pillars' | 'packages' | 'contact'>('metrics');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Package creation modal state
  const [showPkgModal, setShowPkgModal] = useState(false);
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgType, setPkgType] = useState<'avulso' | 'combinado' | 'recorrente'>('avulso');
  const [pkgPrice, setPkgPrice] = useState('Sob Consulta');
  const [pkgDesc, setPkgDesc] = useState('');
  const [pkgDeliverables, setPkgDeliverables] = useState('');

  const handleSave = () => {
    onUpdate({ ...account, mediaKit });
    setStatusMsg('Mídia Kit atualizado com sucesso!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleAddPackage = () => {
    if (!pkgTitle.trim()) return;
    const deliverablesArr = pkgDeliverables
      ? pkgDeliverables.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    const newPkg: CommercialPackage = {
      id: `pkg_${Date.now()}`,
      type: pkgType,
      title: pkgTitle.trim(),
      description: pkgDesc.trim(),
      price: pkgPrice.trim() || 'Sob Consulta',
      deliverables: deliverablesArr,
      popular: pkgType === 'combinado',
    };

    setMediaKit({
      ...mediaKit,
      packages: [...mediaKit.packages, newPkg],
    });

    setShowPkgModal(false);
    setPkgTitle('');
    setPkgDesc('');
    setPkgPrice('Sob Consulta');
    setPkgDeliverables('');
  };

  const handleDeletePackage = (id: string) => {
    setMediaKit({
      ...mediaKit,
      packages: mediaKit.packages.filter(p => p.id !== id),
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Briefcase className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">
              Mídia Kit Comercial & Propostas para Marcas
            </h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold">
              Ativo
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
            Painel comercial inspirado em criadores de alta performance (como o modelo do Mídia Kit da Melissa Costa):
            métricas de audiência, dados demográficos, formatos de publicidade e tabela de valores.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {mediaKit.pdfDownloadUrl && (
            <a
              href={mediaKit.pdfDownloadUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700"
              title="Baixar PDF Original"
            >
              <FileDown className="w-3.5 h-3.5 text-amber-400" />
              <span>Ver PDF</span>
            </a>
          )}

          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-amber-400 bg-neutral-800 hover:bg-neutral-700 transition-colors border border-neutral-700"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Visualizar Mídia Kit</span>
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

      {/* Navigation Subtabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'metrics', label: '1. Métricas & Redes', icon: <TrendingUp className="w-3.5 h-3.5" /> },
          { id: 'demographics', label: '2. Demografia & Qualificação', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'pillars', label: '3. Pilares & Entregáveis', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'packages', label: '4. Tabela de Valores & Formatos', icon: <Target className="w-3.5 h-3.5" /> },
          { id: 'contact', label: '5. Contato Comercial & Agenda', icon: <PhoneCall className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-amber-500/15 text-amber-300 font-semibold border border-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-850'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: MÉTRICAS & REDES */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Headline & Frases de Impacto Comercial</h3>
            <p className="text-xs text-neutral-400">
              Frases que sintetizam o seu posicionamento perante marcas e agências de publicidade.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Tagline Comercial
                </label>
                <input
                  type="text"
                  value={mediaKit.tagline}
                  onChange={(e) => setMediaKit({ ...mediaKit, tagline: e.target.value })}
                  placeholder="Ex: Audiência qualificada. Resultado medido."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Frase de Posicionamento (Headline)
                </label>
                <input
                  type="text"
                  value={mediaKit.headline}
                  onChange={(e) => setMediaKit({ ...mediaKit, headline: e.target.value })}
                  placeholder="Ex: Não entrego publi. Entrego performance."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Citação / Frase de Impacto ("Quote")
              </label>
              <input
                type="text"
                value={mediaKit.quote}
                onChange={(e) => setMediaKit({ ...mediaKit, quote: e.target.value })}
                placeholder="Ex: Marca não compra post. Compra decisão de compra."
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm italic text-amber-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Resumo Comercial para Apresentações
              </label>
              <textarea
                rows={3}
                value={mediaKit.summary}
                onChange={(e) => setMediaKit({ ...mediaKit, summary: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* 3 Core Impact Numbers */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Números Consolidados de Alcance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Seguidores Totais
                </label>
                <input
                  type="text"
                  value={mediaKit.totalFollowers}
                  onChange={(e) => setMediaKit({ ...mediaKit, totalFollowers: e.target.value })}
                  placeholder="Ex: 641K"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Interações Mensais
                </label>
                <input
                  type="text"
                  value={mediaKit.monthlyInteractions}
                  onChange={(e) => setMediaKit({ ...mediaKit, monthlyInteractions: e.target.value })}
                  placeholder="Ex: 3.8M"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-base font-mono font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Visualizações Totais
                </label>
                <input
                  type="text"
                  value={mediaKit.totalViews}
                  onChange={(e) => setMediaKit({ ...mediaKit, totalViews: e.target.value })}
                  placeholder="Ex: 62M+"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-base font-mono font-bold text-sky-400 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Platform breakdown */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Desmembramento por Rede Social</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaKit.platforms.map((plat, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
                      {plat.platform === 'instagram' ? <Instagram className="w-4 h-4 text-rose-400" /> : <Video className="w-4 h-4 text-cyan-400" />}
                      {plat.platform}
                    </span>
                    <span className="text-xs font-mono text-neutral-400">{plat.handle}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Seguidores</span>
                      <input
                        type="text"
                        value={plat.followers}
                        onChange={(e) => {
                          const updated = [...mediaKit.platforms];
                          updated[idx].followers = e.target.value;
                          setMediaKit({ ...mediaKit, platforms: updated });
                        }}
                        className="w-full px-2 py-1 rounded bg-neutral-900 border border-neutral-700 font-mono text-white text-xs mt-0.5"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Views / Mês</span>
                      <input
                        type="text"
                        value={plat.totalViews || ''}
                        onChange={(e) => {
                          const updated = [...mediaKit.platforms];
                          updated[idx].totalViews = e.target.value;
                          setMediaKit({ ...mediaKit, platforms: updated });
                        }}
                        className="w-full px-2 py-1 rounded bg-neutral-900 border border-neutral-700 font-mono text-white text-xs mt-0.5"
                      />
                    </div>
                  </div>

                  {plat.platform === 'instagram' && (
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-mono block">Média Views nos Stories</span>
                      <input
                        type="text"
                        value={plat.storyViews || ''}
                        onChange={(e) => {
                          const updated = [...mediaKit.platforms];
                          updated[idx].storyViews = e.target.value;
                          setMediaKit({ ...mediaKit, platforms: updated });
                        }}
                        placeholder="Ex: 15K / story"
                        className="w-full px-2 py-1 rounded bg-neutral-900 border border-neutral-700 font-mono text-amber-300 text-xs mt-0.5"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DEMOGRAFIA & QUALIFICAÇÃO */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Composição Demográfica do Público</h3>
            <p className="text-xs text-neutral-400">
              Informações retiradas diretamente do painel de Insights para comprovar o público comprador.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  % Público Feminino
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mediaKit.demographics.femalePercentage}
                    onChange={(e) =>
                      setMediaKit({
                        ...mediaKit,
                        demographics: {
                          ...mediaKit.demographics,
                          femalePercentage: Number(e.target.value),
                          malePercentage: 100 - Number(e.target.value),
                        },
                      })
                    }
                    className="w-20 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-base font-mono font-bold text-white"
                  />
                  <span className="text-xs text-neutral-400">%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  % em Capitais Brasileiras
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={mediaKit.demographics.capitalsPercentage}
                    onChange={(e) =>
                      setMediaKit({
                        ...mediaKit,
                        demographics: {
                          ...mediaKit.demographics,
                          capitalsPercentage: Number(e.target.value),
                        },
                      })
                    }
                    className="w-20 px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-base font-mono font-bold text-white"
                  />
                  <span className="text-xs text-neutral-400">%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700">
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Faixa Etária Principal
                </label>
                <input
                  type="text"
                  value={mediaKit.demographics.primaryAgeRange}
                  onChange={(e) =>
                    setMediaKit({
                      ...mediaKit,
                      demographics: {
                        ...mediaKit.demographics,
                        primaryAgeRange: e.target.value,
                      },
                    })
                  }
                  placeholder="Ex: 18–35 anos (72%)"
                  className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-mono text-white"
                />
              </div>
            </div>

            {/* Highlights list */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-2">
                Destaques de Qualificação (Bullets)
              </label>
              <div className="space-y-2">
                {mediaKit.demographics.keyHighlights.map((hl, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={hl}
                      onChange={(e) => {
                        const updated = [...mediaKit.demographics.keyHighlights];
                        updated[idx] = e.target.value;
                        setMediaKit({
                          ...mediaKit,
                          demographics: { ...mediaKit.demographics, keyHighlights: updated },
                        });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
                    />
                    <button
                      onClick={() => {
                        const updated = [...mediaKit.demographics.keyHighlights];
                        updated.splice(idx, 1);
                        setMediaKit({
                          ...mediaKit,
                          demographics: { ...mediaKit.demographics, keyHighlights: updated },
                        });
                      }}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PILARES & ENTREGÁVEIS */}
      {activeTab === 'pillars' && (
        <div className="space-y-6">
          {/* Content pillars */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Pilares de Conteúdo na Prática</h3>
            <p className="text-xs text-neutral-400">
              Como visto no Mídia Kit (Corrida, Ciclismo, Natação, Musculação): demonstre as modalidades e rotinas onde a marca será inserida.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mediaKit.contentPillars.map((pillar, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2">
                  <input
                    type="text"
                    value={pillar.title}
                    onChange={(e) => {
                      const updated = [...mediaKit.contentPillars];
                      updated[idx].title = e.target.value;
                      setMediaKit({ ...mediaKit, contentPillars: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs font-bold text-white"
                  />
                  <textarea
                    rows={2}
                    value={pillar.description}
                    onChange={(e) => {
                      const updated = [...mediaKit.contentPillars];
                      updated[idx].description = e.target.value;
                      setMediaKit({ ...mediaKit, contentPillars: updated });
                    }}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-neutral-300"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Categories with direct fit */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Categorias com Encaixe Direto</h3>
            <p className="text-xs text-neutral-400">
              Nichos comerciais ideais para ativações de produto.
            </p>

            <div className="flex flex-wrap gap-2">
              {mediaKit.categoriesFit.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 flex items-center gap-1.5"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() => {
                      const updated = [...mediaKit.categoriesFit];
                      updated.splice(idx, 1);
                      setMediaKit({ ...mediaKit, categoriesFit: updated });
                    }}
                    className="text-neutral-500 hover:text-rose-400"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: TABELA DE VALORES & FORMATOS */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">Formatos de Parceria & Tabela de Valores</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Formatos avulsos (Stories, Feed, Reels, TikTok), combos estratégicos e planos recorrentes de embaixadora.
                </p>
              </div>

              <button
                onClick={() => setShowPkgModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Formato</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mediaKit.packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    pkg.popular
                      ? 'bg-neutral-850 border-amber-500/50 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-neutral-800/60 border-neutral-700/60'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 font-semibold">
                        {pkg.type}
                      </span>
                      {pkg.popular && (
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">
                          Destaque
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white">{pkg.title}</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">{pkg.description}</p>

                    {pkg.deliverables && pkg.deliverables.length > 0 && (
                      <ul className="text-[11px] text-neutral-300 space-y-1 pt-2 border-t border-neutral-700/60">
                        {pkg.deliverables.map((d, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-700/60 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-amber-400">{pkg.price || 'Sob Consulta'}</span>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="p-1 text-neutral-500 hover:text-rose-400 transition-colors"
                      title="Excluir formato"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: CONTATO COMERCIAL & AGENDA */}
      {activeTab === 'contact' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h3 className="text-sm font-semibold text-white">Canal Direto para Agências & Marcas</h3>
          <p className="text-xs text-neutral-400">
            Contatos de assessoria comercial e status de disponibilidade da agenda.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Nome da Assessoria / Contato
              </label>
              <input
                type="text"
                value={mediaKit.commercialContact.name}
                onChange={(e) =>
                  setMediaKit({
                    ...mediaKit,
                    commercialContact: { ...mediaKit.commercialContact, name: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                E-mail Comercial Oficial
              </label>
              <input
                type="email"
                value={mediaKit.commercialContact.email}
                onChange={(e) =>
                  setMediaKit({
                    ...mediaKit,
                    commercialContact: { ...mediaKit.commercialContact, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                WhatsApp Comercial
              </label>
              <input
                type="text"
                value={mediaKit.commercialContact.whatsapp}
                onChange={(e) =>
                  setMediaKit({
                    ...mediaKit,
                    commercialContact: { ...mediaKit.commercialContact, whatsapp: e.target.value },
                  })
                }
                placeholder="+55 11 98765-4321"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Aviso de Disponibilidade de Agenda
              </label>
              <input
                type="text"
                value={mediaKit.commercialContact.availabilityNotice || ''}
                onChange={(e) =>
                  setMediaKit({
                    ...mediaKit,
                    commercialContact: {
                      ...mediaKit.commercialContact,
                      availabilityNotice: e.target.value,
                    },
                  })
                }
                placeholder="Ex: Agenda com poucas datas disponíveis em setembro / Q4"
                className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-amber-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal for creating a new commercial package */}
      {showPkgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-semibold text-white">Novo Formato de Parceria</h3>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Título do Formato *
              </label>
              <input
                type="text"
                placeholder="Ex: 2 Stories com Demonstração"
                value={pkgTitle}
                onChange={(e) => setPkgTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Tipo
                </label>
                <select
                  value={pkgType}
                  onChange={(e) => setPkgType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
                >
                  <option value="avulso">Avulso</option>
                  <option value="combinado">Combo Estratégico</option>
                  <option value="recorrente">Parceria Mensal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Preço
                </label>
                <input
                  type="text"
                  placeholder="Sob Consulta ou R$ 3.500"
                  value={pkgPrice}
                  onChange={(e) => setPkgPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Descrição do Pacote
              </label>
              <textarea
                rows={2}
                placeholder="Explique como o formato entrega resultado..."
                value={pkgDesc}
                onChange={(e) => setPkgDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Entregáveis (Separados por vírgula)
              </label>
              <input
                type="text"
                placeholder="Ex: 2 Stories, Link na bio por 24h, Relatório pós"
                value={pkgDeliverables}
                onChange={(e) => setPkgDeliverables(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowPkgModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPackage}
                disabled={!pkgTitle}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 disabled:opacity-50"
              >
                Salvar Formato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Kit Fullscreen Preview Modal */}
      <MediaKitModal
        account={account}
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
      />
    </div>
  );
};
