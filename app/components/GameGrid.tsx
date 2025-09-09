import { GameSection } from "./GameSection";
import { FeaturedGame } from "./FeaturedGame";
import { GameCard } from "./GameCard";
import { CategoriesSection } from "./CategoriesSection";
import { NewGamesSection } from "./NewGamesSection";

interface Game {
  id: string;
  title: string;
  image: string;
  rating: number;
  downloads: string;
  genre: string;
  tags: string[];
  price: string;
  description: string;
}

interface GameGridProps {
  games: Game[];
  selectedCategory: string;
  onCategoryChange?: (category: string) => void;
}

export function GameGrid({
  games,
  selectedCategory,
  onCategoryChange,
}: GameGridProps) {
  // Filter games for different sections
  const topRatedGames = games
    .filter((game) => game.rating >= 4.7)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  const bundleDeals = games
    .filter((game) => game.price !== "무료" && Math.random() > 0.5) // Mock bundle logic
    .slice(0, 6);

  const freeGames = games.filter((game) => game.price === "무료").slice(0, 6);

  const newReleases = games
    .filter((game) => ["7", "8", "1"].includes(game.id)) // Mock new releases
    .slice(0, 6);

  const trendingGames = games
    .filter((game) => parseInt(game.downloads.replace(/[^\d]/g, "")) >= 2000000)
    .slice(0, 6);

  // If a specific category is selected, show filtered results
  if (selectedCategory !== "recommended") {
    const filteredGames = games.filter((game) => {
      switch (selectedCategory) {
        case "trending":
          return parseInt(game.downloads.replace(/[^\d]/g, "")) >= 2000000;
        case "new":
          return ["7", "8", "1"].includes(game.id);
        case "action":
          return game.genre === "액션";
        case "rpg":
          return game.genre === "RPG";
        case "racing":
          return game.genre === "레이싱";
        case "multiplayer":
          return game.genre === "멀티플레이어";
        case "puzzle":
          return game.genre === "퍼즐";
        case "simulation":
          return game.genre === "시뮬레이션";
        case "무료게임":
          return game.price === "무료";
        default:
          return game.tags.some((tag) =>
            tag.toLowerCase().includes(selectedCategory.toLowerCase())
          );
      }
    });

    const getCategoryTitle = (category: string) => {
      const categoryMap: Record<string, string> = {
        trending: "트렌딩 게임",
        new: "신작 게임",
        action: "액션 게임",
        rpg: "RPG 게임",
        racing: "레이싱 게임",
        multiplayer: "멀티플레이어 게임",
        puzzle: "퍼즐 게임",
        simulation: "시뮬레이션 게임",
        무료게임: "무료 게임",
      };
      return categoryMap[category] || `${category} 게임`;
    };

    return (
      <main className="flex-1 px-4 py-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="mb-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text font-semibold text-transparent">
            {getCategoryTitle(selectedCategory)}
          </h2>
          <p className="text-muted-foreground">
            {filteredGames.length}개의 게임을 찾았습니다
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredGames.map((game) => (
            <div key={game.id} className="w-full">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </main>
    );
  }

  // Get featured game (highest rated game)
  const featuredGame = games.sort((a, b) => b.rating - a.rating)[0];

  // Default home page with sections
  return (
    <main className="flex-1 px-4 py-6 max-w-7xl mx-auto space-y-8">
      {/* Featured + New Games (same row) */}
      <div className="grid grid-7-3 gap-6 items-stretch">
        <div className="h-full">
          <FeaturedGame embed game={featuredGame} />
        </div>
        <div className="h-full">
          <NewGamesSection
            embed
            games={newReleases.map((g) => ({
              id: g.id,
              title: g.title,
              image: g.image,
              price: g.price,
              description: g.description,
            }))}
          />
        </div>
      </div>

      {/* Horizontal Categories Bar */}
      <CategoriesSection
        categories={[
          { id: "trending", name: "트렌딩" },
          { id: "new", name: "신작" },
          { id: "action", name: "액션" },
          { id: "rpg", name: "RPG" },
          { id: "simulation", name: "시뮬레이션" },
          { id: "racing", name: "레이싱" },
          { id: "puzzle", name: "퍼즐" },
          { id: "무료게임", name: "무료게임" },
        ]}
        onSelect={(id) => onCategoryChange?.(id)}
      />

      <GameSection
        title="🏆 인기 TOP 게임"
        games={topRatedGames.slice(1)} // Exclude featured game
      />

      <GameSection title="💎 번들 할인" games={bundleDeals} />

      <GameSection title="🆓 무료 게임" games={freeGames} />

      <GameSection title="✨ 신작 게임" games={newReleases} />

      <GameSection title="🔥 트렌딩" games={trendingGames} />
    </main>
  );
}
