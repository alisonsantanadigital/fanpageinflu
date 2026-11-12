import React, { useState, useEffect } from 'react';
import { CreatorAccount, TemplateId } from './types/creator';
import {
  getStoredAccounts,
  getActiveCreatorUsername,
  setActiveCreatorUsername,
  getAccountByUsername,
  saveAccount,
  createNewAccount,
} from './services/storageService';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { VisualEditor } from './components/editor/VisualEditor';
import { PublicFanPageView } from './components/public/PublicFanPageView';
import { NewCreatorModal } from './components/dashboard/NewCreatorModal';

export default function App() {
  const [accounts, setAccounts] = useState<CreatorAccount[]>([]);
  const [activeUsername, setActiveUsername] = useState<string>('helenavogue');
  const [appMode, setAppMode] = useState<'dashboard' | 'editor' | 'public'>('dashboard');
  const [showNewModal, setShowNewModal] = useState(false);

  // Initialize and load accounts from storage
  useEffect(() => {
    const loadedAccounts = getStoredAccounts();
    setAccounts(loadedAccounts);

    // Check if URL specifies a creator e.g. /@lucasneon or #@lucasneon
    const hash = window.location.hash.replace('#', '');
    const path = window.location.pathname.replace('/', '');
    const matchedSlug = (hash || path).replace(/^@+/, '').toLowerCase();

    if (matchedSlug) {
      const match = loadedAccounts.find(a => a.profile.username.toLowerCase() === matchedSlug);
      if (match) {
        setActiveUsername(match.profile.username);
        setAppMode('public');
        return;
      }
    }

    const defaultActive = getActiveCreatorUsername();
    setActiveUsername(defaultActive);
  }, []);

  const currentAccount = accounts.find(
    a => a.profile.username.toLowerCase() === activeUsername.toLowerCase()
  ) || accounts[0];

  const handleSelectAccount = (username: string) => {
    setActiveUsername(username);
    setActiveCreatorUsername(username);
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
    setAppMode('editor'); // Jump straight into the Visual Editor for the new creator!
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
        onBackToDashboard={() => setAppMode('dashboard')}
        onViewPublic={() => setAppMode('public')}
      />
    );
  }

  // 2. Public Fan Page Experience Mode
  if (appMode === 'public') {
    return (
      <PublicFanPageView
        account={currentAccount}
        allAccounts={accounts}
        onBackToDashboard={() => setAppMode('dashboard')}
        onOpenVisualEditor={() => setAppMode('editor')}
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
        onOpenVisualEditor={() => setAppMode('editor')}
        onViewPublic={() => setAppMode('public')}
        onReloadAll={handleReloadAll}
      />

      <NewCreatorModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onCreate={handleCreateAccount}
      />
    </>
  );
}
