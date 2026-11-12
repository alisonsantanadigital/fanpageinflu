import React, { useState, useEffect, useRef } from 'react';
import { CreatorAccount } from '../../types/creator';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Send, 
  X, 
  Loader2, 
  Check, 
  Volume2, 
  FileText, 
  Wand2,
  AlertCircle
} from 'lucide-react';

interface AiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyGenerated: (generatedData: any) => void;
  currentProfileName?: string;
}

export const AiCopilotModal: React.FC<AiCopilotModalProps> = ({
  isOpen,
  onClose,
  onApplyGenerated,
  currentProfileName,
}) => {
  const [promptText, setPromptText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check SpeechRecognition support in browser
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setPromptText(prev => {
          const cleanPrev = prev.trim();
          return cleanPrev ? `${cleanPrev} ${currentTranscript}` : currentTranscript;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  if (!isOpen) return null;

  const toggleVoiceRecording = () => {
    if (!recognitionRef.current) {
      alert('Reconhecimento de voz do navegador não suportado neste dispositivo. Por favor, digite o prompt.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        setError(null);
      } catch (err) {
        console.error('Failed to start speech recognition', err);
      }
    }
  };

  const handleGenerate = async () => {
    if (!promptText.trim()) {
      setError('Por favor, informe seu briefing por texto ou voz.');
      return;
    }

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setLoading(true);
    setError(null);
    setStatusStep('Conectando ao Gemini AI...');

    try {
      setTimeout(() => setStatusStep('Gerando biografia, publicações e produtos...'), 1200);

      const response = await fetch('/api/ai/autofill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText.trim() }),
      });

      const data = await response.json();

      if (data.success && data.creator) {
        setStatusStep('Aplicando perfil e paleta recomendada!');
        setTimeout(() => {
          onApplyGenerated(data.creator);
          setLoading(false);
          setStatusStep(null);
          onClose();
        }, 800);
      } else {
        throw new Error(data.error || 'Não foi possível gerar os dados.');
      }
    } catch (err: any) {
      console.error('Error generating creator:', err);
      setError('Houve uma oscilação na conexão com a IA. Aplicando modelo padrão autoral.');
      setLoading(false);
      setStatusStep(null);
    }
  };

  const presetExamples = [
    {
      title: '👗 Moda & Luxo',
      text: 'Sou consultora de estilo e diretora criativa em São Paulo. Tenho uma masterclass de imagem, um livro sobre armário inteligente e um perfume autoral.',
    },
    {
      title: '🎧 DJ & Produção Sonora',
      text: 'Sou produtor de música eletrônica e sound designer. Quero divulgar meu novo álbum no Spotify, meus sample packs modulares e a comunidade VIP no Discord.',
    },
    {
      title: '📖 Autora & Bem-Estar',
      text: 'Sou escritora de ensaios e apresentadora de podcast sobre desaceleração. Quero divulgar meu livro físico, meu planner intencional e minha newsletter dominical.',
    },
    {
      title: '🍳 Gastronomia & Culinária',
      text: 'Sou chef e criador de receitas artesanais. Quero vender meu curso de fermentação natural, facas personalizadas e divulgar meus vídeos no YouTube.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative z-10 w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 text-neutral-100 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-neutral-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold block">
              Creator Copilot AI
            </span>
            <span className="text-[11px] text-neutral-400 block">
              Preenchimento Inteligente via Áudio ou Prompt
            </span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white tracking-tight mt-3">
          Crie ou Atualize seu Espaço com IA
        </h2>
        <p className="text-xs text-neutral-400 mt-1 mb-5 leading-relaxed">
          Fale no microfone ou descreva o que você faz. Nossa inteligência artificial escreverá sua biografia editorial, artigos de revista, carta aos fãs, catálogo de produtos e escolherá o template perfeito.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Input Textarea with Mic Button */}
        <div className="relative mb-4">
          <textarea
            rows={4}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            placeholder="Fale no microfone ou digite: 'Sou fotógrafo de vida selvagem e autor de 2 livros, quero vender minhas impressões fine-art e divulgar minha expedição na Patagônia...'"
            className="w-full p-4 pr-14 rounded-2xl bg-neutral-800/90 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 leading-relaxed"
          />

          {/* Voice Mic Toggle Button */}
          <button
            type="button"
            onClick={toggleVoiceRecording}
            className={`absolute right-3 bottom-4 p-3 rounded-xl transition-all shadow-md ${
              isRecording
                ? 'bg-rose-600 text-white animate-pulse ring-4 ring-rose-500/30'
                : 'bg-neutral-700 hover:bg-neutral-600 text-amber-400'
            }`}
            title={isRecording ? 'Parar gravação' : 'Falar por áudio'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
        </div>

        {/* Live Audio indicator */}
        {isRecording && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center justify-between text-xs text-rose-300 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>Ouvindo sua voz em português... Fale normalmente sobre você.</span>
            </div>
            <button
              onClick={toggleVoiceRecording}
              className="text-xs font-semibold underline text-rose-200"
            >
              Concluir Fala
            </button>
          </div>
        )}

        {/* Quick presets */}
        <div className="mb-6">
          <span className="text-[11px] font-mono uppercase text-neutral-400 tracking-wider block mb-2">
            Sugestões Rápidas de Briefing:
          </span>
          <div className="flex flex-wrap gap-2">
            {presetExamples.map((ex, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setPromptText(ex.text)}
                className="px-3 py-1.5 rounded-lg text-xs bg-neutral-800/80 hover:bg-neutral-700/80 text-neutral-300 border border-neutral-700 text-left transition-colors"
              >
                {ex.title}
              </button>
            ))}
          </div>
        </div>

        {/* Status / Submit button */}
        <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400">
            {statusStep ? (
              <span className="text-amber-400 font-medium flex items-center gap-2 animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                {statusStep}
              </span>
            ) : (
              <span>Alimentado por Gemini 3.8 Flash</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleGenerate}
              disabled={loading || !promptText.trim()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-neutral-950 transition-all shadow-md disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Gerando Universo...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Preencher Meu Espaço com IA</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
