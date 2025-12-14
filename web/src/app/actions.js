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

export async function createNote(formData) {
  const { supabase, user } = await getUserOrThrow();

  const content = formData.get("content")?.toString().trim();

  if (!content) {
    throw new Error("Note content is required");
  }

  const { error } = await supabase.from("notes").insert({
    content,
    user_id: user.id,
  });

  if (error) {
    throw error;
  }

  revalidatePath("/");
}

export async function deleteNote(noteId) {
  const { supabase, user } = await getUserOrThrow();

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", noteId)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/");
}

