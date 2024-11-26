import CONFIG from './config.js';
const backendUrl = CONFIG.BACKEND_BASE_URL || 'http://localhost:8000';

export async function translateTexts(texts, targetLanguage) {
    try {
      const response = await fetch(`${backendUrl}/translate`, {
        method: 'POST',
        body: JSON.stringify({ texts, target_language: targetLanguage }),
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Translation API responded with status ${response.status}: ${errorData}`);
        throw new Error(`Translation API error: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (!data.data || !data.data.translations) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid translation response');
      }
  
      return data.data.translations.map(t => t.translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
      return texts; // Fallback to original texts
    }
  }
  


// Function to translate page content
const translatePageContent = async () => {
    const userPreferredLanguage = localStorage.getItem('preferredLanguage') || 'en';

    if (userPreferredLanguage === 'en') {
      // No need to translate
      return;
    }

    // Translate text content of elements with data-translate
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    const textsToTranslate = [];
    elementsToTranslate.forEach(element => {
      const originalText = element.getAttribute('data-original-text') || element.textContent.trim();
      if (!element.getAttribute('data-original-text')) {
        element.setAttribute('data-original-text', originalText);
      }
      textsToTranslate.push(originalText);
    });

    // Translate placeholders
    const elementsWithPlaceholder = document.querySelectorAll('[data-translate-placeholder]');
    elementsWithPlaceholder.forEach(element => {
      const originalPlaceholder = element.getAttribute('data-original-placeholder') || element.placeholder;
      if (!element.getAttribute('data-original-placeholder')) {
        element.setAttribute('data-original-placeholder', originalPlaceholder);
      }
      textsToTranslate.push(originalPlaceholder);
    });

    // Translate options in select elements
    const optionElements = document.querySelectorAll('select option[data-translate-option]');
    optionElements.forEach(option => {
      const originalText = option.getAttribute('data-original-text') || option.textContent.trim();
      if (!option.getAttribute('data-original-text')) {
        option.setAttribute('data-original-text', originalText);
      }
      textsToTranslate.push(originalText);
    });

    // Now, translate all collected texts
    const translatedTexts = await translateTexts(textsToTranslate, userPreferredLanguage);

    // Update elements with translated texts
    let index = 0;
    elementsToTranslate.forEach(element => {
      element.textContent = translatedTexts[index];
      index++;
    });
    elementsWithPlaceholder.forEach(element => {
      element.placeholder = translatedTexts[index];
      index++;
    });
    optionElements.forEach(option => {
      option.textContent = translatedTexts[index];
      index++;
    });
  };

  // Call the function to translate content
  translatePageContent();