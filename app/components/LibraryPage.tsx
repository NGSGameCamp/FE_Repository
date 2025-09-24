import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";
import { Play, Heart, Settings, Download } from "lucide-react";

const STORAGE_KEY = "library:games";

type LibraryGame = {
  id: string;
  title: string;
  image: string;
  genre: string;
  installed: boolean;
  playTimeHours: number;
  lastPlayedAt: number;
};

function fromStore(): LibraryGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LibraryGame[]) : [];
  } catch {
    return [];
  }
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
    const loadedGames = fromStore();
    setGames(loadedGames);
    if (loadedGames.length > 0 && !selectedId) {
      setSelectedId(loadedGames[0].id);
    }
  }, []);

  const selected = useMemo(
    () => games.find((g) => g.id === selectedId) || games[0],
    [games, selectedId]
  );

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-primary/20 px-6 py-3">
        <div className="flex items-center justify-between">
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
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Game List (1/5) */}
        <aside className="w-1/5 min-w-[240px] border-r border-primary/20 bg-background/50">
          <div className="p-3 border-b border-primary/20">
            <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              내 게임 ({games.length})
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100vh-8rem)]">
            {games.map((game) => {
              const active = selected?.id === game.id;
              return (
                <button
                  key={game.id}
                  onClick={() => setSelectedId(game.id)}
                  className={`w-full px-3 py-2 text-left flex items-center gap-3 border-l-2 transition-all ${
                    active
                      ? "bg-primary/15 border-primary text-primary"
                      : "border-transparent hover:bg-primary/5 hover:border-primary/30"
                  }`}
                >
                  <img
                    src={game.image}
                    alt={game.title}
                    className="h-12 w-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                      {game.title}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {game.installed ? "설치됨" : "미설치"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Right Content - Game Details (4/5) */}
        <main className="flex-1 overflow-hidden">
          {selected ? (
            <div className="h-full flex flex-col">
              {/* Game Hero Section */}
              <div className="relative h-2/3 overflow-hidden">
                <img
                  src={selected.image}
                  alt={selected.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                
                {/* Game Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="max-w-4xl">
                    <h1 className="text-4xl font-bold mb-3">{selected.title}</h1>
                    <div className="flex items-center gap-4 mb-6">
                      <Badge variant="outline" className="border-primary/40">
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
                        onClick={() => nav("/game03")}
                      >
                        <Play className="h-5 w-5" />
                        {selected.installed ? "플레이" : "설치"}
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2">
                        <Heart className="h-5 w-5" />
                        즐겨찾기
                      </Button>
                      <Button size="lg" variant="outline" className="gap-2">
                        <Settings className="h-5 w-5" />
                        설정
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
    </div>
  );
}