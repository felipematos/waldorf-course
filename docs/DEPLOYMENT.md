# Deployment Instructions for Chatbot with OpenRouter API

## Local Development

The chatbot is now configured to use your OpenRouter API key locally. The `.env` file has been created with your API key.

To run locally:
```bash
npm install
npm run dev
```

The application will be available at http://localhost:5173

## Netlify Production Deployment

### Important: Setting the API Key in Netlify

For the chatbot to work in production on Netlify, you need to add the environment variable in the Netlify dashboard:

1. **Go to your Netlify Dashboard**
   - Navigate to https://app.netlify.com
   - Select your `waldorf-course` site

2. **Add Environment Variable**
   - Go to **Site configuration** → **Environment variables**
   - Click **"Add a variable"**
   - Add the following:
     - **Key:** `OPENROUTER_API_KEY`
     - **Value:** `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`
     - **Scope:** Select both "Production" and "Preview"

3. **Deploy the Changes**
   - After adding the environment variable, trigger a new deployment
   - You can do this by:
     - Pushing new code to your repository (if connected to Git)
     - Or clicking **"Trigger deploy"** → **"Clear cache and deploy site"**

## How It Works

- **Frontend**: The React component (`src/components/ChatBot.jsx`) sends chat messages to `/api/chat`
- **Netlify Redirects**: The `netlify.toml` file redirects `/api/chat` to the serverless function
- **Serverless Function**: `netlify/functions/chat.js` handles the API calls securely using the environment variable
- **OpenRouter API**: The function communicates with OpenRouter's API using your key

## Security Notes

- ✅ The API key is stored as an environment variable, not in the code
- ✅ The `.env` file is gitignored and won't be committed
- ✅ The serverless function acts as a proxy, keeping the API key server-side
- ✅ CORS headers are properly configured in `netlify.toml`

## Testing the Chatbot

After deployment:
1. Open your site at https://waldorf-course.netlify.app
2. Click the chat button to open the chatbot
3. Ask questions about Waldorf pedagogy or Anthroposophy
4. The bot will now use the OpenRouter API with the Mistral-7B model

## Troubleshooting

If the chatbot isn't working:

1. **Check Netlify Function Logs**
   - Go to **Functions** tab in Netlify dashboard
   - Look for errors in the `chat` function logs

2. **Verify Environment Variable**
   - Ensure the `OPENROUTER_API_KEY` is set correctly in Netlify
   - Make sure there are no extra spaces or quotes

3. **Check API Key**
   - Verify your OpenRouter API key is valid
   - Check your OpenRouter dashboard for usage/limits

4. **Fallback Mode**
   - If the API fails, the chatbot will use pre-configured fallback responses
   - This ensures the chat remains functional even if the API is down

## API Configuration

Current settings in `netlify/functions/chat.js`:
- **Model**: `mistralai/mistral-7b-instruct:free` (free tier)
- **Max Tokens**: 600
- **Temperature**: 0.7
- **Context**: Last 3 conversation exchanges are sent for context

You can modify these settings in the serverless function if needed.