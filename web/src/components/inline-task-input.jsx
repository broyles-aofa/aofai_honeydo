"use client";

import { useState, useTransition, useRef } from "react";
import { createTask } from "@/app/actions";

export default function InlineTaskInput({ category }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");
  const [showNotesInput, setShowNotesInput] = useState(false);
  const [notes, setNotes] = useState("");
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;

    setError(null);

    const formData = new FormData();
    formData.set("title", value);
    formData.set("notes", notes);
    formData.set("category", category);

    startTransition(async () => {
      try {
        await createTask(formData);
        setValue("");
        setNotes("");
        setShowNotesInput(false);
        inputRef.current?.focus();
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="border-t border-gray-100">
      <form onSubmit={handleSubmit} className="py-2 px-3">
        <div className="flex items-start gap-2">
          {/* Empty checkbox placeholder */}
          <div className="w-5 h-5 rounded border-2 border-gray-200 flex-shrink-0 mt-0.5" />

          {/* Input */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPending}
              placeholder="Type here..."
              className="w-full text-sm border-none outline-none bg-transparent text-gray-900 placeholder-gray-400"
              autoFocus
            />

            {/* Notes input (if toggled) */}
            {showNotesInput && (
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isPending}
                placeholder="Add note..."
                className="w-full text-xs border-none outline-none bg-transparent text-gray-500 placeholder-gray-300 mt-1"
              />
            )}

            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* Notes toggle icon */}
          <button
            type="button"
            onClick={() => setShowNotesInput(!showNotesInput)}
            className="text-xs text-gray-300 hover:text-gray-500 px-1"
            title="Add note"
          >
            {showNotesInput ? "📝" : "📝"}
          </button>
        </div>
      </form>
    </div>
  );
}

