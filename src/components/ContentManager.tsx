import { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Edit3, Eye, EyeOff, Trash2, Calendar, BarChart3 } from 'lucide-react';
import PostEditor from './PostEditor';
import VideoEditor from './VideoEditor';

interface Post {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  cover_image_url: string | null;
  published: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  slug?: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  published: boolean;
  views_count: number;
  likes_count: number;
  comments_count: number;
  youtube_url: string;
  youtube_video_id?: string;
  created_at: string;
  updated_at: string;
  slug?: string;
}

export default function ContentManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  useEffect(() => {
    if (user) {
      loadContent();
    }
  }, [user]);

  const loadContent = async () => {
    try {
      setLoading(true);
      
      // Load posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user!.id)
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      // Load videos
      const { data: videosData, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('author_id', user!.id)
        .order('created_at', { ascending: false });

      if (videosError) throw videosError;

      setPosts(postsData || []);
      setVideos(videosData || []);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar seus conteúdos.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePostPublication = async (post: Post) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          published: !post.published,
          published_at: !post.published ? new Date().toISOString() : null
        })
        .eq('id', post.id);

      if (error) throw error;

      setPosts(posts.map(p => 
        p.id === post.id 
          ? { ...p, published: !p.published }
          : p
      ));

      toast({
        title: 'Sucesso',
        description: `Post ${!post.published ? 'publicado' : 'despublicado'} com sucesso!`
      });
    } catch (error) {
      console.error('Erro ao alterar publicação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao alterar status de publicação.',
        variant: 'destructive'
      });
    }
  };

  const toggleVideoPublication = async (video: Video) => {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ 
          published: !video.published,
          published_at: !video.published ? new Date().toISOString() : null
        })
        .eq('id', video.id);

      if (error) throw error;

      setVideos(videos.map(v => 
        v.id === video.id 
          ? { ...v, published: !v.published }
          : v
      ));

      toast({
        title: 'Sucesso',
        description: `Vídeo ${!video.published ? 'publicado' : 'despublicado'} com sucesso!`
      });
    } catch (error) {
      console.error('Erro ao alterar publicação:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao alterar status de publicação.',
        variant: 'destructive'
      });
    }
  };

  const deletePost = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.filter(p => p.id !== postId));
      toast({
        title: 'Sucesso',
        description: 'Post excluído com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir post.',
        variant: 'destructive'
      });
    }
  };

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Tem certeza que deseja excluir este vídeo?')) return;

    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;

      setVideos(videos.filter(v => v.id !== videoId));
      toast({
        title: 'Sucesso',
        description: 'Vídeo excluído com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao excluir vídeo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao excluir vídeo.',
        variant: 'destructive'
      });
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(posts.map(p => p.id === updatedPost.id ? updatedPost : p));
    setEditingPost(null);
  };

  const handleVideoUpdate = (updatedVideo: Video) => {
    setVideos(videos.map(v => v.id === updatedVideo.id ? updatedVideo : v));
    setEditingVideo(null);
  };

  if (editingPost) {
    return (
      <PostEditor
        post={editingPost}
        onSave={handlePostUpdate}
        onCancel={() => setEditingPost(null)}
      />
    );
  }

  if (editingVideo) {
    return (
      <VideoEditor
        video={editingVideo}
        onSave={handleVideoUpdate}
        onCancel={() => setEditingVideo(null)}
      />
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center py-8">Carregando...</div>;
  }

  const publishedPosts = posts.filter(p => p.published);
  const draftPosts = posts.filter(p => !p.published);
  const publishedVideos = videos.filter(v => v.published);
  const draftVideos = videos.filter(v => !v.published);

  const renderPostCard = (post: Post) => (
    <Card key={post.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="w-full sm:w-24 h-32 sm:h-16 bg-muted rounded overflow-hidden flex-shrink-0">
            {post.cover_image_url ? (
              <img 
                src={post.cover_image_url} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Edit3 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base line-clamp-2">
                  {post.title}
                </h3>
                <div 
                  className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.excerpt) }}
                />
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="whitespace-nowrap">{post.views_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="whitespace-nowrap">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 sm:mt-0 mt-2">
                <Badge variant={post.published ? "default" : "secondary"} className="text-xs w-fit">
                  {post.published ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingPost(post)}
                className="text-xs"
              >
                <Edit3 className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => togglePostPublication(post)}
                className="text-xs"
              >
                {post.published ? (
                  <>
                    <EyeOff className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Despublicar</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Publicar</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deletePost(post.id)}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderVideoCard = (video: Video) => (
    <Card key={video.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="w-full sm:w-24 h-32 sm:h-16 bg-muted rounded overflow-hidden flex-shrink-0">
            {video.thumbnail_url ? (
              <img 
                src={video.thumbnail_url} 
                alt={video.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground mb-1 text-sm sm:text-base line-clamp-2">
                  {video.title}
                </h3>
                <div 
                  className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2"
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(video.description) }}
                />
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span className="whitespace-nowrap">{video.views_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span className="whitespace-nowrap">{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col gap-1 sm:mt-0 mt-2">
                <Badge variant={video.published ? "default" : "secondary"} className="text-xs w-fit">
                  {video.published ? "Publicado" : "Rascunho"}
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingVideo(video)}
                className="text-xs"
              >
                <Edit3 className="h-3 w-3 sm:mr-1" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleVideoPublication(video)}
                className="text-xs"
              >
                {video.published ? (
                  <>
                    <EyeOff className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Despublicar</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-3 w-3 sm:mr-1" />
                    <span className="hidden sm:inline">Publicar</span>
                  </>
                )}
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteVideo(video.id)}
                className="text-xs"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full">
      <div className="px-1">
        <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Meus Conteúdos</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Gerencie seus posts e vídeos publicados e rascunhos
        </p>
      </div>

      <Tabs defaultValue="posts" className="w-full overflow-hidden">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="posts">
            Posts ({posts.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            Vídeos ({videos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-6">
          {draftPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rascunhos ({draftPosts.length})</CardTitle>
                <CardDescription>Posts que ainda não foram publicados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {draftPosts.map(renderPostCard)}
              </CardContent>
            </Card>
          )}

          {publishedPosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publicados ({publishedPosts.length})</CardTitle>
                <CardDescription>Posts que estão visíveis para o público</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {publishedPosts.map(renderPostCard)}
              </CardContent>
            </Card>
          )}

          {posts.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Você ainda não criou nenhum post.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="videos" className="space-y-6">
          {draftVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Rascunhos ({draftVideos.length})</CardTitle>
                <CardDescription>Vídeos que ainda não foram publicados</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {draftVideos.map(renderVideoCard)}
              </CardContent>
            </Card>
          )}

          {publishedVideos.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Publicados ({publishedVideos.length})</CardTitle>
                <CardDescription>Vídeos que estão visíveis para o público</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {publishedVideos.map(renderVideoCard)}
              </CardContent>
            </Card>
          )}

          {videos.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">Você ainda não criou nenhum vídeo.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}