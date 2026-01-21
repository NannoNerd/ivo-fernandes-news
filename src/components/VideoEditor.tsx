import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from './ImageUpload';
import { ArrowLeft } from 'lucide-react';

interface Video {
  id: string;
  title: string;
  description: string;
  youtube_url: string;
  youtube_video_id?: string;
  thumbnail_url: string | null;
  published: boolean;
  category_id?: string;
  views_count?: number;
  likes_count?: number;
  comments_count?: number;
  created_at?: string;
  updated_at?: string;
  slug?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface VideoEditorProps {
  video: Video;
  onSave: (video: Video) => void;
  onCancel: () => void;
}

export default function VideoEditor({ video, onSave, onCancel }: VideoEditorProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [title, setTitle] = useState(video.title);
  const [description, setDescription] = useState(video.description);
  const [youtubeUrl, setYoutubeUrl] = useState(video.youtube_url);
  const [thumbnailUrl, setThumbnailUrl] = useState(video.thumbnail_url || '');
  const [published, setPublished] = useState(video.published);
  const [categoryId, setCategoryId] = useState(video.category_id || '');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const extractYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const youtubeVideoId = extractYouTubeVideoId(youtubeUrl);
      if (!youtubeVideoId) {
        throw new Error('URL do YouTube inválida');
      }

      const { data, error } = await supabase
        .from('videos')
        .update({
          title,
          description,
          youtube_url: youtubeUrl,
          youtube_video_id: youtubeVideoId,
          thumbnail_url: thumbnailUrl || `https://img.youtube.com/vi/${youtubeVideoId}/maxresdefault.jpg`,
          category_id: categoryId || null,
          published,
          published_at: published ? new Date().toISOString() : null,
        })
        .eq('id', video.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Vídeo atualizado com sucesso!'
      });

      onSave(data);
    } catch (error) {
      console.error('Erro ao atualizar vídeo:', error);
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao atualizar vídeo. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onCancel}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Editar Vídeo</h1>
          <p className="text-muted-foreground">Altere os dados do seu vídeo</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Vídeo</CardTitle>
          <CardDescription>
            Edite as informações do seu vídeo
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o título do seu vídeo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Breve descrição do vídeo"
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="youtube-url">URL do YouTube *</Label>
              <Input
                id="youtube-url"
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                required
              />
              <p className="text-sm text-muted-foreground">
                Cole o link do YouTube
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger className="bg-background border-input">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-background border-input shadow-lg z-50">
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <ImageUpload 
              onImageUploaded={setThumbnailUrl}
              currentImage={thumbnailUrl}
              onImageRemoved={() => setThumbnailUrl('')}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
              />
              <Label htmlFor="published">
                {published ? 'Publicado' : 'Rascunho'}
              </Label>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={isSubmitting || !title || !description || !youtubeUrl}
              >
                {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}