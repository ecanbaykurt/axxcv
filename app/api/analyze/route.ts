import { NextRequest, NextResponse } from 'next/server';
import { GPTRequest, AIHealthResponse } from '../../../types/health';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    
    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'No text provided for analysis' },
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

    const systemPrompt = `You are a medical AI assistant that helps organize health symptoms for patient-doctor communication. 
You do NOT provide medical diagnosis or treatment advice. You help structure symptom information for healthcare professionals.

Analyze the following symptom description and return a JSON response with this exact structure:
{
  "summary": "2-3 sentence neutral summary of the symptoms",
  "patient_summary": "Plain language summary for the patient",
  "doctor_summary": "Medical terminology summary for healthcare providers",
  "severity_level": "routine/attention/emergency",
  "timeline": [
    {
      "symptom": "specific symptom description",
      "severity": 1-10,
      "duration": "how long it's been happening",
      "frequency": "how often it occurs",
      "icd10_codes": ["relevant ICD-10 codes if applicable"]
    }
  ],
  "red_flags": [
    {
      "description": "concerning symptom or pattern",
      "severity": "low/medium/high/critical",
      "recommendation": "what to do about it",
      "urgency": "immediate/within_24h/within_week/routine"
    }
  ],
  "recommendations": [
    "Clear, actionable next steps for the patient",
    "When to seek medical attention",
    "What information to bring to doctor"
  ],
  "triage_guidance": "routine/attention/emergency with brief explanation"
}

Focus on:
- Standardized medical terminology for doctor_summary
- Clear triage guidance (routine/attention/emergency)
- Actionable recommendations
- ICD-10 codes where applicable
- Patient safety and when to seek immediate care

Always emphasize consulting healthcare professionals for proper medical evaluation.`;

    const gptRequest: GPTRequest = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3
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
        { error: 'Failed to analyze symptoms' },
        { status: response.status }
      );
    }

    const gptResponse = await response.json();
    const content = gptResponse.choices[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json(
        { error: 'No analysis content received' },
        { status: 500 }
      );
    }

    // Parse the JSON content from GPT response
    let healthResponse: AIHealthResponse;
    try {
      healthResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse AI response' },
        { status: 500 }
      );
    }

    // Add IDs to timeline and red flags (with safety checks)
    healthResponse.timeline = (healthResponse.timeline || []).map((item, index) => ({
      ...item,
      id: `timeline_${index}_${Date.now()}`
    }));

    healthResponse.redFlags = (healthResponse.redFlags || []).map((item, index) => ({
      ...item,
      id: `redflag_${index}_${Date.now()}`
    }));

    return NextResponse.json(healthResponse);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
