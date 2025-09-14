"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ShopItem = {
  id: string;
  name: string;
  price_coins: number;
  price_points: number;
  description: string;
  quantity: number;
  image_url: string;
};

export default function modifshop() {
  const supabase = createClient();
  const [data, setData] = React.useState<ShopItem[]>([]);

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase.from("shop_items").select("*");
      if (error) console.error(error);
      else {
        // Traitez les données des articles de la boutique ici
        setData(data);
        console.log(data);
      }
    };
    fetchItems();
  }, [supabase]);

  const handleEdit = async (itemId, newData) => {
    const { error } = await supabase
      .from("shop_items")
      .update(newData)
      .eq("id", itemId);
    if (!error) {
      // Met à jour la liste localement ou refetch
      alert("Article modifié !");
      setData((prevData) =>
        prevData.map((item) =>
          item.id === itemId ? { ...item, ...newData } : item
        )
      );
    } else {
      alert("Erreur lors de la modification !");
    }
  };

  // ajouter un article
  const handleAdd = async (newData) => {
    const { error } = await supabase.from("shop_items").insert([newData]);
    if (!error) {
      // Met à jour la liste localement ou refetch
      alert("Article ajouté !");
      setData((prevData) => [...prevData, newData]);
    } else {
      alert("Erreur lors de l'ajout !");
    }
  };

  const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));
  // ou par id : .sort((a, b) => a.id.localeCompare(b.id))

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Modifier la boutique</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4 px-4 py-2 rounded">
            Ajouter un article
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un article</DialogTitle>
            <DialogDescription>
              Remplissez les détails de l'article ci-dessous.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const newData = {
                name: formData.get("name"),
                description: formData.get("description"),
                price_points: Number(formData.get("price_points")),
                price_coins: Number(formData.get("price_coins")),
                quantity: Number(formData.get("quantity")),
                image_url: formData.get("image_url"),
              };
              handleAdd(newData);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name" className="mb-1">
                Nom
              </Label>
              <Input name="name" id="name" required />
            </div>
            <div>
              <Label htmlFor="description" className="mb-1">
                Description
              </Label>
              <Textarea name="description" id="description" required />
            </div>
            <div>
              <Label htmlFor="price_points" className="mb-1">
                Prix en points
              </Label>
              <Input type="number" name="price_points" id="price_points" required />
            </div>
            <div>
              <Label htmlFor="price_coins" className="mb-1">
                Prix en coins
              </Label>
              <Input type="number" name="price_coins" id="price_coins" required />
            </div>
            <div>
              <Label htmlFor="quantity" className="mb-1">
                Quantité
              </Label>
              <Input type="number" name="quantity" id="quantity" required />
            </div>
            <div>
              <Label htmlFor="image_url" className="mb-1">
                URL de l'image
              </Label>
              <Input name="image_url" id="image_url" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button type="submit" className="px-4 py-2 rounded">
                Ajouter
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Button className="ml-2 mb-4 px-4 py-2 rounded" onClick={() => window.location.pathname = '/protected/admin'}>
        Retour à la page admin
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {sortedData.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow">
            <img
              src={item.image_url}
              alt={`image de ${item.name}`}
              className="w-full h-48 object-cover mb-4"
            />
            <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
            <p className="text-sm text-gray-300 mb-2">{item.description}</p>
            <p className="text-sm text-gray-400 mb-2">
              Prix: {item.price_points} points, {item.price_coins} coins
            </p>
            <p className="text-sm text-gray-400 mb-4">
              Quantité: {item.quantity}
            </p>
            {/* Bouton pour ouvrir le dialogue de modification */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-4 py-2 rounded ">
                  Modifier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Modifier l'article</DialogTitle>
                  <DialogDescription>
                    Modifiez les détails de l'article ci-dessous.
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target as HTMLFormElement);
                    const newData = {
                      name: formData.get("name"),
                      description: formData.get("description"),
                      price_points: Number(formData.get("price_points")),
                      price_coins: Number(formData.get("price_coins")),
                      quantity: Number(formData.get("quantity")),
                      image_url: formData.get("image_url"),
                    };
                    handleEdit(item.id, newData);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <Label htmlFor="name" className="mb-1">
                      Nom
                    </Label>
                    <Input name="name" id="name" defaultValue={item.name} />
                  </div>
                  <div>
                    <Label htmlFor="description" className="mb-1">
                      Description
                    </Label>
                    <Textarea
                      name="description"
                      id="description"
                      defaultValue={item.description}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_points" className="mb-1">
                      Prix en points
                    </Label>
                    <Input
                      type="number"
                      name="price_points"
                      id="price_points"
                      defaultValue={item.price_points}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price_coins" className="mb-1">
                      Prix en coins
                    </Label>
                    <Input
                      type="number"
                      name="price_coins"
                      id="price_coins"
                      defaultValue={item.price_coins}
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantity" className="mb-1">
                      Quantité
                    </Label>
                    <Input
                      type="number"
                      name="quantity"
                      id="quantity"
                      defaultValue={item.quantity}
                    />
                  </div>
                  <div>
                    <Label htmlFor="image_url" className="mb-1">
                      URL de l'image
                    </Label>
                    <Input
                      name="image_url"
                      id="image_url"
                      defaultValue={item.image_url || "Pas d'image"}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button type="submit" className="px-4 py-2 rounded">
                      Enregistrer
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        ))}
      </div>
    </div>
  );
}
