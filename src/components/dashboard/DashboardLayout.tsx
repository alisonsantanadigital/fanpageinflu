import React, { useState } from 'react';
import { CreatorAccount, TemplateId } from '../../types/creator';
import { Sidebar, DashboardTab } from './Sidebar';
import { OverviewView } from './OverviewView';
import { MyPageView } from './MyPageView';
import { ProfileView } from './ProfileView';
import { LinksView } from './LinksView';
import { GalleryView } from './GalleryView';
import { PostsView } from './PostsView';
import { LetterView } from './LetterView';
import { ProductsView } from './ProductsView';
import { SettingsView } from './SettingsView';
import { NewCreatorModal } from './NewCreatorModal';
import { ShareModal } from '../public/ShareModal';
import { AiCopilotModal } from '../ai/AiCopilotModal';
import { InstagramAutoConnectModal } from '../ai/InstagramAutoConnectModal';
import { applyGeneratedAndInstagramToAccount } from '../../utils/creatorMapper';
import {
  Palette,
  ExternalLink,
  Share2,
  Menu,
  AlertTriangle
} from 'lucide-react';

interface DashboardLayoutProps {
  activeAccount: CreatorAccount;
  allAccounts: CreatorAccount[];
  onSelectAccount: (username: string) => void;
  onUpdateAccount: (updatedAccount: CreatorAccount) => void;
  onCreateAccount: (username: string, displayName: string, email: string, templateId: TemplateId) => void;
  onOpenVisualEditor: () => void;
  onViewPublic: () => void;
  onReloadAll: () => void;
  onResetDefault: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  activeAccount,
  allAccounts,
  onSelectAccount,
  onUpdateAccount,
  onCreateAccount,
  onOpenVisualEditor,
  onViewPublic,
  onReloadAll,
  onResetDefault,
}) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('overview');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAiCopilot, setShowAiCopilot] = useState(false);
  const [showInstagramConnect, setShowInstagramConnect] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab: DashboardTab) => {
    setCurrentTab(tab);
    setMobileMenuOpen(false);
  };

  const handleApplyAiGenerated = (generated: Record<string, any>) => {
    const updatedAccount = applyGeneratedAndInstagramToAccount(activeAccount, generated);
    onUpdateAccount(updatedAccount);
  };

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'overview':
        return (
          <OverviewView
            account={activeAccount}
            onOpenVisualEditor={onOpenVisualEditor}
            onOpenInstagramConnect={() => setShowInstagramConnect(true)}
            onViewPublic={onViewPublic}
            onShare={() => setShowShareModal(true)}
            onNavigateTab={handleSelectTab}
          />
        );
      case 'my-page':
        return (
          <MyPageView
            account={activeAccount}
            onOpenVisualEditor={onOpenVisualEditor}
            onViewPublic={onViewPublic}
            onShare={() => setShowShareModal(true)}
          />
        );
      case 'profile':
        return <ProfileView account={activeAccount} onUpdate={onUpdateAccount} />;
      case 'links':
        return <LinksView account={activeAccount} onUpdate={onUpdateAccount} />;
      case 'gallery':
        return <GalleryView account={activeAccount} onUpdate={onUpdateAccount} />;
      case 'posts':
        return <PostsView account={activeAccount} onUpdate={onUpdateAccount} />;
      case 'letter':
        return <LetterView account={activeAccount} onUpdate={onUpdateAccount} />;
      case 'products':
        return <ProductsView account={activeAccount} onUpdate={onUpdateAccount} />;
      case 'settings':
        return (
          <SettingsView
            account={activeAccount}
            onUpdate={onUpdateAccount}
            onReloadAll={onReloadAll}
            onOpenInstagramConnect={() => setShowInstagramConnect(true)}
          />
        );
      default:
        return (
          <OverviewView
            account={activeAccount}
            onOpenVisualEditor={onOpenVisualEditor}
            onOpenInstagramConnect={() => setShowInstagramConnect(true)}
            onViewPublic={onViewPublic}
            onShare={() => setShowShareModal(true)}
            onNavigateTab={handleSelectTab}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
          activeAccount={activeAccount}
          allAccounts={allAccounts}
          onSelectAccount={onSelectAccount}
          onNewCreator={() => setShowNewModal(true)}
          onOpenVisualEditor={onOpenVisualEditor}
          onOpenAiCopilot={() => setShowAiCopilot(true)}
          onOpenInstagramConnect={() => setShowInstagramConnect(true)}
          onViewPublic={onViewPublic}
          onResetDefault={() => setShowResetModal(true)}
        />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 bg-neutral-900 h-full">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={handleSelectTab}
              activeAccount={activeAccount}
              allAccounts={allAccounts}
              onSelectAccount={onSelectAccount}
              onNewCreator={() => {
                setMobileMenuOpen(false);
                setShowNewModal(true);
              }}
              onOpenVisualEditor={() => {
                setMobileMenuOpen(false);
                onOpenVisualEditor();
              }}
              onOpenAiCopilot={() => {
                setMobileMenuOpen(false);
                setShowAiCopilot(true);
              }}
              onOpenInstagramConnect={() => {
                setMobileMenuOpen(false);
                setShowInstagramConnect(true);
              }}
              onViewPublic={() => {
                setMobileMenuOpen(false);
                onViewPublic();
              }}
              onResetDefault={() => {
                setMobileMenuOpen(false);
                setShowResetModal(true);
              }}
            />
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-4 md:px-8 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 md:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white capitalize">
                {currentTab.replace('-', ' ')}
              </span>
              <span className="text-neutral-500 text-xs hidden sm:inline">/</span>
              <span className="text-xs font-mono text-neutral-400 hidden sm:inline">
                /@{activeAccount.profile.username}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenVisualEditor}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Editor Visual</span>
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors hidden sm:block"
              title="Compartilhar"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={onViewPublic}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Fan Page</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* New Creator Modal */}
      <NewCreatorModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreate={onCreateAccount}
      />

      {/* Share Modal */}
      <ShareModal
        account={activeAccount}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      {/* AI Copilot Modal */}
      <AiCopilotModal
        isOpen={showAiCopilot}
        onClose={() => setShowAiCopilot(false)}
        onApplyGenerated={handleApplyAiGenerated}
        currentProfileName={activeAccount.profile.displayName}
      />

      {/* Instagram Auto-Connect + Gemini Modal */}
      <InstagramAutoConnectModal
        account={activeAccount}
        isOpen={showInstagramConnect}
        onClose={() => setShowInstagramConnect(false)}
        onApplyAccount={onUpdateAccount}
        onViewPublic={onViewPublic}
        onOpenVisualEditor={onOpenVisualEditor}
      />

      {/* Restore Default Confirmation Dialog */}
      {showResetModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-restore-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 id="dashboard-restore-title" className="text-base font-semibold text-white">
                  Restaurar Padrão Original
                </h3>
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                  Deseja restaurar o layout e o conteúdo da página de{' '}
                  <strong className="text-white">{activeAccount.profile.displayName}</strong> para o template original escolhido na criação?
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onResetDefault();
                  setShowResetModal(false);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
              >
                Confirmar Restauração
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
