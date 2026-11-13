import { fetchInstagramAccountFromUnifiedToken } from '../../src/utils/serverAi';

interface VercelRequestLike {
  method?: string;
  body?: any;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
  end: () => void;
}

export default async function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método não permitido. Use POST.' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const accessToken = typeof body?.accessToken === 'string' ? body.accessToken : '';
  if (!accessToken) {
    res.status(400).json({ success: false, error: 'Token de acesso ausente.' });
    return;
  }

  try {
    const instagramData = await fetchInstagramAccountFromUnifiedToken(accessToken);
    res.status(200).json({ success: true, instagramData });
  } catch (err: any) {
    res.status(200).json({
      success: false,
      error: err?.message || 'Falha ao consultar perfil do Instagram via token.',
    });
  }
}
