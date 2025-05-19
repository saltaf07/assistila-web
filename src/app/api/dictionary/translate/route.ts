
import { NextResponse, type NextRequest } from 'next/server';
import type { ApiError, TranslationResult } from '@/types';

// List of supported languages for mock translation
const MOCK_SUPPORTED_LANGUAGES: Record<string, string> = {
  'ar': 'Arabic',
  'es': 'Spanish',
  'fr': 'French',
  'de': 'German',
  'ja': 'Japanese',
  'ru': 'Russian',
  'hi': 'Hindi',
  'zh': 'Chinese',
  'pt': 'Portuguese',
  'it': 'Italian',
  'ko': 'Korean',
  'tr': 'Turkish',
  'nl': 'Dutch',
  'sv': 'Swedish',
};


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, targetLanguage } = body;

    if (!word || !targetLanguage) {
      return NextResponse.json({ message: 'Word and targetLanguage are required' } as ApiError, { status: 400 });
    }

    const targetLanguageName = MOCK_SUPPORTED_LANGUAGES[targetLanguage];

    if (!targetLanguageName) {
      return NextResponse.json({ message: `Mock translation to '${targetLanguage}' is not supported.` } as ApiError, { status: 400 });
    }
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock translation logic - make it clear it's a mock
    const translatedText = `(Mock) "${word}" translated to ${targetLanguageName} would be: "${word}_${targetLanguage}".`;
    
    return NextResponse.json({ translatedText } as TranslationResult);

  } catch (error) {
    console.error('Mock Translation API error:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload for mock translation' } as ApiError, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error during mock translation' } as ApiError, { status: 500 });
  }
}
