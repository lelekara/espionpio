import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { User, BadgeCheck, Store, CircleCheckBig, Lightbulb } from "lucide-react";
import Link from "next/link";
import AdminButton from "./admin-button";
import ScoutMissionsPage from "./client-mission";

export async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  return (
    <div className="p-6 md:p-10 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl w-full max-w-7xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-10 text-primary dark:text-white text-center tracking-tight mb-4">Tableau de bord</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Infos Agent */}
        <Card className=" dark:bg-slate-900 shadow-lg border border-gray-100 dark:border-slate-700">
          <CardHeader className="flex flex-col items-center gap-2">
            <User className="w-10 h-10 text-primary dark:text-blue-400 mb-2" />
            <CardTitle className="text-2xl font-bold dark:text-white">Agent</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-400 text-center">
              Informations personnelles et rôle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="text-base dark:text-white">
                <span className="font-semibold text-primary dark:text-blue-300">Email :</span> {user?.email}
              </li>
              <li className="text-base dark:text-white">
                <span className="font-semibold text-primary dark:text-blue-300">Totem :</span> {user?.user_metadata?.display_name}
              </li>
              <li className="text-base dark:text-white">
                <span className="font-semibold text-primary dark:text-blue-300">Rôle :</span>
                <span className={`ml-2 rounded px-2 py-1 text-white ${user?.app_metadata?.role === "chef" ? "bg-green-600" : "bg-blue-600"}`}>
                  {user?.app_metadata?.role}
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
        {/* Missions */}
        <Card className=" dark:bg-slate-900 shadow-lg border border-gray-100 dark:border-slate-700">
          <CardHeader className="flex flex-col items-center gap-2">
            <CircleCheckBig className="w-10 h-10 text-primary dark:text-blue-400 mb-2" />
            <CardTitle className="text-2xl font-bold dark:text-white">Missions</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-400 text-center">
              Tes missions en cours et à venir
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold dark:text-white">
              <ScoutMissionsPage />
            </div>
          </CardContent>
        </Card>
        {/* Compétences */}
        <Card className="dark:bg-slate-900 shadow-lg border border-gray-100 dark:border-slate-700">
          <CardHeader className="flex flex-col items-center gap-2">
            <BadgeCheck className="w-10 h-10 text-primary dark:text-blue-400 mb-2" />
            <CardTitle className="text-2xl font-bold dark:text-white">Compétences</CardTitle>
            <CardDescription className="text-muted-foreground dark:text-gray-400 text-center">
              Points de compétence obtenus
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-extrabold text-center dark:text-green-400">Construction en cours...</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10 flex flex-col md:flex-row gap-4 justify-center mt-8">
        <Button size="lg" className="flex items-center gap-2 text-lg font-semibold dark:bg-slate-800 dark:text-white">
          <Store className="w-5 h-5" />
          <Link href="/protected/shop">Boutique</Link>
        </Button>
        <Button size="lg" className="flex items-center gap-2 text-lg font-semibold dark:bg-slate-800 dark:text-white">
          <Lightbulb className="w-5 h-5" />
          <Link href="/protected/ideas">idées </Link>
        </Button>
        {user?.app_metadata?.role === "chef" && (
          <AdminButton />
        )}
      </div>
    </div>
  );
}