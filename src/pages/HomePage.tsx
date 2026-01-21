import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Cog, BookOpen, TrendingUp, Lightbulb, Play, Users, Target, Brain, Loader2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Feed from '@/components/Feed';
import EngineeringAIModal from '@/components/EngineeringAIModal';
import CryptoAIModal from '@/components/CryptoAIModal';
import TestimonialsSection from '@/components/TestimonialsSection';
import heroBackground from '@/assets/hero-engineering-bg.jpg';
import autocadImage from '@/assets/autocad-civil-3d.jpg';
import supereLimitesImage from '@/assets/supere-limites.jpg';
import mentalidadeVencedoraImage from '@/assets/mentalidade-vencedora.jpg';
import focoDisciplinaImage from '@/assets/foco-disciplina.jpg';
import criptosImage from '@/assets/criptos.jpg';

const HomePage = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);
  const [isCryptoAIModalOpen, setIsCryptoAIModalOpen] = useState(false);

  // Se há uma categoria, mostrar o Feed em vez da homepage
  if (category) {
    return (
      <main className="container mx-auto max-w-7xl px-4">
        <Feed />
      </main>
    );
  }

  const generateMotivationalMessage = async () => {
    setIsGeneratingMessage(true);
    try {
      const { data, error } = await supabase.functions.invoke('motivational-message');
      
      if (error) {
        console.error('Error generating motivational message:', error);
        toast.error('Erro ao gerar mensagem. Tente novamente.');
        return;
      }

      if (data?.message) {
        setMotivationalMessage(data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao conectar com o gerador de mensagens');
    } finally {
      setIsGeneratingMessage(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative min-h-[80vh] flex items-center justify-center text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(30, 41, 59, 0.8), rgba(51, 65, 85, 0.8)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
            Conhecimento, Inspiração e Inovação
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-4xl mx-auto">
            Aprenda Autocad Civil 3D, inspire-se com vídeos motivacionais e fique por dentro do universo das criptomoedas.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-lg">
            <Link to="/?category=engenharia" className="flex items-center">
              Explorar Agora
            </Link>
          </Button>
        </div>
      </section>

      {/* AutoCAD Civil 3D Section - 3 columns */}
      <section className="py-20 bg-white">{/* Tema explicitamente branco */}
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            {/* Coluna 1: Texto */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-blue-600">
                Aulas de Autocad Civil 3D
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Desenvolva suas habilidades em modelagem, projetos de infraestrutura e análise de terrenos com nossas aulas especializadas de Autocad Civil 3D.
              </p>
              <Button asChild variant="outline" size="lg" className="bg-white border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                <Link to="/engineering">
                  Saiba Mais
                </Link>
              </Button>
            </div>
            
            {/* Coluna 2: Imagem */}
            <div className="flex justify-center">
              <img 
                src="/lovable-uploads/9738989c-ef4b-4c6e-9aa1-02023a20c9c9.png" 
                alt="Autocad Civil 3D" 
                className="rounded-lg shadow-2xl w-full h-auto max-w-sm"
              />
            </div>
            
            {/* Coluna 3: Engenharia e Designer */}
            <div className="text-center border border-gray-300 rounded-lg p-6">
              <div className="bg-orange-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cog className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Engenharia e Designer</h3>
              <p className="text-muted-foreground mb-6">
                Gere scripts e comandos para softwares de engenharia usando IA.
              </p>
              <Button 
                className="bg-cyan-500 hover:bg-cyan-600 text-white mb-4 w-full max-w-xs"
                onClick={() => setIsAIModalOpen(true)}
              >
                Geração de Comandos por IA
              </Button>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Manuais e Tutoriais (Em Breve...)</p>
                <p>Projetos de Engenharia Civil (Em Breve...)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Motivational Videos Section - Dark Theme */}
      <section className="py-20 bg-slate-800 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-cyan-400">
              Vídeos Motivacionais
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
              Encontre inspiração para superar desafios e conquistar seus objetivos com conteúdos motivacionais cuidadosamente selecionados.
            </p>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white mb-8 px-8 py-3"
              onClick={generateMotivationalMessage}
              disabled={isGeneratingMessage}
            >
              {isGeneratingMessage ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Gerar Mensagem Positiva
                </>
              )}
            </Button>

            {motivationalMessage && (
              <div className="max-w-2xl mx-auto mb-12">
                <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-6">
                  <p className="text-cyan-300 text-lg italic font-medium">
                    "{motivationalMessage}"
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-700 border-slate-600 text-white group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={supereLimitesImage} 
                  alt="Supere seus limites" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Target className="h-5 w-5 mr-2 text-cyan-400" />
                  Supere seus limites
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Histórias inspiradoras de resiliência e determinação.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-700 border-slate-600 text-white group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={mentalidadeVencedoraImage} 
                  alt="Mentalidade vencedora" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Brain className="h-5 w-5 mr-2 text-yellow-400" />
                  Mentalidade vencedora
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Aprenda a cultivar pensamentos positivos diariamente.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-slate-700 border-slate-600 text-white group hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-300">
              <div className="relative overflow-hidden rounded-t-lg">
                <img 
                  src={focoDisciplinaImage} 
                  alt="Foco e disciplina" 
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Lightbulb className="h-5 w-5 mr-2 text-green-400" />
                  Foco e disciplina
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Descubra como manter a consistência para alcançar seus sonhos.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Cryptocurrency Section - 3 columns */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12 items-center">
            {/* Coluna 1: Imagem */}
            <div className="flex justify-center">
              <img 
                src={criptosImage} 
                alt="Criptomoedas" 
                className="rounded-lg shadow-2xl w-full h-auto max-w-sm"
              />
            </div>
            
            {/* Coluna 2: Texto e botão */}
            <div>
              <h2 className="text-4xl font-bold mb-6 text-pink-600">
                Mundo das Criptomoedas
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Explore análises, tendências e oportunidades no mercado de criptomoedas. Informação confiável e atualizada para quem deseja investir com segurança.
              </p>
              <Button asChild variant="outline" size="lg" className="border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white">
                <Link to="/?category=crypto">
                  Ver Conteúdos
                </Link>
              </Button>
            </div>
            
            {/* Coluna 3: Card CryptoMoeda + IA */}
            <div className="text-center border border-gray-300 rounded-lg p-6">
              <div className="bg-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-800">CryptoMoeda + IA</h3>
              <p className="text-muted-foreground mb-6">
                Tire suas dúvidas sobre criptomoedas e blockchain com nosso assistente.
              </p>
              <Button 
                className="bg-pink-500 hover:bg-pink-600 text-white mb-4 w-full max-w-xs"
                onClick={() => setIsCryptoAIModalOpen(true)}
              >
                Crypto IA / Pergunte
              </Button>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Análise de Gráficos (Em Breve...)</p>
                <p>Notícias e Atualizações (Em Breve...)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Explore Nossas Categorias
            </h2>
            <p className="text-muted-foreground">
              Conteúdo especializado para diferentes áreas de interesse
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-blue-500">
              <CardHeader className="text-center">
                <div className="bg-blue-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cog className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-blue-600">Engenharia</CardTitle>
                <CardDescription>
                  AutoCAD Civil 3D, projetos e ferramentas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-blue-50">
                  <Link to="/?category=engenharia">Explorar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-yellow-500">
              <CardHeader className="text-center">
                <div className="bg-yellow-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-yellow-600">Criptomoedas</CardTitle>
                <CardDescription>
                  Bitcoin, blockchain e investimentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-yellow-50">
                  <Link to="/?category=crypto">Explorar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-pink-500">
              <CardHeader className="text-center">
                <div className="bg-pink-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-pink-600">Música</CardTitle>
                <CardDescription>
                  Instrumentos, teoria musical e mais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-pink-50">
                  <Link to="/?category=music">Explorar</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 hover:border-green-500">
              <CardHeader className="text-center">
                <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-green-600">Motivacional</CardTitle>
                <CardDescription>
                  Inspiração e desenvolvimento pessoal
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full group-hover:bg-green-50">
                  <Link to="/?category=motivational">Explorar</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Engineering AI Modal */}
      <EngineeringAIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />

      {/* Crypto AI Modal */}
      <CryptoAIModal
        isOpen={isCryptoAIModalOpen}
        onClose={() => setIsCryptoAIModalOpen(false)}
      />
    </div>
  );
};

export default HomePage;