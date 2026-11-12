import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize GoogleGenAI server-side with required User-Agent
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// AI Creator Autofill Endpoint (Supports prompt text or transcribed speech)
app.post('/api/ai/autofill', async (req, res) => {
  try {
    const { prompt, audioData, currentProfile } = req.body;

    if (!prompt && !audioData) {
      return res.status(400).json({ error: 'Prompt ou áudio necessário para geração.' });
    }

    if (!aiClient) {
      // Fallback deterministic generator if API key is not yet set
      const mockResult = generateFallbackCreator(prompt || 'Criador Digital Criativo');
      return res.json({ success: true, creator: mockResult, source: 'fallback' });
    }

    const systemInstruction = `Você é o Creator World AI Copilot, especialista em branding de influenciadores, design editorial e monetização de criadores digitais.
Com base no briefing, prompt de texto ou áudio fornecido, gere um perfil de influenciador ultra-completo, sofisticado e pronto para publicação.
Retorne ESTRITAMENTE um objeto JSON válido (sem tags markdown, sem blocos de código) com o seguinte formato:
{
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
    { "title": string, "url": string, "description": string, "category": string, "isFeatured": boolean }
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
  ] (2 produtos ou livros autorais),
  "videos": [
    { "title": string, "description": string, "videoUrl": string, "duration": string, "views": string, "category": string }
  ] (2 vídeos ou trailers em destaque)
}`;

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
      model: 'gemini-3.8-flash',
      contents: { parts: contents },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
      },
    });

    const textOutput = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(textOutput);
    } catch {
      // Regex parse fallback
      const cleanJson = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    }

    return res.json({ success: true, creator: parsed, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error generating creator with Gemini:', error);
    // Graceful fallback to rich local generation
    const fallback = generateFallbackCreator(req.body.prompt || 'Influenciador Digital');
    return res.json({ success: true, creator: fallback, source: 'fallback_error', error: error.message });
  }
});

function generateFallbackCreator(briefing: string) {
  const isAudio = briefing.toLowerCase().includes('música') || briefing.toLowerCase().includes('áudio') || briefing.toLowerCase().includes('dj');
  const isWellness = briefing.toLowerCase().includes('livro') || briefing.toLowerCase().includes('escrit') || briefing.toLowerCase().includes('bem-estar');
  
  if (isAudio) {
    return {
      displayName: 'Matheus Kross',
      username: 'matheuskross',
      tagline: 'Produtor Musical, DJ & Engenheiro de Som',
      bio: 'Explorando novas fronteiras entre música eletrônica analógica, sintetizadores modulares e inteligência sonora.',
      fullStory: 'Iniciei minha jornada gravando em estúdios underground aos 17 anos. Hoje, minhas faixas e soundscapes tocam em palcos internacionais e compõem trilhas para documentários premiados.',
      location: 'São Paulo & Berlim',
      interests: ['Sintetizadores Modulares', 'Sound Design Cinematográfico', 'Gravação em Fita', 'Música Imersiva'],
      trajectory: [
        { year: '2019', title: 'Primeiro EP Independente', description: 'Mais de 2 milhões de streams orgânicos no Spotify.' },
        { year: '2022', title: 'Turnê Europeia de Live Sets', description: 'Apresentações em festivais em Amsterdã e Berlim.' },
        { year: '2026', title: 'Lançamento do Sound Pack Vol. 1', description: 'Banco de timbres analógicos para produtores.' }
      ],
      templateId: 'dark-creator',
      links: [
        { title: 'Ouça no Spotify', url: 'https://spotify.com', description: 'Último single e discografia oficial', category: 'conteudos', isFeatured: true },
        { title: 'Sound Pack Analógico 2026', url: 'https://exemplo.com/pack', description: 'Mais de 300 samples exclusivos', category: 'produtos', isFeatured: true },
        { title: 'Canal do YouTube', url: 'https://youtube.com', description: 'Bastidores de estúdio e tutoriais', category: 'redes', isFeatured: false },
        { title: 'Comunidade no Discord', url: 'https://discord.com', description: 'Troca de presets e networking', category: 'comunidade', isFeatured: false }
      ],
      posts: [
        {
          title: 'A Arte da Mixagem Imersiva com Sintetizadores',
          slug: 'mixagem-imersiva-sintetizadores',
          excerpt: 'Como esculpir frequências para criar sensações de espaço tridimensional no ouvinte.',
          content: 'O som é mais do que vibração de ar; é arquitetura emocional. Quando trabalhamos com filtros analógicos, cada ressonância gera calor harmônico que conecta com o sistema nervoso.',
          category: 'Produção',
          readTime: '5 min'
        }
      ],
      letter: {
        title: 'Mensagem aos Exploradores de Frequência',
        teaser: 'Toque para abrir minha carta sobre os desafios de viver da própria arte.',
        text: 'A todos vocês que apoiam cada lançamento e me mandam mensagens de incentivo: este som existe por causa de vocês. Obrigado por compartilharem essa jornada sonora comigo!',
        signature: 'Matheus Kross',
        waxSealColor: '#8B5CF6'
      },
      products: [
        {
          title: 'Kross Modular Sample Pack',
          description: '400+ loops e One-Shots capturados em sintetizadores modulares raros.',
          price: 'R$ 180,00',
          benefits: ['Royalty Free', '24-bit 96kHz WAV', 'Presets exclusivos para Serum'],
          buyUrl: 'https://exemplo.com/buy/pack',
          badge: 'Mais Vendido',
          format: 'Download Imediato'
        }
      ],
      videos: [
        {
          title: 'Live Modular Session no Estúdio',
          description: 'Improvisação ao vivo com sintetizadores analógicos e sequenciadores.',
          videoUrl: 'https://www.youtube.com',
          duration: '18:40',
          views: '45k visualizações',
          category: 'Live Set'
        }
      ]
    };
  }

  return {
    displayName: 'Mariana Duarte',
    username: 'marianaduarte',
    tagline: 'Autora, Criadora Editorial & Pesquisadora Visual',
    bio: 'Narrando histórias sobre arte, viagens lentas, literatura e o poder dos pequenos detalhes cotidianos.',
    fullStory: 'Deixei a rotina corporativa tradicional para me dedicar à escrita autoral e curadoria de arte. Acredito na internet como espaço de calma, reflexão e beleza duradoura.',
    location: 'Rio de Janeiro & Lisboa',
    interests: ['Literatura Contemporânea', 'Design Editorial', 'Café Especial', 'Fotografia Analógica', 'Cerâmica'],
    trajectory: [
      { year: '2021', title: 'Início da Newsletter Semanal', description: 'Mais de 40 mil leitores fiéis todo domingo de manhã.' },
      { year: '2023', title: 'Publicação do Livro "Tempo de Respirar"', description: 'Best-seller de ensaios e crônicas reflexivas.' },
      { year: '2026', title: 'Clube de Leitura & Revista Digital', description: 'Encontros mensais com autores e comunidade.' }
    ],
    templateId: isWellness ? 'minimal-personal' : 'editorial-luxury',
    links: [
      { title: 'Newsletter no Substack', url: 'https://substack.com', description: 'Ensaios dominicais com reflexões inéditas', category: 'conteudos', isFeatured: true },
      { title: 'Livro "Tempo de Respirar"', url: 'https://amazon.com', description: 'Edição especial em capa dura com ilustrações', category: 'produtos', isFeatured: true },
      { title: 'Canal de Conversas & Leituras', url: 'https://youtube.com', description: 'Vídeos quinzenais sobre livros e rotina', category: 'redes', isFeatured: false },
      { title: 'Contato para Palestras & Projetos', url: 'mailto:contato@exemplo.com', description: 'Assessoria editorial e convites', category: 'contato', isFeatured: false }
    ],
    posts: [
      {
        title: 'A Coragem de Ler Devagar na Era da Pressa',
        slug: 'a-coragem-de-ler-devagar',
        excerpt: 'Por que desacelerar a leitura transforma nossa capacidade de sentir e criar.',
        content: 'Ler devagar não é lentidão; é respeito pela palavra alheia. Quando mastigamos uma frase com atenção, descobrimos camadas que a pressa nos rouba.',
        category: 'Literatura',
        readTime: '4 min'
      }
    ],
    letter: {
      title: 'Uma Carta Aberta aos Meus Leitores',
      teaser: 'Abra este envelope para ler o que guardei no coração para você.',
      text: 'Querido leitor(a), obrigado por fazer deste cantinho na internet um refúgio de presença e afeto. Cada linha que escrevo é um diálogo silencioso com a sua sensibilidade.',
      signature: 'Mariana Duarte',
      waxSealColor: '#8F714B'
    },
    products: [
      {
        title: 'Livro "Tempo de Respirar" — Edição Especial',
        description: 'Livro físico em capa dura com tecido bordado e 220 páginas de ensaios.',
        price: 'R$ 89,00',
        benefits: ['Marcador de páginas em linho', 'Dedicatória personalizada', 'Frete incluso'],
        buyUrl: 'https://exemplo.com/comprar/livro',
        badge: 'Best-Seller',
        format: 'Livro Físico'
      }
    ],
    videos: [
      {
        title: 'Tour Pelo Meu Ateliê de Escrita & Biblioteca',
        description: 'Os livros mais marcantes da minha vida e como organizo meu espaço de criação.',
        videoUrl: 'https://www.youtube.com',
        duration: '14:20',
        views: '88k visualizações',
        category: 'Bastidores'
      }
    ]
  };
}

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
