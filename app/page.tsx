'use client';
import { useEffect, useState } from 'react';
import NoteEditor from './components/NoteEditor';
import useDebounce from './hooks/useDebounce';
import { Note } from './types/interface';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const useDebouncedSearch = useDebounce(search, 500);
  const [editing, setEditing] = useState<Note | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchNotes(search);
  }, [search]);

  const fetchNotes = async (q = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes${q ? `?q=${encodeURIComponent(q)}` : ''}`);
      setNotes(await res.json());
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (isClient) fetchNotes(useDebouncedSearch);
  }, [useDebouncedSearch, isClient]);

  const handleSave = async (data: Omit<Note, '_id'>) => {
    try {
      if (editing) {
        await fetch(`/api/notes/${editing._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      setEditing(null);
      fetchNotes(search);
    } catch (error) {
      console.error('Operation failed:', error);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, {
      method: 'DELETE'
    });
    fetchNotes(search);
  }

  return (
    <main className="max-w-4xl p-4 mx-auto">
      <h1 className="mb-8 text-3xl font-bold">Smart Notes</h1>
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search notes..."
        className="input mb-4 w-full"
      />
      {isClient && (
        editing ? (
          <NoteEditor note={editing} onSave={handleSave} />
        ) : (
          <NoteEditor onSave={handleSave} />
        )
      )}

      {isClient && (
        <ul className="mt-8 space-y-2">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <svg
                className="animate-spin h-12 w-12 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : notes && notes.length > 0 ? (
            notes.map(note => (
              <li key={note._id} className="p-4 border rounded">
                <div className="flex justify-between">
                  <div>
                    <strong>{note.title}</strong> - <span className="text-xs text-gray-500">[{note.category}]</span>
                    <p>{note.content}</p>
                  </div>
                  <div className="space-x-2">
                    <button onClick={() => setEditing(note)} className="btn-sm">Edit</button>
                    <button onClick={() => handleDelete(note._id)} className="btn-sm text-red-500">Delete</button>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="p-4 border rounded">No notes found.</li>
          )}
        </ul>
      )}
    </main>
  );
}