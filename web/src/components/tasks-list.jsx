"use client";

import EditableTask from "./editable-task";

export default function TasksList({ tasks, showNotes }) {
  if (tasks.length === 0) {
    return null; // Don't show empty state, just let user start typing
  }

  return (
    <div>
      {tasks.map((task) => (
        <EditableTask key={task.id} task={task} showNotes={showNotes} />
      ))}
    </div>
  );
}
