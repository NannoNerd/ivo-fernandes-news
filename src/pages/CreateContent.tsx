import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';

export default function CreateContent() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post form state
  const [postTitle, setPostTitle] = useState('');
  const [postDescription, setPostDescription] = useState('');
  const [postCategory, setPostCategory] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postCoverImage, setPostCoverImage] = useState('');
  const [postPublished, setPostPublished] = useState(false);

  // Video form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoCategory, setVideoCategory] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoCoverImage, setVideoCoverImage] = useState('');
  const [videoPublished, setVideoPublished] = useState(false);

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Date.now();
  };

  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          title: postTitle,
          content: postContent,
          excerpt: postDescription,
          slug: generateSlug(postTitle),
          cover_image_url: postCoverImage || null,
          published: postPublished,
          published_at: postPublished ? new Date().toISOString() : null,
          author_id: user!.id,
          category_id: null // You might want to create categories later
        });

      if (error) throw error;

      toast({
        title: 'Post criado com sucesso!',
        description: 'Seu artigo foi publicado na plataforma.'
      });

      // Reset form
      setPostTitle('');
      setPostDescription('');
      setPostCategory('');
      setPostContent('');
      setPostCoverImage('');
      setPostPublished(false);

    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast({
        title: 'Erro ao criar post',
        description: 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const youtubeVideoId = extractYouTubeVideoId(videoUrl);
      if (!youtubeVideoId) {
        throw new Error('URL do YouTube inválida');
      }

      const { error } = await supabase
        .from('videos')
        .insert({
          title: videoTitle,
          description: videoDescription,
          slug: generateSlug(videoTitle),
          youtube_url: videoUrl,
          youtube_video_id: youtubeVideoId,
          thumbnail_url: videoCoverImage || `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`,
          published: videoPublished,
          published_at: videoPublished ? new Date().toISOString() : null,
          author_id: user!.id,
          category_id: null // You might want to create categories later
        });

      if (error) throw error;

      toast({
        title: 'Vídeo criado com sucesso!',
        description: 'Seu vídeo foi publicado na plataforma.'
      });

      // Reset form
      setVideoTitle('');
      setVideoDescription('');
      setVideoCategory('');
      setVideoUrl('');
      setVideoCoverImage('');
      setVideoPublished(false);

    } catch (error) {
      console.error('Erro ao criar vídeo:', error);
      toast({
        title: 'Erro ao criar vídeo',
        description: error instanceof Error ? error.message : 'Tente novamente mais tarde.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
          Criar Conteúdo
        </h1>
        <p className="text-muted-foreground">
          Compartilhe seu conhecimento com a comunidade
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo Conteúdo</CardTitle>
          <CardDescription>
            Escolha o tipo de conteúdo que deseja criar
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="post" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="post">Artigo/Post</TabsTrigger>
              <TabsTrigger value="video">Vídeo</TabsTrigger>
            </TabsList>
            
            <TabsContent value="post" className="space-y-6">
              <form onSubmit={handlePostSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="post-title">Título *</Label>
                    <Input
                      id="post-title"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      placeholder="Digite o título do seu post"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="post-category">Categoria</Label>
                    <Select value={postCategory} onValueChange={setPostCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engenharia">Engenharia</SelectItem>
                        <SelectItem value="crypto">Criptomoedas</SelectItem>
                        <SelectItem value="music">Música</SelectItem>
                        <SelectItem value="motivational">Motivacional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="post-description">Descrição/Resumo *</Label>
                  <Textarea
                    id="post-description"
                    value={postDescription}
                    onChange={(e) => setPostDescription(e.target.value)}
                    placeholder="Breve descrição do conteúdo"
                    rows={3}
                    required
                  />
                </div>

                <ImageUpload 
                  onImageUploaded={setPostCoverImage}
                  currentImage={postCoverImage}
                  onImageRemoved={() => setPostCoverImage('')}
                />
                
                <div className="space-y-2">
                  <Label htmlFor="post-content">Conteúdo *</Label>
                  <RichTextEditor
                    value={postContent}
                    onChange={setPostContent}
                    placeholder="Escreva o conteúdo do seu post usando o editor rico..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="post-published"
                    checked={postPublished}
                    onCheckedChange={setPostPublished}
                  />
                  <Label htmlFor="post-published">
                    Publicar imediatamente
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !postTitle || !postDescription || !postContent}
                >
                  {isSubmitting ? 'Criando...' : postPublished ? 'Publicar Post' : 'Salvar como Rascunho'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="video" className="space-y-6">
              <form onSubmit={handleVideoSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-title">Título *</Label>
                    <Input
                      id="video-title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Digite o título do seu vídeo"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="video-category">Categoria</Label>
                    <Select value={videoCategory} onValueChange={setVideoCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engenharia">Engenharia</SelectItem>
                        <SelectItem value="crypto">Criptomoedas</SelectItem>
                        <SelectItem value="music">Música</SelectItem>
                        <SelectItem value="motivational">Motivacional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video-description">Descrição *</Label>
                  <Textarea
                    id="video-description"
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Breve descrição do vídeo"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video-url">URL do Vídeo *</Label>
                  <Input
                    id="video-url"
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Cole o link do YouTube
                  </p>
                </div>

                <ImageUpload 
                  onImageUploaded={setVideoCoverImage}
                  currentImage={videoCoverImage}
                  onImageRemoved={() => setVideoCoverImage('')}
                />

                <div className="flex items-center space-x-2">
                  <Switch
                    id="video-published"
                    checked={videoPublished}
                    onCheckedChange={setVideoPublished}
                  />
                  <Label htmlFor="video-published">
                    Publicar imediatamente
                  </Label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !videoTitle || !videoDescription || !videoUrl}
                >
                  {isSubmitting ? 'Criando...' : videoPublished ? 'Publicar Vídeo' : 'Salvar como Rascunho'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}