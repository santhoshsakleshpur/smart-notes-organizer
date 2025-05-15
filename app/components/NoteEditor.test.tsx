import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import NoteEditor from './NoteEditor';
import userEvent from '@testing-library/user-event';

const mockOnSave = jest.fn(() => Promise.resolve());
const mockNote = {
  title: 'Test Title',
  content: 'Test content',
  category: 'Personal',
  _id: '123'
};

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('NoteEditor', () => {
  it('populates form with existing note data after mount', async () => {
    render(<NoteEditor note={mockNote} onSave={mockOnSave} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Title')).toHaveValue(mockNote.title);
      expect(screen.getByPlaceholderText('Content')).toHaveValue(mockNote.content);
      expect(screen.getByDisplayValue(mockNote.category)).toBeInTheDocument();
    });
  });

  it('submits form with correct data and resets fields', async () => {
    const user = userEvent.setup();
    render(<NoteEditor onSave={mockOnSave} />);

    await user.type(screen.getByPlaceholderText('Title'), 'New Title');
    await user.type(screen.getByPlaceholderText('Content'), 'New content');
    await user.click(screen.getByRole('button', { name: /Add Note/i }));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        title: 'New Title',
        content: 'New content',
        category: 'Work'
      });
      expect(screen.getByPlaceholderText('Title')).toHaveValue('');
      expect(screen.getByPlaceholderText('Content')).toHaveValue('');
    });
  });

  it('triggers content analysis when content meets minimum length', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => ({ category: 'Ideas' })
    });

    render(<NoteEditor onSave={mockOnSave} />);

    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'This content has enough words to trigger analysis' }
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      expect(screen.getByDisplayValue('Ideas')).toBeInTheDocument();
    });
  });

  it('shows analyzing state during API call', async () => {
    mockFetch.mockImplementationOnce(() =>
      new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: () => ({ category: 'Work' })
      }), 100))
    );

    render(<NoteEditor onSave={mockOnSave} />);

    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Content with enough words' }
    });

    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByText('Analyzing...')).not.toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500
    });
    console.error = jest.fn();

    render(<NoteEditor onSave={mockOnSave} />);

    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'Content that causes error' }
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(screen.queryByText('Analyzing...')).not.toBeInTheDocument();
    });
  });

  it('does not trigger analysis for short content', () => {
    render(<NoteEditor onSave={mockOnSave} />);

    fireEvent.change(screen.getByPlaceholderText('Content'), {
      target: { value: 'short' }
    });

    expect(mockFetch).not.toHaveBeenCalled();
  });
});
