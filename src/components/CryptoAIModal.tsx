import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CryptoAIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CryptoAIModal = ({ isOpen, onClose }: CryptoAIModalProps) => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      toast.error('Por favor, digite sua pergunta');
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const { data, error } = await supabase.functions.invoke('crypto-ai', {
        body: { prompt }
      });

      if (error) {
        console.error('Error calling crypto-ai function:', error);
        toast.error('Erro ao gerar resposta. Tente novamente.');
        return;
      }

      if (data?.response) {
        setResponse(data.response);
      } else {
        toast.error('Resposta vazia recebida');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao conectar com o assistente IA');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setPrompt('');
    setResponse('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-yellow-600">
            CryptoMoeda + IA
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Tire suas dúvidas sobre criptomoedas e blockchain com nosso assistente
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Ex: Como funciona o staking de Ethereum? Quais são os riscos e benefícios?"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !prompt.trim()}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analisando...
              </>
            ) : (
              <>
                <TrendingUp className="mr-2 h-4 w-4" />
                Crypto IA / Pergunte
              </>
            )}
          </Button>

          {response && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-medium mb-2 text-yellow-800">Resposta:</h3>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {response}
                </pre>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CryptoAIModal;