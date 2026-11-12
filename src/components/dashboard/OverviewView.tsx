import React from 'react';
import { CreatorAccount } from '../../types/creator';
import { 
  Eye, 
  Link2, 
  FileText, 
  CheckCircle, 
  Share2, 
  ExternalLink, 
  TrendingUp, 
  Mail, 
  ShoppingBag,
  Palette,
  Sparkles
} from 'lucide-react';

interface OverviewViewProps {
  account: CreatorAccount;
  onOpenVisualEditor: () => void;
  onViewPublic: () => void;
  onShare: () => void;
  onNavigateTab: (tab: any) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  account,
  onOpenVisualEditor,
  onViewPublic,
  onShare,
  onNavigateTab,
}) => {
  const { analytics, profile, links, posts, products, letter } = account;

  const statCards = [
    {
      title: 'Visualizações da Página',
      value: (analytics.totalViews || 0).toLocaleString('pt-BR'),
      change: '+14% esta semana',
      icon: <Eye className="w-5 h-5 text-amber-400" />,
    },
    {
      title: 'Cliques nos Links',
      value: (analytics.linkClicks || 0).toLocaleString('pt-BR'),
      change: '+22% conversão',
      icon: <Link2 className="w-5 h-5 text-sky-400" />,
    },
    {
      title: 'Publicações Realizadas',
      value: (posts || []).length.toString(),
      change: 'Revista Pessoal',
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
    },
    {
      title: 'Status do Site',
      value: account.isPublished ? 'Publicado' : 'Rascunho',
      change: account.isPublished ? 'Disponível na Web' : 'Aguardando publicação',
      icon: <CheckCircle className={`w-5 h-5 ${account.isPublished ? 'text-emerald-400' : 'text-amber-400'}`} />,
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Welcome Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 to-neutral-800/80 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-amber-500/40 shrink-0">
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-white">
                Olá, {profile.displayName}
              </h1>
              <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                Fan Page Ativa
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl">
              Sua fan page está operando com o modelo{' '}
              <strong className="text-neutral-200 uppercase font-mono text-[11px]">
                {account.design.templateId.replace('-', ' ')}
              </strong>
              . Edite visualmente e acompanhe o engajamento da sua audiência.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onViewPublic}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-all"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            <span>Visualizar Página</span>
          </button>

          <button
            onClick={onShare}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartilhar</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div
            key={i}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800/90 flex flex-col justify-between shadow-sm hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-neutral-400">{stat.title}</span>
              <div className="p-2 rounded-xl bg-neutral-800/80">{stat.icon}</div>
            </div>
            <div>
              <p className="text-2xl font-bold font-mono text-white tracking-tight">
                {stat.value}
              </p>
              <p className="text-[11px] text-neutral-500 mt-1 font-mono">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Editor Visual Card */}
        <div
          onClick={onOpenVisualEditor}
          className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 border border-neutral-800 hover:border-amber-500/50 transition-all flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Editor Visual em Tempo Real</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Altere cores, fontes, modelos, fotos e veja o resultado instantaneamente na tela dividida.
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-400 mt-6 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Abrir Editor WYSIWYG &rarr;
          </span>
        </div>

        {/* Links Manager Card */}
        <div
          onClick={() => onNavigateTab('links')}
          className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 border border-neutral-800 hover:border-sky-500/50 transition-all flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Link2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Gerenciador de Links</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Organize seus links por categorias, destaque produtos importantes e acompanhe cliques.
            </p>
          </div>
          <span className="text-xs font-semibold text-sky-400 mt-6 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Gerenciar {links.length} links &rarr;
          </span>
        </div>

        {/* Fan Letter Card */}
        <div
          onClick={() => onNavigateTab('letter')}
          className="group cursor-pointer p-6 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 border border-neutral-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Carta aos Fãs com Lacre</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Escreva uma correspondência pessoal com envelope digital interativo e selo de cera.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-400 mt-6 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Editar carta &rarr;
          </span>
        </div>
      </div>

      {/* Traffic & Weekly Insight Strip */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Desempenho Semanal de Acessos</span>
          </h4>
          <p className="text-xs text-neutral-400">
            Acompanhe o tráfego gerado pela sua bio do Instagram, TikTok e YouTube.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {analytics.dailyStats?.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <div className="h-16 w-6 bg-neutral-800 rounded-lg flex items-end p-1">
                <div
                  className="w-full bg-amber-500 rounded-sm transition-all"
                  style={{
                    height: `${Math.min(100, Math.max(15, (day.views / 12000) * 100))}%`,
                  }}
                />
              </div>
              <span className="text-[10px] font-mono text-neutral-500">{day.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
