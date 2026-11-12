import React, { useState } from 'react';
import { CreatorAccount } from '../../types/creator';
import { X, Copy, Check, QrCode, ExternalLink, Share2 } from 'lucide-react';

interface ShareModalProps {
  account: CreatorAccount;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ account, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const appBaseUrl = window.location.origin;
  const publicUrl = `${appBaseUrl}/@${account.profile.username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareText = encodeURIComponent(`Conheça a fan page oficial e revista digital de ${account.profile.displayName} na Creator World!`);
  const encodedUrl = encodeURIComponent(publicUrl);

  const socialChannels = [
    {
      name: 'WhatsApp',
      url: `https://api.whatsapp.com/send?text=${shareText}%20${encodedUrl}`,
      color: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    {
      name: 'Twitter / X',
      url: `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      color: 'bg-neutral-900 hover:bg-neutral-800 text-white',
    },
    {
      name: 'LinkedIn',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'bg-blue-700 hover:bg-blue-800 text-white',
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${shareText}`,
      color: 'bg-sky-600 hover:bg-sky-700 text-white',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 rounded-2xl shadow-2xl p-6 md:p-8 border border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold">Compartilhar Fan Page</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Divulgue o endereço exclusivo na sua bio
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Copy Link field */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-2">
            Link público permanente
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-neutral-100 dark:bg-neutral-800/80 px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-xs font-mono truncate text-neutral-800 dark:text-neutral-200">
              {publicUrl}
            </div>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>
        </div>

        {/* QR Code toggle */}
        <div className="mb-6 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <QrCode className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
            <div>
              <p className="text-xs font-medium">QR Code para Eventos e Stories</p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Gere um código escaneável para celular
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowQr(!showQr)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-white dark:hover:bg-neutral-800 transition-colors"
          >
            {showQr ? 'Ocultar' : 'Exibir QR'}
          </button>
        </div>

        {/* Render QR code */}
        {showQr && (
          <div className="mb-6 p-6 rounded-xl bg-white text-neutral-950 flex flex-col items-center justify-center border border-neutral-200 shadow-inner">
            {/* Visual SVG QR pattern */}
            <svg viewBox="0 0 100 100" className="w-40 h-40">
              {/* Outer corner 1 */}
              <rect x="5" y="5" width="28" height="28" fill="none" stroke="#111" strokeWidth="4" />
              <rect x="12" y="12" width="14" height="14" fill="#111" />
              {/* Outer corner 2 */}
              <rect x="67" y="5" width="28" height="28" fill="none" stroke="#111" strokeWidth="4" />
              <rect x="74" y="12" width="14" height="14" fill="#111" />
              {/* Outer corner 3 */}
              <rect x="5" y="67" width="28" height="28" fill="none" stroke="#111" strokeWidth="4" />
              <rect x="12" y="74" width="14" height="14" fill="#111" />
              {/* Mock QR data matrix dots */}
              <rect x="38" y="10" width="6" height="6" fill="#111" />
              <rect x="48" y="10" width="6" height="6" fill="#111" />
              <rect x="40" y="24" width="8" height="8" fill="#111" />
              <rect x="54" y="22" width="6" height="6" fill="#111" />
              <rect x="10" y="42" width="6" height="6" fill="#111" />
              <rect x="24" y="44" width="8" height="6" fill="#111" />
              <rect x="38" y="38" width="24" height="24" rx="4" fill="#8F714B" />
              <text x="50" y="53" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">CW</text>
              <rect x="68" y="40" width="8" height="8" fill="#111" />
              <rect x="82" y="42" width="6" height="6" fill="#111" />
              <rect x="42" y="68" width="6" height="6" fill="#111" />
              <rect x="54" y="72" width="8" height="6" fill="#111" />
              <rect x="70" y="68" width="6" height="6" fill="#111" />
              <rect x="80" y="78" width="8" height="8" fill="#111" />
              <rect x="40" y="84" width="18" height="6" fill="#111" />
            </svg>
            <span className="text-[11px] font-mono mt-3 text-neutral-600">
              /@{account.profile.username}
            </span>
          </div>
        )}

        {/* Social channels */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-2">
            Compartilhar diretamente
          </label>
          <div className="grid grid-cols-2 gap-2">
            {socialChannels.map(item => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium transition-all ${item.color}`}
              >
                <span>{item.name}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        </div>

        {/* Social Meta preview card (Instagram / WhatsApp preview) */}
        <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl p-3.5 bg-neutral-50 dark:bg-neutral-800/30">
          <p className="text-[10px] uppercase tracking-wider font-mono text-neutral-500 mb-2">
            Pré-visualização nas Redes Sociais (OpenGraph)
          </p>
          <div className="flex gap-3 items-center">
            <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
              <img
                src={account.profile.avatarUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                {account.seo?.metaTitle || `${account.profile.displayName} — Fan Page Oficial`}
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                {account.seo?.metaDescription || account.profile.tagline}
              </p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                creatorworld.app/@{account.profile.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
