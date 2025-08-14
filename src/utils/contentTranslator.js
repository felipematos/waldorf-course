// Content Translation System
// This module handles dynamic content translation using Google Translate

export class ContentTranslator {
  constructor() {
    this.isInitialized = false;
    this.currentLanguage = 'pt';
    this.cache = new Map();
  }

  // Initialize Google Translate
  async init() {
    if (this.isInitialized) return;
    
    return new Promise((resolve) => {
      if (typeof window !== 'undefined') {
        // Check if Google Translate is already loaded
        if (window.google && window.google.translate) {
          this.isInitialized = true;
          resolve();
          return;
        }

        // Define the callback function
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement({
            pageLanguage: 'pt',
            includedLanguages: 'en,es,fr,nl,pt',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
            multilanguagePage: true
          }, 'google_translate_element');
          
          this.isInitialized = true;
          resolve();
        };

        // Load Google Translate script
        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  // Translate content using Google Translate API (free tier)
  async translateText(text, targetLang) {
    if (!text || targetLang === 'pt') return text;
    
    // Check cache first
    const cacheKey = `${text.substring(0, 50)}_${targetLang}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Use Google Translate free API through a proxy or widget
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=pt&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
      const data = await response.json();
      
      if (data && data[0]) {
        const translated = data[0].map(item => item[0]).join('');
        this.cache.set(cacheKey, translated);
        return translated;
      }
    } catch (error) {
      console.error('Translation error:', error);
    }
    
    return text; // Return original text if translation fails
  }

  // Translate entire course content structure
  async translateCourseContent(content, targetLang) {
    if (targetLang === 'pt') return content;

    const translatedContent = { ...content };
    
    // Translate introduction
    if (content.introduction) {
      translatedContent.introduction = {
        ...content.introduction,
        title: await this.translateText(content.introduction.title, targetLang),
        content: await this.translateText(content.introduction.content, targetLang),
        poem: await this.translateText(content.introduction.poem, targetLang)
      };
    }

    // Translate chapters
    if (content.chapters) {
      translatedContent.chapters = await Promise.all(
        content.chapters.map(async (chapter) => ({
          ...chapter,
          title: await this.translateText(chapter.title, targetLang),
          subtitle: await this.translateText(chapter.subtitle, targetLang),
          poem: await this.translateText(chapter.poem, targetLang),
          sections: await Promise.all(
            chapter.sections.map(async (section) => ({
              ...section,
              title: await this.translateText(section.title, targetLang),
              content: await this.translateText(section.content, targetLang),
              exercise: section.exercise ? {
                ...section.exercise,
                title: await this.translateText(section.exercise.title, targetLang),
                description: await this.translateText(section.exercise.description, targetLang)
              } : undefined,
              practices: section.practices ? 
                await Promise.all(section.practices.map(p => this.translateText(p, targetLang))) : 
                undefined
            }))
          ),
          activities: chapter.activities ? 
            await Promise.all(chapter.activities.map(a => this.translateText(a, targetLang))) : 
            undefined,
          finalReflection: chapter.finalReflection ? {
            ...chapter.finalReflection,
            title: await this.translateText(chapter.finalReflection.title, targetLang),
            content: await this.translateText(chapter.finalReflection.content, targetLang),
            poem: await this.translateText(chapter.finalReflection.poem, targetLang)
          } : undefined
        }))
      );
    }

    return translatedContent;
  }

  // Get language from i18n or browser
  getCurrentLanguage() {
    if (typeof window !== 'undefined') {
      // Check i18n setting
      const i18nLang = localStorage.getItem('i18nextLng');
      if (i18nLang) return i18nLang.split('-')[0];
      
      // Check browser language
      const browserLang = navigator.language || navigator.userLanguage;
      return browserLang.split('-')[0];
    }
    return 'pt';
  }

  // Apply Google Translate to a specific element
  translateElement(element) {
    if (!element || !this.isInitialized) return;
    
    // Add notranslate class to elements that shouldn't be translated
    const noTranslateElements = element.querySelectorAll('code, pre, .notranslate');
    noTranslateElements.forEach(el => el.classList.add('notranslate'));
    
    // Trigger translation
    if (window.google && window.google.translate) {
      const frame = document.querySelector('.goog-te-banner-frame');
      if (frame) {
        frame.style.display = 'none';
      }
    }
  }
}

// Create singleton instance
export const contentTranslator = new ContentTranslator();

// Helper function to translate content on demand
export async function translateContent(content, targetLanguage) {
  await contentTranslator.init();
  return contentTranslator.translateCourseContent(content, targetLanguage);
}

// Helper function to get translated text
export async function t(text, targetLanguage) {
  return contentTranslator.translateText(text, targetLanguage);
}