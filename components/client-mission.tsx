"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function ScoutMissionsPage() {
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    // Charger missions déjà assignées
    const fetchMissions = async () => {
      const {
        data,
        error,
      } = await supabase
        .from("user_missions")
        .select("id, status, missions(title, description, reward_points, reward_coins)")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) console.error(error);
      else setMissions(data || []);
    };

    fetchMissions();

    // 🔔 Realtime : écouter les nouvelles missions
    const channel = supabase
      .channel("missions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_missions" },
        (payload) => {
          console.log("Nouvelle mission !", payload.new);
          setMissions((prev) => [...prev, payload.new]);
          alert("Nouvelle mission reçue !");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Mes missions</h1>
      <ul className="space-y-3">
        {missions.map((um) => (
          <li key={um.id} className="border p-3 rounded shadow">
            <h2 className="font-semibold">{um.missions?.title}</h2>
            <p>{um.missions?.description}</p>
            <p className="text-sm text-gray-500">
              🎯 {um.missions?.reward_points} points – 💰 {um.missions?.reward_coins} pièces
            </p>
            <p className="text-sm italic">Statut : {um.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
