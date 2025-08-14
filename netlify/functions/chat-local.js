// Local development server for the chat function
const express = require('express');
const app = express();
const chatHandler = require('./chat');

app.use(express.json());

app.post('/.netlify/functions/chat', async (req, res) => {
  // Set the OpenRouter API key from local .env file
  process.env.OPENROUTER_API_KEY = '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';
  
  const event = {
    httpMethod: 'POST',
    body: JSON.stringify(req.body)
  };
  
  const result = await chatHandler.handler(event, {});
  
  res.status(result.statusCode).json(JSON.parse(result.body));
});

const PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Chat API running on http://localhost:${PORT}/.netlify/functions/chat`);
});