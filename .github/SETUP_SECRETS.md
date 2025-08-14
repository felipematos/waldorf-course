# GitHub Secrets Setup Guide

## Required Secrets for Automated Deployment

To enable automated deployment via GitHub Actions, you need to add the following secrets to your GitHub repository:

### 1. NETLIFY_SITE_ID
**Value**: `6ad0cff8-f0a4-4c91-bd5d-b694361e2f21`

This is your Netlify site ID that's already configured.

### 2. NETLIFY_AUTH_TOKEN
To get this token:
1. Go to [Netlify User Settings](https://app.netlify.com/user/applications#personal-access-tokens)
2. Click "New access token"
3. Give it a name like "GitHub Actions"
4. Copy the token (you won't see it again!)
5. Add it as a GitHub secret

## How to Add Secrets to GitHub

1. Go to your repository: https://github.com/felipematos/waldorf-course
2. Click on "Settings" tab
3. Click on "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Add each secret:
   - Name: `NETLIFY_SITE_ID`
   - Value: `6ad0cff8-f0a4-4c91-bd5d-b694361e2f21`
   
   - Name: `NETLIFY_AUTH_TOKEN`
   - Value: (your personal access token from Netlify)

## OpenRouter API Key (for Chatbot)

To make the chatbot functional:
1. Create an account at [OpenRouter](https://openrouter.ai)
2. Get your API key
3. Update it in Netlify:
   - Go to [Site Settings](https://app.netlify.com/sites/superlative-belekoy-fbd614/settings/env)
   - Update `OPENROUTER_API_KEY` with your actual key

## Testing the Deployment

After adding the secrets, any push to the `main` branch will automatically:
1. Run tests
2. Build the project
3. Deploy to Netlify
4. Comment on the commit with the deployment URL

## Current Deployment URLs

- **Production**: https://superlative-belekoy-fbd614.netlify.app
- **Netlify Dashboard**: https://app.netlify.com/sites/superlative-belekoy-fbd614/overview
- **GitHub Repository**: https://github.com/felipematos/waldorf-course