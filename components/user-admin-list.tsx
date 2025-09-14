"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";

type User = {
  id: string;
  email?: string;
  user_metadata?: {
    display_name?: string;
  };
  app_metadata?: {
    role?: string;
  };
};

export function UserAdminList({ users }: { users: User[] }) {
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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {users.map((user) => (
        <div key={user.id} className="border p-4 rounded shadow bg-background flex flex-col justify-between">
          <div className="mb-2">
            <div className="font-bold text-lg mb-1">{user.user_metadata?.display_name || "-"}</div>
            <div className="text-sm text-muted-foreground mb-1">{user.email}</div>
            <div className="mb-2"><span className="font-semibold">Rôle:</span> {user.app_metadata?.role || "-"}</div>
          </div>
          <Button className="w-full mb-2"><Link href={`admin/profiles/${user.id}`}>Voir le profil</Link></Button>
          {error && loading === user.id && (
            <div className="text-red-500 mt-2">{error}</div>
          )}
          <div className="flex gap-2 mt-2">
            <Button className="flex-1" onClick={() => handlePromote(user.id, "scout")}>rôle Scout</Button>
            <Button variant="destructive" className="flex-1" onClick={() => handlePromote(user.id, "chef")}>rôle Chef</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
