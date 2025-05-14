import { connectDB } from '@/lib/mongodb';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const filter = q
    ? {
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } }
      ]
    }
    : {};
  const notes = await Note.find(filter).sort('-createdAt');
  return NextResponse.json(notes);
}

export async function POST(req: Request) {
  await connectDB();
  const { title, content, category } = await req.json();
  const note = new Note({ title, content, category });
  await note.save();
  return NextResponse.json(note);
}


