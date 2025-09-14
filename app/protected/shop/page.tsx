"use client"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import React, { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"

type ShopItem = {
  id: string
  name: string
  price_coins: number
  price_points: number
  description: string
  quantity: number
  image_url: string;
}

const ShopPage = () => {
  const supabase = createClient()
  const [data, setData] = React.useState<ShopItem[]>([])
  const [userId, setUserId] = React.useState<string | null>(null)
    const [user, setUser] = React.useState<{ points: number; coins: number }>({ points: 0, coins: 0 })
    
  // Récupérer l'ID utilisateur
  useEffect(() => {
    const fetchUserId = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUserId(user?.id || null)
    }
    fetchUserId()
  }, [supabase])
    // Récupérer les points et coins de l'utilisateur
    useEffect(() => {
        if (!userId) return
        const fetchUserPointsAndCoins = async () => {
            const { data, error } = await supabase
                .from("profiles")
                .select("points, coins")
                .eq("id", userId)
                .single()
            if (!error && data) {
                setUser({ points: data.points, coins: data.coins })
            }
        }
        fetchUserPointsAndCoins()
    }, [userId, supabase])

  // Récupérer les articles de la boutique

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("shop_items").select("*")
      if (error) console.error(error)
      else {
        // Traitez les données des articles de la boutique ici
        setData(data)
        console.log(data)
      }
    }
    fetchItems()
  }, [supabase])

  const handleBuy = async (item: ShopItem) => {
    // 1. Récupérer le profil utilisateur
    const { data: user } = await supabase.from("profiles").select("coins, points").eq("id", userId).single()

    // 2. Vérifier les fonds
    if (user.points < item.price_points || user.coins < item.price_coins) {
        alert("Fonds insuffisants pour cet achat.")
      return
    }

    // 3. Déduire les points/coins
    await supabase
      .from("profiles")
      .update({
        points: user.points - item.price_points,
        coins: user.coins - item.price_coins,
      })
      .eq("id", userId)

    // 4. Diminuer la quantité de l'item
    await supabase
      .from("shop_items")
      .update({ quantity: item.quantity - 1 })
      .eq("id", item.id)

    // 5. (Optionnel) Ajouter à l'historique
    await supabase.from("purchases").insert({ user_id: userId, item_id: item.id, quantity: 1 })

    alert("Achat réussi !")
  }

  const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name))
  // ou par id : .sort((a, b) => a.id.localeCompare(b.id))

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Card className="w-full shadow-xl">
        <CardTitle className="text-center text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 tracking-tight pt-6">
          Boutique scout
        </CardTitle>
        <CardDescription className="text-center text-base">
          vos points et coins :{" "}
          <span className="font-semibold text-blue-600">points {user.points}</span> /{" "}
          <span className="font-semibold text-amber-600">coins {user.coins}</span>
        </CardDescription>
        <CardContent className="px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 w-full">
            {Array.isArray(sortedData) && sortedData.length > 0 ? (
              sortedData.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col items-center p-3 sm:p-4 shadow-md w-full hover:shadow-lg transition-shadow"
                >
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="mb-2 rounded"
                    />
                  )}
                  <CardTitle className="text-base sm:text-lg font-bold mb-2 text-center text-balance leading-tight">
                    {item.name}
                  </CardTitle>
                  <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 mb-2 text-center">
                    <span className="font-semibold text-amber-600 text-sm sm:text-base">{item.price_coins} coins</span>
                    <span className="font-semibold text-blue-600 text-sm sm:text-base">{item.price_points} points</span>
                  </div>
                  <span className="text-muted-foreground text-xs sm:text-sm mb-2 text-center text-pretty px-1">
                    {item.description}
                  </span>
                  <div className="flex items-center gap-2 mt-1 mb-3">
                    <span className="text-xs">Quantité :</span>
                    <span className="font-bold text-green-600 text-sm">{item.quantity}</span>
                  </div>
                  <Button
                    className="mt-auto w-full text-sm sm:text-base py-2 sm:py-2.5"
                    onClick={() => handleBuy(item)}
                  >
                    Acheter
                  </Button>
                </Card>
              ))
            ) : (
              <div className="col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4 flex flex-col items-center justify-center py-8">
                <span className="text-muted-foreground text-center">Aucun article disponible.</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <Button className="mt-4" onClick={() => window.location.pathname = '/protected/'}>
        Retour au dashboard
      </Button>
    </div>
  )
}

export default ShopPage
