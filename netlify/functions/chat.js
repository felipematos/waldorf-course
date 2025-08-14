// Netlify serverless function to handle chat API calls securely
exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Parse request body
  let requestData;
  try {
    requestData = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid request body' })
    };
  }

  const { message, context: chatContext } = requestData;

  // Use environment variable for API key (set in Netlify dashboard)
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    // Return fallback response if API key not configured
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: getFallbackResponse(message)
      })
    };
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.URL || 'https://waldorf-course.netlify.app',
        'X-Title': 'Waldorf Course'
      },
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          {
            role: 'system',
            content: `Você é Rudolf Steiner, fundador da Antroposofia e Pedagogia Waldorf.
            
Características da sua comunicação:
- Fale com sabedoria profunda e sensibilidade espiritual
- Use metáforas da natureza e imagens poéticas
- Conecte sempre o físico, anímico e espiritual
- Seja acolhedor e inspirador com os pais
- Ofereça insights práticos baseados na Antroposofia
- Mencione os setênios, temperamentos e trimembração quando relevante
- Enfatize a importância do ritmo, arte e reverência na educação

Responda em português brasileiro de forma clara mas profunda.`
          },
          ...formatContext(chatContext),
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 600,
        top_p: 0.9
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          response: data.choices[0].message.content
        })
      };
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: getFallbackResponse(message)
      })
    };
  }
};

function formatContext(context) {
  if (!context || !Array.isArray(context)) return [];
  
  return context.slice(-3).flatMap(exchange => [
    { role: 'user', content: exchange.userMessage },
    { role: 'assistant', content: exchange.botResponse }
  ]);
}

function getFallbackResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Comprehensive fallback responses covering main topics
  const responses = {
    antroposofia: `A Antroposofia, querida alma, é a sabedoria do ser humano - uma ciência espiritual que nos permite conhecer os mundos suprassensíveis através do desenvolvimento consciente de nossas faculdades latentes.

Não é uma crença, mas um caminho de conhecimento. Assim como desenvolvemos o pensamento científico para conhecer o mundo físico, podemos desenvolver órgãos de percepção espiritual através de exercícios meditativos e do cultivo moral.

A Antroposofia nos revela que somos seres tripartidos - corpo, alma e espírito - e que nossa tarefa é harmonizar estas três naturezas em nós.`,

    waldorf: `A Pedagogia Waldorf é o florescimento da Antroposofia no campo da educação. 

Reconhecemos que cada criança é um ser espiritual único que escolheu encarnar neste tempo e lugar. Nossa tarefa como educadores é criar as condições para que esta individualidade possa desenvolver-se plenamente.

Educamos a criança toda: suas mãos através do trabalho e da arte, seu coração através da beleza e da reverência, sua cabeça através do pensamento vivo. E fazemos isso respeitando as fases naturais do desenvolvimento - os setênios sagrados da biografia humana.`,

    setênio: `Os setênios são os ritmos sagrados do desenvolvimento humano, querido buscador.

No primeiro setênio (0-7 anos), a criança está construindo seu templo físico. Ela aprende por imitação, vive na fantasia, e o mundo deve ser BOM para ela. É quando o corpo etérico trabalha na formação dos órgãos.

No segundo setênio (7-14 anos), nasce a vida anímica própria. A criança vive no sentimento, aprende através da arte e da imaginação. O mundo deve ser BELO. O professor amado é a autoridade natural.

No terceiro setênio (14-21 anos), desperta o pensar independente. O jovem busca a VERDADE, questiona, forma ideais. É o nascimento do EU consciente.

Cada setênio é um nascimento - do corpo, da alma, do espírito.`,

    temperamento: `Os quatro temperamentos são as colorações da alma, as tendências fundamentais através das quais cada individualidade se expressa no mundo.

O **sanguíneo** é como a borboleta - leve, mutável, sociável, vivendo no presente imediato. A criança sanguínea precisa de variedade e desafios breves.

O **colérico** é o fogo que quer transformar o mundo. Tem vontade forte, é líder natural. Precisa de grandes desafios e responsabilidades.

O **melancólico** vive nas profundezas da alma, é sensível, perfeccionista. Necessita de compreensão e tempo para processar.

O **fleumático** é a terra firme - calmo, confiável, metódico. Precisa ser gentilmente despertado para a ação.

Conhecer o temperamento da criança é como ter a chave para seu coração.`,

    ritmo: `O ritmo, querida alma, é o grande curador e educador. "Ritmo substitui força", como sempre digo.

Observe a natureza: o sol nasce e se põe, as estações se sucedem, nosso coração bate, respiramos... Tudo na vida é ritmo. A criança, especialmente, vive destes ritmos.

Estabeleça ritmos diários: a mesma hora para acordar, para as refeições, para dormir. Ritmos semanais: cada dia com sua qualidade. Ritmos anuais: as festas que marcam as estações.

O ritmo traz segurança, reduz a ansiedade, fortalece a vontade. É como as margens de um rio - dão forma e direção à corrente da vida.`,

    tecnologia: `A questão da tecnologia, especialmente para as crianças, é uma das grandes provas de nosso tempo.

A criança pequena precisa primeiro conhecer o mundo real através de seus sentidos. As telas oferecem apenas sombras do mundo, imagens mortas que não respondem ao toque amoroso da criança.

Até os 7 anos, a criança deveria viver livre de telas, construindo sua imaginação através do brincar livre. Dos 7 aos 14, o uso deve ser mínimo e sempre supervisionado. Só após os 14 anos, quando o pensar próprio desperta, a criança pode começar a relacionar-se conscientemente com a tecnologia.

Não é sobre negar o mundo moderno, mas sobre dar à criança bases sólidas antes de entrar nele. Primeiro as raízes, depois as asas.`,

    default: `Sua questão toca as profundezas do mistério humano, querida alma.

Na Antroposofia, sempre buscamos olhar para cada questão a partir de três perspectivas: Como isso se manifesta no corpo físico? Como ressoa em nossa vida anímica de sentimentos? Que significado tem para nosso desenvolvimento espiritual?

Convido você a meditar sobre sua pergunta. Às vezes, as respostas mais profundas vêm não do exterior, mas do silêncio interior onde nossa sabedoria mais elevada pode falar.

Que aspecto específico da Pedagogia Waldorf ou da Antroposofia gostaria de explorar mais profundamente?`
  };

  // Check for keywords and return appropriate response
  for (const [key, response] of Object.entries(responses)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return response;
    }
  }

  // Check for additional keywords
  if (lowerMessage.includes('seteni') || lowerMessage.includes('sete anos') || lowerMessage.includes('idade')) {
    return responses.setênio;
  }
  
  if (lowerMessage.includes('tela') || lowerMessage.includes('celular') || lowerMessage.includes('tablet') || lowerMessage.includes('computador')) {
    return responses.tecnologia;
  }

  return responses.default;
}