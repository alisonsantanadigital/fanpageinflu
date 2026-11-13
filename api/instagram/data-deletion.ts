import { renderMetaComplianceHtml, resolveOAuthBaseUrl } from '../../src/utils/serverAi';

interface VercelRequestLike {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponseLike {
  status: (code: number) => VercelResponseLike;
  json: (data: any) => void;
  send: (body: string) => void;
  setHeader: (name: string, value: string) => void;
}

export default function handler(req: VercelRequestLike, res: VercelResponseLike) {
  const baseUrl = resolveOAuthBaseUrl(req.headers || {});
  if (req.method === 'POST') {
    res.setHeader('Content-Type', 'application/json');
    const confirmationCode = `cw_del_${Date.now().toString(36)}`;
    res.status(200).json({
      url: `${baseUrl}/api/instagram/data-deletion?code=${confirmationCode}`,
      confirmation_code: confirmationCode,
    });
    return;
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(renderMetaComplianceHtml('deletion', baseUrl));
}
