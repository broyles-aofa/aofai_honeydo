import { createServerSupabaseClient } from "@/lib/supabase/server";
import AuthPanel from "@/components/auth-panel";
import NotesList from "@/components/notes-list";
import NoteForm from "@/components/note-form";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="container mx-auto max-w-2xl px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🏗️ AOFA Template
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Hello World app to verify your stack works!
          </p>
        </div>
        <AuthPanel />
      </main>
    );
  }

  // Get user's notes
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            📝 Notes
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Signed in as {user.email}
          </p>
        </div>
        <AuthPanel />
      </div>

      <div className="mb-8">
        <NoteForm />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Notes
        </h2>
        <NotesList notes={notes || []} />
      </div>

      <div className="mt-12 p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
          ✅ Your Stack is Working!
        </h3>
        <ul className="space-y-1 text-sm text-green-800 dark:text-green-200">
          <li>✓ Next.js rendering pages</li>
          <li>✓ Supabase authentication active</li>
          <li>✓ Database connected and working</li>
          <li>✓ Row Level Security protecting data</li>
          <li>✓ Server Actions handling mutations</li>
          <li>✓ Ready to build your app!</li>
        </ul>
        <p className="mt-4 text-sm text-green-700 dark:text-green-300">
          <strong>Next Step:</strong> Open in Cursor and say &quot;I want to build [your app idea]&quot;
        </p>
      </div>
    </main>
  );
}

