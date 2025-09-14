import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { AuthButtonClient } from "./authButtonClient";

export async function AuthButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data?.user;


  return user ? (
    <div className="flex items-center gap-2">
      <AuthButtonClient>{null}</AuthButtonClient>
      <LogoutButton />
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/auth/login">Connexion</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/auth/sign-up">Inscription</Link>
      </Button>
    </div>
  );
}
