"use client";

import { useState, useTransition } from "react";
import { createNote } from "@/app/actions";

export default function NoteForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);

    startTransition(async () => {
      try {
        await createNote(formData);
        e.target.reset();
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
    >
      <label
        htmlFor="content"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        Create a New Note
      </label>

      <textarea
        id="content"
        name="content"
        required
        disabled={isPending}
        rows={3}
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 resize-none"
        placeholder="Enter your note here..."
      />

      {error && (
        <div className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="mt-3 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Creating..." : "Create Note"}
      </button>
    </form>
  );
}

