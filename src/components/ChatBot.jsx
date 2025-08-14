import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, User, Sparkles } from 'lucide-react';
import './ChatBot.scss';

function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: `Saudações, querida alma em busca de conhecimento!
      
Sou Rudolf Steiner, e estou aqui para conversar com você sobre a Antroposofia, a Pedagogia Waldorf e as questões profundas da vida humana.

Como posso iluminar seu caminho hoje?`
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load saved conversations
    const saved = localStorage.getItem('chatConversations');
    if (saved) {
      const conversations = JSON.parse(saved);
      setConversationHistory(conversations);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const saveConversation = (newMessage, response) => {
    const conversation = {
      timestamp: new Date().toISOString(),
      userMessage: newMessage,
      botResponse: response
    };
    
    const updated = [...conversationHistory, conversation];
    setConversationHistory(updated);
    localStorage.setItem('chatConversations', JSON.stringify(updated.slice(-50))); // Keep last 50 exchanges
  };

  const callOpenRouterAPI = async (userMessage) => {
    try {
      // Use environment variable or secure backend endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          context: conversationHistory.slice(-5) // Send last 5 exchanges for context
        })
      });

      if (!response.ok) {
        throw new Error('API call failed');
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Chat API error:', error);
      return getFallbackResponse(userMessage);
    }
  };

  const getFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    // Anthroposophy responses
    if (lowerMessage.includes('antroposofia') || lowerMessage.includes('anthroposophy')) {
      return `A Antroposofia é um caminho de conhecimento que busca guiar o espiritual no ser humano ao espiritual no universo. 

Não é uma religião, mas uma ciência espiritual que procura expandir a consciência humana através de métodos precisos de observação e meditação.

Ela nos ensina que somos seres tripartidos - corpo, alma e espírito - e que nossa tarefa é desenvolver conscientemente estas três dimensões de nosso ser.`;
    }
    
    // Waldorf pedagogy
    if (lowerMessage.includes('waldorf') || lowerMessage.includes('pedagogia')) {
      return `A Pedagogia Waldorf é a aplicação prática da Antroposofia na educação. 

Ela reconhece que a criança se desenvolve em ciclos de aproximadamente sete anos - os setênios - e que cada fase requer uma abordagem pedagógica específica.

No primeiro setênio (0-7 anos), a criança aprende por imitação e o mundo deve ser BOM.
No segundo setênio (7-14 anos), ela aprende através da arte e imaginação, e o mundo deve ser BELO.
No terceiro setênio (14-21 anos), desenvolve o pensamento abstrato e busca a VERDADE.`;
    }
    
    // Four bodies
    if (lowerMessage.includes('corpos') || lowerMessage.includes('etérico') || lowerMessage.includes('astral')) {
      return `O ser humano possui quatro corpos ou veículos de manifestação:

1. **Corpo Físico** - nossa substância material, compartilhada com o reino mineral
2. **Corpo Etérico** - nossas forças vitais e formativas, compartilhadas com as plantas
3. **Corpo Astral** - nossa vida emocional e de sensações, compartilhada com os animais  
4. **O Eu** - nossa essência espiritual individual, exclusivamente humana

Cada um destes corpos tem seu próprio ritmo de desenvolvimento e necessita de cuidados específicos.`;
    }
    
    // Septennials
    if (lowerMessage.includes('setênio') || lowerMessage.includes('sete anos') || lowerMessage.includes('biografia')) {
      return `A biografia humana se desenrola em ciclos de sete anos, cada um com suas características próprias:

**0-7 anos**: Desenvolvimento do corpo físico, aprendizado por imitação
**7-14 anos**: Desenvolvimento do corpo etérico, aprendizado através da arte
**14-21 anos**: Desenvolvimento do corpo astral, busca por ideais
**21-28 anos**: Desenvolvimento do Eu, busca pela identidade
**28-35 anos**: Consolidação da personalidade
**35-42 anos**: Crise de meia-idade e transformação
**42-49 anos**: Desenvolvimento da sabedoria

Cada setênio é uma oportunidade de crescimento e transformação.`;
    }
    
    // Temperaments
    if (lowerMessage.includes('temperamento')) {
      return `Os quatro temperamentos são disposições anímicas fundamentais que influenciam como interagimos com o mundo:

**Sanguíneo** 🌸: Leve, sociável, otimista, dispersivo
**Colérico** 🔥: Forte vontade, liderança, impulsivo
**Melancólico** 💧: Profundo, sensível, introspectivo
**Fleumático** 🌍: Calmo, estável, lento, confiável

Conhecer o temperamento da criança ajuda a educá-la respeitando sua natureza individual.`;
    }
    
    // Rhythm
    if (lowerMessage.includes('ritmo') || lowerMessage.includes('rotina')) {
      return `O ritmo é o grande educador e curador. Assim como nosso coração bate ritmicamente e respiramos em ritmo, toda a vida se organiza em ritmos.

Para a criança, estabelecer ritmos saudáveis significa:
- Horários regulares para dormir e acordar
- Refeições em família nos mesmos horários
- Ritmo semanal com atividades específicas para cada dia
- Celebração das festas anuais e estações

O ritmo traz segurança, reduz a ansiedade e fortalece a vontade.`;
    }
    
    // Technology and screens
    if (lowerMessage.includes('tela') || lowerMessage.includes('tecnologia') || lowerMessage.includes('celular') || lowerMessage.includes('tablet')) {
      return `A relação com a tecnologia requer consciência e cuidado, especialmente na infância.

Recomendamos:
- **0-7 anos**: Nenhuma tela, para proteger o desenvolvimento da imaginação
- **7-14 anos**: Uso muito limitado e supervisionado
- **14+ anos**: Educação gradual para uso consciente

As telas podem prejudicar:
- O desenvolvimento sensorial
- A capacidade de concentração
- A imaginação criativa
- O sono e os ritmos naturais
- As habilidades sociais

O mundo digital pode esperar. A infância não volta.`;
    }
    
    // Parents role
    if (lowerMessage.includes('pais') || lowerMessage.includes('família')) {
      return `Os pais são os primeiros e mais importantes educadores da criança. 

Vocês oferecem:
- O **exemplo vivo** que a criança imita
- O **ambiente** onde ela cresce e se desenvolve
- O **amor incondicional** que a sustenta
- Os **ritmos e limites** que a estruturam

Lembrem-se: não se trata de ser perfeito, mas de estar em constante desenvolvimento. A criança precisa ver que os adultos também estão crescendo e aprendendo.

O maior presente que podem dar aos filhos é o próprio trabalho interior de vocês.`;
    }
    
    // Default response
    return `Esta é uma questão profunda que merece nossa atenção cuidadosa.

Na Antroposofia, procuramos sempre olhar para as questões da vida a partir de múltiplas perspectivas - física, anímica e espiritual.

Sugiro que você reflita sobre:
- Como esta questão se relaciona com seu desenvolvimento pessoal?
- Que forças interiores ela desperta em você?
- Como podemos transformar desafios em oportunidades de crescimento?

Gostaria de explorar algum aspecto específico da Pedagogia Waldorf ou da Antroposofia?`;
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Call the actual API endpoint
    try {
      const response = await callOpenRouterAPI(input);
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      saveConversation(input, response);
    } catch (error) {
      console.error('Error in chat:', error);
      // Fallback to default response if API fails
      const fallbackResponse = getFallbackResponse(input);
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: fallbackResponse
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
      saveConversation(input, fallbackResponse);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <motion.div 
      className="chatbot-container"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ duration: 0.3 }}
    >
      <div className="chatbot-header">
        <div className="header-info">
          <Sparkles className="header-icon" />
          <div>
            <h3>Rudolf Steiner</h3>
            <span className="status">Guia Antroposófico</span>
          </div>
        </div>
        <button className="close-btn" onClick={onClose}>
          <X />
        </button>
      </div>

      <div className="chatbot-messages">
        <AnimatePresence>
          {messages.map(message => (
            <motion.div
              key={message.id}
              className={`message ${message.type}`}
              initial={{ opacity: 0, x: message.type === 'user' ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="message-avatar">
                {message.type === 'user' ? <User size={20} /> : <Sparkles size={20} />}
              </div>
              <div className="message-content">
                <p>{message.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div 
            className="typing-indicator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <span></span>
            <span></span>
            <span></span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua pergunta..."
          rows="2"
        />
        <button 
          className="send-btn"
          onClick={handleSend}
          disabled={!input.trim() || isTyping}
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
}

export default ChatBot;