import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Clock, Eye, Calendar, Play, Search } from 'lucide-react';
import DOMPurify from 'dompurify';

interface Post {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  cover_image_url: string | null;
  published: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  slug: string;
  category_id?: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id: string;
  thumbnail_url: string | null;
  published: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  duration?: string;
  created_at: string;
  updated_at: string;
  slug: string;
  category_id?: string;
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  image_url: string;
  views_count: number;
  created_at: string;
  slug: string;
  type: 'post' | 'video';
  category: string;
  duration?: string;
  youtube_video_id?: string;
}

export default function Noticias() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Load categories first
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*');

      if (categoriesError) {
        console.error('Erro ao carregar categorias:', categoriesError);
      } else {
        setCategories(categoriesData || []);
      }
      
      // Load published posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (postsError) {
        console.error('Erro ao carregar posts:', postsError);
      } else {
        setPosts(postsData || []);
      }

      // Load published videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (videosError) {
        console.error('Erro ao carregar vídeos:', videosError);
      } else {
        setVideos(videosData || []);
      }
    } catch (error) {
      console.error('Erro geral ao carregar conteúdo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Geral';
  };

  const getCategoryColor = (categoryName: string) => {
    switch (categoryName.toLowerCase()) {
      case 'engenharia': return 'bg-orange-500';
      case 'crypto': return 'bg-yellow-500';
      case 'motivacional': return 'bg-green-500';
      case 'música': return 'bg-purple-500';
      case 'musica': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  // Combine and sort all content by date
  const allContent: ContentItem[] = [
    ...posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.excerpt,
      image_url: post.cover_image_url || "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=400&fit=crop&crop=center",
      views_count: post.views_count,
      created_at: post.created_at,
      slug: post.slug,
      type: 'post' as const,
      category: getCategoryName(post.category_id || '')
    })),
    ...videos.map(video => ({
      id: video.id,
      title: video.title,
      description: video.description,
      image_url: video.thumbnail_url || `https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`,
      views_count: video.views_count,
      created_at: video.created_at,
      slug: video.slug,
      type: 'video' as const,
      category: getCategoryName(video.category_id || ''),
      duration: video.duration,
      youtube_video_id: video.youtube_video_id
    }))
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  // Filter content based on search term
  const filteredContent = allContent.filter(content => 
    content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    content.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <section className="relative py-4 text-center bg-gradient-to-br from-background via-background/95 to-primary/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
              Notícias & Conteúdo
            </h1>
            <p className="text-base text-muted-foreground mb-2">
              Carregando conteúdo...
            </p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-4 text-center bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Notícias & Conteúdo
          </h1>
          <p className="text-base text-muted-foreground mb-2">
            Fique por dentro das últimas novidades em engenharia, tecnologia, 
            criptomoedas e muito mais.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por posts e vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Featured Content */}
          {filteredContent.length > 0 && (
            <div className="mb-8">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="md:flex">
                  <div className="md:w-1/2 relative">
                    <div className="aspect-video">
                      <img 
                        src={filteredContent[0].image_url} 
                        alt={filteredContent[0].title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {filteredContent[0].type === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Button size="lg" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                          <Play className="h-8 w-8 text-white" />
                        </Button>
                      </div>
                    )}
                    {filteredContent[0].type === 'video' && filteredContent[0].duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                        {filteredContent[0].duration}
                      </div>
                    )}
                    {/* Tags */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`${getCategoryColor(filteredContent[0].category)} text-white`}>
                        {filteredContent[0].category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-white">
                        {filteredContent[0].type === 'post' ? 'Post' : 'Vídeo'}
                      </Badge>
                    </div>
                  </div>
                  <div className="md:w-1/2 p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="outline">Destaque</Badge>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-3">
                      {filteredContent[0].title}
                    </h2>
                    <div 
                      className="text-muted-foreground mb-4"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(filteredContent[0].description) }}
                    />
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(filteredContent[0].created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {filteredContent[0].views_count.toLocaleString()}
                      </div>
                    </div>
                    <Link to={`/${filteredContent[0].type}/${filteredContent[0].slug}`}>
                      <Button className="w-full md:w-auto">
                        {filteredContent[0].type === 'video' && <Play className="h-4 w-4 mr-2" />}
                        {filteredContent[0].type === 'post' ? 'Ler Artigo Completo' : 'Assistir Vídeo'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Content Grid */}
          {filteredContent.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.slice(1).map((content) => (
                <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="aspect-video overflow-hidden relative">
                    <img 
                      src={content.image_url} 
                      alt={content.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {content.type === 'video' && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                        <Button size="sm" className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm">
                          <Play className="h-5 w-5 text-white" />
                        </Button>
                      </div>
                    )}
                    {content.type === 'video' && content.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {content.duration}
                      </div>
                    )}
                    {/* Tags */}
                    <div className="absolute top-2 left-2">
                      <Badge className={`${getCategoryColor(content.category)} text-white text-xs`}>
                        {content.category}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-white text-xs">
                        {content.type === 'post' ? 'Post' : 'Vídeo'}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {content.title}
                    </h3>
                    <div 
                      className="text-sm text-muted-foreground mb-3 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content.description) }}
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(content.created_at).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {content.views_count.toLocaleString()}
                      </div>
                    </div>
                    <Link to={`/${content.type}/${content.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        {content.type === 'video' && <Play className="h-3 w-3 mr-2" />}
                        {content.type === 'post' ? 'Ler Mais' : 'Assistir'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Empty state messages */}
          {posts.length === 0 && videos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum conteúdo publicado ainda.
              </p>
            </div>
          )}
          
          {/* No search results message */}
          {searchTerm && filteredContent.length === 0 && (posts.length > 0 || videos.length > 0) && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Nenhum resultado encontrado para "{searchTerm}".
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}