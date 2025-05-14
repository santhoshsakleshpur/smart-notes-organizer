'use client';
import { useEffect, useState } from 'react';
import NoteEditor from './components/NoteEditor';
import useDebounce from './hooks/useDebounce';

export default function Home() {
  const [notes, setNotes] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const useDebouncedSearch = useDebounce(search, 500);
  const [editing, setEditing] = useState<any | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchNotes(search);
  }, []);

  const fetchNotes = async (q = '') => {
    const res = await fetch(`/api/notes${q ? `?q=${encodeURIComponent(q)}` : ''}`);
    setNotes(await res.json());
  }

  useEffect(() => {
    if (isClient) fetchNotes(useDebouncedSearch);
  }, [useDebouncedSearch, isClient]);

  const handleSave = async (data: any) => {
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
          {notes && notes.length > 0 ? notes.map(note => (
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
          )) : (
            <li className="p-4 border rounded">No notes found.</li>
          )}
        </ul>
      )}
    </main>
  );
}