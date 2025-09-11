"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

export function UserAdminList({ users }: { users: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePromote(userId: string, role: string) {
    setLoading(userId);
    setError(null);
    const res = await fetch("/api/admin/promote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role })
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur inconnue");
    }
    setLoading(null);
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user.id} className="border p-4 rounded">
          <div><b>Email:</b> {user.email}</div>
          <div><b>Totem:</b> {user.user_metadata?.display_name || "-"}</div>
          <div><b>Rôle:</b> {user.app_metadata?.role || "-"}</div>
          <div className="mt-2">
            <Button className="w-full"><Link href={`admin/profiles/${user.id}`}>Voir le profil</Link></Button></div>
          {error && loading === user.id && (
            <div className="text-red-500 mt-2">{error}
            </div>
          )}
           <div className="flex gap-2 mt-2">
            <Button className="w-full" onClick={() => handlePromote(user.id, "scout")}>rôle Scout</Button>
            <Button className="w-full" onClick={() => handlePromote(user.id, "chef")}>rôle Chef</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
