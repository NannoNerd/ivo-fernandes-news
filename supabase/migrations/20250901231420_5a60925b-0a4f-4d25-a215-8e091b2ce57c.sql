-- Insert default categories if they don't exist
INSERT INTO public.categories (name, slug, description) 
VALUES 
  ('Engenharia', 'engenharia', 'Conteúdo sobre engenharia e tecnologia'),
  ('Crypto', 'crypto', 'Conteúdo sobre criptomoedas e blockchain'),
  ('Música', 'musica', 'Conteúdo sobre música e entretenimento'),
  ('Motivacional', 'motivacional', 'Conteúdo motivacional e desenvolvimento pessoal')
ON CONFLICT (slug) DO NOTHING;