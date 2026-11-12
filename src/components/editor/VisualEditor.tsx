import React, { useState } from 'react';
import { CreatorAccount, TemplateId } from '../../types/creator';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { 
  Palette, 
  Type, 
  Layers, 
  User, 
  Layout, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  Globe, 
  Check, 
  Undo,
  ExternalLink,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface VisualEditorProps {
  account: CreatorAccount;
  onSave: (updatedAccount: CreatorAccount) => void;
  onPublish: (updatedAccount: CreatorAccount) => void;
  onBackToDashboard: () => void;
  onViewPublic: () => void;
}

export const VisualEditor: React.FC<VisualEditorProps> = ({
  account,
  onSave,
  onPublish,
  onBackToDashboard,
  onViewPublic,
}) => {
  // Working copy in editor state for instant reactivity
  const [draft, setDraft] = useState<CreatorAccount>(JSON.parse(JSON.stringify(account)));
  const [activeTab, setActiveTab] = useState<'templates' | 'identity' | 'colors' | 'fonts' | 'elements'>('templates');
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const availableTemplates: { id: TemplateId; name: string; tag: string; description: string; available: boolean }[] = [
    {
      id: 'editorial-luxury',
      name: '01. Editorial Luxury',
      tag: 'Revista & Luxo',
      description: 'Estilo revista de alta-costura, fotos amplas, tipografia serifada e sofisticação.',
      available: true,
    },
    {
      id: 'dark-creator',
      name: '02. Dark Creator',
      tag: 'Tech & Sound',
      description: 'Interface escura, neon violeta/ciano, elementos luminosos e energia moderna.',
      available: true,
    },
    {
      id: 'minimal-personal',
      name: '03. Minimal Personal',
      tag: 'Notion & Scandi',
      description: 'Design minimalista, fundo claro, foco absoluto no conteúdo e conexão humana.',
      available: true,
    },
    {
      id: 'lifestyle-journal',
      name: '04. Lifestyle Journal',
      tag: 'Em breve',
      description: 'Layout em grid solto, diário fotográfico e atmosfera de viagens.',
      available: false,
    },
    {
      id: 'fashion-portfolio',
      name: '05. Fashion Portfolio',
      tag: 'Em breve',
      description: 'Mural visual avant-garde para diretores de arte e modelos.',
      available: false,
    },
    {
      id: 'cinematic-story',
      name: '06. Cinematic Story',
      tag: 'Em breve',
      description: 'Formato widescreen 16:9 contínuo com transições de cinema.',
      available: false,
    },
  ];

  const handleTemplateChange = (templateId: TemplateId) => {
    setDraft(prev => {
      const next = { ...prev };
      next.design = { ...next.design, templateId };

      // Apply tailored default palette if switching models
      if (templateId === 'dark-creator') {
        next.design.colors = {
          primary: '#8B5CF6',
          secondary: '#06B6D4',
          background: '#09090B',
          text: '#F4F4F5',
          buttonBg: '#8B5CF6',
          buttonText: '#FFFFFF',
          accent: '#EC4899',
          cardBg: '#18181B',
        };
        next.design.fonts.titleFont = 'Outfit';
      } else if (templateId === 'minimal-personal') {
        next.design.colors = {
          primary: '#3F3F46',
          secondary: '#71717A',
          background: '#FAF9F6',
          text: '#18181B',
          buttonBg: '#18181B',
          buttonText: '#FAF9F6',
          accent: '#A16207',
          cardBg: '#FFFFFF',
        };
        next.design.fonts.titleFont = 'Playfair Display';
      } else if (templateId === 'editorial-luxury') {
        next.design.colors = {
          primary: '#8F714B',
          secondary: '#C5A880',
          background: '#FAF7F2',
          text: '#1C1917',
          buttonBg: '#1C1917',
          buttonText: '#FAF7F2',
          accent: '#B45309',
          cardBg: '#FFFFFF',
        };
        next.design.fonts.titleFont = 'Cormorant Garamond';
      }
      return next;
    });
  };

  const handleSave = () => {
    onSave(draft);
    setSaveStatus('Alterações salvas com sucesso!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handlePublish = () => {
    const updated = { ...draft, isPublished: true };
    setDraft(updated);
    onPublish(updated);
    setSaveStatus('Página publicada com sucesso no endereço permanente!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="flex flex-col h-screen bg-neutral-950 text-neutral-100 overflow-hidden">
      {/* Top Header Bar */}
      <header className="h-14 border-b border-neutral-800 bg-neutral-900 px-4 sm:px-6 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Painel</span>
          </button>
          <div className="h-4 w-[1px] bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Editor Visual</span>
            <span className="text-xs text-neutral-500 font-mono">/@{draft.profile.username}</span>
          </div>
        </div>

        {/* Device Switcher (Central) */}
        <div className="hidden md:flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => setPreviewDevice('desktop')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
              previewDevice === 'desktop'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Visualização Computador"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setPreviewDevice('tablet')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
              previewDevice === 'tablet'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Visualização Tablet"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setPreviewDevice('mobile')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
              previewDevice === 'mobile'
                ? 'bg-neutral-800 text-white font-medium'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Visualização Celular"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {saveStatus && (
            <span className="text-xs text-emerald-400 font-medium hidden lg:inline flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              {saveStatus}
            </span>
          )}

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white transition-all border border-neutral-700"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Salvar</span>
          </button>

          <button
            onClick={handlePublish}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Publicar</span>
          </button>

          <button
            onClick={onViewPublic}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors hidden sm:block"
            title="Ver Página Pública"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Dual-Pane Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* PAINEL ESQUERDO: CONTROLES DE EDIÇÃO (Width ~380px) */}
        <aside className="w-full md:w-[380px] lg:w-[420px] bg-neutral-900 border-r border-neutral-800 flex flex-col shrink-0 z-10">
          {/* Subtabs Navigation */}
          <div className="flex items-center px-3 pt-3 border-b border-neutral-800 overflow-x-auto no-scrollbar gap-1 bg-neutral-900/90">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'templates'
                  ? 'border-amber-500 text-white font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              <span>Modelos</span>
            </button>
            <button
              onClick={() => setActiveTab('identity')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'identity'
                  ? 'border-amber-500 text-white font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Identidade</span>
            </button>
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'colors'
                  ? 'border-amber-500 text-white font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Cores</span>
            </button>
            <button
              onClick={() => setActiveTab('fonts')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'fonts'
                  ? 'border-amber-500 text-white font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>Tipografia</span>
            </button>
            <button
              onClick={() => setActiveTab('elements')}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                activeTab === 'elements'
                  ? 'border-amber-500 text-white font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Estilo</span>
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* TAB: TEMPLATES */}
            {activeTab === 'templates' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Escolha de Modelo</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Troque de design a qualquer instante sem perder seus textos, links, fotos ou publicações.
                  </p>
                </div>

                <div className="space-y-3">
                  {availableTemplates.map((tmpl) => (
                    <div
                      key={tmpl.id}
                      onClick={() => tmpl.available && handleTemplateChange(tmpl.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        draft.design.templateId === tmpl.id
                          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40'
                          : tmpl.available
                          ? 'border-neutral-800 bg-neutral-800/40 hover:bg-neutral-800 hover:border-neutral-700 cursor-pointer'
                          : 'border-neutral-800/50 bg-neutral-900/40 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-semibold text-white">{tmpl.name}</span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                            tmpl.available
                              ? draft.design.templateId === tmpl.id
                                ? 'bg-amber-500 text-neutral-950 font-bold'
                                : 'bg-neutral-800 text-neutral-300'
                              : 'bg-neutral-800 text-neutral-500'
                          }`}
                        >
                          {tmpl.tag}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">{tmpl.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: IDENTIDADE VISUAL */}
            {activeTab === 'identity' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Identidade do Criador</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Informações principais que aparecem na abertura da sua página.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Nome de Exibição
                  </label>
                  <input
                    type="text"
                    value={draft.profile.displayName}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        profile: { ...draft.profile, displayName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Frase de Apresentação (Tagline)
                  </label>
                  <input
                    type="text"
                    value={draft.profile.tagline}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        profile: { ...draft.profile, tagline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Foto de Perfil (URL da Imagem)
                  </label>
                  <input
                    type="text"
                    value={draft.profile.avatarUrl}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        profile: { ...draft.profile, avatarUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Localização & Base
                  </label>
                  <input
                    type="text"
                    value={draft.profile.location}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        profile: { ...draft.profile, location: e.target.value },
                      })
                    }
                    placeholder="Ex: São Paulo, Brasil"
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Biografia Curta
                  </label>
                  <textarea
                    rows={3}
                    value={draft.profile.bio}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        profile: { ...draft.profile, bio: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-xs text-neutral-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* TAB: CORES */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Paleta de Cores</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Personalize as cores primárias, fundo e botões da sua fan page.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: 'Cor Principal', key: 'primary', val: draft.design.colors.primary },
                    { label: 'Cor Secundária', key: 'secondary', val: draft.design.colors.secondary },
                    { label: 'Cor de Fundo', key: 'background', val: draft.design.colors.background },
                    { label: 'Cor dos Textos', key: 'text', val: draft.design.colors.text },
                    { label: 'Cor dos Botões', key: 'buttonBg', val: draft.design.colors.buttonBg },
                    { label: 'Cor de Destaque', key: 'accent', val: draft.design.colors.accent },
                  ].map((colorItem) => (
                    <div key={colorItem.key} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-800/60 border border-neutral-700/60">
                      <span className="text-xs font-medium text-neutral-300">{colorItem.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-neutral-400 uppercase">
                          {colorItem.val}
                        </span>
                        <input
                          type="color"
                          value={colorItem.val}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              design: {
                                ...draft.design,
                                colors: {
                                  ...draft.design.colors,
                                  [colorItem.key]: e.target.value,
                                },
                              },
                            })
                          }
                          className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: FONTES */}
            {activeTab === 'fonts' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Biblioteca Tipográfica</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Escolha as fontes dos títulos e corpo de texto da sua fan page.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Fonte dos Títulos
                  </label>
                  <select
                    value={draft.design.fonts.titleFont}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        design: {
                          ...draft.design,
                          fonts: {
                            ...draft.design.fonts,
                            titleFont: e.target.value as any,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Cormorant Garamond">Cormorant Garamond (Editorial Luxo)</option>
                    <option value="Playfair Display">Playfair Display (Elegante Clássica)</option>
                    <option value="Outfit">Outfit (Moderna & Techno)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Geométrica)</option>
                    <option value="DM Sans">DM Sans (Minimalista)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Fonte dos Textos
                  </label>
                  <select
                    value={draft.design.fonts.bodyFont}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        design: {
                          ...draft.design,
                          fonts: {
                            ...draft.design.fonts,
                            bodyFont: e.target.value as any,
                          },
                        },
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-sm text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                    <option value="DM Sans">DM Sans</option>
                    <option value="Outfit">Outfit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Espaçamento de Letras (Tracking)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['tight', 'normal', 'wide'].map((sp) => (
                      <button
                        key={sp}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            design: {
                              ...draft.design,
                              fonts: {
                                ...draft.design.fonts,
                                letterSpacing: sp as any,
                              },
                            },
                          })
                        }
                        className={`py-1.5 text-xs rounded-lg border capitalize ${
                          draft.design.fonts.letterSpacing === sp
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                            : 'border-neutral-700 bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {sp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ELEMENTOS VISUAIS */}
            {activeTab === 'elements' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white">Elementos Visuais & Estilo</h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Arredondamento de bordas, estilos de cards e efeitos.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Arredondamento dos Cantos
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: 'Reto' },
                      { id: 'sm', label: 'Suave' },
                      { id: 'md', label: 'Médio' },
                      { id: 'lg', label: 'Curvo' },
                    ].map((r) => (
                      <button
                        key={r.id}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            design: {
                              ...draft.design,
                              visual: {
                                ...draft.design.visual,
                                borderRadius: r.id as any,
                              },
                            },
                          })
                        }
                        className={`py-1.5 text-xs rounded-lg border ${
                          draft.design.visual.borderRadius === r.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                            : 'border-neutral-700 bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Estilo dos Cards
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'solid', label: 'Sólido' },
                      { id: 'glass', label: 'Vidro Fosco' },
                      { id: 'bordered', label: 'Bordas Finas' },
                      { id: 'minimal', label: 'Minimalista' },
                    ].map((styleItem) => (
                      <button
                        key={styleItem.id}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            design: {
                              ...draft.design,
                              visual: {
                                ...draft.design.visual,
                                cardStyle: styleItem.id as any,
                              },
                            },
                          })
                        }
                        className={`py-2 text-xs rounded-lg border ${
                          draft.design.visual.cardStyle === styleItem.id
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                            : 'border-neutral-700 bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {styleItem.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800 space-y-3">
                  <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
                    <span>Efeito Glow Luminoso</span>
                    <input
                      type="checkbox"
                      checked={draft.design.visual.enableGlow}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          design: {
                            ...draft.design,
                            visual: {
                              ...draft.design.visual,
                              enableGlow: e.target.checked,
                            },
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                    />
                  </label>
                  <label className="flex items-center justify-between text-xs text-neutral-300 cursor-pointer">
                    <span>Textura de Granulação Editorial</span>
                    <input
                      type="checkbox"
                      checked={draft.design.visual.enableGrain}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          design: {
                            ...draft.design,
                            visual: {
                              ...draft.design.visual,
                              enableGrain: e.target.checked,
                            },
                          },
                        })
                      }
                      className="w-4 h-4 rounded text-amber-500 focus:ring-0"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* PAINEL DIREITO: PRÉ-VISUALIZAÇÃO EM TEMPO REAL */}
        <main className="flex-1 bg-neutral-950 flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto">
          <div
            className={`transition-all duration-300 overflow-hidden shadow-2xl h-full flex flex-col ${
              previewDevice === 'mobile'
                ? 'w-[390px] max-h-[844px] rounded-[48px] border-[10px] border-neutral-800 ring-1 ring-white/10'
                : previewDevice === 'tablet'
                ? 'w-[768px] max-h-[95%] rounded-3xl border-[8px] border-neutral-800 ring-1 ring-white/10'
                : 'w-full h-full rounded-xl border border-neutral-800'
            }`}
          >
            {/* Top camera notch for mobile preview */}
            {previewDevice === 'mobile' && (
              <div className="w-full bg-neutral-900 py-1.5 flex justify-center items-center shrink-0 border-b border-neutral-800">
                <div className="w-24 h-4 bg-black rounded-full" />
              </div>
            )}

            <div className="flex-1 overflow-y-auto no-scrollbar">
              <TemplateRenderer account={draft} isPreview={true} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
