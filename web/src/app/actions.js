"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

async function getUserOrThrow() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return { supabase, user };
}

// Create a new task
export async function createTask(formData) {
  const { supabase, user } = await getUserOrThrow();

  const title = formData.get("title")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim();
  const category = formData.get("category")?.toString() || "home";

  if (!title) {
    throw new Error("Title is required");
  }

  // Get the current max position for this category
  const { data: maxPositionData } = await supabase
    .from("tasks")
    .select("position")
    .eq("category", category)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = (maxPositionData?.[0]?.position ?? -1) + 1;

  const { error } = await supabase.from("tasks").insert({
    title,
    notes: notes || null,
    category,
    created_by: user.id,
    position: nextPosition,
    status: "open",
  });

  if (error) {
    throw error;
  }

  revalidatePath("/");
}

// Update task status (cycle through: open -> in_progress -> done)
export async function updateTaskStatus(taskId, currentStatus) {
  const { supabase, user } = await getUserOrThrow();

  const statusOrder = ["open", "in_progress", "done"];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

  const updateData = {
    status: nextStatus,
  };

  // If marking as done, record who completed it
  if (nextStatus === "done") {
    updateData.completed_by = user.id;
    updateData.completed_by_email = user.email;
    updateData.completed_at = new Date().toISOString();
  } else {
    // If unchecking from done, clear completion data
    updateData.completed_by = null;
    updateData.completed_by_email = null;
    updateData.completed_at = null;
  }

  const { error } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", taskId);

  if (error) {
    throw error;
  }

  revalidatePath("/");
}

// Delete a task
export async function deleteTask(taskId) {
  const { supabase } = await getUserOrThrow();

  const { error } = await supabase.from("tasks").delete().eq("id", taskId);

  if (error) {
    throw error;
  }

  revalidatePath("/");
}

// Update task title and notes
export async function updateTask(taskId, formData) {
  const { supabase } = await getUserOrThrow();

  const title = formData.get("title")?.toString().trim();
  const notes = formData.get("notes")?.toString().trim();

  if (!title) {
    throw new Error("Title is required");
  }

  const { error } = await supabase
    .from("tasks")
    .update({
      title,
      notes: notes || null,
    })
    .eq("id", taskId);

  if (error) {
    throw error;
  }

  revalidatePath("/");
}
