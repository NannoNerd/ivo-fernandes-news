import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Generating motivational message');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `Você é um especialista em motivação e desenvolvimento pessoal. Gere uma mensagem motivacional curta, inspiradora e impactante em português.

A mensagem deve:
- Ter entre 10 a 25 palavras
- Ser positiva e inspiradora
- Usar linguagem poética e impactante
- Focuar em superação, determinação, sucesso ou crescimento pessoal
- Ser única e original

Exemplos do estilo desejado:
"O sucesso floresce na alma que insiste, mesmo quando o vento sopra ao contrário."
"Cada desafio é uma oportunidade disfarçada esperando para ser descoberta."
"A coragem não é a ausência do medo, mas a decisão de seguir em frente apesar dele."

Gere apenas a mensagem, sem aspas ou explicações adicionais.`
          },
          { role: 'user', content: 'Gere uma mensagem motivacional inspiradora.' }
        ],
        max_tokens: 100,
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const motivationalMessage = data.choices[0].message.content.trim().replace(/^["'"'"'"'"'"'"'"""]|["'"'"'"'"'"'"'"""]$/g, '');

    console.log('Generated motivational message successfully');

    return new Response(JSON.stringify({ message: motivationalMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in motivational-message function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});