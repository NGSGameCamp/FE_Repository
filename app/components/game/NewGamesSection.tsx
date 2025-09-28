import { Card } from "../ui/card";
import { Link } from "react-router-dom";
import StarBorder from "@/components/ui/StarBorder";
import AnimatedContent from "@/components/ui/AnimatedContent";

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

  const colors = [
    "from-blue-500/60 to-indigo-500/60",
    "from-emerald-500/60 to-teal-500/60",
    "from-amber-500/60 to-orange-500/60",
    "from-violet-500/60 to-fuchsia-500/60",
    "from-rose-500/60 to-red-500/60",
  ];

  return (
    <Wrapper>
     {/* <StarBorder as="div" color="cyan" speed="5s" className="block w-full h-full" style={{ borderRadius: 12 }}> */}
      <Card className="h-full rounded-xl border border-primary/20 bg-background/80 overflow-hidden flex flex-col">
    <div className="p-4 border-b border-primary/10 flex items-center justify-between">
      <h3 className="font-semibold">신작 게임</h3>
      <Link
        to="/search"
        className="text-xs text-primary/80 hover:text-primary"
      >
        더 보기 →
      </Link>
    </div>

    <ul className="p-3 space-y-3 flex-1">
      {games.slice(0, 5).map((g, idx) => (
        <li
          key={g.id}
          className="rounded-xl bg-muted/10 hover:bg-muted/20 transition border border-primary/10"
        >
          <AnimatedContent
            distance={150}
            direction="horizontal"
            reverse={false}
            duration={1.2}
            ease="cubic-bezier(0.22, 1, 0.36, 1)"
            initialOpacity={0.2}
            animateOpacity
            scale={1.05}
            threshold={0.2}
            delay={idx * 0.06}
          >
            <Link
              to={`/game/${g.id}`}
              className="flex items-center gap-3 p-3"
            >
              <div
                className={`h-10 w-10 rounded-md overflow-hidden bg-gradient-to-br ${
                  colors[idx % colors.length]
                }`}
              >
                {g.image ? (
                  <img
                    src={g.image}
                    alt={g.title}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{g.title}</div>
              </div>
              <div className="text-sm font-semibold text-primary whitespace-nowrap">
                {g.price}
              </div>
            </Link>
          </AnimatedContent>
        </li>
      ))}
    </ul>
  </Card>
{/* </StarBorder> */}
    </Wrapper>
  );
}
