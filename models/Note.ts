import { Schema, model, models } from 'mongoose';

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Work', 'Personal', 'Ideas'] },
  sentiment: { type: String, enum: ['Positive', 'Neutral', 'Negative'] },
  summary: String
}, { timestamps: true });

const Note = models.Note || model('Note', NoteSchema);

export default Note;
