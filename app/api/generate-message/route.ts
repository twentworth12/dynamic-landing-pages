import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { UTMParams } from '@/lib/utm';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache
const cache = new Map<string, { message: string; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

function getCacheKey(utmParams: UTMParams): string {
  return JSON.stringify(utmParams);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const utmParams: UTMParams = body.utmParams;

    if (!utmParams || Object.keys(utmParams).length === 0) {
      return NextResponse.json(
        { error: 'No UTM parameters provided' },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = getCacheKey(utmParams);
    const cached = cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log('Cache hit for:', cacheKey);
      return NextResponse.json({ message: cached.message, cached: true });
    }

    const prompt = generatePrompt(utmParams);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert copywriter for incident.io. You write clear, compelling landing page copy that connects visitor intent to business value. You understand incident management, SRE practices, and how to speak to technical audiences.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 200,
    });

    const generatedMessage = completion.choices[0]?.message?.content || 'Welcome!';

    // Store in cache
    cache.set(cacheKey, {
      message: generatedMessage,
      timestamp: Date.now()
    });

    return NextResponse.json({ message: generatedMessage, cached: false });
  } catch (error) {
    console.error('Error generating message:', error);
    return NextResponse.json(
      { error: 'Failed to generate personalized message' },
      { status: 500 }
    );
  }
}

function generatePrompt(utmParams: UTMParams): string {
  const parts: string[] = [];

  if (utmParams.utm_source) {
    parts.push(`- Traffic source: ${utmParams.utm_source}`);
  }
  if (utmParams.utm_medium) {
    parts.push(`- Marketing medium: ${utmParams.utm_medium}`);
  }
  if (utmParams.utm_campaign) {
    parts.push(`- Campaign name: ${utmParams.utm_campaign}`);
  }
  if (utmParams.utm_term) {
    parts.push(`- Search term/keyword: ${utmParams.utm_term}`);
  }
  if (utmParams.utm_content) {
    parts.push(`- Ad content/variant: ${utmParams.utm_content}`);
  }

  return `You are writing landing page copy for incident.io, an end-to-end incident management platform that helps tech-led businesses navigate incidents with clarity, speed, and confidence.

COMPANY CONTEXT:
incident.io provides a complete platform including:
- On-call tool (alerts, schedules, notifications)
- Incident Response (Slack/Teams integration, workflows, automations)
- AI SRE (intelligent incident assistance that surfaces context and suggests actions)
- Status Pages (public, private, internal updates)
- Post-incident learnings (dashboards, trends, auto-generated post-mortems)
- Scribe (AI-powered meeting transcription)
- Catalog (organization-wide context and queryability)

Trusted by 150+ companies including Netflix, Etsy, Vercel, Intercom, Okta, Airbnb, and Zendesk.

VISITOR CONTEXT:
This visitor arrived via these campaign parameters:
${parts.join('\n')}

TASK:
Create a compelling, personalized landing page message with:
1. A headline (8-12 words) that speaks directly to their search intent/pain point
2. A brief description (2-3 sentences) that connects their need to incident.io's value

TONE: Professional but conversational. Confident and helpful. Focus on outcomes (efficiency, resilience, speed) not features.

FORMAT:
Headline: [your headline]
Description: [your description]`;
}
