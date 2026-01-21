-- Create storage bucket for post/video covers
INSERT INTO storage.buckets (id, name, public) VALUES ('post-covers', 'post-covers', true);

-- Create posts table
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  cover_image_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('post', 'video')),
  slug TEXT UNIQUE,
  views INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies for posts
CREATE POLICY "Anyone can view published posts" 
ON public.posts 
FOR SELECT 
USING (published = true);

CREATE POLICY "Users can create their own posts" 
ON public.posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts" 
ON public.posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts" 
ON public.posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage policies for post covers
CREATE POLICY "Anyone can view post covers" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'post-covers');

CREATE POLICY "Authenticated users can upload post covers" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'post-covers' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own post covers" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'post-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own post covers" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'post-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to generate slug
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(regexp_replace(title, '[^a-zA-Z0-9\s]', '', 'g')) || '-' || extract(epoch from now())::text;
END;
$$ LANGUAGE plpgsql;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-generate slug
CREATE OR REPLACE FUNCTION public.generate_post_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL THEN
    NEW.slug = generate_slug(NEW.title);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER generate_slug_trigger
BEFORE INSERT ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.generate_post_slug();