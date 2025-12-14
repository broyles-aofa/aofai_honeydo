"use client";

import { useState, useTransition, useRef } from "react";
import { createTask } from "@/app/actions";

export default function InlineTaskInput({ category, showNotes }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [value, setValue] = useState("");
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
        inputRef.current?.focus();
      } catch (err) {
        setError(err.message);
      }
    });
  };

  return (
    <div className="border-t border-gray-100">
      <form onSubmit={handleSubmit} className="py-1 px-3">
        <div className="flex items-center gap-2">
          {/* Empty checkbox placeholder */}
          <div className="w-4 h-4 rounded border-2 border-gray-200 flex-shrink-0" />

          {/* Input */}
          <div className="flex-1">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={isPending}
              placeholder="Type here..."
              className="w-full text-sm border-none outline-none bg-transparent text-gray-900 placeholder-gray-400 py-0.5"
              autoFocus
            />

            {/* Notes input (if showNotes is enabled globally) */}
            {showNotes && (
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isPending}
                placeholder="Add note..."
                className="w-full text-xs border-none outline-none bg-transparent text-gray-500 placeholder-gray-300 py-0.5"
              />
            )}

            {error && (
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

