import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { 
  Menu, 
  User, 
  Plus, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navigation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const navLinks = [
    { name: 'Engenharia', slug: 'engenharia', href: '/engineering' },
    { name: 'Notícias', slug: 'noticias', href: '/noticias' },
    { name: 'Crypto', slug: 'crypto', href: '/?category=crypto' },
    { name: 'Música', slug: 'music', href: '/?category=music' },
    { name: 'Motivacional', slug: 'motivational', href: '/?category=motivational' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-800 border-b border-slate-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/4f1ad74d-29d6-4772-beb5-c8f4a8f188c4.png" 
              alt="Logo" 
              className="h-8 w-8"
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl text-white leading-none">
                IVO FERNANDES NEWS
              </span>
              <span className="text-xs text-gray-400 leading-none">
                Engenharia • IA • Motivação • Crypto • Música
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.slug}
                to={link.href}
                className={`text-sm font-medium transition-colors relative ${
                  currentCategory === link.slug 
                    ? 'text-white after:absolute after:bottom-[-8px] after:left-0 after:right-0 after:h-0.5 after:bg-primary' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <Button asChild variant="outline" size="sm" className="hidden md:flex bg-transparent border-primary text-primary hover:bg-primary hover:text-white">
                  <Link to="/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full text-white hover:bg-slate-700">
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Painel Admin
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/create" className="flex items-center md:hidden">
                        <Plus className="mr-2 h-4 w-4" />
                        Criar Conteúdo
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button asChild variant="ghost" size="sm" className="text-white hover:bg-slate-700">
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button asChild size="sm" className="bg-primary hover:bg-primary/90 text-white">
                  <Link to="/auth">Cadastrar</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white hover:bg-slate-700">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-6">
                  <div className="flex flex-col space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Categorias</h3>
                    {navLinks.map((link) => (
                      <Link
                        key={link.slug}
                        to={link.href}
                        className={`px-4 py-2 rounded-md transition-colors ${
                          currentCategory === link.slug 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                  
                  {user && (
                    <div className="pt-4 border-t">
                      <div className="flex flex-col space-y-2">
                        <Button asChild variant="outline" className="justify-start">
                          <Link to="/create" onClick={() => setIsOpen(false)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Criar Conteúdo
                          </Link>
                        </Button>
                        <Button asChild variant="outline" className="justify-start">
                          <Link to="/profile" onClick={() => setIsOpen(false)}>
                            <User className="h-4 w-4 mr-2" />
                            Painel Admin
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          className="justify-start" 
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sair
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;