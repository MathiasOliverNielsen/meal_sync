import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import HeroSection from "../components/HeroSection";
import InfoCards from "../components/InfoCards";
import Footer from "../components/Footer";

export default async function Home() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from("todos").select();

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <main className="flex-1">
        <InfoCards />
        {todos && todos.length > 0 && (
          <section className="py-12 px-4 bg-white">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Your Todos</h2>
              <ul className="space-y-2">
                {todos.map((todo: any) => (
                  <li key={todo.id} className="p-4 border rounded bg-gray-50">
                    {todo.name}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
