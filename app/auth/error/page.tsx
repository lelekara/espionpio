import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Quelque chose s'est mal passé !
              </CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">
                  Code d'erreur: {params.error}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Une erreur non spécifiée est survenue.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
