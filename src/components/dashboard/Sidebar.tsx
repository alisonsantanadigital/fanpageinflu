import React from 'react';
import { CreatorAccount } from '../../types/creator';
import {
  LayoutDashboard,
  Eye,
  Palette,
  User,
  Image,
  Link2,
  FileText,
  Mail,
  ShoppingBag,
  Settings,
  PlusCircle,
  ExternalLink,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  RotateCcw,
  Instagram
} from 'lucide-react';

export type DashboardTab =
  | 'overview'
  | 'my-page'
  | 'appearance'
  | 'profile'
  | 'gallery'
  | 'links'
  | 'posts'
  | 'letter'
  | 'products'
  | 'settings';

interface SidebarProps {
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  activeAccount: CreatorAccount;
  allAccounts: CreatorAccount[];
  onSelectAccount: (username: string) => void;
  onNewCreator: () => void;
  onOpenVisualEditor: () => void;
  onOpenAiCopilot: () => void;
  onOpenInstagramConnect: () => void;
  onViewPublic: () => void;
  onResetDefault: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  activeAccount,
  allAccounts,
  onSelectAccount,
  onNewCreator,
  onOpenVisualEditor,
  onOpenAiCopilot,
  onOpenInstagramConnect,
  onViewPublic,
  onResetDefault,
}) => {
  const [isSwitchOpen, setIsSwitchOpen] = React.useState(false);

  const navItems: { id: DashboardTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'overview', label: 'Visão Geral', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'my-page', label: 'Minha Fan Page', icon: <Eye className="w-4 h-4" /> },
    { id: 'appearance', label: 'Aparência & 10 Modelos', icon: <Palette className="w-4 h-4" />, badge: 'Editor' },
    { id: 'profile', label: 'Meu Perfil & História', icon: <User className="w-4 h-4" /> },
    { id: 'gallery', label: 'Galeria & Vídeos', icon: <Image className="w-4 h-4" /> },
    { id: 'links', label: 'Meus Links Detalhados', icon: <Link2 className="w-4 h-4" /> },
    { id: 'posts', label: 'Revista & Blog', icon: <FileText className="w-4 h-4" /> },
    { id: 'letter', label: 'Carta aos Fãs com Lacre', icon: <Mail className="w-4 h-4" /> },
    { id: 'products', label: 'Livros & Produtos', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'settings', label: 'Configurações & SEO', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0 h-screen select-none font-sans">
      {/* Brand & Panel Header: Named "Meu Espaço" */}
      <div className="h-16 px-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-neutral-950 font-bold text-sm shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            ME
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-white block">
              Meu Espaço
            </span>
            <span className="text-[10px] uppercase font-mono text-neutral-400 block tracking-wider">
              Painel do Criador
            </span>
          </div>
        </div>
      </div>

      {/* Influencer Account Switcher Dropdown */}
      <div className="p-3 border-b border-neutral-800 relative">
        <button
          onClick={() => setIsSwitchOpen(!isSwitchOpen)}
          className="w-full flex items-center justify-between p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700/60 transition-all text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-700 shrink-0">
              <img
                src={activeAccount.profile.avatarUrl}
                alt={activeAccount.profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-semibold text-white block truncate">
                {activeAccount.profile.displayName}
              </span>
              <span className="text-[10px] font-mono text-neutral-400 block truncate">
                /@{activeAccount.profile.username}
              </span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
        </button>

        {/* Switcher Menu */}
        {isSwitchOpen && (
          <div className="absolute top-full left-3 right-3 mt-1.5 z-30 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl p-1.5 space-y-1">
            <div className="px-2 py-1 text-[10px] font-mono uppercase text-neutral-400 tracking-wider">
              Alternar Criador
            </div>
            {allAccounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => {
                  onSelectAccount(acc.profile.username);
                  setIsSwitchOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition-colors ${
                  acc.id === activeAccount.id
                    ? 'bg-amber-500/15 text-amber-300 font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-700/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-6 h-6 rounded-full overflow-hidden bg-neutral-600 shrink-0">
                    <img src={acc.profile.avatarUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="truncate">{acc.profile.displayName}</span>
                </div>
                {acc.id === activeAccount.id && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                )}
              </button>
            ))}

            <div className="pt-1 border-t border-neutral-700/80">
              <button
                onClick={() => {
                  setIsSwitchOpen(false);
                  onNewCreator();
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-amber-400 hover:bg-neutral-700/60 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Criar Novo Criador</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Copilot & Instagram Auto-Fill Actions in Sidebar */}
      <div className="px-3 pt-3 space-y-2">
        <button
          onClick={onOpenInstagramConnect}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-rose-500/15 via-purple-500/10 to-transparent border border-rose-500/30 hover:bg-rose-500/20 text-rose-200 text-xs font-semibold transition-all group"
        >
          <div className="flex items-center gap-2">
            <Instagram className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            <span>Instagram + IA</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-rose-500/90 text-white font-bold px-1.5 py-0.5 rounded">
            {activeAccount.instagramIntegration?.connected ? 'Conectado' : 'Auto-Fill'}
          </span>
        </button>

        <button
          onClick={onOpenAiCopilot}
          className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-transparent border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold transition-all group"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>Preencher com IA</span>
          </div>
          <span className="text-[10px] font-mono uppercase bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.5 rounded">
            Voz & Prompt
          </span>
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'appearance') {
                onOpenVisualEditor();
              } else {
                onSelectTab(item.id);
              }
            }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
              currentTab === item.id
                ? 'bg-amber-500/10 text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/60'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-neutral-800 space-y-2">
        <button
          onClick={onViewPublic}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-white transition-all border border-neutral-700"
        >
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
          <span>Ver Fan Page Pública</span>
        </button>

        {/* Restore Defaults button */}
        <button
          onClick={onResetDefault}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-neutral-500 hover:text-amber-400 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Padrão</span>
        </button>

        <div className="text-center">
          <span className="text-[10px] font-mono text-neutral-500">
            /@{activeAccount.profile.username}
          </span>
        </div>
      </div>
    </aside>
  );
};
