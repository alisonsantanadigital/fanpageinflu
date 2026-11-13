import { GoogleGenAI } from '@google/genai';
import {
  decodeHtmlEntities,
  generateFallbackCreator,
  InstagramAutofillPayload,
  InstagramMediaInput,
  parseInstagramOgProfile,
} from './creatorMapper';

export interface AiAutofillResult {
  success: boolean;
  creator: Record<string, any>;
  source: string;
  error?: string;
}

function createAiClient(apiKey: string) {
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function parseJsonResponse(textOutput: string): Record<string, any> {
  try {
    return JSON.parse(textOutput);
  } catch {
    const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  }
}

const CREATOR_JSON_FORMAT = `{
  "displayName": string,
  "username": string (slug minúsculo sem espaços nem acentos, ex: "anasilva"),
  "tagline": string (frase de impacto autoral),
  "bio": string (resumo de 2 a 3 frases envolventes),
  "fullStory": string (trajetória de 2 a 3 parágrafos narrativos emocionantes),
  "location": string (ex: "São Paulo & Lisboa"),
  "interests": string[] (5 interesses/valores fundamentais),
  "trajectory": [
    { "year": string, "title": string, "description": string }
  ] (3 a 4 marcos da carreira),
  "templateId": string (escolha um entre: "editorial-luxury", "dark-creator", "minimal-personal", "lifestyle-journal", "fashion-portfolio", "cinematic-story", "modern-magazine", "bold-creator", "professional-identity", "artistic-experience"),
  "links": [
    { "title": string, "url": string, "description": string, "category": "redes" | "produtos" | "conteudos" | "comunidade" | "contato" | "parcerias", "isFeatured": boolean }
  ] (4 a 6 links estruturados),
  "posts": [
    { "title": string, "slug": string, "excerpt": string, "content": string, "category": string, "readTime": string }
  ] (2 a 3 publicações de revista completas),
  "letter": {
    "title": string,
    "teaser": string,
    "text": string,
    "signature": string,
    "waxSealColor": string (hex color)
  },
  "products": [
    { "title": string, "description": string, "price": string, "benefits": string[], "buyUrl": string, "badge": string, "format": string }
  ] (2 produtos ou serviços autorais)
}`;

export async function generateCreatorAutofill(options: {
  prompt?: string;
  audioData?: string;
  apiKey?: string;
}): Promise<AiAutofillResult> {
  const { prompt, audioData, apiKey } = options;

  if (!apiKey) {
    return {
      success: true,
      creator: generateFallbackCreator(prompt || 'Criador Digital Criativo'),
      source: 'fallback',
    };
  }

  try {
    const aiClient = createAiClient(apiKey);
    const systemInstruction = `Você é o Creator World AI Copilot, especialista em branding de influenciadores, design editorial e monetização de criadores digitais.
Com base no briefing, prompt de texto ou áudio fornecido, gere um perfil de influenciador completo, sofisticado e pronto para publicação.
Retorne ESTRITAMENTE um objeto JSON válido (sem markdown) com o seguinte formato:
${CREATOR_JSON_FORMAT}`;

    const contents: any[] = [];
    if (audioData) {
      contents.push({
        inlineData: {
          mimeType: 'audio/webm',
          data: audioData,
        },
      });
    }
    contents.push({
      text: `Briefing do Criador: ${prompt || 'Gere um perfil autoral de alto padrão para influenciador.'}`,
    });

    const response = await aiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseJsonResponse(response.text || '{}');
    return {
      success: true,
      creator: parsed,
      source: 'gemini-4-hydrogen',
    };
  } catch (error: any) {
    return {
      success: true,
      creator: generateFallbackCreator(prompt || 'Influenciador Digital'),
      source: 'fallback_error',
      error: error?.message || 'Erro ao consultar Gemini',
    };
  }
}

export async function generateCreatorFromInstagram(
  payload: InstagramAutofillPayload,
  apiKey?: string
): Promise<AiAutofillResult> {
  const cleanHandle = (payload.username || '').replace(/^@+/, '').trim();
  const captionsSummary = (payload.media || [])
    .slice(0, 10)
    .map((m, i) => `Post ${i + 1} (${m.media_type || 'IMAGE'}): ${m.caption || 'Sem legenda'}`)
    .join('\n');

  const combinedBriefing = [
    cleanHandle ? `Instagram: @${cleanHandle}` : '',
    payload.displayName ? `Nome no Instagram: ${payload.displayName}` : '',
    payload.biography ? `Biografia do Instagram: ${payload.biography}` : '',
    payload.followersCount ? `Seguidores: ${payload.followersCount}` : '',
    payload.promptNotes ? `Observações do criador: ${payload.promptNotes}` : '',
    captionsSummary ? `Legendas das fotos/posts recentes:\n${captionsSummary}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  if (!apiKey) {
    return {
      success: true,
      creator: generateFallbackCreator(
        combinedBriefing,
        cleanHandle || undefined,
        payload.displayName || undefined,
        payload.biography || payload.promptNotes || undefined
      ),
      source: 'fallback',
    };
  }

  try {
    const aiClient = createAiClient(apiKey);
    const systemInstruction = `Você acabou de receber os dados reais e legendas das fotos do Instagram de um influenciador recém-conectado.
Sua missão é preencher AUTOMATICAMENTE toda a fan page do criador em português do Brasil, capturando sua voz, estilo, nicho e personalidade a partir do Instagram conectado.
Inclua um link oficial para o Instagram https://instagram.com/${cleanHandle || 'perfil'} como destaque.
Retorne ESTRITAMENTE um objeto JSON válido (sem markdown) com o formato:
${CREATOR_JSON_FORMAT}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents: `Dados extraídos do Instagram conectado:\n${combinedBriefing || 'Criador de conteúdo digital.'}`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const parsed = parseJsonResponse(response.text || '{}');
    if (cleanHandle) {
      parsed.username = cleanHandle;
    }
    if (payload.displayName && !parsed.displayName) {
      parsed.displayName = payload.displayName;
    }

    return {
      success: true,
      creator: parsed,
      source: 'gemini-4-hydrogen',
    };
  } catch (error: any) {
    return {
      success: true,
      creator: generateFallbackCreator(
        combinedBriefing,
        cleanHandle || undefined,
        payload.displayName || undefined,
        payload.biography || payload.promptNotes || undefined
      ),
      source: 'fallback_error',
      error: error?.message || 'Erro ao consultar Gemini',
    };
  }
}

export function resolveOAuthBaseUrl(headers: Record<string, string | string[] | undefined>): string {
  const envAppUrl = process.env.APP_URL;
  if (envAppUrl && envAppUrl !== 'MY_APP_URL' && envAppUrl.startsWith('http')) {
    return envAppUrl.replace(/\/+$/, '');
  }
  const forwardedProto = Array.isArray(headers['x-forwarded-proto'])
    ? headers['x-forwarded-proto'][0]
    : headers['x-forwarded-proto'];
  const forwardedHost = Array.isArray(headers['x-forwarded-host'])
    ? headers['x-forwarded-host'][0]
    : headers['x-forwarded-host'];
  const host = forwardedHost || (Array.isArray(headers.host) ? headers.host[0] : headers.host) || 'localhost:3000';
  const proto = forwardedProto || (host.includes('localhost') ? 'http' : 'https');
  return `${proto}://${host}`.replace(/\/+$/, '');
}

export function getInstagramClientCredentials() {
  const clientId = process.env.INSTAGRAM_CLIENT_ID || process.env.META_APP_ID || '';
  const clientSecret = process.env.INSTAGRAM_CLIENT_SECRET || process.env.META_APP_SECRET || '';
  const configId = process.env.INSTAGRAM_CONFIG_ID || process.env.META_CONFIG_ID || '';
  return { clientId, clientSecret, configId };
}

export function buildInstagramAuthUrl(redirectUri: string) {
  const { clientId, clientSecret, configId } = getInstagramClientCredentials();
  const explicitLoginUrl = (process.env.INSTAGRAM_LOGIN_URL || '').trim();

  if (explicitLoginUrl.startsWith('https://')) {
    return {
      configured: true,
      mode: configId ? 'unified' : 'instagram',
      redirectUri,
      url: explicitLoginUrl,
    };
  }

  if (!clientId || !clientSecret) {
    return {
      configured: false,
      redirectUri,
      missingVars: [
        !clientId ? 'INSTAGRAM_CLIENT_ID' : null,
        !clientSecret ? 'INSTAGRAM_CLIENT_SECRET' : null,
      ].filter((v): v is string => Boolean(v)),
    };
  }

  // Meta Unified Login (Facebook Login for Business / Config ID)
  if (configId) {
    const params = new URLSearchParams({
      client_id: clientId,
      config_id: configId,
      display: 'popup',
      override_default_response_type: 'true',
      redirect_uri: redirectUri,
      response_type: 'code',
    });

    return {
      configured: true,
      mode: 'unified',
      redirectUri,
      url: `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`,
    };
  }

  // Direct Instagram API with Instagram Login
  const params = new URLSearchParams({
    enable_fb_login: '0',
    force_authentication: '1',
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'instagram_business_basic',
  });

  return {
    configured: true,
    mode: 'instagram',
    redirectUri,
    url: `https://www.instagram.com/oauth/authorize?${params.toString()}`,
  };
}

export async function fetchInstagramAccountFromUnifiedToken(
  accessToken: string,
  clientId?: string,
  clientSecret?: string
) {
  const creds = getInstagramClientCredentials();
  const resolvedClientId = clientId || creds.clientId;
  const resolvedClientSecret = clientSecret || creds.clientSecret;

  const igFields =
    'id,username,name,profile_picture_url,biography,followers_count,media.limit(12){id,caption,media_type,media_url,thumbnail_url,permalink,timestamp}';

  // 1. Check granular_scopes from debug_token (works directly when Instagram Business account was granted without a Page)
  let igAccountId = '';
  if (resolvedClientId && resolvedClientSecret) {
    try {
      const debugRes = await fetch(
        `https://graph.facebook.com/v21.0/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(`${resolvedClientId}|${resolvedClientSecret}`)}`
      );
      const debugJson: any = await debugRes.json();
      const scopes = Array.isArray(debugJson?.data?.granular_scopes)
        ? debugJson.data.granular_scopes
        : [];
      const igScope = scopes.find(
        (s: any) =>
          (s.scope === 'instagram_basic' ||
            s.scope === 'instagram_content_publish' ||
            s.scope === 'instagram_manage_messages' ||
            s.scope === 'instagram_manage_comments') &&
          Array.isArray(s.target_ids) &&
          s.target_ids.length > 0
      );
      if (igScope) {
        igAccountId = String(igScope.target_ids[0]);
      }
    } catch {
      // Continue to Page lookup fallback
    }
  }

  if (igAccountId) {
    const igRes = await fetch(
      `https://graph.facebook.com/v21.0/${encodeURIComponent(igAccountId)}?fields=${encodeURIComponent(igFields)}&access_token=${encodeURIComponent(accessToken)}`
    );
    const igJson: any = await igRes.json();
    if (igRes.ok && igJson?.username) {
      const media: InstagramMediaInput[] = Array.isArray(igJson?.media?.data) ? igJson.media.data : [];
      return {
        username: igJson.username || '',
        displayName: igJson.name || igJson.username || '',
        biography: igJson.biography || '',
        profilePictureUrl: igJson.profile_picture_url || '',
        followersCount: igJson.followers_count,
        media,
        connectedAt: new Date().toISOString().split('T')[0],
      };
    }
  }

  // 2. Fallback: look up Instagram Business Account linked to a Facebook Page
  const pagesRes = await fetch(
    `https://graph.facebook.com/v21.0/me/accounts?fields=${encodeURIComponent(`instagram_business_account{${igFields}}`)}&access_token=${encodeURIComponent(accessToken)}`
  );
  const pagesJson: any = await pagesRes.json();
  const pageWithIg = Array.isArray(pagesJson?.data)
    ? pagesJson.data.find((p: any) => p?.instagram_business_account?.username)
    : null;

  if (pageWithIg?.instagram_business_account) {
    const ig = pageWithIg.instagram_business_account;
    const media: InstagramMediaInput[] = Array.isArray(ig?.media?.data) ? ig.media.data : [];
    return {
      username: ig.username || '',
      displayName: ig.name || ig.username || '',
      biography: ig.biography || '',
      profilePictureUrl: ig.profile_picture_url || '',
      followersCount: ig.followers_count,
      media,
      connectedAt: new Date().toISOString().split('T')[0],
    };
  }

  // 3. Fallback for direct Instagram Graph token
  try {
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=user_id,username,name,profile_picture_url,followers_count,biography&access_token=${encodeURIComponent(accessToken)}`
    );
    const meJson: any = await meRes.json();
    if (meRes.ok && meJson?.username) {
      const mediaRes = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${encodeURIComponent(accessToken)}`
      );
      const mediaJson: any = await mediaRes.json();
      return {
        username: meJson.username || '',
        displayName: meJson.name || meJson.username || '',
        biography: meJson.biography || '',
        profilePictureUrl: meJson.profile_picture_url || '',
        followersCount: meJson.followers_count,
        media: Array.isArray(mediaJson?.data) ? mediaJson.data : [],
        connectedAt: new Date().toISOString().split('T')[0],
      };
    }
  } catch {
    // Throw helpful error below
  }

  throw new Error(
    'Nenhuma conta profissional do Instagram foi autorizada ou vinculada neste login. Verifique as permissões selecionadas no popup.'
  );
}

export async function exchangeInstagramCodeAndFetchData(code: string, redirectUri: string) {
  const { clientId, clientSecret, configId } = getInstagramClientCredentials();
  if (!clientId || !clientSecret) {
    throw new Error('INSTAGRAM_CLIENT_ID / INSTAGRAM_CLIENT_SECRET não configurados no servidor.');
  }

  // Meta Unified Login flow (Facebook Graph OAuth)
  if (configId) {
    const tokenUrl = new URL('https://graph.facebook.com/v21.0/oauth/access_token');
    tokenUrl.searchParams.set('client_id', clientId);
    tokenUrl.searchParams.set('redirect_uri', redirectUri);
    tokenUrl.searchParams.set('client_secret', clientSecret);
    tokenUrl.searchParams.set('code', code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenJson: any = await tokenRes.json();
    const accessToken = tokenJson?.access_token;

    if (!tokenRes.ok || !accessToken) {
      throw new Error(
        tokenJson?.error?.message || tokenJson?.error_message || 'Falha ao obter token na Meta.'
      );
    }

    return fetchInstagramAccountFromUnifiedToken(accessToken, clientId, clientSecret);
  }

  // Direct Instagram API with Instagram Login flow
  const tokenParams = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri,
    code,
  });

  const tokenRes = await fetch('https://api.instagram.com/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: tokenParams.toString(),
  });

  const tokenJson: any = await tokenRes.json();
  const accessToken = tokenJson.access_token || tokenJson?.data?.[0]?.access_token;

  if (!tokenRes.ok || !accessToken) {
    throw new Error(tokenJson?.error_message || tokenJson?.error?.message || 'Falha ao obter token do Instagram.');
  }

  const profileFields = 'user_id,username,name,account_type,profile_picture_url,followers_count,follows_count,media_count,biography';
  const profileRes = await fetch(
    `https://graph.instagram.com/me?fields=${encodeURIComponent(profileFields)}&access_token=${encodeURIComponent(accessToken)}`
  );
  const profileJson: any = await profileRes.json();

  const mediaFields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const mediaRes = await fetch(
    `https://graph.instagram.com/me/media?fields=${encodeURIComponent(mediaFields)}&limit=12&access_token=${encodeURIComponent(accessToken)}`
  );
  const mediaJson: any = await mediaRes.json();

  const media: InstagramMediaInput[] = Array.isArray(mediaJson?.data) ? mediaJson.data : [];

  return {
    username: profileJson?.username || '',
    displayName: profileJson?.name || profileJson?.username || '',
    biography: profileJson?.biography || '',
    profilePictureUrl: profileJson?.profile_picture_url || '',
    followersCount: profileJson?.followers_count,
    media,
    connectedAt: new Date().toISOString().split('T')[0],
  };
}

export function renderOAuthCallbackHtml(payload: {
  type: 'INSTAGRAM_OAUTH_SUCCESS' | 'INSTAGRAM_OAUTH_ERROR' | 'CHECK_HASH_FRAGMENT';
  instagramData?: any;
  error?: string;
}): string {
  const safePayload = JSON.stringify(payload).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <title>Conexão Instagram — Creator World</title>
    <style>
      body { background: #09090b; color: #f4f4f5; font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; padding: 24px; }
      .box { max-width: 380px; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 24px; }
      p { font-size: 13px; color: #a1a1aa; }
    </style>
  </head>
  <body>
    <div class="box">
      <h3 id="title">${
        payload.type === 'INSTAGRAM_OAUTH_SUCCESS'
          ? 'Instagram conectado!'
          : payload.type === 'CHECK_HASH_FRAGMENT'
          ? 'Finalizando conexão...'
          : 'Erro ao conectar Instagram'
      }</h3>
      <p id="desc">${
        payload.type === 'INSTAGRAM_OAUTH_SUCCESS'
          ? 'Sincronizando fotos e preenchendo seus dados automaticamente com Gemini...'
          : payload.type === 'CHECK_HASH_FRAGMENT'
          ? 'Processando token de acesso da Meta...'
          : payload.error || 'Tente novamente.'
      }</p>
    </div>
    <script>
      (function () {
        var msg = ${safePayload};
        function notifyAndClose(finalMsg) {
          if (window.opener) {
            window.opener.postMessage(finalMsg, '*');
            setTimeout(function () { window.close(); }, 600);
          } else {
            window.location.href = '/';
          }
        }

        if (msg.type === 'CHECK_HASH_FRAGMENT') {
          var hashParams = new URLSearchParams((window.location.hash || '').replace(/^#/, ''));
          var accessToken = hashParams.get('access_token');
          var hashError = hashParams.get('error_description') || hashParams.get('error');
          if (accessToken) {
            fetch('/api/instagram/exchange-token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken: accessToken })
            })
              .then(function (r) { return r.json(); })
              .then(function (data) {
                if (data && data.success && data.instagramData) {
                  document.getElementById('title').textContent = 'Instagram conectado!';
                  document.getElementById('desc').textContent = 'Preenchendo sua página automaticamente...';
                  notifyAndClose({ type: 'INSTAGRAM_OAUTH_SUCCESS', instagramData: data.instagramData });
                } else {
                  notifyAndClose({ type: 'INSTAGRAM_OAUTH_ERROR', error: (data && data.error) || 'Falha ao ler dados da conta.' });
                }
              })
              .catch(function () {
                notifyAndClose({ type: 'INSTAGRAM_OAUTH_ERROR', error: 'Erro de comunicação ao validar token da Meta.' });
              });
            return;
          }
          notifyAndClose({
            type: 'INSTAGRAM_OAUTH_ERROR',
            error: hashError || 'Autorização cancelada ou código ausente.'
          });
          return;
        }

        notifyAndClose(msg);
      })();
    </script>
  </body>
</html>`;
}

export function renderMetaComplianceHtml(
  kind: 'privacy' | 'terms' | 'deletion',
  baseUrl: string
): string {
  const titles = {
    privacy: 'Política de Privacidade — Creator World',
    terms: 'Termos de Serviço — Creator World',
    deletion: 'Exclusão de Dados do Usuário — Creator World',
  };
  const bodyHtml =
    kind === 'privacy'
      ? `
        <h1>Política de Privacidade — Creator World</h1>
        <p>A plataforma <strong>Creator World</strong> coleta exclusivamente as informações públicas e mídias autorizadas pelo criador via Login Oficial da Meta/Instagram (nome, nome de usuário, foto de perfil, biografia e postagens selecionadas) com a única finalidade de gerar e hospedar sua página pública de criador.</p>
        <p>Não vendemos, compartilhamos ou utilizamos seus dados para anúncios de terceiros. Os dados salvos no navegador podem ser removidos ou atualizados pelo criador a qualquer momento.</p>
        <p>Para solicitar exclusão de qualquer dado conectado, acesse <a href="${baseUrl}/exclusao-de-dados">${baseUrl}/exclusao-de-dados</a>.</p>
      `
      : kind === 'terms'
      ? `
        <h1>Termos de Serviço — Creator World</h1>
        <p>Ao utilizar a plataforma <strong>Creator World</strong> e conectar sua conta do Instagram, você declara ser titular ou representante autorizado do perfil e concorda que suas informações e mídias autorizadas sejam exibidas na sua página pública de criador.</p>
        <p>Você pode revogar o acesso do aplicativo a qualquer momento nas configurações de aplicativos e sites da sua conta do Instagram ou Meta.</p>
      `
      : `
        <h1>Instruções de Exclusão de Dados — Creator World</h1>
        <p>Você pode remover seus dados conectados ao <strong>Creator World</strong> a qualquer momento seguindo os passos abaixo:</p>
        <ol>
          <li>Acesse as configurações da sua conta do <strong>Instagram</strong> ou <strong>Facebook</strong> &rarr; <em>Apps e sites</em>.</li>
          <li>Selecione <strong>Creator World / Meu Espaço</strong> e clique em <strong>Remover</strong>.</li>
          <li>Opcionalmente, limpe os dados da página no painel do navegador em <em>Restaurar Padrão</em>.</li>
        </ol>
        <p>Nenhuma cópia permanente dos tokens OAuth é retida após a desconexão.</p>
      `;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${titles[kind]}</title>
    <style>
      body { background: #09090b; color: #e4e4e7; font-family: system-ui, -apple-system, sans-serif; line-height: 1.65; margin: 0; padding: 40px 20px; }
      main { max-width: 720px; margin: 0 auto; background: #18181b; border: 1px solid #27272a; border-radius: 16px; padding: 32px; }
      h1 { color: #ffffff; font-size: 24px; margin-top: 0; }
      a { color: #fbbf24; }
    </style>
  </head>
  <body>
    <main>
      ${bodyHtml}
      <p style="margin-top: 28px;"><a href="/">Voltar para Creator World</a></p>
    </main>
  </body>
</html>`;
}

export interface PublicInstagramLookupResult {
  success: boolean;
  profile?: {
    username: string;
    displayName: string;
    profilePictureUrl: string;
    biography: string;
    followersText: string;
    media: InstagramMediaInput[];
  };
  error?: string;
}

const CRAWLER_HEADERS = [
  {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  },
  {
    'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  },
];

async function fetchInstagramHtml(targetUrl: string): Promise<string> {
  for (const headers of CRAWLER_HEADERS) {
    try {
      const res = await fetch(targetUrl, {
        headers,
        redirect: 'follow',
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;
      const html = await res.text();
      if (html && (html.includes('og:title') || html.includes('og:image'))) {
        return html;
      }
    } catch {
      // Try next crawler header
    }
  }
  return '';
}

async function fetchImageAsDataUrl(imageUrl: string, maxBytes = 900 * 1024): Promise<string> {
  if (!imageUrl || !imageUrl.startsWith('http')) return '';
  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        Accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
      },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return imageUrl;

    const rawMime = (res.headers.get('content-type') || 'image/jpeg').split(';')[0].trim().toLowerCase();
    if (!rawMime.startsWith('image/')) return imageUrl;

    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.byteLength === 0) return imageUrl;
    if (buffer.byteLength > maxBytes) return imageUrl;

    return `data:${rawMime};base64,${buffer.toString('base64')}`;
  } catch {
    return imageUrl;
  }
}

function extractPostOgMetadata(html: string) {
  const getMeta = (attr: string, value: string): string => {
    const r1 = new RegExp(`<meta[^>]*${attr}=["']${value}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
    const r2 = new RegExp(`<meta[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${value}["'][^>]*>`, 'i');
    return decodeHtmlEntities(html.match(r1)?.[1] || html.match(r2)?.[1] || '').trim();
  };

  const ogImage = getMeta('property', 'og:image');
  const ogDescription = getMeta('property', 'og:description') || getMeta('name', 'description');
  const ogTitle = getMeta('property', 'og:title');

  const captionMatch = ogDescription.match(/on Instagram:\s*["“]([\s\S]*?)["”]$/i) || ogTitle.match(/:\s*["“]([\s\S]*?)["”]$/i);
  const caption = (captionMatch?.[1] || ogDescription || ogTitle || '').trim();

  return { ogImage, caption };
}

export async function fetchPublicInstagramProfile(
  username: string,
  postUrls: string[] = []
): Promise<PublicInstagramLookupResult> {
  const cleanHandle = (username || '')
    .replace(/^@+/, '')
    .replace(/[^a-zA-Z0-9._]/g, '')
    .trim()
    .toLowerCase();

  if (!cleanHandle) {
    return { success: false, error: 'Informe um @ válido do Instagram.' };
  }

  const profileHtml = await fetchInstagramHtml(`https://www.instagram.com/${cleanHandle}/`);
  const parsed = profileHtml
    ? parseInstagramOgProfile(profileHtml, cleanHandle)
    : {
        username: cleanHandle,
        displayName: '',
        profilePictureUrl: '',
        biography: '',
        followersText: '',
      };

  const validPostUrls = Array.from(
    new Set(
      (postUrls || [])
        .map((u) => (u || '').trim())
        .filter((u) => /^https?:\/\/(www\.)?instagram\.com\/.+/i.test(u))
    )
  ).slice(0, 8);

  const [resolvedAvatar, postMediaResults] = await Promise.all([
    parsed.profilePictureUrl ? fetchImageAsDataUrl(parsed.profilePictureUrl) : Promise.resolve(''),
    Promise.allSettled(
      validPostUrls.map(async (url, idx): Promise<InstagramMediaInput | null> => {
        const html = await fetchInstagramHtml(url);
        if (!html) return null;
        const { ogImage, caption } = extractPostOgMetadata(html);
        if (!ogImage) return null;
        const dataUrl = await fetchImageAsDataUrl(ogImage);
        return {
          id: `ig_post_${Date.now()}_${idx}`,
          media_type: url.includes('/reel/') ? 'VIDEO' : 'IMAGE',
          media_url: dataUrl || ogImage,
          thumbnail_url: dataUrl || ogImage,
          caption: caption || `Publicação de @${cleanHandle}`,
          permalink: url,
          timestamp: new Date().toISOString(),
        };
      })
    ),
  ]);

  const media: InstagramMediaInput[] = postMediaResults
    .filter((r): r is PromiseFulfilledResult<InstagramMediaInput | null> => r.status === 'fulfilled')
    .map((r) => r.value)
    .filter((item): item is InstagramMediaInput => Boolean(item));

  if (!parsed.displayName && !resolvedAvatar && !parsed.followersText && media.length === 0) {
    return {
      success: false,
      error: `Não foi possível ler os dados públicos de @${cleanHandle} agora. Verifique se o @ está correto e se a conta é pública (ou envie suas fotos manualmente).`,
    };
  }

  return {
    success: true,
    profile: {
      username: cleanHandle,
      displayName: parsed.displayName || `@${cleanHandle}`,
      profilePictureUrl: resolvedAvatar,
      biography: parsed.biography,
      followersText: parsed.followersText,
      media,
    },
  };
}

