"use client";

import { useState, useTransition } from "react";
import { updateTaskStatus, deleteTask } from "@/app/actions";

export default function TasksList({ tasks, showNotes }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusToggle = (taskId, currentStatus) => {
    startTransition(async () => {
      try {
        await updateTaskStatus(taskId, currentStatus);
      } catch (err) {
        console.error("Failed to update task:", err);
      }
    });
  };

  const handleDelete = (taskId) => {
    if (confirm("Delete this task?")) {
      startTransition(async () => {
        try {
          await deleteTask(taskId);
        } catch (err) {
          console.error("Failed to delete task:", err);
        }
      });
    }
  };

  const getCheckboxIcon = (status) => {
    if (status === "done") return "✓";
    if (status === "in_progress") return "◐";
    return "";
  };

  const getStatusStyles = (status) => {
    if (status === "done") {
      return "text-gray-400 line-through";
    }
    if (status === "in_progress") {
      return "text-blue-600 font-medium";
    }
    return "text-gray-900";
  };

  const getCheckboxStyles = (status) => {
    if (status === "done") {
      return "bg-green-500 border-green-500 text-white";
    }
    if (status === "in_progress") {
      return "bg-blue-500 border-blue-500 text-white";
    }
    return "bg-white border-gray-300";
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p className="text-base">No items yet</p>
        <p className="text-xs mt-2">Add one below to get started!</p>
        <p className="text-xs mt-4 text-gray-300">💡 Tap checkbox to change status</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {tasks.map((task) => (
        <div
          key={task.id}
          className="p-4 hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-start gap-3">
            {/* Checkbox */}
            <button
              onClick={() => handleStatusToggle(task.id, task.status)}
              disabled={isPending}
              className={`
                flex-shrink-0 w-7 h-7 rounded border-2 flex items-center justify-center
                transition-all text-lg font-bold
                ${getCheckboxStyles(task.status)}
                ${isPending ? "opacity-50" : "hover:scale-110"}
              `}
              style={{ minWidth: "28px", minHeight: "28px" }}
            >
              {getCheckboxIcon(task.status)}
            </button>

            {/* Task content */}
            <div className="flex-1 min-w-0">
              <p className={`text-base ${getStatusStyles(task.status)}`}>
                {task.title}
              </p>

              {/* Show notes if toggle is on and notes exist */}
              {showNotes && task.notes && (
                <p className="text-xs text-gray-600 mt-1 pl-1">
                  📝 {task.notes}
                </p>
              )}

              {/* Show who completed it */}
              {task.status === "done" && task.completed_by_email && (
                <p className="text-xs text-gray-400 mt-1">
                  ✓ by {task.completed_by_email.split("@")[0]}
                </p>
              )}
            </div>

            {/* Delete button */}
            <button
              onClick={() => handleDelete(task.id)}
              disabled={isPending}
              className="flex-shrink-0 text-gray-400 hover:text-red-500 text-xl px-2"
              style={{ minWidth: "44px", minHeight: "44px" }}
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

