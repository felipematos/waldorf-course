# 🌸 Jornada Antroposófica - Curso Waldorf para Pais

Um curso interativo e completo sobre Antroposofia e Pedagogia Waldorf, desenvolvido especialmente para pais de alunos de escolas Waldorf.

## ✨ Características

- 📚 **7 Capítulos Completos** sobre os fundamentos da Antroposofia e Pedagogia Waldorf
- 🎨 **Design Waldorf Autêntico** com cores aquareladas e estética suave
- 💬 **Chatbot Interativo** com a persona de Rudolf Steiner
- 📊 **Sistema de Progresso** para acompanhar sua jornada de aprendizado
- 📱 **Totalmente Responsivo** para acesso em qualquer dispositivo
- 🔒 **API Segura** com proteção da chave através de serverless functions
- 💾 **Salvamento Automático** do progresso no navegador

## 🚀 Instalação Local

1. Clone o repositório:
```bash
cd waldorf-course
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Acesse em seu navegador:
```
http://localhost:5173
```

## 🌐 Deployment Gratuito

### Opção 1: Netlify (Recomendado)

1. **Crie uma conta gratuita** em [Netlify](https://www.netlify.com)

2. **Faça o build do projeto**:
```bash
npm run build
```

3. **Deploy via Netlify CLI**:
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

4. **Configure a variável de ambiente** no painel do Netlify:
   - Vá para Site Settings > Environment Variables
   - Adicione: `OPENROUTER_API_KEY` = `sua_chave_aqui`

### Opção 2: Vercel

1. **Instale o Vercel CLI**:
```bash
npm install -g vercel
```

2. **Deploy**:
```bash
vercel --prod
```

3. **Configure a variável de ambiente** no painel do Vercel

### Opção 3: GitHub Pages (sem chatbot API)

1. **Instale gh-pages**:
```bash
npm install --save-dev gh-pages
```

2. **Adicione ao package.json**:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. **Deploy**:
```bash
npm run deploy
```

## 🔐 Configuração Segura da API

### Para o Chatbot Funcionar Completamente:

1. **Crie uma conta** em [OpenRouter](https://openrouter.ai)
2. **Obtenha sua API key** gratuita
3. **Configure no servidor** (não no código):
   - Netlify: Site Settings > Environment Variables
   - Vercel: Project Settings > Environment Variables
   - Nome da variável: `OPENROUTER_API_KEY`

⚠️ **IMPORTANTE**: Nunca coloque a API key diretamente no código frontend!

## 📁 Estrutura do Projeto

```
waldorf-course/
├── src/
│   ├── components/      # Componentes React
│   ├── pages/           # Páginas da aplicação
│   ├── styles/          # Estilos SCSS
│   ├── data/            # Conteúdo do curso
│   └── api/             # Configuração da API
├── netlify/
│   └── functions/       # Serverless functions
├── public/              # Assets públicos
└── dist/               # Build de produção
```

## 🎨 Personalização

### Cores Waldorf
As cores podem ser ajustadas em `src/styles/global.scss`:

```scss
$cor-ceu: #a8c5e0;      // Azul celeste
$cor-sol: #f4d03f;      // Amarelo dourado
$cor-terra: #8b6f47;    // Marrom terra
$cor-folha: #7cb342;    // Verde folha
$cor-rosa: #e8a5a5;     // Rosa suave
$cor-violeta: #9c7bb8;  // Violeta
```

### Conteúdo do Curso
Todo o conteúdo está em `src/data/courseContent.js` e pode ser facilmente editado.

## 🆓 Hospedagem Gratuita Alternativa

### FreeHostia
1. Faça o build: `npm run build`
2. Faça upload da pasta `dist` via FTP
3. Configure o `.htaccess` para SPA routing

### Surge.sh
```bash
npm install -g surge
npm run build
surge dist your-domain.surge.sh
```

### Firebase Hosting
```bash
npm install -g firebase-tools
firebase init hosting
firebase deploy
```

## 📝 Notas de Desenvolvimento

- **React 18** com Vite para build rápido
- **Framer Motion** para animações suaves
- **SCSS** para estilos organizados
- **LocalStorage** para persistência de dados
- **Serverless Functions** para proteção da API

## 🤝 Contribuindo

Contribuições são bem-vindas! Este é um projeto educacional sem fins lucrativos.

## 📄 Licença

MIT - Livre para uso educacional

## 💖 Agradecimentos

Desenvolvido com amor para a comunidade Waldorf, honrando os ensinamentos de Rudolf Steiner e todos os educadores que dedicam suas vidas ao desenvolvimento integral das crianças.

---

*"Receber a criança em reverência, educá-la com amor, deixá-la partir em liberdade."* - Rudolf Steiner