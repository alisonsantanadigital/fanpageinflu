import { buildInstagramAuthUrl, resolveOAuthBaseUrl } from '../../src/utils/serverAi';

interface VercelRequestLike {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (data: any) => void;
  setHeader: (name: string, value: string) => void;
}

export default function handler(req: VercelRequestLike, res: VercelResponseLike) {
  res.setHeader('Content-Type', 'application/json');
  const baseUrl = resolveOAuthBaseUrl(req.headers || {});
  const redirectUri = `${baseUrl}/api/instagram/callback`;
  res.status(200).json(buildInstagramAuthUrl(redirectUri));
}
