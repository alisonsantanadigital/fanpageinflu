import {
  exchangeInstagramCodeAndFetchData,
  renderOAuthCallbackHtml,
  resolveOAuthBaseUrl,
} from '../../src/utils/serverAi';

interface VercelRequestLike {
  query?: Record<string, string | string[] | undefined>;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  send: (body: string) => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  const query = req.query || {};
  const errorDesc = Array.isArray(query.error_description)
    ? query.error_description[0]
    : query.error_description;
  const error = Array.isArray(query.error) ? query.error[0] : query.error;
  const code = Array.isArray(query.code) ? query.code[0] : query.code;

  if (error) {
    res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'INSTAGRAM_OAUTH_ERROR',
        error: errorDesc || error || 'Autorização cancelada.',
      })
    );
    return;
  }

  if (!code) {
    res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'CHECK_HASH_FRAGMENT',
      })
    );
    return;
  }

  try {
    const baseUrl = resolveOAuthBaseUrl(req.headers || {});
    const redirectUri = `${baseUrl}/api/instagram/callback`;
    const instagramData = await exchangeInstagramCodeAndFetchData(code, redirectUri);
    res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'INSTAGRAM_OAUTH_SUCCESS',
        instagramData,
      })
    );
  } catch (err: any) {
    res.status(200).send(
      renderOAuthCallbackHtml({
        type: 'INSTAGRAM_OAUTH_ERROR',
        error: err?.message || 'Não foi possível concluir a autenticação com o Instagram.',
      })
    );
  }
}
