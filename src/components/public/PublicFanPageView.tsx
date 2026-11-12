import React, { useEffect } from 'react';
import { CreatorAccount } from '../../types/creator';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { recordPageView } from '../../services/storageService';
import { 
  ArrowLeft, 
  Palette, 
  LayoutDashboard, 
  Sparkles,
  Users
} from 'lucide-react';

interface PublicFanPageViewProps {
  account: CreatorAccount;
  allAccounts: CreatorAccount[];
  onBackToDashboard: () => void;
  onOpenVisualEditor: () => void;
  onSelectAccount: (username: string) => void;
  onNewCreator: () => void;
}

export const PublicFanPageView: React.FC<PublicFanPageViewProps> = ({
  account,
  allAccounts,
  onBackToDashboard,
  onOpenVisualEditor,
  onSelectAccount,
  onNewCreator,
}) => {
  useEffect(() => {
    recordPageView(account.profile.username);
  }, [account.profile.username]);

  return (
    <div className="relative min-h-screen">
      {/* Subtle Floating Owner Bar */}
      <aside aria-label="Barra de controle do proprietário" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-neutral-950/90 text-white backdrop-blur-md border border-neutral-800 rounded-full px-4 py-2 shadow-2xl flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-neutral-300 hidden sm:inline">
            /@{account.profile.username}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-neutral-800 hidden sm:block" />

        <div className="flex items-center gap-1.5">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
            <span>Painel</span>
          </button>

          <button
            onClick={onOpenVisualEditor}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Editar</span>
          </button>

          {/* Quick Creator Switcher */}
          <div className="relative group">
            <button
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-400 hover:text-white transition-colors"
              title="Trocar Influenciador"
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Trocar</span>
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-neutral-900 border border-neutral-800 rounded-xl p-1.5 shadow-xl min-w-[180px]">
              <div className="px-2 py-1 text-[10px] font-mono text-neutral-500 uppercase">
                Ver Outro Criador
              </div>
              {allAccounts.map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onSelectAccount(acc.profile.username)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-lg transition-colors truncate ${
                    acc.id === account.id
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  {acc.profile.displayName}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Render Public Template */}
      <TemplateRenderer account={account} isPreview={false} />
    </div>
  );
};
