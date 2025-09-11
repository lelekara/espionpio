"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Users, Coins, FileCheck, Pen, Star } from "lucide-react";
const supabase = createClient();

export default function NewMissionPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [rewardCoins, setRewardCoins] = useState(0);
  const [scouts, setScouts] = useState<any[]>([]);
  const [selectedScouts, setSelectedScouts] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isChef, setIsChef] = useState<boolean | null>(null);

  // Vérifier le rôle de l'utilisateur connecté
  useEffect(() => {
    const checkRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      // Si le rôle est dans app_metadata
      if (user?.app_metadata?.role === "chef") {
        setIsChef(true);
      } else {
        setIsChef(false);
      }
    };
    checkRole();
  }, []);

  // Charger les scouts depuis la table profiles
  useEffect(() => {
    const fetchScouts = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, display_name")

      if (error) console.error(error);
      else {
        setScouts(data || []);
      }
    };

    fetchScouts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Créer la mission
      const { data: mission, error: missionError } = await supabase
        .from("missions")
        .insert({
          title,
          description,
          reward_points: rewardPoints,
          reward_coins: rewardCoins,
        })
        .select()
        .single();

      if (missionError) throw missionError;

      // 2. Assigner aux scouts
      const assignments = selectedScouts.map((scoutId) => ({
        user_id: scoutId,
        mission_id: mission.id,
      }));

      const { error: assignError } = await supabase
        .from("user_missions")
        .insert(assignments);

      if (assignError) throw assignError;

      alert("Mission créée et assignée !");
      setTitle("");
      setDescription("");
      setRewardPoints(0);
      setRewardCoins(0);
      setSelectedScouts([]);
    } catch (err) {
      console.error("Erreur :", err);
      alert("Impossible de créer la mission");
    } finally {
      setLoading(false);
    }
  };

  if (isChef === null) {
    return <div>Chargement...</div>;
  }
  if (!isChef) {
    return <div className="text-red-600 font-bold">Accès réservé aux chefs.</div>;
  }

  console.log(scouts);

  return (
    <div className="max-w-xl mx-auto py-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <FileCheck className="text-yellow-500" size={28} />
            <h1 className="text-2xl font-bold">Créer une mission</h1>
            <Badge variant="secondary" className="ml-auto">Admin</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mt-4">
              <label className="font-semibold flex items-center gap-2 mb-1">
                <Pen className="text-yellow-500" size={18} /> Titre
              </label>
              <Input
                type="text"
                placeholder="Titre de la mission"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="mt-4">
              <label className="font-semibold mb-1">Description</label>
              <Textarea
                placeholder="Décris la mission..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>
            <div className="flex gap-4 mt-4">
              <div className="flex-1">
                <label className="font-semibold flex items-center gap-2 mb-1">
                  <Coins className="text-amber-600" size={18} /> Pièces
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={rewardCoins}
                  onChange={(e) => setRewardCoins(Number(e.target.value))}
                  min={0}
                />
              </div>
              <div className="flex-1 ">
                <label className="font-semibold flex items-center gap-2 mb-1">
                  <Star className="text-blue-600" size={18} /> Points
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={rewardPoints}
                  onChange={(e) => setRewardPoints(Number(e.target.value))}
                  min={0}
                />
              </div>
            </div>
            <div className="mt-4">
              <h2 className="font-semibold mb-2 flex items-center gap-2">
                <Users className="text-green-600" size={18} /> Assigner aux scouts
              </h2>
              <div className="space-y-2">
                {scouts.map((scout) => (
                  <label key={scout.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedScouts.includes(scout.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedScouts([...selectedScouts, scout.id]);
                        } else {
                          setSelectedScouts(selectedScouts.filter((id) => id !== scout.id));
                        }
                      }}
                    />
                    <span className="font-medium">{scout.display_name}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 mt-4">
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Création..." : "Créer la mission"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
