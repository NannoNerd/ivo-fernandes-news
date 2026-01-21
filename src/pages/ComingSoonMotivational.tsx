import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export default function ComingSoonMotivational() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
        Motivacional
      </h1>
      <p className="text-xl text-muted-foreground mb-8">Em breve conteúdo motivacional!</p>
      <Button asChild>
        <Link to="/?category=engenharia">Ver Engenharia</Link>
      </Button>
    </div>
  );
}