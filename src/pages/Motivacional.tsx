import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target, TrendingUp, Star } from 'lucide-react';

const Motivacional = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Conteúdo Motivacional
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Transforme sua mentalidade e alcance seus objetivos com nosso conteúdo inspirador
          </p>
          <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
            <Heart className="mr-2 h-5 w-5" />
            Começar Jornada
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Transforme sua vida
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-purple-500 transition-colors">
              <CardHeader>
                <Target className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Foco e Disciplina</CardTitle>
                <CardDescription>
                  Desenvolva o foco necessário para alcançar seus objetivos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Técnicas de concentração</li>
                  <li>• Hábitos produtivos</li>
                  <li>• Gestão de tempo</li>
                  <li>• Eliminação de distrações</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-colors">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Mentalidade Vencedora</CardTitle>
                <CardDescription>
                  Cultive uma mentalidade de crescimento e sucesso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Mindset de crescimento</li>
                  <li>• Superação de obstáculos</li>
                  <li>• Autoconfiança</li>
                  <li>• Resiliência mental</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-purple-500 transition-colors">
              <CardHeader>
                <Star className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Supere seus Limites</CardTitle>
                <CardDescription>
                  Quebre barreiras e alcance seu máximo potencial
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Zona de conforto</li>
                  <li>• Metas desafiadoras</li>
                  <li>• Persistência</li>
                  <li>• Autossuperação</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">
            Pronto para transformar sua vida?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Acesse nosso conteúdo motivacional e comece sua jornada de transformação hoje mesmo
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Ver Conteúdo Motivacional
            </Button>
            <Button size="lg" variant="outline">
              Downloads Gratuitos
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Motivacional;