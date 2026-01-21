export const processTextWithLinks = (text: string) => {
  // Regex para detectar URLs
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  
  // Substitui URLs por links clicáveis
  return text.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>');
};

export const truncateText = (text: string, maxLength: number = 150) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};