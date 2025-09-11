"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Car } from "lucide-react";

const ProfileScout = () => {
  const supabase = createClient();
  const params = useParams();
  const userId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [profile, setProfile] = useState<any>(null);
  const [missions, setMissions] = useState<any[]>([]);
  const [missionDetails, setMissionDetails] = useState<any>(null);

  useEffect(() => {
    if (!userId) return;
    // 1. Récupérer le profil
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
      if (!error) setProfile(data);
      else setProfile(null);
    };
    fetchProfile();

    // 2. Récupérer les missions de l'utilisateur
    const fetchMissions = async () => {
      const { data, error } = await supabase
        .from("user_missions")
        .select("*")
        .eq("user_id", userId);
      if (!error) setMissions(data || []);
      else setMissions([]);
    };
    fetchMissions();
  }, [userId]);

  // 3. Afficher les informations de mission
  const fetchMissionDetails = async (missionId: string) => {
    const { data, error } = await supabase
      .from("missions")
      .select("*")
      .eq("id", missionId)
      .single();
    if (!error) setMissionDetails(data);
    else setMissionDetails(null);
  };

  // 4. Valider la mission
  const handleMissionValidate = async (mission_id: string) => {
    const { data, error } = await supabase
      .from("user_missions")
      .update({ status: "validee" })
      .eq("id", mission_id)
      .select()
      .single();
    if (!error) {
      // Mettre à jour la liste des missions
      setMissions((prevMissions) =>
        prevMissions.map((mission) =>
          mission.id === mission_id ? { ...mission, status: "validee" } : mission
        )
      );
    } else {
      console.error("Erreur lors de la validation de la mission:", error, data, mission_id);
    }
  };
  

  return (
    <div className="flex flex-col items-center min-h-[70vh] bg-muted/40 py-10">
      <Card className="w-full max-w-md shadow-xl mb-8">
        <CardHeader className="flex flex-col items-center gap-2">
          {!profile ? (
            <Skeleton className="h-20 w-20 rounded-full" />
          ) : (
            <Avatar className="h-20 w-20">
              {profile.avatar_url ? (
                <AvatarImage src={profile.avatar_url} alt={profile.display_name || "Avatar"} />
              ) : null}
              <AvatarFallback>
                {profile?.display_name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          )}
          <h2 className="text-2xl font-bold mt-2">
            {!profile ? <Skeleton className="h-6 w-32" /> : profile.display_name || "-"}
          </h2>
          {profile?.role && (
            <Badge variant="secondary" className="mt-1">{profile.role}</Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-2">
          {!profile ? (
            <>
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
            </>
          ) : (
            <>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Email</span>
                <span className="font-medium">{profile.email || profile.username || "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Points de récompense</span>
                <span className="font-medium">{profile.points ?? profile.reward_points ?? "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Coins de récompense</span>
                <span className="font-medium">{profile.coins ?? profile.reward_coins ?? "-"}</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      <Card className="w-full max-w-md shadow-md mb-8">
        <CardHeader>
          <h3 className="text-lg font-bold">Missions de l'utilisateur</h3>
        </CardHeader>
        <CardContent>
          {missions.length > 0 ? (
            <ul className="space-y-2">
              {missions.map((mission) => (
                <li key={mission.id} className="flex items-center justify-between">
                  <span className="font-medium">Statut: {mission.status}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-2"
                    onClick={() => fetchMissionDetails(mission.mission_id)}
                  >
                    Voir les détails
                  </Button>
                  <Button
                    size="sm"
                    className="ml-2"
                    onClick={() => handleMissionValidate(mission.id)}
                  >
                    valider
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground">Aucune mission trouvée.</span>
          )}
        </CardContent>
      </Card>
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <h3 className="text-lg font-bold">Détails de la mission</h3>
        </CardHeader>
        <CardContent>
          {missionDetails ? (
            <div className="space-y-1">
              <p><span className="font-semibold">Titre:</span> {missionDetails.title}</p>
              <p><span className="font-semibold">Description:</span> {missionDetails.description}</p>
              <p><span className="font-semibold">Points de récompense:</span> {missionDetails.reward_points}</p>
              <p><span className="font-semibold">Coins de récompense:</span> {missionDetails.reward_coins}</p>
            </div>
          ) : (
            <span className="text-muted-foreground">Sélectionnez une mission pour voir les détails.</span>
          )}
        </CardContent>
      </Card>
      <div className="mt-4 width-full">
        <Button><Link href={`/protected/admin`}>Retour</Link></Button>
      </div>
    </div>
  );
};

export default ProfileScout;