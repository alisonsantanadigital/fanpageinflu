import React, { useState, useEffect, useRef } from 'react';
import { CreatorAccount } from '../../types/creator';
import {
  applyGeneratedAndInstagramToAccount,
  generateFallbackCreator,
  InstagramAutofillPayload,
  InstagramMediaInput,
} from '../../utils/creatorMapper';
import {
  Instagram,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Palette,
  Trash2,
  Search,
  Link as LinkIcon,
} from 'lucide-react';

interface InstagramAutoConnectModalProps {
  account: CreatorAccount;
  isOpen: boolean;
  onClose: () => void;
  onApplyAccount: (updatedAccount: CreatorAccount) => void;
  onViewPublic?: () => void;
  onOpenVisualEditor?: () => void;
}

interface LookedUpProfile {
  username: string;
  displayName: string;
  profilePictureUrl: string;
  biography: string;
  followersText: string;
  media: InstagramMediaInput[];
}

function compressImageToDataUrl(file: File, maxDim = 720): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.75));
      };
      img.onerror = () => reject(new Error('Imagem inválida'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Falha ao ler arquivo'));
    reader.readAsDataURL(file);
  });
}

export const InstagramAutoConnectModal: React.FC<InstagramAutoConnectModalProps> = ({
  account,
  isOpen,
  onClose,
  onApplyAccount,
  onViewPublic,
  onOpenVisualEditor,
}) => {
  const [step, setStep] = useState<'idle' | 'authenticating' | 'autofilling' | 'done'>('idle');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [oauthMissingInfo, setOauthMissingInfo] = useState<{
    redirectUri: string;
    missingVars: string[];
  } | null>(null);
  const [copiedUri, setCopiedUri] = useState(false);
  const [showMetaUrls, setShowMetaUrls] = useState(false);
  const [copiedMetaKey, setCopiedMetaKey] = useState<string | null>(null);

  // Instant @Instagram + Lookup + Gemini sync inputs
  const [handleInput, setHandleInput] = useState(
    account.profile.instagramUsername || account.profile.username || ''
  );
  const [displayNameInput, setDisplayNameInput] = useState(account.profile.displayName || '');
  const [bioInput, setBioInput] = useState(account.profile.bio || '');
  const [postLinksInput, setPostLinksInput] = useState('');
  const [displayNameEdited, setDisplayNameEdited] = useState(false);
  const [bioEdited, setBioEdited] = useState(false);

  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [fetchedProfile, setFetchedProfile] = useState<LookedUpProfile | null>(null);

  const [uploadedPhotos, setUploadedPhotos] = useState<{ url: string; name: string }[]>([]);
  const [importedPreview, setImportedPreview] = useState<{
    username: string;
    displayName: string;
    photoCount: number;
    photos: string[];
    source: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const accountRef = useRef<CreatorAccount>(account);
  accountRef.current = account;
  const popupPollRef = useRef<number | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;
  const lookupTimerRef = useRef<number | null>(null);
  const latestHandleRef = useRef(handleInput);
  latestHandleRef.current = handleInput;

  const clearPopupPoll = () => {
    if (popupPollRef.current !== null) {
      window.clearInterval(popupPollRef.current);
      popupPollRef.current = null;
    }
  };

  const clearLookupTimer = () => {
    if (lookupTimerRef.current !== null) {
      window.clearTimeout(lookupTimerRef.current);
      lookupTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (isOpen) {
      clearPopupPoll();
      clearLookupTimer();
      setStep('idle');
      setStatusMessage(null);
      setErrorMsg(null);
      setLookupError(null);
      setOauthMissingInfo(null);
      setImportedPreview(null);
      setFetchedProfile(null);
      setUploadedPhotos([]);
      setPostLinksInput('');
      setDisplayNameEdited(false);
      setBioEdited(false);

      const initialHandle = account.profile.instagramUsername || account.profile.username || '';
      setHandleInput(initialHandle);
      setDisplayNameInput(account.profile.displayName || '');
      setBioInput(account.profile.bio || '');
    } else {
      clearPopupPoll();
      clearLookupTimer();
    }
    return () => {
      clearPopupPoll();
      clearLookupTimer();
    };
  }, [isOpen, account.id]);

  const fetchInstagramProfileData = async (
    rawHandle: string,
    postUrls: string[] = [],
    silent = false
  ): Promise<LookedUpProfile | null> => {
    const cleanHandle = rawHandle
      .replace(/^@+/, '')
      .replace(/[^a-zA-Z0-9._]/g, '')
      .trim()
      .toLowerCase();

    if (!cleanHandle || cleanHandle.length < 2) return null;

    setIsLookingUp(true);
    if (!silent) setLookupError(null);

    try {
      const res = await fetch('/api/instagram/lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanHandle, postUrls }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!res.ok || !contentType.includes('application/json')) {
        throw new Error('Falha ao consultar dados públicos do Instagram.');
      }

      const data = await res.json();
      if (!data.success || !data.profile) {
        if (!silent) {
          setLookupError(data.error || `Não encontramos dados públicos para @${cleanHandle}.`);
        }
        return null;
      }

      // Guard against stale async lookup if user kept typing a new handle
      const currentClean = latestHandleRef.current
        .replace(/^@+/, '')
        .replace(/[^a-zA-Z0-9._]/g, '')
        .trim()
        .toLowerCase();
      if (currentClean && currentClean !== cleanHandle) {
        return data.profile;
      }

      const profile: LookedUpProfile = data.profile;
      setFetchedProfile(profile);
      setLookupError(null);

      if (profile.displayName && !displayNameEdited) {
        setDisplayNameInput(profile.displayName);
      }
      if (profile.biography && !bioEdited) {
        setBioInput(profile.biography);
      }

      return profile;
    } catch (err: any) {
      if (!silent) {
        setLookupError(err?.message || 'Erro ao buscar perfil no Instagram.');
      }
      return null;
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleInstagramInputChange = (nextValue: string) => {
    setHandleInput(nextValue);
    setLookupError(null);
    setErrorMsg(null);

    const nextClean = nextValue
      .replace(/^@+/, '')
      .replace(/[^a-zA-Z0-9._]/g, '')
      .trim()
      .toLowerCase();
    const origClean = (
      accountRef.current.profile.instagramUsername ||
      accountRef.current.profile.username ||
      ''
    ).toLowerCase();

    if (nextClean !== origClean) {
      setFetchedProfile(null);
      if (!displayNameEdited) setDisplayNameInput('');
      if (!bioEdited) setBioInput('');
    }

    clearLookupTimer();
    if (nextClean.length >= 3) {
      lookupTimerRef.current = window.setTimeout(() => {
        fetchInstagramProfileData(nextClean, [], true);
      }, 650);
    }
  };

  const runGeminiAutofillFromInstagram = async (payload: InstagramAutofillPayload) => {
    setStep('autofilling');
    setErrorMsg(null);
    setStatusMessage('Preenchendo fotos, links e textos automaticamente com Gemini...');

    let generated: Record<string, any> | null = null;
    let source = 'gemini-4-hydrogen';

    try {
      const res = await fetch('/api/instagram/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.creator) {
          generated = data.creator;
          source = data.source || 'gemini-4-hydrogen';
        }
      }
    } catch {
      // Fallback handled cleanly below
    }

    if (!generated) {
      generated = generateFallbackCreator(
        [payload.biography, payload.followersCount, payload.promptNotes].filter(Boolean).join(' '),
        payload.username,
        payload.displayName,
        payload.biography || payload.promptNotes || undefined
      );
      source = 'fallback';
    }

    const updatedAccount = applyGeneratedAndInstagramToAccount(accountRef.current, generated, {
      username: payload.username,
      profilePictureUrl: payload.profilePictureUrl,
      media: payload.media,
      connectedAt: new Date().toISOString().split('T')[0],
    });

    onApplyAccount(updatedAccount);

    const previewPhotos = [
      updatedAccount.profile.avatarUrl,
      ...updatedAccount.gallery.map((g) => g.mediaUrl),
    ].filter((v, i, arr) => Boolean(v) && arr.indexOf(v) === i);

    setImportedPreview({
      username: updatedAccount.profile.username,
      displayName: updatedAccount.profile.displayName,
      photoCount: updatedAccount.gallery.length,
      photos: previewPhotos.slice(0, 6),
      source,
    });
    setStep('done');
    setStatusMessage('Fotos e dados preenchidos automaticamente!');
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin || '';
      const isTrustedOrigin =
        origin === window.location.origin ||
        origin.endsWith('.run.app') ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost');

      if (!isTrustedOrigin) return;

      if (event.data?.type === 'INSTAGRAM_OAUTH_SUCCESS' && event.data.instagramData) {
        const ig = event.data.instagramData;
        runGeminiAutofillFromInstagram({
          username: ig.username,
          displayName: ig.displayName,
          biography: ig.biography,
          profilePictureUrl: ig.profilePictureUrl,
          followersCount: ig.followersCount,
          media: ig.media || [],
        });
      } else if (event.data?.type === 'INSTAGRAM_OAUTH_ERROR') {
        setStep('idle');
        setErrorMsg(event.data.error || 'Não foi possível concluir o login com o Instagram.');
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [isOpen, account]);

  if (!isOpen) return null;

  const handleConnectOAuth = async () => {
    setErrorMsg(null);
    setOauthMissingInfo(null);
    setStep('authenticating');
    setStatusMessage('Preparando autorização oficial do Instagram...');

    try {
      const response = await fetch('/api/instagram/auth-url');
      if (!response.ok) {
        throw new Error('Falha ao consultar endpoint de autenticação do Instagram.');
      }
      const data = await response.json();

      if (!data.configured || !data.url) {
        setStep('idle');
        setStatusMessage(null);
        setOauthMissingInfo({
          redirectUri: data.redirectUri || `${window.location.origin}/api/instagram/callback`,
          missingVars: data.missingVars || ['INSTAGRAM_CLIENT_ID', 'INSTAGRAM_CLIENT_SECRET'],
        });
        return;
      }

      const popup = window.open(
        data.url,
        'instagram_oauth',
        'width=600,height=720,menubar=no,toolbar=no'
      );

      if (!popup) {
        setStep('idle');
        setErrorMsg('O navegador bloqueou o popup do Instagram. Permita popups para continuar.');
        return;
      }

      clearPopupPoll();
      popupPollRef.current = window.setInterval(() => {
        if (popup.closed) {
          clearPopupPoll();
          if (stepRef.current === 'authenticating') {
            setStep('idle');
            setStatusMessage(null);
          }
        }
      }, 600);
    } catch (err: any) {
      setStep('idle');
      setErrorMsg(err?.message || 'Erro ao iniciar conexão com o Instagram.');
    }
  };

  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 8);
    if (files.length === 0) return;

    try {
      const compressed = await Promise.all(
        files.map(async (file) => ({
          url: await compressImageToDataUrl(file),
          name: file.name.replace(/\.[^/.]+$/, ''),
        }))
      );
      setUploadedPhotos((prev) => [...prev, ...compressed].slice(0, 10));
      setErrorMsg(null);
    } catch {
      setErrorMsg('Não foi possível processar uma das imagens selecionadas.');
    }
  };

  const parsePostUrls = (): string[] =>
    postLinksInput
      .split(/[\n,\s]+/)
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(u));

  const handleInstantSyncWithInstagram = async () => {
    clearLookupTimer();
    const cleanHandle = handleInput
      .replace(/^@+/, '')
      .replace(/[^a-zA-Z0-9._]/g, '')
      .trim()
      .toLowerCase();

    if (!cleanHandle) {
      setErrorMsg('Informe seu @ do Instagram para buscar seus dados e preencher a página.');
      return;
    }

    setStep('autofilling');
    setErrorMsg(null);
    setStatusMessage(`Buscando perfil oficial e avatar de @${cleanHandle} no Instagram...`);

    const postUrls = parsePostUrls();
    let liveProfile =
      fetchedProfile && fetchedProfile.username === cleanHandle && postUrls.length === 0
        ? fetchedProfile
        : null;

    if (!liveProfile) {
      liveProfile = await fetchInstagramProfileData(cleanHandle, postUrls, true);
    }

    const uploadedMedia: InstagramMediaInput[] = uploadedPhotos.map((p, idx) => ({
      id: `upload_${Date.now()}_${idx}`,
      media_type: 'IMAGE',
      media_url: p.url,
      caption: p.name,
      permalink: `https://instagram.com/${cleanHandle}`,
      timestamp: new Date().toISOString(),
    }));

    const fetchedPostMedia: InstagramMediaInput[] = liveProfile?.media || [];
    const combinedMedia = [...uploadedMedia, ...fetchedPostMedia];

    const resolvedDisplayName =
      (displayNameEdited ? displayNameInput.trim() : '') ||
      liveProfile?.displayName ||
      displayNameInput.trim() ||
      `@${cleanHandle}`;

    const resolvedBio =
      (bioEdited ? bioInput.trim() : '') ||
      liveProfile?.biography ||
      bioInput.trim();

    const resolvedProfilePic =
      uploadedPhotos[0]?.url ||
      liveProfile?.profilePictureUrl ||
      fetchedPostMedia[0]?.media_url;

    await runGeminiAutofillFromInstagram({
      username: cleanHandle,
      displayName: resolvedDisplayName,
      biography: resolvedBio,
      profilePictureUrl: resolvedProfilePic,
      followersCount: liveProfile?.followersText,
      media: combinedMedia,
    });
  };

  const handleCopyRedirectUri = () => {
    if (!oauthMissingInfo?.redirectUri) return;
    navigator.clipboard.writeText(oauthMissingInfo.redirectUri);
    setCopiedUri(true);
    setTimeout(() => setCopiedUri(false), 2000);
  };

  const handleCopyMetaUrl = (key: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedMetaKey(key);
    setTimeout(() => setCopiedMetaKey(null), 2000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="instagram-autoconnect-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative z-10 w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl max-h-[92vh] overflow-y-auto space-y-6">
        <button
          onClick={onClose}
          aria-label="Fechar janela"
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Instagram className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-semibold block">
              Sincronização Instantânea · Instagram + Gemini AI
            </span>
            <h2 id="instagram-autoconnect-title" className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Conectar Instagram & Auto-Preencher Página
            </h2>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading / Pipeline State */}
        {(step === 'authenticating' || step === 'autofilling') && (
          <div className="p-6 rounded-2xl bg-neutral-800/70 border border-amber-500/40 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
            <p className="text-sm font-semibold text-white">
              {step === 'authenticating'
                ? 'Aguardando autorização do Instagram no popup...'
                : 'Importando Instagram & preenchendo sua fan page com Gemini...'}
            </p>
            <p className="text-xs text-neutral-400">{statusMessage}</p>
            {step === 'authenticating' && (
              <button
                type="button"
                onClick={() => {
                  clearPopupPoll();
                  setStep('idle');
                  setStatusMessage(null);
                }}
                className="mt-1 px-4 py-1.5 rounded-lg text-xs font-medium bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 transition-colors"
              >
                Cancelar e voltar
              </button>
            )}
          </div>
        )}

        {/* Completion State */}
        {step === 'done' && importedPreview && (
          <div className="space-y-5 animate-fadeIn">
            <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-700/60 flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  Fan page de {importedPreview.displayName} (@{importedPreview.username}) preenchida automaticamente!
                </h3>
                <p className="text-xs text-emerald-200/80 mt-1">
                  Foto de perfil, biografia, {importedPreview.photoCount} foto(s) na galeria, links, artigos e carta aos fãs aplicados na hora.
                </p>
              </div>
            </div>

            {importedPreview.photos.length > 0 && (
              <div>
                <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-2">
                  Imagens aplicadas automaticamente na página:
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {importedPreview.photos.map((src, idx) => (
                    <div key={idx} className="aspect-square rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700">
                      <img src={src} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-neutral-800">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
              >
                Continuar no Painel
              </button>
              {onOpenVisualEditor && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenVisualEditor();
                  }}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 border border-neutral-700"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>Personalizar no Editor</span>
                </button>
              )}
              {onViewPublic && (
                <button
                  onClick={() => {
                    onClose();
                    onViewPublic();
                  }}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Ver Fan Page Pronta</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Default Interactive View */}
        {step === 'idle' && (
          <>
            {/* 1. Instant Public @Instagram + Gemini Sync (Primary) */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-800/85 to-neutral-900 border border-amber-500/40 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>1. Importar pelo @ do Instagram + Gemini (Instantâneo)</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Digite seu @ do Instagram para buscar sua foto de perfil, nome e dados públicos automaticamente — e adicione links de posts ou fotos se quiser preencher a galeria inteira na hora.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Seu @ do Instagram *
                  </label>
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center flex-1 min-w-0">
                      <span className="px-2.5 py-2 rounded-l-xl bg-neutral-950 border border-r-0 border-neutral-700 text-xs font-mono text-neutral-400">
                        @
                      </span>
                      <input
                        type="text"
                        value={handleInput}
                        onChange={(e) => handleInstagramInputChange(e.target.value)}
                        placeholder="prumocreators"
                        className="flex-1 min-w-0 px-3 py-2 rounded-r-xl bg-neutral-950 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchInstagramProfileData(handleInput, parsePostUrls(), false)}
                      disabled={isLookingUp || !handleInput.trim()}
                      title="Buscar perfil público no Instagram"
                      className="shrink-0 px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-semibold text-amber-300 flex items-center gap-1.5 disabled:opacity-40 transition-colors"
                    >
                      {isLookingUp ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Search className="w-3.5 h-3.5" />
                      )}
                      <span>Buscar</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Nome de Exibição
                  </label>
                  <input
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => {
                      setDisplayNameEdited(true);
                      setDisplayNameInput(e.target.value);
                    }}
                    placeholder="Preenchido automaticamente pelo @"
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Live Instagram Preview Card */}
              {fetchedProfile && (
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-700/50 flex items-center gap-3">
                  {fetchedProfile.profilePictureUrl ? (
                    <img
                      src={fetchedProfile.profilePictureUrl}
                      alt={fetchedProfile.displayName}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-full object-cover border border-emerald-500/50 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
                      <Instagram className="w-5 h-5 text-amber-400" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white truncate">
                      {fetchedProfile.displayName}
                    </p>
                    <p className="text-[11px] font-mono text-emerald-300 truncate">
                      @{fetchedProfile.username}
                      {fetchedProfile.followersText ? ` · ${fetchedProfile.followersText}` : ''}
                    </p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
              )}

              {lookupError && (
                <p className="text-[11px] text-amber-300/90 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{lookupError}</span>
                </p>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Bio atual do Instagram ou nicho (opcional)
                </label>
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => {
                    setBioEdited(true);
                    setBioInput(e.target.value);
                  }}
                  placeholder="Descreva seu trabalho ou deixe vazio para o Gemini gerar a partir do seu Instagram..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300 mb-1">
                  <LinkIcon className="w-3.5 h-3.5 text-sky-400" />
                  <span>Links de posts ou reels do Instagram (opcional, 1 URL por linha)</span>
                </label>
                <textarea
                  rows={2}
                  value={postLinksInput}
                  onChange={(e) => setPostLinksInput(e.target.value)}
                  placeholder="https://www.instagram.com/p/..."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-mono text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Photo Picker */}
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFilesSelected}
                  className="hidden"
                />

                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-300">
                    Fotos do dispositivo ({uploadedPhotos.length}/10)
                  </span>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-neutral-800 hover:bg-neutral-700 text-sky-400 border border-neutral-700 transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Selecionar Fotos</span>
                  </button>
                </div>

                {uploadedPhotos.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {uploadedPhotos.map((p, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-neutral-950 border border-neutral-700 group">
                        <img src={p.url} alt={p.name} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setUploadedPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 p-1 rounded bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remover foto"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleInstantSyncWithInstagram}
                  disabled={!handleInput.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-colors disabled:opacity-40"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Importar & Preencher com Gemini</span>
                </button>
              </div>
            </div>

            {/* 2. Official Instagram OAuth 2.0 Login (Requires Meta Verification) */}
            <div className="p-5 rounded-2xl bg-neutral-800/40 border border-neutral-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-rose-400" />
                    <span>2. Login Oficial OAuth 2.0 (Meta)</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    Para contas profissionais após configurar Privacidade, Testadores/Acesso Avançado e Verificação na Meta.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowMetaUrls((v) => !v)}
                    className="mt-1.5 text-[11px] font-medium text-amber-400 hover:text-amber-300 underline underline-offset-2"
                  >
                    {showMetaUrls ? 'Ocultar URLs da Meta' : 'Ver URLs para colar na Meta (Privacidade / Exclusão / Callback)'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleConnectOAuth}
                  className="shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white shadow-lg transition-opacity"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Entrar com Instagram</span>
                </button>
              </div>

              {showMetaUrls && typeof window !== 'undefined' && (
                <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-2 text-[11px]">
                  {[
                    { key: 'callback', label: 'Redirect URI', url: `${window.location.origin}/api/instagram/callback` },
                    { key: 'privacy', label: 'Política de Privacidade', url: `${window.location.origin}/privacidade` },
                    { key: 'terms', label: 'Termos de Serviço', url: `${window.location.origin}/termos` },
                    { key: 'deletion', label: 'Exclusão de Dados', url: `${window.location.origin}/api/instagram/data-deletion` },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <span className="w-36 shrink-0 text-neutral-400">{item.label}:</span>
                      <code className="flex-1 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 font-mono text-emerald-300 truncate">
                        {item.url}
                      </code>
                      <button
                        type="button"
                        onClick={() => handleCopyMetaUrl(item.key, item.url)}
                        className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 shrink-0"
                      >
                        {copiedMetaKey === item.key ? (
                          <Check className="w-3 h-3 text-emerald-400" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                        <span>{copiedMetaKey === item.key ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {oauthMissingInfo && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-700/50 space-y-3 text-xs">
                  <p className="font-semibold text-amber-300">
                    Para ativar o login OAuth direto do Instagram neste servidor, configure no Meta for Developers e nas variáveis de ambiente:
                  </p>
                  <div className="space-y-1.5 text-neutral-300">
                    <p>
                      <span className="text-neutral-400">Variáveis necessárias:</span>{' '}
                      <code className="font-mono text-amber-300">
                        {oauthMissingInfo.missingVars.join(', ')}
                      </code>
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-400 shrink-0">Callback URI:</span>
                      <code className="flex-1 px-2.5 py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-emerald-300 truncate">
                        {oauthMissingInfo.redirectUri}
                      </code>
                      <button
                        type="button"
                        onClick={handleCopyRedirectUri}
                        className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 flex items-center gap-1 shrink-0"
                      >
                        {copiedUri ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedUri ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
