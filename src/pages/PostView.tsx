import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Eye, MessageCircle, Heart } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  slug: string;
}

export default function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (slug) {
      loadPost();
    }
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) {
        console.error('Erro ao carregar post:', error);
        setNotFound(true);
      } else {
        setPost(data);
        // Incrementar views
        await supabase
          .from('posts')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', data.id);
      }
    } catch (error) {
      console.error('Erro geral ao carregar post:', error);
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
            <p className="text-muted-foreground">Carregando post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !post) {
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
            <h1 className="text-2xl font-bold text-foreground mb-4">Post não encontrado</h1>
            <p className="text-muted-foreground mb-6">O post que você está procurando não existe ou foi removido.</p>
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

        {/* Imagem de capa */}
        {post.cover_image_url && (
          <div className="aspect-video w-full mb-8 rounded-lg overflow-hidden">
            <img 
              src={post.cover_image_url} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Conteúdo do post */}
        <article className="space-y-6">
          {/* Badge e metadados */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <Badge className="bg-primary text-white">Post</Badge>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {(post.views_count + 1).toLocaleString()} visualizações
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {post.likes_count.toLocaleString()} curtidas
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post.comments_count.toLocaleString()} comentários
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <div 
            className="text-lg text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }}
          />

          {/* Divisor */}
          <hr className="border-border" />

          {/* Conteúdo principal */}
          <div 
            className="prose prose-lg max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
            style={{
              color: 'hsl(var(--foreground))',
              lineHeight: '1.7'
            }}
          />

          {/* Rodapé do artigo */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                Publicado em {new Date(post.created_at).toLocaleDateString('pt-BR')}
                {post.updated_at !== post.created_at && (
                  <span> • Atualizado em {new Date(post.updated_at).toLocaleDateString('pt-BR')}</span>
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