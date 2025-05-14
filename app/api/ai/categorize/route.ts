import { NextResponse } from "next/server";

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3', 10);

export async function POST(req: Request, { retryCount = 0 }: { retryCount?: number } = {}) {
  const { text } = await req.json();

  try {
    const response = await fetch('https://api-inference.huggingface.co/models/facebook/bart-large-mnli', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          candidate_labels: ['Work', 'Personal', 'Ideas'],
        }
      }),
    });

    const responseText = await response.text();

    // Handle model loading scenario
    if (responseText.includes('is currently loading')) {
      if (retryCount >= MAX_RETRIES) {
        return NextResponse.json({ error: 'Model is still loading after several retries.' }, { status: 503 });
      }
      const match = responseText.match(/"estimated_time":\s*(\d+)/);
      const waitTime = match ? parseInt(match[1]) * 1000 : 10000;
      await new Promise(resolve => setTimeout(resolve, waitTime));
      // Recursively retry, incrementing the retryCount
      return POST(req, { retryCount: retryCount + 1 });
    }

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Hugging Face response:', responseText);
      return NextResponse.json({ error: 'Invalid response from Hugging Face API.' }, { status: 502 });
    }

    if (!response.ok) {
      return NextResponse.json({ error: data.error || 'AI service error' }, { status: response.status });
    }

    if (!data.labels || !Array.isArray(data.labels) || data.labels.length === 0) {
      return NextResponse.json({ error: 'No category returned.' }, { status: 500 });
    }

    return NextResponse.json({ category: data.labels[0] });
  } catch (error) {
    console.error('Categorization failed:', error);
    return NextResponse.json({ error: 'Failed to categorize note' }, { status: 500 });
  }
}
