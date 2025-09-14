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

  // 5. supprimer la mission
  const handleMissionDelete = async (mission_id: string) => {
    const { data, error } = await supabase
      .from("user_missions")
      .delete()
      .eq("id", mission_id)
      .select()
      .single();
    if (!error) {
      // Mettre à jour la liste des missions
      setMissions((prevMissions) =>
        prevMissions.filter((mission) => mission.id !== mission_id)
      );
    } else {
      console.error("Erreur lors de la suppression de la mission:", error, data, mission_id);
    }
  };

  //6. Historique des achats
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*, shop_items(name)")
        .eq("user_id", userId);
      if (!error) setPurchaseHistory(data || []);
      else setPurchaseHistory([]);
    };
    fetchPurchaseHistory();
  }, [userId]);

  return (
    <div className="flex flex-col items-center py-10">
      <Card className="w-full max-w-md shadow-xl mb-8">
        <CardHeader className="flex flex-col items-center gap-2">
          {!profile ? (
            <Skeleton className="h-20 w-20 rounded-full" />
          ) : (
            <Avatar className="h-20 w-20">
              {profile.avatar ? (
                <AvatarImage src={profile.avatar} alt={profile.display_name || "Avatar"} />
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
                <span className="font-medium">{profile.points ?? profile.reward_points ?? "-"} points</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground text-sm">Solde</span>
                <span className="font-medium">{profile.coins ?? profile.reward_coins ?? "-"} coins</span>
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
                  <Button
                    size="sm"
                    variant="destructive"
                    className="ml-2"
                    onClick={() => handleMissionDelete(mission.id)}
                  >
                    Supprimer
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
      <Card className="w-full max-w-md shadow-md mb-8 mt-8">
        <CardHeader className="flex flex-col items-center gap-2">
          <h3 className="text-lg font-bold">Historique d'achats</h3>
        </CardHeader>
        <CardContent>
          {purchaseHistory.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {purchaseHistory.map((purchase) => (
                <li
                  key={purchase.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all mt-2"
                >
                  <div className="flex-1">
                    <span className="font-semibold text-primary block">
                      {purchase.shop_items?.name || "Article inconnu"}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      Quantité : {purchase.quantity}
                    </span>
                  </div>
                  <div className="mt-2 sm:mt-0 sm:ml-4 text-xs text-muted-foreground text-right">
                    Acheté le :{" "}
                    {purchase.created_at
                      ? new Date(purchase.created_at).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-muted-foreground">Aucun achat trouvé.</span>
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