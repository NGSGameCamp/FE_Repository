import { GameCard } from "./GameCard";
import { Button } from "../y_ui/base/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

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
  const cardsPerView = 4;
  const gapSpacing = 24; // px, matches gap-6 spacing
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(games.length / cardsPerView)),
    [games.length, cardsPerView]
  );
  const hasMultiplePages = totalPages > 1;

  const cardFlexBasis = useMemo(
    () =>
      `calc((100% - ${(cardsPerView - 1) * gapSpacing}px) / ${cardsPerView})`,
    [cardsPerView, gapSpacing]
  );

  const cardStyle = useMemo<CSSProperties>(
    () => ({
      flex: `0 0 ${cardFlexBasis}`,
      maxWidth: cardFlexBasis,
      scrollSnapAlign: "start",
    }),
    [cardFlexBasis]
  );

  const containerStyle = useMemo<CSSProperties>(
    () => ({
      scrollSnapType: "x mandatory",
    }),
    []
  );

  const getPageWidth = useCallback(() => {
    if (!scrollRef.current) return 0;
    return scrollRef.current.clientWidth;
  }, []);

  const scrollToPage = useCallback(
    (page: number) => {
      if (!scrollRef.current) return;
      const target = Math.min(Math.max(page, 1), totalPages);
      const container = scrollRef.current;
      const pageWidth = getPageWidth();
      container.scrollTo({
        left: pageWidth * (target - 1),
        behavior: "smooth",
      });
      setCurrentPage(target);
    },
    [getPageWidth, totalPages]
  );

  const handleArrow = (direction: "left" | "right") => {
    const delta = direction === "left" ? -1 : 1;
    scrollToPage(currentPage + delta);
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      const pageWidth = getPageWidth();
      if (!pageWidth) return;
      const computed = Math.round(element.scrollLeft / pageWidth) + 1;
      setCurrentPage((prev) => {
        const clamped = Math.min(Math.max(computed, 1), totalPages);
        return prev === clamped ? prev : clamped;
      });
    };

    element.addEventListener("scroll", handleScroll, { passive: true });
    return () => element.removeEventListener("scroll", handleScroll);
  }, [getPageWidth, totalPages]);

  useEffect(() => {
    scrollToPage(1);
  }, [games.length, scrollToPage]);

  if (games.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text font-semibold text-transparent">
          {title}
        </h2>
        {showViewAll && (
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary"
          >
            모두 보기
          </Button>
        )}
      </div>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide"
          style={containerStyle}
        >
          {games.map((game) => (
            <div key={game.id} className="flex-none" style={cardStyle}>
              <GameCard game={game} />
            </div>
          ))}
        </div>

        {hasMultiplePages && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -left-12 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-primary/30 bg-background/95 text-primary shadow-md shadow-primary/10 hover:bg-primary/20 hover:text-primary"
              onClick={() => handleArrow("left")}
              disabled={currentPage === 1}
              aria-label="이전 게임 묶음"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute -right-12 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-primary/30 bg-background/95 text-primary shadow-md shadow-primary/10 hover:bg-primary/20 hover:text-primary"
              onClick={() => handleArrow("right")}
              disabled={currentPage === totalPages}
              aria-label="다음 게임 묶음"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>

      {hasMultiplePages && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            const isActive = pageNumber === currentPage;
            return (
              <button
                key={`page-${pageNumber}`}
                type="button"
                onClick={() => scrollToPage(pageNumber)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`${pageNumber}번째 게임 페이지`}
                aria-current={isActive ? "page" : undefined}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
