"use client"
import React from "react";
import { useForm } from "react-hook-form"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  content: z.string().min(2).max(500),
  is_anonymous: z.boolean(),
});

export default function FormsIdeas() {
    

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      is_anonymous: false,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      const scout_id = values.is_anonymous ? null : data?.user?.id;
      supabase.from('ideas').insert({
        content: values.content,
        is_anonymous: values.is_anonymous,
        scout_id,
      }).then(({ error }) => {
        if (error) {
          alert("Erreur lors de l'enregistrement de l'idée");
        } else {
          alert("Idée enregistrée !");
          form.reset();
          // Optionally, you can redirect the user or show a success message
          window.location.href = "/protected";
        }
      });
    });
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-8">
      <div className="bg-card rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-2 text-center text-primary">Propose ton idée !</h2>
        <p className="text-muted-foreground mb-6 text-center">Partage une idée pour le groupe. Tu peux choisir d'être anonyme.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Ton idée</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Écris ton idée ici..."
                      {...field}
                      className="resize-none min-h-[80px] rounded-lg border focus:ring-primary"
                    />
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground">Max 500 caractères</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_anonymous"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mr-2"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">Je veux rester anonyme</FormLabel>
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full mt-4">Envoyer mon idée</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
