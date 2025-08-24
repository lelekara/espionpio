import { Card, CardContent, CardTitle } from "./ui/card";

export function Charte() {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card>
        <CardTitle className="text-2xl mb-4 text-center">Charte des Scouts Pionniers</CardTitle>
        <CardContent>
          <p>Voici la charte de notre projet...</p>
          <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit cum fuga explicabo mollitia quidem, corporis magni perspiciatis assumenda repudiandae tenetur labore velit hic error possimus! Iusto magni officia quam harum.</p>
        </CardContent>
      </Card>
    </div>
  );
}
