import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Eye, MessageCircle, Heart, ExternalLink } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url: string | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  duration?: string;
  created_at: string;
  updated_at: string;
  slug: string;
}

export default function VideoView() {
  const { slug } = useParams<{ slug: string }>();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadVideo();
    }
  }, [slug]);

  const loadVideo = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Erro ao carregar vídeo:', error);
        setNotFound(true);
      } else {
        setVideo(data);
        // Incrementar views
        await supabase
          .from('videos')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Erro geral ao carregar vídeo:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/noticias">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Notícias
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">Carregando vídeo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !video) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/noticias">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Notícias
              </Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">Vídeo não encontrado</h1>
            <p className="text-muted-foreground mb-6">O vídeo que você está procurando não existe ou foi removido.</p>
            <Link to="/noticias">
              <Button>Voltar para Notícias</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header com botão voltar */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/noticias">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Notícias
            </Button>
          </Link>
        </div>

        {/* Player do YouTube */}
        <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtube_video_id}`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        {/* Conteúdo do vídeo */}
        <article className="space-y-6">
          {/* Badge e metadados */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Badge className="bg-red-600 text-white">Vídeo</Badge>
            {video.duration && (
              <div className="flex items-center gap-1">
                <span>Duração: {video.duration}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(video.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {(video.views_count + 1).toLocaleString()} visualizações
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {video.likes_count.toLocaleString()} curtidas
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {video.comments_count.toLocaleString()} comentários
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {video.title}
          </h1>

          {/* Botão para assistir no YouTube */}
          <div className="flex gap-4">
            <a 
              href={video.youtube_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex"
            >
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                Assistir no YouTube
              </Button>
            </a>
          </div>

          {/* Divisor */}
          <hr className="border-border" />

          {/* Descrição */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Sobre este vídeo</h2>
            <div 
              className="prose prose-lg max-w-none dark:prose-invert whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(video.description.replace(/\n/g, '<br>')) }}
              style={{
                color: 'hsl(var(--foreground))',
                lineHeight: '1.7'
              }}
            />
          </div>

          {/* Rodapé do vídeo */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Publicado em {new Date(video.created_at).toLocaleDateString('pt-BR')}
                {video.updated_at !== video.created_at && (
                  <span> • Atualizado em {new Date(video.updated_at).toLocaleDateString('pt-BR')}</span>
                )}
              </div>
              <Link to="/noticias">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para Notícias
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}