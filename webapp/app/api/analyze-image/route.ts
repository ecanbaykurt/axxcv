import { NextRequest, NextResponse } from 'next/server';
import { ImageAnalysisRequest, ImageAnalysis } from '../../../types/health';

export async function POST(request: NextRequest) {
  try {
    const { imageData, analysisType }: ImageAnalysisRequest = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'No image data provided for analysis' },
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

    let prompt = `Analyze the provided image for health-related conditions.`;
    switch (analysisType) {
      case 'skin':
        prompt += ` Focus on skin conditions, rashes, lesions, or any dermatological issues.`;
        break;
      case 'wound':
        prompt += ` Focus on wound assessment, including signs of infection, healing progress, size, and type.`;
        break;
      case 'general':
      default:
        prompt += ` Provide a general health assessment based on visual cues.`;
        break;
    }
    
    prompt += ` Return a JSON response with detected conditions, confidence, recommendations, severity (low/medium/high), and notes.`;
    prompt += `
    {
      "detectedConditions": ["string"],
      "confidence": 0-1,
      "recommendations": ["string"],
      "severity": "low" | "medium" | "high",
      "notes": "string"
    }
    Be neutral, helpful, and always recommend consulting a healthcare professional for serious concerns.`;

    const gptRequest = {
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageData}`,
              },
            },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
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
        { error: 'Failed to analyze image' },
        { status: response.status }
      );
    }

    const gptResponse = await response.json();
    const content = gptResponse.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No image analysis content received' },
        { status: 500 }
      );
    }

    const imageAnalysis: ImageAnalysis = JSON.parse(content);
    return NextResponse.json(imageAnalysis);

  } catch (error) {
    console.error('Image analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error during image analysis' },
      { status: 500 }
    );
  }
}
