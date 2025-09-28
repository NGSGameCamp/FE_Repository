import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { MessageSquare, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import StarBorder from "@/components/ui/StarBorder";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  game: string;
  topic: string;
  tags: string[];
  comments: number;
  likes: number;
  views: number;
  time: string;
};

const games = ["전체", "Cyberpunk 2087", "Neon Racing", "Puzzle Matrix", "Esports Champion", "Digital Art Quest"] as const;
const topics = ["전체", "토론", "스크린샷", "가이드", "방송"] as const;
const allTags = ["인기", "신규", "질문", "가이드", "팁", "공지"] as const;

const postsData: Post[] = [
  {
    id: "p1",
    title: "레이드 매칭 시스템 개선 아이디어 모음",
    excerpt:
      "현재 매칭 시간이 너무 길고, 개인별 선호도 반영이 어렵다는 문제를 해결하기 위해 몇 가지 개선을 정리했습니다...",
    game: "Esports Champion",
    topic: "토론",
    tags: ["인기", "질문"],
    comments: 89,
    likes: 241,
    views: 8931,
    time: "2시간 전",
  },
  {
    id: "p2",
    title: "초보자 장비 모음 (업데이트)",
    excerpt:
      "처음 시작하는 분들을 위한 장비 추천을 한 눈에 정리했습니다. 무기, 방어구, 스킬 정비, 스펙 티어링...",
    game: "Cyberpunk 2087",
    topic: "가이드",
    tags: ["가이드", "팁"],
    comments: 54,
    likes: 120,
    views: 5402,
    time: "6시간 전",
  },
  {
    id: "p3",
    title: "오늘의 네온 시티 스크린샷",
    excerpt: "새로 추가된 포토 모드로 찍은 스샷 공유합니다!",
    game: "Neon Racing",
    topic: "스크린샷",
    tags: ["신규"],
    comments: 18,
    likes: 76,
    views: 1293,
    time: "3시간 전",
  },
  {
    id: "p4",
    title: "퍼즐 매트릭스 스테이지 12 공략",
    excerpt: "이 스테이지는 체인 반응을 이해하는 것이 핵심입니다. 핵심 포인트는...",
    game: "Puzzle Matrix",
    topic: "가이드",
    tags: ["가이드", "공지"],
    comments: 11,
    likes: 98,
    views: 2103,
    time: "1일 전",
  },
  {
    id: "p5",
    title: "PvP 초근접 전투 팁 7가지",
    excerpt: "원거리 메타 속에서도 가깝게 붙어 이기는 방법들 정리",
    game: "Esports Champion",
    topic: "가이드",
    tags: ["팁"],
    comments: 23,
    likes: 142,
    views: 3201,
    time: "1일 전",
  },
];

const trending = [
  { id: "t1", title: "패치 1.2 밸런스 조정 토론", posts: 152, time: "1시간 전" },
  { id: "t2", title: "커뮤니티 스크린샷 콘테스트 결과 공개", posts: 87, time: "3시간 전" },
  { id: "t3", title: "초보자 빌드 모음 가이드", posts: 45, time: "어제" },
];

export function CommunityPage() {
  const [selectedGame, setSelectedGame] = useState<(typeof games)[number]>("전체");
  const [selectedTopic, setSelectedTopic] = useState<(typeof topics)[number]>("전체");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    return postsData.filter((p) => {
      const gameOk = selectedGame === "전체" || p.game === selectedGame;
      const topicOk = selectedTopic === "전체" || p.topic === selectedTopic;
      const tagOk =
        selectedTags.length === 0 || selectedTags.some((t) => p.tags.includes(t));
      return gameOk && topicOk && tagOk;
    });
  }, [selectedGame, selectedTopic, selectedTags]);

  const resetFilters = () => {
    setSelectedGame("전체");
    setSelectedTopic("전체");
    setSelectedTags([]);
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white px-4">커뮤니티</h2>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">등록된 게시글 {filteredPosts.length}건</div>
          <Button asChild size="sm" variant="outline" className="border-primary/30">
            <Link to="/community/all">전체 글</Link>
          </Button>
        </div>
      </div>

      <Card className="border-primary/30 shadow-sm">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">게임 선택</div>
              <Select value={selectedGame} onValueChange={(v) => setSelectedGame(v as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="게임 선택" />
                </SelectTrigger>
                <SelectContent>
                  {games.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">주제 선택</div>
              <Select value={selectedTopic} onValueChange={(v) => setSelectedTopic(v as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="주제 선택" />
                </SelectTrigger>
                <SelectContent>
                  {topics.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end justify-end">
              <Button variant="outline" className="border-primary/30 mb-4" onClick={resetFilters}>
                필터 초기화
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <div className="text-xs text-muted-foreground mt-4 mb-2">태그 필터</div>
            <ToggleGroup
              type="multiple"
              value={selectedTags}
              onValueChange={(v) => setSelectedTags(v)}
              variant="outline"
              className="flex flex-wrap"
            >
              {allTags.map((t) => (
                <ToggleGroupItem key={t} value={t} className="px-3">
                  {t}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 grid-7-3">
        {/* Main list */}
        <div className="space-y-6">
          {filteredPosts.map((p) => (
            <Link key={p.id} to={`/community/post/${p.id}`} className="block group" aria-label={`${p.title} 게시글로 이동`}>
              <Card className="border-primary/30 shadow-sm transition-colors transition-shadow hover:shadow-md group-hover:border-primary/40 group-hover:bg-primary/5">
                <CardContent className="pt-0">
                  <h3 className="text-base font-semibold group-hover:text-primary pt-4 pb-2">{p.title}</h3> 
                  <p className="text-sm text-muted-foreground pb-2">{p.excerpt}</p>
                  <div className="flex flex-wrap items-center gap-2 pb-3">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">
                      {p.game}
                    </Badge>
                    <Badge variant="outline">{p.topic}</Badge>
                    {p.tags.map((t) => (
                      <Badge key={t} variant="outline" className="text-muted-foreground">
                        #{t}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-4">
                    <span className="inline-flex items-center gap-1"><MessageSquare className="h-3.5 w-3.5" /> {p.comments}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {p.likes}</span>
                    <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {p.views.toLocaleString()}</span>
                    <span>· {p.time}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}

          {filteredPosts.length === 0 && (
            <Card className="border-primary/30">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">
                조건에 맞는 게시글이 없습니다.
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <StarBorder as="div" color="cyan" speed="5s" className="block w-full" style={{ borderRadius: 12 }}>
            <Card className="border-transparent shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">트렌딩 토픽</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trending.map((t) => (
                  <div key={t.id} className="flex items-start justify-between">
                    <div>
                      <div className="text-sm">{t.title}</div>
                      <div className="text-xs text-muted-foreground">{t.time}</div>
                    </div>
                    <Badge variant="outline">게시글 {t.posts}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </StarBorder>
        </div>
      </div>
    </div>
  );
}

export default CommunityPage;
