import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ProfileSidebar } from '@/components/ProfileSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { AvatarUpload } from "@/components/AvatarUpload";
import { Trash2, Plus } from "lucide-react";

const settingsSchema = z.object({
  display_name: z.string().min(1, "Nome de exibição é obrigatório"),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, "Senha atual é obrigatória"),
  newPassword: z.string().min(6, "Nova senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

type SettingsForm = z.infer<typeof settingsSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function Settings() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  const settingsForm = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      display_name: "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data) {
      setProfile(data);
      setIsAdmin(data.role === 'admin');
      settingsForm.reset({
        display_name: data.display_name || "",
      });
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return;
    }

    setCategories(data || []);
  };

  // Move useEffect before any conditional returns
  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchCategories();
    }
  }, [user]);

  // Redirect if not authenticated
  if (!loading && !user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const onSettingsSubmit = async (data: SettingsForm) => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: data.display_name,
      })
      .eq('user_id', user.id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar perfil: " + error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Perfil atualizado com sucesso!",
    });

    fetchProfile();
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    const { error } = await supabase.auth.updateUser({
      password: data.newPassword
    });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar senha: " + error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Senha alterada com sucesso!",
    });

    passwordForm.reset();
  };

  const addCategory = async () => {
    if (!newCategoryName.trim()) return;

    const slug = newCategoryName.toLowerCase()
      .replace(/[áàãâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[íìîï]/g, 'i')
      .replace(/[óòõôö]/g, 'o')
      .replace(/[úùûü]/g, 'u')
      .replace(/[ç]/g, 'c')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    const { error } = await supabase
      .from('categories')
      .insert({
        name: newCategoryName.trim(),
        slug: slug,
      });

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar categoria: " + error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Categoria adicionada com sucesso!",
    });

    setNewCategoryName("");
    fetchCategories();
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir categoria: " + error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Sucesso",
      description: "Categoria excluída com sucesso!",
    });

    fetchCategories();
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <ProfileSidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 flex-shrink-0">
            <SidebarTrigger />
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-foreground truncate">Configurações</h2>
            </div>
          </header>
          
          <main className="flex-1 p-4 lg:p-6 overflow-auto space-y-6">
            {/* Profile Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
                <CardDescription>
                  Atualize suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <AvatarUpload
                    currentAvatarUrl={profile?.avatar_url}
                    onAvatarUpdate={() => fetchProfile()}
                    userId={user.id}
                  />
                  
                  <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-4">
                      <FormField
                        control={settingsForm.control}
                        name="display_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome de Exibição</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Seu nome de exibição" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit">Salvar Alterações</Button>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle>Alterar Senha</CardTitle>
                <CardDescription>
                  Atualize sua senha de acesso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Senha Atual</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Sua senha atual" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Sua nova senha" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" placeholder="Confirme sua nova senha" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button type="submit">Alterar Senha</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Admin Category Management */}
            {isAdmin && (
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Categorias</CardTitle>
                  <CardDescription>
                    Adicione ou remova categorias para posts e vídeos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Nome da nova categoria"
                      onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                    />
                    <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Categorias Existentes</h4>
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-2 border rounded">
                        <div>
                          <span className="font-medium">{category.name}</span>
                          <span className="text-muted-foreground ml-2">({category.slug})</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}