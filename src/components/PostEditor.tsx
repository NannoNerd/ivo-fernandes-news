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
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import { ArrowLeft } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content?: string;
  excerpt: string;
  cover_image_url: string | null;
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

interface PostEditorProps {
  post: Post;
  onSave: (post: Post) => void;
  onCancel: () => void;
}

export default function PostEditor({ post, onSave, onCancel }: PostEditorProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [title, setTitle] = useState(post.title);
  const [excerpt, setExcerpt] = useState(post.excerpt);
  const [content, setContent] = useState(post.content || '');
  const [coverImage, setCoverImage] = useState(post.cover_image_url || '');
  const [published, setPublished] = useState(post.published);
  const [categoryId, setCategoryId] = useState(post.category_id || '');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('posts')
        .update({
          title,
          content,
          excerpt,
          cover_image_url: coverImage || null,
          category_id: categoryId || null,
          published,
          published_at: published ? new Date().toISOString() : null,
        })
        .eq('id', post.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Post atualizado com sucesso!'
      });

      onSave(data);
    } catch (error) {
      console.error('Erro ao atualizar post:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar post. Tente novamente.',
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
          <h1 className="text-2xl font-bold text-foreground">Editar Post</h1>
          <p className="text-muted-foreground">Altere os dados do seu post</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Post</CardTitle>
          <CardDescription>
            Edite as informações do seu post
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
                placeholder="Digite o título do seu post"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="excerpt">Descrição/Resumo *</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Breve descrição do conteúdo"
                rows={3}
                required
              />
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
              onImageUploaded={setCoverImage}
              currentImage={coverImage}
              onImageRemoved={() => setCoverImage('')}
            />
            
            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Escreva o conteúdo do seu post usando o editor rico..."
              />
            </div>

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
                disabled={isSubmitting || !title || !excerpt || !content}
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