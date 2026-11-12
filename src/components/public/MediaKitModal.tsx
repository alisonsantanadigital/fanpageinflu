import React, { useState } from 'react';
import { CreatorAccount, CommercialPackage } from '../../types/creator';
import { 
  X, 
  FileDown, 
  Share2, 
  TrendingUp, 
  Users, 
  Instagram, 
  Video, 
  Check, 
  ArrowRight, 
  Mail, 
  Calendar, 
  Flame, 
  Bike, 
  Waves, 
  Dumbbell, 
  Sparkles,
  ShieldCheck,
  Send
} from 'lucide-react';

interface MediaKitModalProps {
  account: CreatorAccount;
  isOpen: boolean;
  onClose: () => void;
}

export const MediaKitModal: React.FC<MediaKitModalProps> = ({ account, isOpen, onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState<CommercialPackage | null>(null);
  const [brandName, setBrandName] = useState('');
  const [brandEmail, setBrandEmail] = useState('');
  const [brandMessage, setBrandMessage] = useState('');
  const [proposalSent, setProposalSent] = useState(false);

  if (!isOpen) return null;

  const { mediaKit, profile } = account;

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    setProposalSent(true);
    setTimeout(() => {
      // Create mailto or whatsapp link
      const text = encodeURIComponent(
        `Olá! Sou da marca ${brandName} e gostaria de solicitar uma proposta comercial para ${profile.displayName} (Formato: ${selectedPackage?.title || 'Campanha Personalizada'}). Mensagem: ${brandMessage}`
      );
      if (mediaKit.commercialContact?.whatsapp) {
        window.open(`https://api.whatsapp.com/send?phone=${mediaKit.commercialContact.whatsapp.replace(/\D/g, '')}&text=${text}`, '_blank');
      } else {
        window.location.href = `mailto:${mediaKit.commercialContact.email}?subject=Proposta Comercial - ${brandName}&body=${text}`;
      }
      setProposalSent(false);
      setSelectedPackage(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full md:max-w-4xl h-full md:h-auto md:max-h-[92vh] bg-stone-50 dark:bg-neutral-900 text-stone-900 dark:text-neutral-100 md:rounded-3xl shadow-2xl overflow-y-auto flex flex-col border border-stone-200 dark:border-neutral-800">
        {/* Sticky top action bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-stone-50/90 dark:bg-neutral-900/90 backdrop-blur border-b border-stone-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="font-serif text-lg font-bold tracking-tight text-stone-950 dark:text-white">
              {profile.displayName}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-400 font-bold">
              Mídia Kit Oficial
            </span>
          </div>

          <div className="flex items-center gap-2">
            {mediaKit.pdfDownloadUrl && (
              <a
                href={mediaKit.pdfDownloadUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-stone-700 dark:text-neutral-200 bg-stone-200/70 dark:bg-neutral-800 hover:bg-stone-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <FileDown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span className="hidden sm:inline">Baixar PDF</span>
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-500 dark:text-neutral-400 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Kit Body Content */}
        <div className="p-6 md:p-10 space-y-12 flex-1">
          {/* 1. Header / Abertura Mídia Kit */}
          <div className="space-y-4 border-b border-stone-200 dark:border-neutral-800 pb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-stone-500 dark:text-neutral-400">
              <span>{profile.tagline}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-normal leading-tight text-stone-950 dark:text-white">
              {mediaKit.tagline || 'Audiência qualificada. Resultado medido.'}
            </h1>

            <p className="text-base sm:text-lg text-stone-700 dark:text-neutral-300 font-light max-w-2xl leading-relaxed">
              {mediaKit.summary}
            </p>

            {/* 3 Core Highlight Stat Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700/60 shadow-sm">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-neutral-400 block mb-1">
                  Seguidores Totais
                </span>
                <span className="text-3xl font-serif font-bold text-stone-950 dark:text-white">
                  {mediaKit.totalFollowers || '641K'}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Instagram + TikTok</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700/60 shadow-sm">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-700 dark:text-amber-400 block mb-1">
                  Interações / Mês
                </span>
                <span className="text-3xl font-serif font-bold text-amber-700 dark:text-amber-400">
                  {mediaKit.monthlyInteractions || '3.8M'}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Engajamento recorrente</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700/60 shadow-sm">
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-neutral-400 block mb-1">
                  Visualizações Totais
                </span>
                <span className="text-3xl font-serif font-bold text-stone-950 dark:text-white">
                  {mediaKit.totalViews || '62M+'}
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">Vídeos e impressões</span>
              </div>
            </div>
          </div>

          {/* 2. Filosofia & Quote */}
          <div className="bg-amber-500/10 dark:bg-amber-500/5 rounded-2xl p-6 sm:p-8 border border-amber-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold block">
                Posicionamento
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-stone-950 dark:text-white">
                "{mediaKit.quote || 'Marca não compra post. Compra decisão de compra.'}"
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-neutral-300">
                {mediaKit.headline}
              </p>
            </div>

            <button
              onClick={() => setSelectedPackage({ id: 'custom', type: 'combinado', title: 'Ação Personalizada', description: '' })}
              className="shrink-0 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-950 dark:bg-amber-500 hover:opacity-90 text-white dark:text-neutral-950 shadow-md transition-all flex items-center gap-2"
            >
              <span>Solicitar Proposta</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Painel de Redes Sociais */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-neutral-400 block">
              Redes & Métricas Oficiais
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mediaKit.platforms?.map((plat, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {plat.platform === 'instagram' ? (
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
                          <Instagram className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center">
                          <Video className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-bold uppercase block">{plat.platform}</span>
                        <span className="text-xs text-stone-500 dark:text-neutral-400 font-mono">
                          {plat.handle}
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verificado
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-100 dark:border-neutral-700/60">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-stone-500 dark:text-neutral-400 block">
                        Seguidores
                      </span>
                      <span className="text-xl font-serif font-bold text-stone-900 dark:text-white">
                        {plat.followers}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase text-stone-500 dark:text-neutral-400 block">
                        {plat.platform === 'instagram' ? 'Stories (Média)' : 'Visualizações'}
                      </span>
                      <span className="text-xl font-serif font-bold text-amber-700 dark:text-amber-400">
                        {plat.storyViews || plat.totalViews}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Demografia & Qualificação do Público */}
          <div className="space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-neutral-400 block">
              Dados Demográficos & Poder de Compra
            </span>

            <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-sm">
              <div className="text-center md:text-left space-y-1">
                <span className="text-4xl font-serif font-bold text-stone-950 dark:text-white">
                  {mediaKit.demographics.femalePercentage}%
                </span>
                <p className="text-xs font-medium text-stone-600 dark:text-neutral-300">Público Feminino</p>
                <p className="text-[11px] text-stone-400">Maior tomada de decisão em compras</p>
              </div>

              <div className="text-center md:text-left space-y-1">
                <span className="text-4xl font-serif font-bold text-stone-950 dark:text-white">
                  {mediaKit.demographics.capitalsPercentage}%
                </span>
                <p className="text-xs font-medium text-stone-600 dark:text-neutral-300">Em Capitais Brasileiras</p>
                <p className="text-[11px] text-stone-400">São Paulo, Rio, Curitiba, Fortaleza</p>
              </div>

              <div className="text-center md:text-left space-y-1">
                <span className="text-4xl font-serif font-bold text-amber-700 dark:text-amber-400">
                  72%
                </span>
                <p className="text-xs font-medium text-stone-600 dark:text-neutral-300">Faixa 18–35 anos</p>
                <p className="text-[11px] text-stone-400">Maior poder aquisitivo e conversão online</p>
              </div>
            </div>
          </div>

          {/* 5. Pilares de Conteúdo na Rotina */}
          {mediaKit.contentPillars && mediaKit.contentPillars.length > 0 && (
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-neutral-400 block">
                Pilares na Rotina Real
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {mediaKit.contentPillars.map((pilar, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-white dark:bg-neutral-800/40 border border-stone-200 dark:border-neutral-700/60 space-y-2 shadow-sm"
                  >
                    <span className="text-xs font-serif font-bold text-stone-950 dark:text-white block">
                      {pilar.title}
                    </span>
                    <p className="text-xs text-stone-600 dark:text-neutral-400 leading-relaxed">
                      {pilar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Formatos de Parceria & Tabela de Valores */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-neutral-400 block">
                  Tabela Comercial
                </span>
                <h3 className="font-serif text-2xl font-normal text-stone-950 dark:text-white">
                  Formatos de Parceria & Investimento
                </h3>
              </div>
              {mediaKit.commercialContact.availabilityNotice && (
                <span className="text-xs font-mono text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10 px-3 py-1 rounded-full hidden sm:inline">
                  {mediaKit.commercialContact.availabilityNotice}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {mediaKit.packages?.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                    pkg.popular
                      ? 'bg-white dark:bg-neutral-850 border-amber-500 shadow-md ring-1 ring-amber-500/20'
                      : 'bg-white dark:bg-neutral-800/60 border-stone-200 dark:border-neutral-700'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 dark:bg-neutral-900 text-stone-600 dark:text-neutral-400 font-semibold">
                        {pkg.type}
                      </span>
                      {pkg.popular && (
                        <span className="text-[10px] font-mono uppercase font-bold text-amber-700 dark:text-amber-400">
                          Recomendado
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-lg font-medium text-stone-950 dark:text-white leading-snug">
                      {pkg.title}
                    </h4>

                    <p className="text-xs text-stone-600 dark:text-neutral-400 leading-relaxed font-sans">
                      {pkg.description}
                    </p>

                    {pkg.deliverables && pkg.deliverables.length > 0 && (
                      <ul className="text-xs text-stone-700 dark:text-neutral-300 space-y-1.5 pt-2 border-t border-stone-100 dark:border-neutral-700/60">
                        {pkg.deliverables.map((d, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="pt-4 mt-4 border-t border-stone-100 dark:border-neutral-700/60 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-900 dark:text-white">
                      {pkg.price || 'Sob Consulta'}
                    </span>
                    <button
                      onClick={() => setSelectedPackage(pkg)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-stone-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90 transition-opacity"
                    >
                      Solicitar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Categorias com Encaixe Direto */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-800/60 border border-stone-200 dark:border-neutral-700 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-neutral-400 block">
              Categorias com Encaixe Direto
            </span>
            <div className="flex flex-wrap gap-2">
              {mediaKit.categoriesFit?.map((cat, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs rounded-full bg-stone-100 dark:bg-neutral-900 text-stone-800 dark:text-neutral-200 border border-stone-200 dark:border-neutral-700"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="p-6 border-t border-stone-200 dark:border-neutral-800 bg-stone-100/60 dark:bg-neutral-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-xs font-semibold text-stone-900 dark:text-white">
              {mediaKit.commercialContact.name}
            </p>
            <p className="text-[11px] text-stone-500 dark:text-neutral-400 font-mono">
              {mediaKit.commercialContact.email} · {mediaKit.commercialContact.whatsapp}
            </p>
          </div>

          <button
            onClick={() => setSelectedPackage({ id: 'custom', type: 'combinado', title: 'Campanha Personalizada', description: '' })}
            className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-600 hover:bg-amber-500 text-white shadow-md transition-colors flex items-center gap-2"
          >
            <span>Falar com a Assessoria</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Proposal Request Modal */}
      {selectedPackage && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-white dark:bg-neutral-900 border border-stone-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative space-y-4">
            <button
              onClick={() => setSelectedPackage(null)}
              className="absolute top-5 right-5 p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-mono uppercase text-amber-600 dark:text-amber-400 font-bold block">
                Solicitação de Proposta
              </span>
              <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-0.5">
                {selectedPackage.title}
              </h3>
            </div>

            <form onSubmit={handleSendProposal} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-neutral-300 mb-1">
                  Nome da Marca / Agência *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Nike, Track&Field, Strava..."
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-neutral-800 border border-stone-300 dark:border-neutral-700 text-xs text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-neutral-300 mb-1">
                  E-mail Comercial para Retorno *
                </label>
                <input
                  type="email"
                  required
                  placeholder="contato@marca.com"
                  value={brandEmail}
                  onChange={(e) => setBrandEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-neutral-800 border border-stone-300 dark:border-neutral-700 text-xs text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-neutral-300 mb-1">
                  Objetivo da Campanha / Produto
                </label>
                <textarea
                  rows={3}
                  placeholder="Conte um pouco sobre o lançamento ou meta..."
                  value={brandMessage}
                  onChange={(e) => setBrandMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-neutral-800 border border-stone-300 dark:border-neutral-700 text-xs text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={proposalSent}
                className="w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider bg-stone-950 dark:bg-amber-500 text-white dark:text-neutral-950 hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mt-4"
              >
                {proposalSent ? (
                  <span>Conectando com Assessoria...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Enviar para WhatsApp / E-mail</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
