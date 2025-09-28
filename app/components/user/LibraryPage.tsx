import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Badge } from "../y_ui/base/badge";
import { useNavigate } from "react-router-dom";
import { Eye, Heart } from "lucide-react";

const STORAGE_KEY = "library:games";

type LibraryGame = {
  id: string;
  title: string;
  image: string;
  genre: string;
  installed: boolean;
  playTimeHours: number;
  lastPlayedAt: number;
  isFavorite: boolean;
};

function fromStore(): LibraryGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Array<Partial<LibraryGame>>;
    return parsed.map((game) => ({
      ...game,
      isFavorite: Boolean(game?.isFavorite),
    })) as LibraryGame[];
  } catch {
    return [];
  }
}

function toStore(games: LibraryGame[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
  } catch {
    /* ignore */
  }
}

function sortGames(games: LibraryGame[]) {
  const favorites = games.filter((game) => game.isFavorite);
  const others = games.filter((game) => !game.isFavorite);
  return [...favorites, ...others];
}

function timeAgo(ms: number) {
  const sec = Math.floor((Date.now() - ms) / 1000);
  const d = Math.floor(sec / 86400);
  if (d > 0) return `${d}일 전`;
  const h = Math.floor((sec % 86400) / 3600);
  if (h > 0) return `${h}시간 전`;
  const m = Math.floor((sec % 3600) / 60);
  return `${m}분 전`;
}

export default function LibraryPage() {
  const nav = useNavigate();
  const [games, setGames] = useState<LibraryGame[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const loadedGames = sortGames(fromStore());
    setGames(loadedGames);
    if (loadedGames.length > 0) {
      toStore(loadedGames);
    }
    if (loadedGames.length > 0 && !selectedId) {
      setSelectedId(loadedGames[0].id);
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setGames((prev) => {
      const updated = prev.map((game) =>
        game.id === id ? { ...game, isFavorite: !game.isFavorite } : game
      );
      const ordered = sortGames(updated);
      toStore(ordered);
      return ordered;
    });
  };

  const selected = useMemo(
    () => games.find((g) => g.id === selectedId) || games[0],
    [games, selectedId]
  );

  return (
    <div className="container mx-auto px-6 py-8 space-y-6 text-white">
      {/* Header
      <header className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground uppercase tracking-wide">
          라이브러리
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost">
            필터
          </Button>
          <Button size="sm" variant="ghost">
            정렬
          </Button>
          <Button size="sm" variant="ghost" className="p-2">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header> */}

      {/* Main Content */}
      <Card className="border border-primary/20 bg-background/85 backdrop-blur mt-4">
        <CardContent className="p-6">
          <div className="flex gap-6">
            {/* Left Sidebar - Game List (1/5) */}
            <aside className="w-[400px] max-w-[400px] border border-primary/30 bg-background/70 rounded-xl">
              <div className="p-4 border-b border-primary/20">
                <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  내 게임 ({games.length})
                </div>
              </div>
              <div className="overflow-y-auto max-h-[65vh] p-2 space-y-2">
                {games.map((game) => {
                  const active = selected?.id === game.id;
                  return (
                    <button
                      key={game.id}
                      onClick={() => setSelectedId(game.id)}
                      className={`w-full px-4 py-3 text-left flex items-center gap-3 rounded-lg border transition-all ${
                        active
                          ? "border-primary bg-primary/15 text-primary shadow-lg"
                          : "border-primary/20 bg-background/70 hover:border-primary/40 hover:bg-primary/5"
                      }`}
                    >
                      <img
                        src={game.image}
                        alt={game.title}
                        className="h-10 w-10 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {game.title}
                        </div>
                      </div>
                      {game.isFavorite ? (
                        <Heart
                          className="h-4 w-4 text-rose-400"
                          fill="currentColor"
                        />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Right Content - Game Details (4/5) */}
            <main className="flex-1 max-h-[65vh] overflow-y-auto pr-2">
              {selected ? (
                <div className="h-full flex flex-col">
                  {/* Game Hero Section */}
                  <div className="relative h-64 overflow-hidden rounded-xl">
                    <img
                      src={selected.image}
                      alt={selected.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                    {/* Game Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="max-w-4xl">
                        <h1 className="text-4xl font-bold mb-3">
                          {selected.title}
                        </h1>
                        <div className="flex items-center gap-4 mb-6">
                          <Badge
                            variant="outline"
                            className="border-primary/40"
                          >
                            {selected.genre}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            총 플레이 시간: {selected.playTimeHours}시간
                          </span>
                          <span className="text-sm text-muted-foreground">
                            마지막 플레이: {timeAgo(selected.lastPlayedAt)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <Button
                            size="lg"
                            className="gap-2"
                            onClick={() => nav(`/game/${selected.id}`)}
                          >
                            <Eye className="h-5 w-5" />
                            상세 페이지 보기
                          </Button>
                          <Button
                            size="lg"
                            variant="secondary"
                            className={`gap-2 transition-colors ${
                              selected.isFavorite
                                ? "border border-rose-400 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                                : ""
                            }`}
                            onClick={() => toggleFavorite(selected.id)}
                          >
                            <Heart
                              className={`h-5 w-5 ${
                                selected.isFavorite ? "text-rose-400" : ""
                              }`}
                              fill={
                                selected.isFavorite ? "currentColor" : "none"
                              }
                            />
                            즐겨찾기
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Info Section */}
                  <div className="flex-1 bg-background/95 border-t border-primary/20">
                    <div className="p-8">
                      <div className="grid grid-cols-3 gap-6 max-w-4xl">
                        <Card className="border-primary/20 bg-background/70">
                          <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              플레이 시간
                            </div>
                            <div className="text-2xl font-bold">
                              {selected.playTimeHours}시간
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-primary/20 bg-background/70">
                          <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              마지막 플레이
                            </div>
                            <div className="text-2xl font-bold">
                              {timeAgo(selected.lastPlayedAt)}
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border-primary/20 bg-background/70">
                          <CardContent className="p-4">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                              상태
                            </div>
                            <div className="text-2xl font-bold">
                              {selected.installed ? "설치됨" : "미설치"}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  게임을 선택해주세요
                </div>
              )}
            </main>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
