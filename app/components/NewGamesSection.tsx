import { Card } from "./ui/card";

interface Game {
  id: string;
  title: string;
  image: string;
  price: string;
  description?: string;
}

export function NewGamesSection({ games, embed = false }: { games: Game[]; embed?: boolean }) {
  if (!games?.length) return null;

  const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) => (
    embed ? <>{children}</> : <section className="mx-auto max-w-7xl">{children}</section>
  );

  return (
    <Wrapper>
      <Card className="h-full rounded-xl border border-primary/20 bg-background/80 overflow-hidden">
        <div className="p-4 border-b border-primary/10 flex items-center justify-between">
          <h3 className="font-semibold">신규 게임</h3>
          <a href="#" className="text-xs text-primary/80 hover:text-primary">더 보기</a>
        </div>
        <ul className="divide-y divide-primary/10">
          {games.slice(0, 5).map((g) => (
            <li key={g.id} className="p-4 flex items-center gap-3 hover:bg-primary/5 transition">
              <div className="h-10 w-10 rounded overflow-hidden bg-primary/10">
                {g.image ? (
                  <img src={g.image} alt={g.title} className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{g.title}</div>
                {g.description ? (
                  <div className="text-xs text-muted-foreground truncate">{g.description}</div>
                ) : null}
              </div>
              <div className="text-sm text-foreground/90">{g.price}</div>
            </li>
          ))}
        </ul>
      </Card>
    </Wrapper>
  );
}
