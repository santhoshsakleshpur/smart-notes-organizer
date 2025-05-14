import { InferenceClient } from '@huggingface/inference';
import { NextResponse } from 'next/server';

const hf = new InferenceClient(process.env.HF_TOKEN);

export async function POST(req: Request) {
  const { text, task } = await req.json();

  try {
    let result;
    switch (task) {
      case 'categorize':
        result = await hf.textClassification({
          model: 'facebook/bart-large-mnli',
          inputs: text,
          parameters: { candidate_labels: ['Work', 'Personal', 'Ideas'] }
        });
        break;
      case 'sentiment':
        result = await hf.textClassification({
          model: 'distilbert-base-uncased-finetuned-sst-2-english',
          inputs: text
        });
    }
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'AI processing failed' }, { status: 500 });
  }
}
