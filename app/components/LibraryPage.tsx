import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { useNavigate } from "react-router-dom";

type LibraryGame = {
  id: string;
  title: string;
  image: string;
  genre: string;
  installed: boolean;
  playTimeHours: number; // 누적 시간
  lastPlayedAt: number; // ms epoch
  news: { id: string; title: string; date: string }[];
};

const STORAGE_KEY = "library:games";

function seedGames() {
  const exists = localStorage.getItem(STORAGE_KEY);
  if (exists) return;
  const now = Date.now();
  const sample: LibraryGame[] = [
    {
      id: "cyber-raid-2079",
      title: "Cyber Raid 2079",
      genre: "액션 RPG",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
      installed: true,
      playTimeHours: 142.6,
      lastPlayedAt: now - 3 * 24 * 60 * 60 * 1000,
      news: [
        { id: "n1", title: "대규모 밸런스 패치 1.2.0 배포", date: "2025-08-01" },
        { id: "n2", title: "신규 DLC 티저 공개", date: "2025-07-20" },
      ],
    },
    {
      id: "dungeon-story",
      title: "Dungeon Story",
      genre: "어드벤처",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
      installed: false,
      playTimeHours: 0.6,
      lastPlayedAt: now - 30 * 24 * 60 * 60 * 1000,
      news: [{ id: "n1", title: "미니 이벤트 진행 중", date: "2025-07-11" }],
    },
    {
      id: "kingdom-kings",
      title: "Kingdom Kings",
      genre: "전략",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop",
      installed: true,
      playTimeHours: 64.0,
      lastPlayedAt: now - 14 * 24 * 60 * 60 * 1000,
      news: [{ id: "n1", title: "연합전 신규 시즌 시작", date: "2025-07-30" }],
    },
    {
      id: "pixel-forge",
      title: "Pixel Forge",
      genre: "인디",
      image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=1200&auto=format&fit=crop",
      installed: false,
      playTimeHours: 2.1,
      lastPlayedAt: now - 31 * 24 * 60 * 60 * 1000,
      news: [],
    },
    {
      id: "sky-arena-online",
      title: "Sky Arena Online",
      genre: "멀티플레이",
      image: "https://images.unsplash.com/photo-1505740106531-4243f3831c78?q=80&w=1200&auto=format&fit=crop",
      installed: true,
      playTimeHours: 421.3,
      lastPlayedAt: now - 12 * 60 * 60 * 1000, // 12h ago
      news: [{ id: "n1", title: "시즌 종료 보상 안내", date: "2025-08-10" }],
    },
    {
      id: "valley-of-echoes",
      title: "Valley of Echoes",
      genre: "RPG",
      image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
      installed: false,
      playTimeHours: 18.2,
      lastPlayedAt: now - 1 * 24 * 60 * 60 * 1000,
      news: [{ id: "n1", title: "최적화 핫픽스", date: "2025-08-12" }],
    },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sample));
}

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
    seedGames();
    setGames(fromStore());
  }, []);

  const selected = useMemo(() => games.find((g) => g.id === selectedId) || games[0], [games, selectedId]);

  return (
    <div className="container mx-auto px-6 py-6 grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* Left: filters + my games list (simplified) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">필터</div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">전체</Badge>
            <Badge variant="secondary">설치됨</Badge>
            <Badge variant="secondary">업데이트 필요</Badge>
            <Badge variant="secondary">즐겨찾기</Badge>
          </div>
        </div>

        <Separator className="bg-primary/20" />

        <div className="text-sm">내 게임 <span className="text-muted-foreground">{games.length}개</span></div>
        <Card className="border-primary/20 overflow-hidden">
          <CardContent className="p-0 divide-y divide-primary/10">
            {games.map((g) => (
              <button
                key={g.id}
                onClick={() => setSelectedId(g.id)}
                className={`w-full px-3 py-3 text-left hover:bg-primary/5 ${selected?.id === g.id ? "bg-primary/10" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <img src={g.image} alt={g.title} className="h-10 w-10 rounded object-cover" />
                  <div className="flex-1">
                    <div className="text-sm font-medium truncate">{g.title}</div>
                    <div className="text-xs text-muted-foreground">플레이 {g.playTimeHours}시간 · {timeAgo(g.lastPlayedAt)}</div>
                  </div>
                  <Badge variant="outline" className="border-primary/30">{g.installed ? "설치됨" : "미설치"}</Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Right: selected game detail */}
      {selected && (
        <div className="space-y-4">
          <Card className="border-primary/20">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <img src={selected.image} alt={selected.title} className="w-full md:w-72 h-44 md:h-40 object-cover rounded" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{selected.title}</div>
                      <div className="text-xs text-muted-foreground">{selected.genre}</div>
                    </div>
                    <Badge className="bg-emerald-600">지금 플레이</Badge>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-md border border-primary/20 p-3">
                      누적 플레이 시간
                      <div className="font-semibold">{selected.playTimeHours}시간</div>
                    </div>
                    <div className="rounded-md border border-primary/20 p-3">
                      마지막 플레이
                      <div className="font-semibold">{timeAgo(selected.lastPlayedAt)}</div>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button onClick={() => nav("/game03")}>게임 조회([go])</Button>
                    <Button variant="outline" className="border-primary/30">즐겨찾기</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">게임 뉴스</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {selected.news.length === 0 && (
                <div className="text-muted-foreground">등록된 뉴스가 없습니다.</div>
              )}
              {selected.news.map((n) => (
                <div key={n.id} className="rounded-md border border-primary/20 p-3">
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{n.date}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

