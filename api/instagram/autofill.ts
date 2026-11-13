import { generateCreatorFromInstagram } from '../../src/utils/serverAi';

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
    res.status(405).json({ error: 'Método não permitido. Use POST.' });
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

  const payload = body || {};
  const result = await generateCreatorFromInstagram(payload, process.env.GEMINI_API_KEY);
  res.status(200).json(result);
}
