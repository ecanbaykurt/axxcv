import { NextRequest, NextResponse } from 'next/server';
import { 
  SupportedLanguage, 
  MedicalCategory, 
  SeverityLevel, 
  PainScale,
  StandardizedMedicalResponse,
  StandardizedSymptom,
  TranslationRequest
} from '../../../types/medical';

export async function POST(request: NextRequest) {
  try {
    const { 
      text, 
      patientLanguage = SupportedLanguage.ENGLISH,
      doctorLanguage = SupportedLanguage.ENGLISH,
      region = 'global'
    } = await request.json();
    
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

    // Enhanced system prompt for multi-language medical standardization
    const systemPrompt = `You are an advanced AI medical assistant specializing in multi-language symptom analysis and medical standardization. Your role is to:

1. ANALYZE symptoms in any language and standardize them for global medical understanding
2. CATEGORIZE symptoms into WHO/ICD-10 medical categories
3. TRANSLATE between patient language and doctor language
4. PROVIDE standardized medical terminology
5. ENSURE cultural sensitivity and accessibility

Analyze the following symptom description and return a JSON response with this exact structure:
{
  "patientSummary": "Clear summary in patient's language",
  "doctorSummary": "Medical summary in doctor's language with standardized terminology",
  "symptoms": [
    {
      "id": "unique_id",
      "originalText": "original patient description",
      "originalLanguage": "detected_language_code",
      "standardizedDescription": "standardized medical description",
      "category": "medical_category",
      "severity": "severity_level",
      "painScale": pain_number_0_to_5,
      "duration": "duration description",
      "frequency": "frequency description",
      "location": "body location if specified",
      "associatedSymptoms": ["related symptoms"],
      "redFlags": ["concerning signs"],
      "doctorNotes": "clinical notes for doctor",
      "patientLanguage": "patient_language_code",
      "doctorLanguage": "doctor_language_code",
      "translation": {
        "en": {
          "description": "English description",
          "patientNotes": "Patient-friendly English notes",
          "doctorNotes": "Clinical English notes"
        }
      }
    }
  ],
  "categories": ["primary_category", "secondary_categories"],
  "severity": "overall_severity_level",
  "urgency": "routine|urgent|emergency",
  "recommendations": [
    "Specific recommendation in patient language",
    "Medical recommendation in doctor language"
  ],
  "followUpRequired": true/false,
  "specialistReferral": ["specialist_types_if_needed"],
  "translations": {
    "en": {
      "patientSummary": "English patient summary",
      "doctorSummary": "English doctor summary", 
      "recommendations": ["English recommendations"]
    }
  },
  "culturalNotes": ["Cultural considerations"],
  "accessibilityNotes": ["Accessibility considerations"]
}

MEDICAL CATEGORIES (use exactly these):
- infectious_diseases, neoplasms, blood_diseases, endocrine_diseases, mental_disorders
- nervous_system, eye_diseases, ear_diseases, circulatory_system, respiratory_system
- digestive_system, skin_diseases, musculoskeletal, genitourinary, pregnancy_childbirth
- congenital_anomalies, injuries_poisoning, external_causes, health_services, unspecified

SEVERITY LEVELS: minimal, mild, moderate, severe, critical
PAIN SCALE: 0-5 (0=none, 1=mild, 2=moderate, 3=severe, 4=very_severe, 5=excruciating)
URGENCY LEVELS: routine (can wait), urgent (24-48h), emergency (immediate)

Be culturally sensitive, use standardized medical terminology, and ensure translations are accurate and appropriate for both patient understanding and clinical use.`;

    const gptRequest = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Patient language: ${patientLanguage}, Doctor language: ${doctorLanguage}, Region: ${region}\n\nSymptom description: ${text}` }
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
    let medicalResponse: StandardizedMedicalResponse;
    try {
      medicalResponse = JSON.parse(content);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Failed to parse medical response' },
        { status: 500 }
      );
    }

    // Add IDs to symptoms with safety checks
    medicalResponse.symptoms = (medicalResponse.symptoms || []).map((symptom, index) => ({
      ...symptom,
      id: symptom.id || `symptom_${index}_${Date.now()}`
    }));

    return NextResponse.json(medicalResponse);

  } catch (error) {
    console.error('Multi-language analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}