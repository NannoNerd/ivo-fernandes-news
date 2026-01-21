import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

// Import testimonial images
import carlosSilvaImg from '@/assets/carlos-silva.jpg';
import mariaSantosImg from '@/assets/maria-santos.jpg';
import joaoPedroImg from '@/assets/joao-pedro.jpg';
import anaCostImg from '@/assets/ana-costa.jpg';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  initials: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Carlos Silva",
    role: "Arquiteto",
    content: "Excelente plataforma para aprender sobre tecnologia e inovação. Muito útil!",
    initials: "CS",
    image: carlosSilvaImg
  },
  {
    id: 2,
    name: "Maria Santos",
    role: "Engenheira Civil",
    content: "Os recursos de IA são incríveis! Me ajudam muito no meu trabalho diário.",
    initials: "MS",
    image: mariaSantosImg
  },
  {
    id: 3,
    name: "João Pedro",
    role: "Desenvolvedor",
    content: "Conteúdo de qualidade e sempre atualizado. Recomendo para todos!",
    initials: "JP",
    image: joaoPedroImg
  },
  {
    id: 4,
    name: "Ana Costa",
    role: "Designer",
    content: "Interface intuitiva e funcionalidades que realmente fazem a diferença.",
    initials: "AC",
    image: anaCostImg
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCarousel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    
    setProgress(0);
    
    // Progress bar animation
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 2; // 100 / 50 = 2% every 100ms for 5 seconds
      });
    }, 100);
    
    // Slide change
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setProgress(0);
    }, 5000);
  };

  const stopCarousel = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  useEffect(() => {
    if (isPlaying) {
      startCarousel();
    } else {
      stopCarousel();
    }

    return () => {
      stopCarousel();
    };
  }, [isPlaying, currentIndex]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    if (isPlaying) {
      startCarousel();
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
    if (isPlaying) {
      startCarousel();
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="py-20 bg-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-cyan-400">
          Testemunhos
        </h2>
        
        <div className="max-w-4xl mx-auto relative">
          <div className="bg-slate-700 rounded-lg p-8 border border-slate-600 relative overflow-hidden">
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-600">
              <div 
                className="h-full bg-cyan-400 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            <div className="text-center space-y-6">
              {/* Avatar */}
              <Avatar className="w-20 h-20 mx-auto border-2 border-cyan-400">
                <AvatarImage src={currentTestimonial.image} alt={currentTestimonial.name} />
                <AvatarFallback className="bg-slate-600 text-white text-lg font-semibold">
                  {currentTestimonial.initials}
                </AvatarFallback>
              </Avatar>
              
              {/* Testimonial content */}
              <blockquote className="text-xl text-white leading-relaxed">
                "{currentTestimonial.content}"
              </blockquote>
              
              {/* Author info */}
              <div className="text-center">
                <h4 className="text-cyan-400 font-semibold text-lg">
                  {currentTestimonial.name}
                </h4>
                <p className="text-gray-400">
                  {currentTestimonial.role}
                </p>
              </div>
            </div>
          </div>
          
          {/* Navigation controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            {/* Previous button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevious}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Pagination dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    if (isPlaying) startCarousel();
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex 
                      ? 'bg-cyan-400' 
                      : 'bg-slate-600 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
            
            {/* Play/Pause button */}
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayPause}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            
            {/* Next button */}
            <Button
              variant="outline"
              size="sm"
              onClick={goToNext}
              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;