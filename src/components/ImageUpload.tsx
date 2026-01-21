import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImage?: string;
  onImageRemoved?: () => void;
}

export default function ImageUpload({ onImageUploaded, currentImage, onImageRemoved }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione apenas arquivos de imagem.',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('content-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('content-images')
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      
      toast({
        title: 'Sucesso',
        description: 'Imagem enviada com sucesso!'
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da imagem. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const removeImage = () => {
    if (onImageRemoved) {
      onImageRemoved();
    }
  };

  return (
    <div className="space-y-2">
      <Label>Imagem de Capa</Label>
      
      {currentImage ? (
        <Card className="relative overflow-hidden">
          <div className="aspect-video relative">
            <img 
              src={currentImage} 
              alt="Capa do post"
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
        >
          <div className="p-8 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-3 bg-muted rounded-full">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Arraste uma imagem aqui ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP até 5MB
                </p>
              </div>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}