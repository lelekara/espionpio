"use client";
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function IdeasAdminPage() {
  type Idea = {
    id: string;
    content: string;
    is_anonymous: boolean;
    created_at: string;
    scout_id: string | null;
    profiles?: { display_name: string } | null;
  };
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('ideas')
      .select('id, content, is_anonymous, created_at, scout_id, profiles:scout_id(display_name)')
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error && data) {
          // On précise le type ici au lieu de any
          const mapped = data.map((idea: {
            id: string;
            content: string;
            is_anonymous: boolean;
            created_at: string;
            scout_id: string | null;
            profiles?: { display_name: string }[] | { display_name: string } | null;
          }) => ({
            ...idea,
            profiles: Array.isArray(idea.profiles) ? idea.profiles[0] || null : idea.profiles || null,
          }));
          setIdeas(mapped);
        }
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">Toutes les idées des scouts</h1>
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Chargement...</div>
      ) : (
        <>
          {/* Desktop/tablette : tableau */}
          <div className="hidden sm:block overflow-x-auto rounded-xl shadow-lg bg-background">
            <Table className="min-w-full border-separate border-spacing-y-2">
              <TableHeader>
                <TableRow className="bg-muted sticky top-0 z-10">
                  <TableHead className="rounded-tl-xl">Idée</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead className="rounded-tr-xl">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ideas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">Aucune idée pour le moment.</TableCell>
                  </TableRow>
                ) : (
                  ideas.map((idea) => (
                    <TableRow key={idea.id} className="bg-card hover:bg-accent transition-all">
                      <TableCell className="max-w-xs break-words text-base font-medium text-foreground">{idea.content}</TableCell>
                      <TableCell className="flex items-center gap-2">
                        {idea.is_anonymous || !idea.profiles ? (
                          <span className="inline-block px-2 py-1 rounded bg-muted text-xs font-semibold">Anonyme</span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary font-semibold text-xs">{idea.profiles.display_name}</span>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">{new Date(idea.created_at).toLocaleString()}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {/* Mobile : cards verticales */}
          <div className="sm:hidden space-y-4">
            {ideas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-card rounded-xl shadow">Aucune idée pour le moment.</div>
            ) : (
              ideas.map((idea) => (
                <div key={idea.id} className="bg-card rounded-xl shadow p-4 flex flex-col gap-2">
                  <div className="text-base font-semibold text-foreground break-words mb-2">{idea.content}</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Auteur :</span>
                    {idea.is_anonymous || !idea.profiles ? (
                      <span className="inline-block px-2 py-1 rounded bg-muted text-xs font-semibold">Anonyme</span>
                    ) : (
                      <span className="inline-block px-2 py-1 rounded bg-primary/10 text-primary font-semibold text-xs">{idea.profiles.display_name}</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">{new Date(idea.created_at).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
