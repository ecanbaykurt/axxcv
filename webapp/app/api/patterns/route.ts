import { NextRequest, NextResponse } from 'next/server';
import { HealthEntry, PatternAnalysis, PatternAnalysisRequest, SymptomPattern, TrendData, CorrelationData, PredictionData } from '../../../types/health';

export async function POST(request: NextRequest) {
  try {
    const { entries, timeframe, analysisTypes }: PatternAnalysisRequest = await request.json();

    if (!entries || entries.length === 0) {
      return NextResponse.json(
        { error: 'No health entries provided for pattern analysis' },
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

    const prompt = `Analyze the following health entries for patterns, trends, and correlations within the last ${timeframe}.
    Provide a structured JSON response including:
    - A summary of overall findings.
    - Identified patterns (e.g., cyclical, trending, correlated) with description, severity (1-10), timeframe, insights, and recommendations.
    - Trends (increasing/decreasing/stable) for key symptoms with rate, timeframe, and significance.
    - Correlations between symptoms with correlation coefficient (-1 to 1), significance, timeframe, and description.
    - Predictions for future symptom occurrences based on observed patterns.

    Health Entries:
    ${entries.map(entry => `Date: ${entry.date}, Symptoms: ${entry.inputText}, AI Response: ${JSON.stringify(entry.aiResponse)}`).join('\n')}

    Return the response in the following JSON format:
    {
      "summary": "Overall summary of patterns, trends, and correlations.",
      "patterns": [
        {
          "id": "string",
          "patternType": "trending" | "cyclical" | "correlated" | "seasonal",
          "symptoms": ["string"],
          "description": "string",
          "confidence": 0-1,
          "severity": 1-10,
          "timeframe": "string",
          "insights": ["string"],
          "recommendations": ["string"]
        }
      ],
      "trends": [
        {
          "symptom": "string",
          "direction": "increasing" | "decreasing" | "stable",
          "rate": number,
          "timeframe": "string",
          "significance": "low" | "medium" | "high"
        }
      ],
      "correlations": [
        {
          "symptom1": "string",
          "symptom2": "string",
          "correlation": number,
          "significance": number,
          "timeframe": "string",
          "description": "string"
        }
      ],
      "predictions": [
        {
          "symptom": "string",
          "prediction": "likely" | "possible" | "unlikely",
          "timeframe": "string",
          "confidence": 0-1,
          "factors": ["string"]
        }
      ]
    }
    Be neutral, helpful, and always recommend consulting a healthcare professional for serious concerns.`;

    const gptRequest = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an AI assistant specialized in health data analysis.' },
        { role: 'user', content: prompt },
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
        { error: 'Failed to analyze patterns' },
        { status: response.status }
      );
    }

    const gptResponse = await response.json();
    const content = gptResponse.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No pattern analysis content received' },
        { status: 500 }
      );
    }

    const patternAnalysis: PatternAnalysis = JSON.parse(content);

    // Add IDs to patterns, trends, correlations, predictions
    patternAnalysis.patterns = (patternAnalysis.patterns || []).map((item, index) => ({
      ...item,
      id: `pattern_${index}_${Date.now()}`
    }));

    patternAnalysis.trends = (patternAnalysis.trends || []).map((item, index) => ({
      ...item,
      id: `trend_${index}_${Date.now()}`
    }));

    patternAnalysis.correlations = (patternAnalysis.correlations || []).map((item, index) => ({
      ...item,
      id: `correlation_${index}_${Date.now()}`
    }));

    patternAnalysis.predictions = (patternAnalysis.predictions || []).map((item, index) => ({
      ...item,
      id: `prediction_${index}_${Date.now()}`
    }));

    return NextResponse.json(patternAnalysis);

  } catch (error) {
    console.error('Pattern analysis error:', error);
    return NextResponse.json(
      { error: 'Internal server error during pattern analysis' },
      { status: 500 }
    );
  }
}
