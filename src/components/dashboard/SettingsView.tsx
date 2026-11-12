import React, { useState } from 'react';
import { CreatorAccount } from '../../types/creator';
import { sanitizeSlug } from '../../utils/pureLogic';
import { exportDatabaseJSON, importDatabaseJSON, resetToDemoData } from '../../services/storageService';
import { 
  Settings, 
  Instagram, 
  Database, 
  Globe, 
  Share2, 
  Save, 
  Check, 
  Download, 
  Upload, 
  RotateCcw, 
  Code2, 
  Copy, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface SettingsViewProps {
  account: CreatorAccount;
  onUpdate: (updatedAccount: CreatorAccount) => void;
  onReloadAll: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ account, onUpdate, onReloadAll }) => {
  const [slug, setSlug] = useState(account.profile.username);
  const [metaTitle, setMetaTitle] = useState(account.seo?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(account.seo?.metaDescription || '');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [showInstagramModal, setShowInstagramModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Manual Instagram importer inputs
  const [manualMediaUrl, setManualMediaUrl] = useState('');
  const [manualPostTitle, setManualPostTitle] = useState('');

  const handleSaveGeneral = () => {
    const cleanSlug = sanitizeSlug(slug) || account.profile.username;
    const updatedAccount: CreatorAccount = {
      ...account,
      profile: {
        ...account.profile,
        username: cleanSlug,
      },
      publishedUrl: `/@${cleanSlug}`,
      seo: {
        metaTitle: metaTitle.trim() || `${account.profile.displayName} — Fan Page Oficial`,
        metaDescription: metaDescription.trim() || account.profile.tagline,
      },
    };
    onUpdate(updatedAccount);
    setStatusMsg('Configurações salvas!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleExportJson = () => {
    const jsonStr = exportDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `creator-world-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importDatabaseJSON(content);
      if (res.success) {
        alert(res.message);
        onReloadAll();
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = () => {
    if (confirm('Deseja restaurar as 3 contas de demonstração originais? Isso resetará alterações locais.')) {
      resetToDemoData();
      onReloadAll();
    }
  };

  const handleManualInstagramImport = () => {
    if (!manualMediaUrl.trim()) return;
    const newMedia = {
      id: `gal_ig_${Date.now()}`,
      title: manualPostTitle.trim() || 'Importado do Instagram',
      type: 'photo' as const,
      mediaUrl: manualMediaUrl.trim(),
      caption: 'Mídia importada manualmente da conta do Instagram.',
      tags: ['Instagram', 'Importado'],
      category: 'Instagram',
      date: 'Recente',
      aspectRatio: '1:1' as const,
    };
    const updated = {
      ...account,
      gallery: [newMedia, ...(account.gallery || [])],
    };
    onUpdate(updated);
    setManualMediaUrl('');
    setManualPostTitle('');
    setShowInstagramModal(false);
    setStatusMsg('Mídia do Instagram adicionada à galeria!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const supabaseSqlSchema = `-- ========================================================
-- CREATOR WORLD — SUPABASE / POSTGRESQL PRODUCTION SCHEMA
-- Multi-Tenant Influencer Platform Schema with Row Level Security (RLS)
-- ========================================================

-- 1. Users / Accounts
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL DEFAULT 'creator',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Creator Profiles
CREATE TABLE IF NOT EXISTS public.creator_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  tagline TEXT,
  bio TEXT,
  full_story TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  location TEXT,
  interests JSONB DEFAULT '[]'::jsonb,
  trajectory JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Design Settings
CREATE TABLE IF NOT EXISTS public.design_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL DEFAULT 'editorial-luxury',
  colors JSONB NOT NULL,
  fonts JSONB NOT NULL,
  visual JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Social Links (Linktree Avançado)
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  category TEXT DEFAULT 'conteudos',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  clicks_count BIGINT DEFAULT 0
);

-- 5. Magazine Posts
CREATE TABLE IF NOT EXISTS public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  read_time TEXT,
  category TEXT,
  published BOOLEAN DEFAULT true,
  published_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Fan Letters (Cartas com Lacre)
CREATE TABLE IF NOT EXISTS public.fan_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  teaser TEXT,
  text TEXT NOT NULL,
  signature TEXT,
  wax_seal_color TEXT DEFAULT '#8F714B',
  envelope_style TEXT DEFAULT 'classic',
  opens_count BIGINT DEFAULT 0
);

-- 7. Products
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.creator_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  price TEXT,
  benefits JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  buy_url TEXT NOT NULL,
  badge TEXT,
  active BOOLEAN DEFAULT true
);

-- Row Level Security (RLS)
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.design_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read published fan pages
CREATE POLICY "Public read access for published creators"
ON public.creator_profiles FOR SELECT USING (is_published = true);

-- Creators manage their own rows
CREATE POLICY "Creators can update own profile"
ON public.creator_profiles FOR ALL USING (auth.uid() = user_id);
`;

  const copySql = () => {
    navigator.clipboard.writeText(supabaseSqlSchema);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl">
      <div className="flex items-center justify-between pb-6 border-b border-neutral-800">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Configurações & Publicação</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Endereço exclusivo, SEO para redes sociais, conexão com Instagram e banco de dados.
          </p>
        </div>

        <button
          onClick={handleSaveGeneral}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
        >
          {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{statusMsg || 'Salvar Configurações'}</span>
        </button>
      </div>

      {/* 1. URL & Slug Exclusivo */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>Endereço Exclusivo da Fan Page</span>
        </h2>
        <p className="text-xs text-neutral-400">
          Cada influenciador possui uma URL única na plataforma para colocar na bio do Instagram e TikTok.
        </p>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Nome de Usuário / Slug
          </label>
          <div className="flex items-center max-w-md">
            <span className="px-3.5 py-2.5 rounded-l-xl bg-neutral-800 border border-r-0 border-neutral-700 text-xs font-mono text-neutral-400">
              creatorworld.app/@
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 px-3.5 py-2.5 rounded-r-xl bg-neutral-800 border border-neutral-700 text-sm font-mono text-white focus:outline-none focus:border-amber-500"
            />
          </div>
          <span className="text-[11px] text-neutral-500 font-mono mt-1 block">
            Exemplo: creatorworld.app/@{sanitizeSlug(slug) || 'seu-nome'}
          </span>
        </div>
      </div>

      {/* 2. SEO & Compartilhamento Social */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-amber-400" />
          <span>SEO & Metadados de Compartilhamento</span>
        </h2>
        <p className="text-xs text-neutral-400">
          Como seu site aparece quando enviado no WhatsApp, Twitter, iMessage ou pesquisado no Google.
        </p>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Título Personalizado (Meta Title)
          </label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            placeholder={`${account.profile.displayName} — Fan Page Oficial`}
            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-300 mb-1">
            Descrição do Card (Meta Description)
          </label>
          <textarea
            rows={2}
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            placeholder={account.profile.tagline}
            className="w-full px-3.5 py-2 rounded-xl bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 3. Conectar Instagram */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
              <Instagram className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Conectar Instagram Oficial</h2>
              <p className="text-xs text-neutral-400">
                Arquitetura para integração via Meta Graph API oficial e importador manual de fotos.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowInstagramModal(true)}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700 transition-colors"
          >
            Gerenciar Conexão
          </button>
        </div>

        <div className="p-4 rounded-xl bg-neutral-800/40 border border-neutral-700/60 text-xs text-neutral-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Diretrizes de Segurança da Meta Graph API</span>
          </div>
          <p className="text-neutral-400 leading-relaxed">
            A Creator World não utiliza raspagem (scraping) ou senhas do Instagram. A integração oficial conecta via OAuth 2.0 seguro utilizando os escopos <code className="text-neutral-200 font-mono text-[11px]">instagram_basic</code> e <code className="text-neutral-200 font-mono text-[11px]">pages_show_list</code>. No MVP, você também pode importar fotos e links diretamente.
          </p>
        </div>
      </div>

      {/* 4. Banco de Dados, Migrations & Backup */}
      <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Banco de Dados & Migrations (Supabase / PostgreSQL)</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Esquema relacional organizado, RLS e suporte para deploy em servidor próprio.
            </p>
          </div>

          <button
            onClick={() => setShowSqlModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Ver Schema SQL</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <button
            onClick={handleExportJson}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 transition-colors"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Exportar Backup JSON</span>
          </button>

          <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-sky-400" />
            <span>Importar Backup JSON</span>
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={handleResetDemo}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 border border-neutral-700 text-xs text-neutral-400 hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Restaurar Demo</span>
          </button>
        </div>
      </div>

      {/* SQL Migration Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Schema SQL & Migrations para Supabase / PostgreSQL
                </h3>
                <p className="text-xs text-neutral-400">
                  Script pronto para criar tabelas, relacionamentos e políticas de segurança RLS.
                </p>
              </div>
              <button
                onClick={copySql}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors"
              >
                {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto font-mono text-xs text-neutral-300 bg-neutral-950 leading-relaxed whitespace-pre">
              {supabaseSqlSchema}
            </div>

            <div className="p-4 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Integration & Manual Importer Modal */}
      {showInstagramModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Conexão Oficial Instagram</h3>
                <p className="text-xs text-neutral-400">Meta for Developers & Importação Segura</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-800/60 border border-neutral-700/60 space-y-2 text-xs text-neutral-300">
              <span className="font-semibold text-white block">Fluxo da Meta Graph API:</span>
              <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                <li>O influenciador autoriza seu perfil profissional ou de criador.</li>
                <li>Geração de User Access Token de longa duração (60 dias).</li>
                <li>Sincronização de posts (<code className="text-neutral-200">/me/media</code>) com links originais.</li>
              </ol>
            </div>

            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <span className="text-xs font-semibold text-white block">
                Importador Direto para o MVP (Sem espera de aprovação da Meta)
              </span>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Título ou Legenda da Foto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Novo ensaio em Milão"
                  value={manualPostTitle}
                  onChange={(e) => setManualPostTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  URL da Imagem
                </label>
                <input
                  type="url"
                  placeholder="https://... ou caminho de imagem"
                  value={manualMediaUrl}
                  onChange={(e) => setManualMediaUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleManualInstagramImport}
                disabled={!manualMediaUrl}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-rose-600 hover:opacity-90 text-white transition-opacity disabled:opacity-40"
              >
                Importar Foto para a Fan Page
              </button>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowInstagramModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-white"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
