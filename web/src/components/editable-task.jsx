"use client";

import { useState, useRef, useTransition } from "react";
import { updateTask, updateTaskStatus, deleteTask } from "@/app/actions";

export default function EditableTask({ task, showNotes }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [isPending, startTransition] = useTransition();
  const titleInputRef = useRef(null);
  const notesInputRef = useRef(null);

  const isEditing = isEditingTitle || isEditingNotes;

  const getCheckboxIcon = (status) => {
    if (status === "done") return "✓";
    if (status === "in_progress") return "◐";
    return "";
  };

  const getStatusStyles = (status) => {
    if (status === "done") return "text-gray-400 line-through";
    if (status === "in_progress") return "text-blue-600 font-medium";
    return "text-gray-900";
  };

  const getCheckboxStyles = (status) => {
    if (status === "done") return "bg-green-500 border-green-500 text-white";
    if (status === "in_progress") return "bg-blue-500 border-blue-500 text-white";
    return "bg-white border-gray-300";
  };

  const handleStatusToggle = () => {
    startTransition(async () => {
      await updateTaskStatus(task.id, task.status);
    });
  };

  const handleSave = () => {
    setIsEditingTitle(false);
    setIsEditingNotes(false);

    if (!title.trim()) {
      setTitle(task.title);
      setNotes(task.notes || "");
      return;
    }

    if (title !== task.title || notes !== (task.notes || "")) {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("notes", notes);
      
      startTransition(async () => {
        await updateTask(task.id, formData);
      });
    }
  };

  const handleTitleClick = (e) => {
    e.stopPropagation();
    setIsEditingTitle(true);
    setIsEditingNotes(false);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleNotesClick = (e) => {
    e.stopPropagation();
    setIsEditingTitle(false);
    setIsEditingNotes(true);
    setTimeout(() => notesInputRef.current?.focus(), 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      setTitle(task.title);
      setNotes(task.notes || "");
      setIsEditingTitle(false);
      setIsEditingNotes(false);
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask(task.id);
    });
  };

  return (
    <div className="py-1 px-3 hover:bg-gray-50 transition-colors border-b border-gray-50">
      <div className="flex items-center gap-2">
        {/* Checkbox */}
        <button
          onClick={handleStatusToggle}
          disabled={isPending}
          className={`
            flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center
            transition-all text-xs font-bold
            ${getCheckboxStyles(task.status)}
            ${isPending ? "opacity-50" : "hover:scale-110"}
          `}
          style={{ minWidth: "16px", minHeight: "16px" }}
        >
          {getCheckboxIcon(task.status)}
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-full text-sm border-none outline-none bg-transparent text-gray-900 py-0.5"
            />
          ) : (
            <p 
              onClick={handleTitleClick}
              className={`text-sm cursor-text ${getStatusStyles(task.status)}`}
            >
              {task.title}
            </p>
          )}

          {/* Notes */}
          {showNotes && (
            isEditingNotes ? (
              <input
                ref={notesInputRef}
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder="Add note..."
                className="w-full text-xs border-none outline-none bg-transparent text-gray-500 placeholder-gray-300 py-0.5"
              />
            ) : (
              <p 
                onClick={handleNotesClick}
                className="text-xs text-blue-500 mt-0.5 cursor-pointer hover:text-blue-600"
              >
                {task.notes || "(click to add note)"}
              </p>
            )
          )}

          {/* Completion info */}
          {task.status === "done" && task.completed_by_email && !isEditing && (
            <p className="text-xs text-gray-400 mt-0.5">
              ✓ by {task.completed_by_email.split("@")[0]}
            </p>
          )}
        </div>

        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex-shrink-0 text-gray-300 hover:text-red-400 text-lg px-1"
        >
          ×
        </button>
      </div>
    </div>
  );
}
