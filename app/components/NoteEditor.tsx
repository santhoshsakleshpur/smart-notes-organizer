'use client';
import { useEffect, useState, useCallback } from 'react';
import { Note } from '../types/interface';

const MINIMUM_KEYWORD_LENGTH = parseInt(process.env.NEXT_PUBLIC_MINIMUM_KEYWORD_LENGTH || '3', 10);

interface NoteEditorProps {
  note?: Note,
  onSave: (data: Omit<Note, '_id'>) => Promise<void>
}
export default function NoteEditor({ note, onSave }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Work');
  const [isMounted, setIsMounted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setCategory(note.category || 'Work');
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ title, content, category });
    setTitle('');
    setContent('');
  };

  const analyzeContent = useCallback(async () => {
    if (!content) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/categorize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const { category } = await res.json();

      setCategory(category);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [content]);

  useEffect(() => {
    if (isMounted && content.split(' ').length > MINIMUM_KEYWORD_LENGTH) {
      analyzeContent();
    }
  }, [content, isMounted, analyzeContent]);

  if (!isMounted) return (
    <div className="space-y-4">
      <div className="w-full h-10 bg-gray-200 rounded animate-pulse"></div>
      <div className="w-full h-32 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <div className="flex gap-2">
        {isAnalyzing ? 'Analyzing...' : (
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 p-2 border rounded"
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Ideas">Ideas</option>
          </select>
        )}
      </div>
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded">
        {note ? 'Update Note' : 'Add Note'}
      </button>
    </form>
  );
}
