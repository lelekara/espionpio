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
  const { data: usersData } =
    await supabaseAdmin.auth.admin.listUsers();
  // Map users to the expected shape if necessary
  const users =
    usersData?.users?.map((user) => ({
      ...user,
      app_metadata: {
        role: user.app_metadata?.role,
      },
    })) || [];

  return (
    <div className="container mx-auto px-2 py-4 max-w-7xl">
      <Card className="w-full shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Dashboard Admin</CardTitle>
          <CardDescription className="text-center text-base">Gérez les scouts et leurs missions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Button className="w-full">
              <Link href="/protected/admin/mission">Créer une mission</Link>
            </Button>
              <Button variant="default" className="w-full">
              <Link href="/protected/admin/shop">modifer la boutique</Link>
            </Button>
          </div>
          <div>
             <Button variant="outline" className="w-full">
              <Link href="/protected">Retour</Link>
            </Button>
          </div>
          <div className="mt-4">
            <UserAdminList users={users} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
