import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Eye, Play, Pause } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  content?: string;
  description?: string;
  excerpt?: string;
  cover_image_url?: string;
  thumbnail_url?: string;
  youtube_url?: string;
  type: 'post' | 'video';
  category_id: string;
  category_name?: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  published: boolean;
}

const Feed = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category') || 'engenharia';
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        // Buscar categoria primeiro
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id, name')
          .eq('slug', category)
          .single();

        if (!categoryData) {
          setContents([]);
          setLoading(false);
          return;
        }

        // Buscar posts
        const { data: posts } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            slug,
            excerpt,
            cover_image_url,
            views_count,
            likes_count,
            comments_count,
            created_at,
            published,
            categories(name)
          `)
          .eq('category_id', categoryData.id)
          .eq('published', true)
          .order('created_at', { ascending: false });

        // Buscar vídeos
        const { data: videos } = await supabase
          .from('videos')
          .select(`
            id,
            title,
            slug,
            description,
            thumbnail_url,
            youtube_url,
            views_count,
            likes_count,
            comments_count,
            created_at,
            published,
            categories(name)
          `)
          .eq('category_id', categoryData.id)
          .eq('published', true)
          .order('created_at', { ascending: false });

        // Combinar e formatar dados
        const allContent: ContentItem[] = [
          ...(posts || []).map(post => ({
            ...post,
            type: 'post' as const,
            category_id: categoryData.id,
            category_name: post.categories?.name || categoryData.name,
            description: post.excerpt
          })),
          ...(videos || []).map(video => ({
            ...video,
            type: 'video' as const,
            category_id: categoryData.id,
            category_name: video.categories?.name || categoryData.name,
            cover_image_url: video.thumbnail_url
          }))
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setContents(allContent);
      } catch (error) {
        console.error('Erro ao buscar conteúdos:', error);
        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchContents();
  }, [category]);

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case 'engenharia': return 'Engenharia';
      case 'crypto': return 'Criptomoedas';
      case 'music': return 'Música';
      case 'motivational': return 'Motivacional';
      default: return 'Conteúdo';
    }
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Carregando {getCategoryTitle(category)}...</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <Card>
                <div className="aspect-video bg-muted rounded-t-lg" />
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
          {getCategoryTitle(category)}
        </h1>
        <p className="text-muted-foreground">
          Conteúdo especializado em {getCategoryTitle(category).toLowerCase()}
        </p>
      </div>

      {contents.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">Em breve!</h2>
          <p className="text-muted-foreground">
            Estamos preparando conteúdo incrível sobre {getCategoryTitle(category).toLowerCase()}.
          </p>
          <Button asChild className="mt-4">
            <Link to="/?category=engenharia">Ver Engenharia</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contents.map((content) => (
            <Card key={content.id} className="group hover:shadow-lg transition-all duration-300 hover:shadow-primary/20">
              <div className="relative">
                {content.cover_image_url && (
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
                    {content.type === 'video' ? (
                      <Play className="h-12 w-12 text-primary" />
                    ) : (
                      <div className="text-primary font-bold text-lg">POST</div>
                    )}
                  </div>
                )}
                <Badge 
                  variant={content.type === 'video' ? 'default' : 'secondary'}
                  className="absolute top-2 right-2"
                >
                  {content.type === 'video' ? 'Vídeo' : 'Post'}
                </Badge>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                  {content.title}
                </CardTitle>
                {content.description && (
                  <CardDescription className="line-clamp-2">
                    {content.description}
                  </CardDescription>
                )}
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-4">
                    <span className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {formatViews(content.views_count)}
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {content.likes_count}
                    </span>
                    <span className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {content.comments_count}
                    </span>
                  </div>
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/${content.type}/${content.slug}`}>
                    {content.type === 'video' ? 'Assistir' : 'Ler'}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;