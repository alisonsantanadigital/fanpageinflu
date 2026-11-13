import React, { useState, useEffect } from 'react';
import { CreatorAccount, TemplateId } from './types/creator';
import {
  getStoredAccounts,
  getActiveCreatorUsername,
  setActiveCreatorUsername,
  saveAccount,
  createNewAccount,
  restoreCreatorAccountToDefault,
} from './services/storageService';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { VisualEditor } from './components/editor/VisualEditor';
import { PublicFanPageView } from './components/public/PublicFanPageView';
import { NewCreatorModal } from './components/dashboard/NewCreatorModal';

function resolveSlugFromUrl(loadedAccounts: CreatorAccount[]): string | null {
  const hash = window.location.hash.replace(/^#\/?/, '');
  const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
  const rawSlug = (hash || path).replace(/^@+/, '').toLowerCase();
  if (!rawSlug) return null;
  const match = loadedAccounts.find(a => a.profile.username.toLowerCase() === rawSlug);
  return match ? match.profile.username : null;
}

export default function App() {
  const [accounts, setAccounts] = useState<CreatorAccount[]>([]);
  const [activeUsername, setActiveUsername] = useState<string>('helenavogue');
  const [appMode, setAppMode] = useState<'dashboard' | 'editor' | 'public'>('dashboard');
  const [showNewModal, setShowNewModal] = useState(false);

  // Initialize and load accounts from storage
  useEffect(() => {
    const loadedAccounts = getStoredAccounts();
    setAccounts(loadedAccounts);

    const matchedUsername = resolveSlugFromUrl(loadedAccounts);
    if (matchedUsername) {
      setActiveUsername(matchedUsername);
      setAppMode('public');
      return;
    }

    const defaultActive = getActiveCreatorUsername();
    setActiveUsername(defaultActive);
  }, []);

  // Support browser back/forward navigation on /@username URLs
  useEffect(() => {
    const onPopState = () => {
      const loadedAccounts = getStoredAccounts();
      const matchedUsername = resolveSlugFromUrl(loadedAccounts);
      if (matchedUsername) {
        setActiveUsername(matchedUsername);
        setAppMode('public');
      } else {
        setAppMode('dashboard');
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const currentAccount = accounts.find(
    a => a.profile.username.toLowerCase() === activeUsername.toLowerCase()
  ) || accounts[0];

  const navigateToMode = (mode: 'dashboard' | 'editor' | 'public', usernameOverride?: string) => {
    const targetUsername = usernameOverride || currentAccount?.profile.username || activeUsername;
    setAppMode(mode);
    try {
      if (mode === 'public' && targetUsername) {
        const targetPath = `/@${targetUsername}`;
        if (window.location.pathname !== targetPath) {
          window.history.pushState({}, '', targetPath);
        }
      } else if (window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    } catch {
      // Ignore history API errors in restricted contexts
    }
  };

  const handleSelectAccount = (username: string) => {
    setActiveUsername(username);
    setActiveCreatorUsername(username);
    if (appMode === 'public') {
      navigateToMode('public', username);
    }
  };

  const handleUpdateAccount = (updated: CreatorAccount) => {
    saveAccount(updated);
    const refreshed = getStoredAccounts();
    setAccounts(refreshed);
    if (updated.profile.username !== activeUsername) {
      setActiveUsername(updated.profile.username);
      setActiveCreatorUsername(updated.profile.username);
    }
  };

  const handleCreateAccount = (
    username: string,
    displayName: string,
    email: string,
    templateId: TemplateId
  ) => {
    const created = createNewAccount(username, displayName, email, templateId);
    const refreshed = getStoredAccounts();
    setAccounts(refreshed);
    setActiveUsername(created.profile.username);
    navigateToMode('editor', created.profile.username);
  };

  const handleReloadAll = () => {
    const refreshed = getStoredAccounts();
    setAccounts(refreshed);
    setActiveUsername(refreshed[0]?.profile.username || 'helenavogue');
  };

  if (!currentAccount) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white font-mono text-sm">
        Carregando Creator World...
      </div>
    );
  }

  // 1. Visual WYSIWYG Editor Mode
  if (appMode === 'editor') {
    return (
      <VisualEditor
        account={currentAccount}
        onSave={handleUpdateAccount}
        onPublish={(updated) => {
          handleUpdateAccount(updated);
        }}
        onBackToDashboard={() => navigateToMode('dashboard')}
        onViewPublic={() => navigateToMode('public')}
      />
    );
  }

  // 2. Public Fan Page Experience Mode
  if (appMode === 'public') {
    return (
      <PublicFanPageView
        account={currentAccount}
        allAccounts={accounts}
        onBackToDashboard={() => navigateToMode('dashboard')}
        onOpenVisualEditor={() => navigateToMode('editor')}
        onSelectAccount={handleSelectAccount}
        onNewCreator={() => setShowNewModal(true)}
      />
    );
  }

  // 3. Admin / Influencer Dashboard Mode
  return (
    <>
      <DashboardLayout
        activeAccount={currentAccount}
        allAccounts={accounts}
        onSelectAccount={handleSelectAccount}
        onUpdateAccount={handleUpdateAccount}
        onCreateAccount={handleCreateAccount}
        onOpenVisualEditor={() => navigateToMode('editor')}
        onViewPublic={() => navigateToMode('public')}
        onReloadAll={handleReloadAll}
        onResetDefault={() => handleUpdateAccount(restoreCreatorAccountToDefault(currentAccount))}
      />

      <NewCreatorModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreate={handleCreateAccount}
      />
    </>
  );
}
