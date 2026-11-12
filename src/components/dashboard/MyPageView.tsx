import React, { useState } from 'react';
import { CreatorAccount } from '../../types/creator';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { 
  Palette, 
  ExternalLink, 
  Share2, 
  Smartphone, 
  Monitor, 
  CheckCircle2,
  Copy
} from 'lucide-react';

interface MyPageViewProps {
  account: CreatorAccount;
  onOpenVisualEditor: () => void;
  onViewPublic: () => void;
  onShare: () => void;
}

export const MyPageView: React.FC<MyPageViewProps> = ({
  account,
  onOpenVisualEditor,
  onViewPublic,
  onShare,
}) => {
  const [device, setDevice] = useState<'mobile' | 'desktop'>('desktop');
  const [copied, setCopied] = useState(false);

  const fullUrl = `${window.location.origin}/@${account.profile.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fadeIn h-[calc(100vh-6rem)] flex flex-col">
      {/* Top Banner Control */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Minha Página</span>
            <span className="text-xs font-mono text-neutral-400">/@{account.profile.username}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Online
          </span>
        </div>

        {/* Viewport switch and actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                device === 'desktop'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition-colors ${
                device === 'mobile'
                  ? 'bg-neutral-800 text-white font-medium'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors border border-neutral-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copiado!' : 'Copiar URL'}</span>
          </button>

          <button
            onClick={onOpenVisualEditor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-800 hover:bg-neutral-700 text-amber-400 transition-colors border border-neutral-700"
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Editar Aparência</span>
          </button>

          <button
            onClick={onViewPublic}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Ver em Tela Cheia</span>
          </button>
        </div>
      </div>

      {/* Embedded Live Preview Container */}
      <div className="flex-1 bg-neutral-950 rounded-2xl border border-neutral-800 p-2 sm:p-4 flex items-center justify-center overflow-hidden">
        <div
          className={`h-full overflow-hidden shadow-2xl transition-all duration-300 flex flex-col ${
            device === 'mobile'
              ? 'w-[390px] max-h-[844px] rounded-[44px] border-[10px] border-neutral-800 ring-1 ring-white/10'
              : 'w-full rounded-xl border border-neutral-800'
          }`}
        >
          {device === 'mobile' && (
            <div className="w-full bg-neutral-900 py-1.5 flex justify-center items-center shrink-0 border-b border-neutral-800">
              <div className="w-24 h-4 bg-black rounded-full" />
            </div>
          )}

          <div className="flex-1 overflow-y-auto no-scrollbar">
            <TemplateRenderer account={account} isPreview={true} />
          </div>
        </div>
      </div>
    </div>
  );
};
