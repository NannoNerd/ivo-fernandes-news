import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, BookOpen, Download, Play } from 'lucide-react';

const AutoCADCivil3D = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            AutoCAD Civil 3D
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Domine as ferramentas mais avançadas de engenharia civil e infraestrutura com nossos tutoriais especializados
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Play className="mr-2 h-5 w-5" />
            Começar Agora
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            O que você vai aprender
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <Wrench className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>Modelagem 3D Avançada</CardTitle>
                <CardDescription>
                  Criação de superfícies, corredores e projetos complexos de infraestrutura
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Superfícies topográficas</li>
                  <li>• Design de estradas</li>
                  <li>• Redes de drenagem</li>
                  <li>• Análise de volumes</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>Documentação Técnica</CardTitle>
                <CardDescription>
                  Geração automática de plantas, perfis e seções transversais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• Plantas baixas automáticas</li>
                  <li>• Perfis longitudinais</li>
                  <li>• Seções transversais</li>
                  <li>• Tabelas de quantidade</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-blue-500 transition-colors">
              <CardHeader>
                <Download className="h-12 w-12 text-purple-600 mb-4" />
                <CardTitle>Scripts e Automação</CardTitle>
                <CardDescription>
                  Automatize tarefas repetitivas com scripts personalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li>• LISP customizados</li>
                  <li>• Macros avançadas</li>
                  <li>• Templates profissionais</li>
                  <li>• Workflows otimizados</li>
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
            Pronto para dominar o Civil 3D?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Junte-se aos nossos cursos e transforme sua carreira na engenharia civil
          </p>
          <div className="space-x-4">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Ver Cursos Disponíveis
            </Button>
            <Button size="lg" variant="outline">
              Download de Recursos
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AutoCADCivil3D;