"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

type Mission = {
  id: number;
  status: string;
  missions: {
    title: string;
    description: string;
    reward_points: number;
    reward_coins: number;
  } | null;
};

export default function ScoutMissionsPage() {
  const [missions, setMissions] = useState<Mission[]>([]);

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
      else setMissions(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (data || []).map((item: any) => ({
          id: item.id,
          status: item.status,
          missions: item.missions
            ? {
                title: item.missions.title,
                description: item.missions.description,
                reward_points: item.missions.reward_points,
                reward_coins: item.missions.reward_coins,
              }
            : null,
        }))
      );
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
          setMissions((prev) => [
            ...prev,
            {
              id: payload.new.id,
              status: payload.new.status,
              missions: payload.new.missions ?? null,
            } as Mission,
          ]);
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
