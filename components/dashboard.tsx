import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import AdminButton from "./admin-button";
import ScoutMissionsPage from "./client-mission";

export async function Dashboard() {

      const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        const user = data?.user;



    return (
        <div className="p-8 bg-muted rounded-lg shadow-lg w-full">
            <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl">Informations sur l'agent : </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul>
                            <li className="text-xl font-bold">email : {user?.email} </li>
                            <li className="text-xl font-bold">totem : {user?.user_metadata?.display_name} </li>
                            <li className="text-xl font-bold">rôle : {user?.app_metadata?.role} </li>
                        </ul>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl">mission <ArrowRight /></CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold"><ScoutMissionsPage /></div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>compétences</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">18</div>
                    </CardContent>
                </Card>
            </div>
            <div className="mt-8 flex gap-4">
                <Button><Link href="/protected/shop">Boutique</Link></Button>
                {user?.app_metadata?.role === "chef" &&
                <AdminButton />
                }
            </div>
        </div>
    );
}