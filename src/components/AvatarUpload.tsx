import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  currentAvatarUrl?: string;
  onAvatarUpdate: (url: string) => void;
  userId: string;
}

export function AvatarUpload({ currentAvatarUrl, onAvatarUpdate, userId }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file
    uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setUploading(true);
    
    try {
      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${userId}/${oldPath}`]);
        }
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      onAvatarUpdate(avatarUrl);
      
      toast({
        title: "Sucesso",
        description: "Avatar atualizado com sucesso!",
      });

    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Erro",
        description: `Erro ao fazer upload do avatar: ${error.message}`,
        variant: "destructive",
      });
      setPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!currentAvatarUrl) return;

    try {
      // Delete from storage
      const oldPath = currentAvatarUrl.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('avatars')
          .remove([`${userId}/${oldPath}`]);
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      onAvatarUpdate('');
      setPreviewUrl(null);
      
      toast({
        title: "Sucesso",
        description: "Avatar removido com sucesso!",
      });

    } catch (error: any) {
      toast({
        title: "Erro",
        description: `Erro ao remover avatar: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const displayUrl = previewUrl || currentAvatarUrl;

  return (
    <div className="space-y-4">
      <Label>Imagem do Avatar</Label>
      
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={displayUrl} alt="Avatar" />
          <AvatarFallback>
            <Upload className="h-8 w-8 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Enviando...' : 'Escolher Imagem'}
          </Button>
          
          {displayUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={removeAvatar}
              disabled={uploading}
            >
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
        </div>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <p className="text-sm text-muted-foreground">
        Formatos suportados: JPG, PNG, GIF. Tamanho máximo: 5MB.
      </p>
    </div>
  );
}