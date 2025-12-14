import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import AuthPanel from "@/components/auth-panel";
import TaskForm from "@/components/task-form";
import TasksList from "@/components/tasks-list";

export default async function HomePage({ searchParams }) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <AuthPanel />
      </main>
    );
  }

  // Get category from URL or default to 'home'
  const params = await searchParams;
  const category = params?.category || "home";
  const showNotes = params?.showNotes === "true";

  // Fetch tasks for the selected category
  const { data: tasks } = await supabase
    .from("tasks")
    .select("*")
    .eq("category", category)
    .order("position", { ascending: true });

  const categoryLabel = category === "home" ? "Home Tasks" : "Grocery Lists";

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">HoneyDo List</h1>
            <AuthPanel />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-3">
            <Link
              href="/?category=home"
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium text-center transition-colors
                ${
                  category === "home"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              🏠 Home Tasks
            </Link>
            <Link
              href="/?category=grocery"
              className={`
                flex-1 py-3 px-4 rounded-lg font-medium text-center transition-colors
                ${
                  category === "grocery"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              🛒 Grocery Lists
            </Link>
          </div>

          {/* Show Notes Toggle */}
          <div className="flex justify-center">
            <Link
              href={`/?category=${category}&showNotes=${!showNotes}`}
              className="text-sm text-gray-600 hover:text-gray-900 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {showNotes ? "👁️ Hide Notes" : "👁️ Show Notes"}
            </Link>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 bg-white overflow-y-auto">
        <TasksList tasks={tasks || []} showNotes={showNotes} />
      </div>

      {/* Task Form - Fixed at bottom */}
      <div className="sticky bottom-0">
        <TaskForm category={category} />
      </div>
    </main>
  );
}
