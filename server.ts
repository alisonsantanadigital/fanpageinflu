import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  buildInstagramAuthUrl,
  exchangeInstagramCodeAndFetchData,
  fetchInstagramAccountFromUnifiedToken,
  fetchPublicInstagramProfile,
  generateCreatorAutofill,
  generateCreatorFromInstagram,
  renderMetaComplianceHtml,
  renderOAuthCallbackHtml,
  resolveOAuthBaseUrl,
} from './src/utils/serverAi';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// AI Creator Autofill Endpoint (Supports prompt text or transcribed speech)
app.post('/api/ai/autofill', async (req, res) => {
  const { prompt, audioData } = req.body || {};

  if (!prompt && !audioData) {
    return res.status(400).json({ error: 'Prompt ou áudio necessário para geração.' });
  }

  const result = await generateCreatorAutofill({
    prompt,
    audioData,
    apiKey: process.env.GEMINI_API_KEY,
  });

  return res.json(result);
});

// Instagram OAuth URL Endpoint
app.get('/api/instagram/auth-url', (req, res) => {
  const baseUrl = resolveOAuthBaseUrl(req.headers);
  const redirectUri = `${baseUrl}/api/instagram/callback`;
  return res.json(buildInstagramAuthUrl(redirectUri));
});

// Instagram OAuth Callback Endpoint (handles trailing slash variations and hash fragments)
const handleInstagramCallback = async (req: express.Request, res: express.Response) => {
  const code = typeof req.query.code === 'string' ? req.query.code : '';
  const error = typeof req.query.error === 'string' ? req.query.error : '';
  const errorDesc = typeof req.query.error_description === 'string' ? req.query.error_description : '';

  if (error) {
    return res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'INSTAGRAM_OAUTH_ERROR',
        error: errorDesc || error || 'Autorização cancelada.',
      })
    );
  }

  if (!code) {
    // Support Meta URL de login implicit fragment (#access_token=...)
    return res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'CHECK_HASH_FRAGMENT',
      })
    );
  }

  try {
    const baseUrl = resolveOAuthBaseUrl(req.headers);
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    const instagramData = await exchangeInstagramCodeAndFetchData(code, redirectUri);
    return res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'INSTAGRAM_OAUTH_SUCCESS',
        instagramData,
      })
    );
  } catch (err: any) {
    return res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'INSTAGRAM_OAUTH_ERROR',
        error: err?.message || 'Não foi possível concluir a autenticação com o Instagram.',
      })
    );
  }
};

app.get(['/api/instagram/callback', '/api/instagram/callback/'], handleInstagramCallback);

app.post('/api/instagram/exchange-token', async (req, res) => {
  const accessToken = typeof req.body?.accessToken === 'string' ? req.body.accessToken : '';
  if (!accessToken) {
    return res.status(400).json({ success: false, error: 'Token de acesso ausente.' });
  }
  try {
    const instagramData = await fetchInstagramAccountFromUnifiedToken(accessToken);
    return res.json({ success: true, instagramData });
  } catch (err: any) {
    return res.status(200).json({
      success: false,
      error: err?.message || 'Falha ao consultar perfil do Instagram via token.',
    });
  }
});

app.post('/api/instagram/data-deletion', (req, res) => {
  const baseUrl = resolveOAuthBaseUrl(req.headers);
  const confirmationCode = `cw_del_${Date.now().toString(36)}`;
  return res.json({
    url: `${baseUrl}/exclusao-de-dados?code=${confirmationCode}`,
    confirmation_code: confirmationCode,
  });
});

app.get('/api/instagram/data-deletion', (req, res) => {
  const baseUrl = resolveOAuthBaseUrl(req.headers);
  return res.status(200).send(renderMetaComplianceHtml('deletion', baseUrl));
});

app.get('/privacidade', (req, res) => {
  const baseUrl = resolveOAuthBaseUrl(req.headers);
  return res.status(200).send(renderMetaComplianceHtml('privacy', baseUrl));
});

app.get('/termos', (req, res) => {
  const baseUrl = resolveOAuthBaseUrl(req.headers);
  return res.status(200).send(renderMetaComplianceHtml('terms', baseUrl));
});

app.get('/exclusao-de-dados', (req, res) => {
  const baseUrl = resolveOAuthBaseUrl(req.headers);
  return res.status(200).send(renderMetaComplianceHtml('deletion', baseUrl));
});

// Instant Public Instagram Lookup Endpoint (Profile + Avatar + Post Links)
app.post('/api/instagram/lookup', async (req, res) => {
  const { username, postUrls } = req.body || {};
  const result = await fetchPublicInstagramProfile(
    typeof username === 'string' ? username : '',
    Array.isArray(postUrls) ? postUrls : []
  );
  return res.json(result);
});

// Instant Instagram + Gemini Auto-Fill Endpoint
app.post('/api/instagram/autofill', async (req, res) => {
  const payload = req.body || {};
  const result = await generateCreatorFromInstagram(payload, process.env.GEMINI_API_KEY);
  return res.json(result);
});

// Mount Vite middleware in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Creator World running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
