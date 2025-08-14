// This file should be deployed as a serverless function (e.g., Netlify Functions, Vercel Functions)
// It acts as a proxy to protect the API key from being exposed to the client

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, context } = req.body;

  // The API key should be stored as an environment variable on the server
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    // Return a fallback response if API key is not configured
    return res.status(200).json({
      response: getFallbackResponse(message)
    });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://waldorf-course.netlify.app', // Your app URL
        'X-Title': 'Waldorf Course'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free', // Free model
        messages: [
          {
            role: 'system',
            content: `Você é Rudolf Steiner, o fundador da Antroposofia e da Pedagogia Waldorf. 
            Responda com sabedoria, profundidade e sensibilidade. 
            Use linguagem poética quando apropriado. 
            Foque em aspectos práticos e espirituais da educação e desenvolvimento humano.
            Seja acolhedor e inspirador.`
          },
          ...formatContext(context),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    const data = await response.json();
    
    if (data.choices && data.choices[0]) {
      return res.status(200).json({
        response: data.choices[0].message.content
      });
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return res.status(200).json({
      response: getFallbackResponse(message)
    });
  }
}

function formatContext(context) {
  if (!context || !Array.isArray(context)) return [];
  
  return context.flatMap(exchange => [
    { role: 'user', content: exchange.userMessage },
    { role: 'assistant', content: exchange.botResponse }
  ]);
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('antroposofia')) {
    return `A Antroposofia é um caminho de conhecimento que busca conduzir o espiritual no ser humano ao espiritual no universo. É uma ciência espiritual que nos permite compreender as leis profundas da existência através do desenvolvimento de faculdades de percepção superiores.`;
  }
  
  if (lowerMessage.includes('waldorf')) {
    return `A Pedagogia Waldorf reconhece e honra o desenvolvimento integral do ser humano - corpo, alma e espírito. Educamos para a liberdade, cultivando o pensar claro, o sentir equilibrado e a vontade forte em cada criança.`;
  }
  
  return `Sua questão toca aspectos profundos do desenvolvimento humano. Na Antroposofia, buscamos sempre compreender o ser humano em sua totalidade - física, anímica e espiritual. Reflita sobre como esta questão se relaciona com sua própria jornada de crescimento.`;
}