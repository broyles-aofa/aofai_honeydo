"use client";

import { useState, useTransition } from "react";
import { createTask } from "@/app/actions";

export default function TaskForm({ category }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.target);
    formData.set("category", category);

    startTransition(async () => {
      try {
        await createTask(formData);
        e.target.reset();
        setShowNotes(false);
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-t border-gray-200 p-4">
      <div className="space-y-3">
        <input
          type="text"
          name="title"
          required
          disabled={isPending}
          placeholder="Type new task..."
          className="w-full text-lg px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showNotes && (
          <textarea
            name="notes"
            disabled={isPending}
            placeholder="Add notes (optional)..."
            rows={2}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowNotes(!showNotes)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            {showNotes ? "Hide Notes" : "+ Add Notes"}
          </button>
          
          <button
            type="submit"
            disabled={isPending}
            className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isPending ? "Adding..." : "Add Task"}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    </form>
  );
}

