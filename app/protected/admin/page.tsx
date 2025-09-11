import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserAdminList } from "@/components/user-admin-list";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProtectedPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const role = data?.claims?.app_metadata?.role;
  if (error || !data?.claims || role !== "chef") {
    redirect("/");
  }

  // Récupérer tous les utilisateurs via la Service Role Key
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: usersData, error: usersError } =
    await supabaseAdmin.auth.admin.listUsers();
  const users = usersData?.users || [];

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-center">
            {" "}
            Dashboard Admin
          </CardTitle>
          <CardDescription className="text-center">
            Ici vous pouvez gérer les scout et leurs missions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <Button className="w-full mb-4">
              <Link href="/protected/admin/mission">Créer une mission</Link>
            </Button>
          </div>
          <div>
            <UserAdminList users={users} />
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Link href="/protected">Retour</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
