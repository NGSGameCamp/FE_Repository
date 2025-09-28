import { GameCard } from "./GameCard";
import { Button } from "../y_ui/base/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface Game {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviews: string;
  genre: string;
  tags: string[];
  price: string;
  description: string;
}

interface GameSectionProps {
  title: string;
  games: Game[];
  showViewAll?: boolean;
}

export function GameSection({
  title,
  games,
  showViewAll = true,
}: GameSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // width of card + gap
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (games.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text font-semibold text-transparent">
          {title}
        </h2>
        <div className="flex items-center gap-2">
          {showViewAll && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary"
            >
              모두 보기
            </Button>
          )}
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-primary/10"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {games.map((game) => (
          <div
            key={game.id}
            className="flex-none w-80"
            style={{ scrollSnapAlign: "start" }}
          >
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  );
}
