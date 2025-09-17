import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

type Board = {
  id: string;
  name: string;
  type: "game" | "topic";
  tags: string[];
  rating?: number; // game only
  info?: string; // game only
  publisher?: { name: string; banner: string };
  hero?: string; // hero background
  genres?: string[]; // game only
  released?: string; // game only
  ratingCount?: number; // game only
  concurrent?: string; // e.g., 동시 접속자
};

const boards: Board[] = [
  {
    id: "cyberpunk-2087",
    name: "Cyberpunk 2087",
    type: "game",
    tags: ["레이드", "가이드", "패치"],
    genres: ["액션 RPG", "레이드", "협동", "PvE"],
    rating: 4.7,
    ratingCount: 12304,
    concurrent: "동시 접속자 23,421",
    released: "2024.11.05",
    info: "미래 도시에서 펼쳐지는 사이버펑크 액션 RPG",
    publisher: { name: "Nexus Games", banner: "사이버펑크 2087 최신 패치 1.2 배포!" },
    hero: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: "neon-racing",
    name: "Neon Racing",
    type: "game",
    tags: ["스샷", "커뮤니티", "하이라이트"],
    genres: ["아케이드", "레이싱"],
    rating: 4.4,
    ratingCount: 8021,
    concurrent: "동시 접속자 9,102",
    released: "2024.05.01",
    info: "네온 도시를 질주하는 고속 레이싱 게임",
    publisher: { name: "RGB Studio", banner: "네온 시티 챔피언십 시즌 4 개최" },
    hero: "https://images.unsplash.com/photo-1567027757540-7b572280fa22?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: "guide-hub",
    name: "가이드 허브",
    type: "topic",
    tags: ["뉴비", "성장", "엔드게임"],
  },
];

type Post = { id: string; title: string; excerpt: string; tags: string[]; author: string; date: string; comments: number; likes: number };
const mockPosts: Record<string, Post[]> = {
  "cyberpunk-2087": [
    { id: "p1", title: "레이드 공략 업데이트", excerpt: "최신 패치 기준 공략 갱신…", tags: ["레이드"], author: "RaiderKim", date: new Date().toISOString(), comments: 18, likes: 90 },
    { id: "p2", title: "엔드게임 성장 루트", excerpt: "자원 수급과 세팅 우선순위…", tags: ["가이드"], author: "이수현", date: new Date(Date.now() - 86400000).toISOString(), comments: 7, likes: 45 },
  ],
  "neon-racing": [
    { id: "p3", title: "네온 트랙 하이라이트", excerpt: "지난 주 스크린샷 모음", tags: ["스샷"], author: "Jin Park", date: new Date().toISOString(), comments: 6, likes: 33 },
  ],
  "guide-hub": [
    { id: "p4", title: "뉴비 종합 가이드", excerpt: "처음 시작부터 엔드게임까지…", tags: ["뉴비", "가이드"], author: "Helper", date: new Date().toISOString(), comments: 12, likes: 88 },
  ],
};

const mockMedia: Record<string, string[]> = {
  "cyberpunk-2087": [
    "https://images.unsplash.com/photo-1689443111384-1cf214df988a?w=600&q=60",
    "https://images.unsplash.com/photo-1697256936504-7c9177a74fc5?w=600&q=60",
  ],
  "neon-racing": [
    "https://images.unsplash.com/photo-1567027757540-7b572280fa22?w=600&q=60",
  ],
  "guide-hub": [],
};

export default function CommunityBoardPage() {
  const params = useParams();
  const boardId = params.id || "";
  const board = useMemo(() => boards.find((b) => b.id === boardId), [boardId]);

  const [tab, setTab] = useState<"posts" | "media">("posts");
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("community:follows");
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      setFollowed(set.has(boardId));
    } catch {}
  }, [boardId]);

  const toggleFollow = () => {
    try {
      const raw = localStorage.getItem("community:follows");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(arr);
      if (set.has(boardId)) set.delete(boardId); else set.add(boardId);
      localStorage.setItem("community:follows", JSON.stringify(Array.from(set)));
      setFollowed((v) => !v);
    } catch {}
  };

  if (!board) {
    return (
      <div className="container mx-auto px-6 py-10">
        <Card className="border-primary/20"><CardContent className="py-10 text-center">존재하지 않는 게시판입니다.</CardContent></Card>
      </div>
    );
  }

  const posts = mockPosts[board.id] || [];
  const media = mockMedia[board.id] || [];

  return (
    <div className="container mx-auto px-0 md:px-6 py-6 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20">
        <div className="h-56 sm:h-64 md:h-72 w-full" style={{ backgroundImage: `linear-gradient( to right, rgba(2,6,23,0.6), rgba(2,6,23,0.1) ), url(${board.hero || 'https://images.unsplash.com/photo-1542751371-adc38448a05e'})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{board.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {(board.genres || board.tags).map((t) => (
                  <Badge key={t} variant="secondary" className="bg-primary/15 text-primary border border-primary/30">{t}</Badge>
                ))}
              </div>
              {board.type === 'game' && (
                <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-3">
                  {board.concurrent && <span>{board.concurrent}</span>}
                  {typeof board.rating === 'number' && (
                    <span>평점 {board.rating.toFixed(1)} ({board.ratingCount?.toLocaleString()})</span>
                  )}
                  {board.released && <span>출시 {board.released}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant={followed ? 'default' : 'outline'} className={followed ? '' : 'border-primary/30'} onClick={toggleFollow}>
                {followed ? '팔로잉' : '팔로우'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]" style={{ alignItems: 'start' }}>
        <div className="space-y-6">
          {/* 최신 공지 */}
          <Card className="border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">최신 공지</CardTitle>
              <Button size="sm" variant="ghost">모두 보기</Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border border-primary/20 p-3">2025.09.08 · 버전 1.2 — 레이드 매칭 및 직업 밸런스 조정</div>
              <div className="rounded-md border border-primary/20 p-3">2025.08.22 · 주간 점검 안내</div>
            </CardContent>
          </Card>

          {/* 인기 토론 */}
          <Card className="border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">인기 토론</CardTitle>
              <Button size="sm" variant="ghost">더 보기</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts.map((p) => (
                <div key={p.id} className="rounded-md border border-primary/20 p-3">
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">댓글 {p.comments} · 추천 {p.likes} · {new Date(p.date).toLocaleDateString('ko-KR')}</div>
                </div>
              ))}
              {posts.length === 0 && <div className="text-sm text-muted-foreground">게시글이 없습니다.</div>}
            </CardContent>
          </Card>

          {/* 스크린샷 */}
          <Card className="border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">스크린샷</CardTitle>
              <Button size="sm" variant="ghost">더 보기</Button>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {media.slice(0, 6).map((src, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-primary/20">
                  <img src={src} className="w-full h-32 object-cover" />
                </div>
              ))}
              {media.length === 0 && <div className="text-sm text-muted-foreground">등록된 미디어가 없습니다.</div>}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {board.type === 'game' && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">게임 정보</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="text-muted-foreground">{board.info}</div>
                <Separator />
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
                  <div>개발사</div><div>Studio NGS</div>
                  <div>퍼블리셔</div><div>{board.publisher?.name || '—'}</div>
                  <div>지원</div><div>컨트롤러, 자막 한글</div>
                </div>
              </CardContent>
            </Card>
          )}

          {board.publisher && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">공식 링크</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <a className="text-primary hover:underline" href="#">공식 홈페이지</a>
                <a className="text-primary hover:underline" href="#">패치 노트</a>
                <a className="text-primary hover:underline" href="#">고객 지원</a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
