import { NextRequest, NextResponse } from 'next/server';
import { SupportedLanguage } from '../../../types/medical';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'No text provided for language detection' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const systemPrompt = `You are a language detection expert. Analyze the provided text and determine the most likely language.

Return a JSON response with this exact structure:
{
  "detectedLanguage": "language_code",
  "confidence": 0.95,
  "alternatives": [
    {
      "language": "alternative_language_code",
      "confidence": 0.85
    }
  ]
}

Supported language codes:
en (English), es (Spanish), fr (French), de (German), it (Italian), pt (Portuguese), 
ru (Russian), zh-CN (Chinese Simplified), zh-TW (Chinese Traditional), ja (Japanese), 
ko (Korean), ar (Arabic), hi (Hindi), tr (Turkish), nl (Dutch), sv (Swedish), 
no (Norwegian), da (Danish), fi (Finnish), pl (Polish), cs (Czech), hu (Hungarian), 
ro (Romanian), bg (Bulgarian), hr (Croatian), sr (Serbian), sk (Slovak), sl (Slovenian), 
et (Estonian), lv (Latvian), lt (Lithuanian), el (Greek), he (Hebrew), fa (Persian), 
ur (Urdu), bn (Bengali), ta (Tamil), te (Telugu), mr (Marathi), gu (Gujarati), 
kn (Kannada), ml (Malayalam), pa (Punjabi), th (Thai), vi (Vietnamese), id (Indonesian), 
ms (Malay), tl (Filipino), sw (Swahili), yo (Yoruba), ig (Igbo), ha (Hausa), 
am (Amharic), zu (Zulu), xh (Xhosa)

Provide confidence scores between 0 and 1.`;

    const gptRequest = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gptRequest),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to detect language' },
        { status: response.status }
      );
    }

    const gptResponse = await response.json();
    const content = gptResponse.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'No language detection content received' },
        { status: 500 }
      );
    }

    const languageDetection = JSON.parse(content);
    return NextResponse.json(languageDetection);

  } catch (error) {
    console.error('Language detection error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}