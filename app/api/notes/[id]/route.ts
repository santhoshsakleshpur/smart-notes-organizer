import { connectDB } from "@/lib/mongodb";
import Note from "@/models/Note";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { title, content, category } = await req.json();
  const { id } = await context.params;
  const note = await Note.findByIdAndUpdate(id, { title, content, category }, { new: true });
  return NextResponse.json(note);
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await context.params;
  await Note.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}