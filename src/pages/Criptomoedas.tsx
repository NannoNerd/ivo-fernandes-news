import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bitcoin, TrendingUp, Shield, Zap } from 'lucide-react';

const Criptomoedas = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Mundo das Criptomoedas
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Domine o futuro das finanças digitais com análises, estratégias e insights sobre criptomoedas
          </p>
          <Button size="lg" className="bg-white text-yellow-600 hover:bg-gray-100">
            <Bitcoin className="mr-2 h-5 w-5" />
            Começar a Investir
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Aprenda sobre o mercado cripto
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <Bitcoin className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>Análise Fundamentalista</CardTitle>
                <CardDescription>
                  Entenda os fundamentos das principais criptomoedas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Bitcoin e Ethereum</li>
                  <li>• Altcoins promissoras</li>
                  <li>• Tecnologia Blockchain</li>
                  <li>• Casos de uso reais</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Análise Técnica</CardTitle>
                <CardDescription>
                  Domine as ferramentas de análise técnica para trading
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Padrões de candlestick</li>
                  <li>• Indicadores técnicos</li>
                  <li>• Suporte e resistência</li>
                  <li>• Estratégias de entrada</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-yellow-500 transition-colors">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Segurança e Gestão</CardTitle>
                <CardDescription>
                  Proteja seus investimentos e gerencie riscos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Carteiras seguras</li>
                  <li>• Gestão de risco</li>
                  <li>• Diversificação</li>
                  <li>• Estratégias DCA</li>
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
            Pronto para entrar no mundo cripto?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Acesse nossas análises exclusivas e comece a investir com conhecimento
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700">
              Ver Análises
            </Button>
            <Button size="lg" variant="outline">
              <Zap className="mr-2 h-4 w-4" />
              IA Crypto Assistant
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Criptomoedas;