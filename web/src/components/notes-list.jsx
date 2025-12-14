"use client";

import { useTransition } from "react";
import { deleteNote } from "@/app/actions";

export default function NotesList({ notes }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (noteId) => {
    if (!confirm("Delete this note?")) return;

    startTransition(async () => {
      await deleteNote(noteId);
    });
  };

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          No notes yet. Create your first note above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => (
        <div
          key={note.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700 flex items-start justify-between gap-4"
        >
          <div className="flex-1">
            <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {note.content}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => handleDelete(note.id)}
            disabled={isPending}
            className="rounded-md border border-red-300 dark:border-red-700 px-3 py-1 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

