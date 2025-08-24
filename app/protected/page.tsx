import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Dashboard } from "@/components/dashboard";


export default async function ProtectedPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <div className="w-full">
      <Dashboard />
      </div>
      <div className="flex flex-col gap-2 items-start">
      </div>
      <div>
        
      </div>
    </div>
  );
}
