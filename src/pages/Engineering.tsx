import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wrench, Building2, Globe, Droplets, Truck, Calculator } from 'lucide-react';
import EngineeringAIModal from '@/components/EngineeringAIModal';
import heroImage from '@/assets/hero-engineering-bg.jpg';

const engineeringCategories = [
  {
    icon: Wrench,
    title: 'Introdução no Autocad Civil 3D',
    description: 'Comandos mais usados, escalas, layers e estilos para começar no Civil 3D',
    color: 'text-orange-400',
    subtopics: [
      'Comandos mais usados no Civil3D/Cad',
      'Tamanho de textos, Labels, qual a melhor escala',
      'Layers, cores, estilos. Como criar e editar'
    ]
  },
  {
    icon: Globe,
    title: 'Topografia no Civil 3D',
    description: 'Importação, criação e edição de topografias e grupos de pontos',
    color: 'text-green-400',
    subtopics: [
      'Entendendo os formatos e Importando Topografia no Civil 3D',
      'Criando e editando grupo de pontos',
      'Convertendo levantamentos para o Civil3D - Data Extraction'
    ]
  },
  {
    icon: Building2,
    title: 'Desenhando levantamento Topografico',
    description: 'Técnicas e métodos para desenhar levantamentos topográficos',
    color: 'text-blue-400',
    subtopics: []
  }
];

export default function Engineering() {
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Full Width */}
      <section className="relative py-20 text-center bg-gradient-to-br from-background via-background/95 to-primary/5 w-screen -mx-[50vw] left-1/2 px-4">
        <div 
          className="absolute inset-0 opacity-10 bg-cover bg-center w-full h-full"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Engenharia Civil & Tecnologia
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transforme sua carreira em engenharia com as ferramentas mais avançadas de IA, 
            tutoriais práticos e projetos reais.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              size="lg" 
              onClick={() => setIsAIModalOpen(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Geração de Comandos IA
            </Button>
            <Button variant="outline" size="lg">
              Vídeos Tutoriais IA
            </Button>
            <Button variant="outline" size="lg">
              Playlists de Vídeos
            </Button>
            <Button variant="outline" size="lg">
              Projetos de Engenharia Civil
            </Button>
          </div>
        </div>
      </section>

      {/* AI Command Generation Section - 70% Width on Desktop */}
      <section className="py-16 px-4">
        <div className="w-full max-w-none mx-auto lg:max-w-[70%]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Geração de Comandos por IA
            </h2>
            <p className="text-lg text-muted-foreground">
              Acelere seus projetos com comandos automatizados gerados por inteligência artificial
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {engineeringCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-300 bg-card/50 border-border/50 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-background/80 rounded-full w-fit">
                      <IconComponent className={`h-8 w-8 ${category.color}`} />
                    </div>
                    <CardTitle className="text-xl text-foreground">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  {category.subtopics && category.subtopics.length > 0 && (
                    <CardContent>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {category.subtopics.map((subtopic, subIndex) => (
                          <li key={subIndex} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {subtopic}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          {/* AI Command Generator */}
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card/80 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-center text-foreground">
                  Gerador de Comandos IA
                </CardTitle>
                <CardDescription className="text-center text-muted-foreground">
                  Descreva o que você precisa e nossa IA gerará comandos específicos para engenharia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">AutoCAD</Badge>
                    <Badge variant="secondary" className="text-xs">Civil 3D</Badge>
                    <Badge variant="secondary" className="text-xs">Revit</Badge>
                    <Badge variant="secondary" className="text-xs">SAP2000</Badge>
                    <Badge variant="secondary" className="text-xs">Python</Badge>
                    <Badge variant="secondary" className="text-xs">LISP</Badge>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90" 
                    size="lg"
                    onClick={() => setIsAIModalOpen(true)}
                  >
                    Gerar Comando
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Latest Engineering Video Section - Dark Theme */}
      <section className="relative py-16 text-center bg-slate-900 w-screen -mx-[50vw] left-1/2 px-4">
        <div className="relative z-10 w-full max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Último Vídeo de Engenharia
          </h2>
          <Card className="bg-slate-800/80 border-slate-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="aspect-video bg-slate-700/20 rounded-lg flex items-center justify-center mb-4">
                <p className="text-slate-300">Vídeo em breve...</p>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Novos Recursos do AutoCAD Civil 3D 2024
              </h3>
              <p className="text-slate-300">
                Explore as últimas funcionalidades e melhorias do AutoCAD Civil 3D para projetos de engenharia civil.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Engineering Projects Section - Light Theme */}
      <section className="py-16 px-4 bg-background">
        <div className="w-full max-w-none mx-auto lg:max-w-[70%]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Projetos de Engenharia
            </h2>
            <p className="text-lg text-muted-foreground">
              Explore nossos projetos práticos e casos de estudo em engenharia civil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Sistema de Drenagem Urbana",
                description: "Projeto completo de sistema de drenagem para área urbana com dimensionamento hidráulico.",
                category: "Hidráulica",
                image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop&crop=center"
              },
              {
                title: "Análise de Estabilidade de Taludes",
                description: "Estudo geotécnico para análise de estabilidade em encostas com diferentes métodos.",
                category: "Geotecnia",
                image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center"
              },
              {
                title: "Dimensionamento de Pavimento",
                description: "Projeto de pavimentação rodoviária com análise de tráfego e dimensionamento estrutural.",
                category: "Pavimentação",
                image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop&crop=center"
              },
              {
                title: "Estrutura de Concreto Armado",
                description: "Projeto estrutural completo de edifício residencial com cálculos e detalhamentos.",
                category: "Estrutural",
                image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop&crop=center"
              },
              {
                title: "Rede de Distribuição de Água",
                description: "Sistema de abastecimento de água com dimensionamento de tubulações e reservatórios.",
                category: "Hidráulica",
                image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center"
              },
              {
                title: "Terraplanagem e Movimento de Terra",
                description: "Projeto de terraplanagem com cálculo de volumes e otimização de corte e aterro.",
                category: "Topografia",
                image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop&crop=center"
              }
            ].map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 hover-scale bg-card border-border">
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="text-xs">
                        {project.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {project.description}
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Projeto
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <EngineeringAIModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
      />
    </div>
  );
}
