"use client";

import { useState, useRef, useTransition } from "react";
import { updateTask, updateTaskStatus, deleteTask } from "@/app/actions";

export default function EditableTask({ task, showNotes }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [notes, setNotes] = useState(task.notes || "");
  const [isPending, startTransition] = useTransition();
  const titleInputRef = useRef(null);

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
    if (title.trim() && title !== task.title || notes !== (task.notes || "")) {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("notes", notes);
      
      startTransition(async () => {
        await updateTask(task.id, formData);
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const handleClick = () => {
    setIsEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleDelete = () => {
    startTransition(async () => {
      await deleteTask(task.id);
    });
  };

  return (
    <div className="py-1 px-3 hover:bg-gray-50 transition-colors border-b border-gray-50" data-task-editable>
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
          {isEditing ? (
            <div>
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full text-sm border-none outline-none bg-transparent text-gray-900 py-0.5"
              />
              {showNotes && (
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleSave}
                  onKeyDown={handleKeyDown}
                  placeholder="Add note..."
                  className="w-full text-xs border-none outline-none bg-transparent text-gray-500 placeholder-gray-300 py-0.5"
                />
              )}
            </div>
          ) : (
            <div onClick={handleClick} className="cursor-text">
              <p className={`text-sm ${getStatusStyles(task.status)}`}>
                {task.title}
              </p>
              {showNotes && task.notes && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {task.notes}
                </p>
              )}
              {task.status === "done" && task.completed_by_email && (
                <p className="text-xs text-gray-400 mt-0.5">
                  ✓ by {task.completed_by_email.split("@")[0]}
                </p>
              )}
            </div>
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

