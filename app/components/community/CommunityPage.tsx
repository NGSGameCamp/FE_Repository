import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Badge } from "../y_ui/base/badge";
import { Button } from "../y_ui/base/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../y_ui/form-controls/select";
import { Separator } from "../y_ui/base/separator";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../y_ui/form-controls/toggle-group";
import { MessageSquare, Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import StarBorder from "~/components/y_ui/motion-effects/StarBorder";
import {
  getCommunityBoards,
} from "../../api/community/communityApi";
import type { CommunityBoard } from "../../api/community/types";
import { getGames } from "../../api/game/gameApi";
import type { GameSummary } from "../../api/game/types";

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

const gameFilterOptions = [
  "전체",
  "Cyberpunk 2087",
  "Neon Racing",
  "Puzzle Matrix",
  "Esports Champion",
  "Digital Art Quest",
] as const;
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
    excerpt:
      "이 스테이지는 체인 반응을 이해하는 것이 핵심입니다. 핵심 포인트는...",
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
  {
    id: "t1",
    title: "패치 1.2 밸런스 조정 토론",
    posts: 152,
    time: "1시간 전",
  },
  {
    id: "t2",
    title: "커뮤니티 스크린샷 콘테스트 결과 공개",
    posts: 87,
    time: "3시간 전",
  },
  { id: "t3", title: "초보자 빌드 모음 가이드", posts: 45, time: "어제" },
];

export function CommunityPage() {
  const [boards, setBoards] = useState<CommunityBoard[]>([]);
  const [boardsLoading, setBoardsLoading] = useState<boolean>(false);
  const [boardsError, setBoardsError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [gameSummaries, setGameSummaries] = useState<GameSummary[]>([]);
  const [gamesError, setGamesError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] =
    useState<(typeof gameFilterOptions)[number]>("전체");
  const [selectedTopic, setSelectedTopic] =
    useState<(typeof topics)[number]>("전체");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    let canceled = false;

    const loadBoards = async () => {
      setBoardsLoading(true);
      setBoardsError(null);
      try {
        const { data } = await getCommunityBoards();
        if (!canceled) {
          setBoards(data);
        }
      } catch (error) {
        if (!canceled) {
          setBoardsError(
            error instanceof Error
              ? error.message
              : "커뮤니티 목록을 불러오지 못했습니다."
          );
        }
      } finally {
        if (!canceled) {
          setBoardsLoading(false);
        }
      }
    };

    loadBoards();

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;

    const loadGames = async () => {
      try {
        const { data } = await getGames();
        if (!canceled) {
          setGameSummaries(data);
        }
      } catch (error) {
        if (!canceled) {
          setGamesError(
            error instanceof Error
              ? error.message
              : "게임 정보를 불러오지 못했습니다."
          );
        }
      }
    };

    loadGames();

    return () => {
      canceled = true;
    };
  }, []);

  const categoryOptions = useMemo(() => {
    const genreSet = new Set<string>();
    gameSummaries.forEach((game) => {
      if (game.genre) {
        genreSet.add(game.genre);
      }
    });

    if (genreSet.size === 0) {
      boards.forEach((board) => {
        (board.tags || []).forEach((tag) => genreSet.add(tag));
        (board.genres || []).forEach((genre) => genreSet.add(genre));
      });
    }

    const sorted = Array.from(genreSet).sort((a, b) => a.localeCompare(b));
    return ["전체", ...sorted];
  }, [boards, gameSummaries]);

  useEffect(() => {
    if (!categoryOptions.includes(selectedCategory)) {
      setSelectedCategory("전체");
    }
  }, [categoryOptions, selectedCategory]);

  const boardGenreMap = useMemo(() => {
    const map = new Map<string, string>();
    gameSummaries.forEach((game) => {
      if (game.genre) {
        map.set(game.title.toLowerCase(), game.genre);
      }
    });
    return map;
  }, [gameSummaries]);

  const filteredBoards = useMemo(() => {
    const gameBoards = boards.filter((board) => board.type === "game");
    if (selectedCategory === "전체") {
      return gameBoards;
    }
    return gameBoards.filter((board) => {
      const boardGenre = boardGenreMap.get(board.name.toLowerCase());
      if (boardGenre) {
        return boardGenre === selectedCategory;
      }
      const fallbackTags = new Set([
        ...(board.tags || []),
        ...(board.genres || []),
      ]);
      return fallbackTags.has(selectedCategory);
    });
  }, [boards, boardGenreMap, selectedCategory]);

  const filteredPosts = useMemo(() => {
    return postsData.filter((p) => {
      const gameOk = selectedGame === "전체" || p.game === selectedGame;
      const topicOk = selectedTopic === "전체" || p.topic === selectedTopic;
      const tagOk =
        selectedTags.length === 0 ||
        selectedTags.some((t) => p.tags.includes(t));
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
          <div className="text-sm text-muted-foreground">
            등록된 게시글 {filteredPosts.length}건
          </div>
          <Button
            asChild
            size="sm"
            variant="outline"
            className="border-primary/30"
          >
            <Link to="/community/all">전체 글</Link>
          </Button>
        </div>
      </div>

      <Card className="border-primary/30 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <CardTitle className="text-lg font-semibold">
              게임별 커뮤니티 찾기
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              관심 있는 게임을 선택하면 해당 커뮤니티로 이동합니다.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <div className="mb-2 text-xs text-muted-foreground">카테고리</div>
            <div className="overflow-x-auto">
              <ToggleGroup
                type="single"
                value={selectedCategory}
                onValueChange={(value) =>
                  setSelectedCategory(value || "전체")
                }
                className="flex w-full gap-2"
              >
                {categoryOptions.map((category) => (
                  <ToggleGroupItem
                    key={category}
                    value={category}
                    className="flex-shrink-0 rounded-full px-4 py-2 text-xs"
                  >
                    {category}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>

          <div className="space-y-3">
            {boardsLoading && (
              <div className="rounded-xl border border-primary/20 p-6 text-sm text-muted-foreground">
                커뮤니티 목록을 불러오는 중입니다...
              </div>
            )}

            {!boardsLoading && boardsError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
                {boardsError}
              </div>
            )}

            {gamesError && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-primary/80">
                게임 장르 정보를 불러오지 못해 커뮤니티 태그 기준으로 표시합니다.
              </div>
            )}

            {!boardsLoading && !boardsError && filteredBoards.length === 0 && (
              <div className="rounded-xl border border-primary/20 p-6 text-sm text-muted-foreground">
                해당 조건에 맞는 커뮤니티가 없습니다.
              </div>
            )}

            {!boardsLoading && !boardsError &&
              filteredBoards.map((board) => {
                const heroSrc = board.hero
                  ? board.hero.includes("?")
                    ? `${board.hero}&auto=compress&fit=crop&w=120&q=60`
                    : `${board.hero}?auto=compress&fit=crop&w=120&q=60`
                  : null;
                const boardGenreLabel = boardGenreMap.get(
                  board.name.toLowerCase()
                );

                return (
                  <Link
                    key={board.id}
                    to={`/community/board/${board.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-primary/20 bg-background/60 p-4 transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-primary/20 bg-primary/10">
                      {heroSrc ? (
                        <img
                          src={heroSrc}
                          alt={`${board.name} 대표 이미지`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-primary">
                          {board.name.slice(0, 2)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold transition-colors group-hover:text-primary">
                          {board.name}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-primary/15 text-primary border border-primary/30"
                        >
                          {board.type === "game" ? "게임" : "토픽"}
                        </Badge>
                        {boardGenreLabel && (
                          <Badge
                            variant="outline"
                            className="border-primary/20 px-2 py-1 text-[11px] text-primary/80"
                          >
                            {boardGenreLabel}
                          </Badge>
                        )}
                      </div>

                      {board.info && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {board.info}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        {board.concurrent && <span>{board.concurrent}</span>}
                        {typeof board.rating === "number" && (
                          <span>
                            평점 {board.rating.toFixed(1)}
                            {board.ratingCount
                              ? ` · ${board.ratingCount.toLocaleString()}명`
                              : ""}
                          </span>
                        )}
                        {board.released && <span>출시 {board.released}</span>}
                      </div>

                      {board.tags && board.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {board.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="border-primary/20 px-2 py-1 text-[11px] text-muted-foreground"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="hidden text-xs font-medium text-primary sm:block">
                      바로 가기 →
                    </div>
                  </Link>
                );
              })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/30 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">게시글 필터</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">게임 선택</div>
              <Select
                value={selectedGame}
                onValueChange={(v) => setSelectedGame(v as any)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="게임 선택" />
                </SelectTrigger>
                <SelectContent>
                  {gameFilterOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">주제 선택</div>
              <Select
                value={selectedTopic}
                onValueChange={(v) => setSelectedTopic(v as any)}
              >
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
              <Button
                variant="outline"
                className="mb-1 border-primary/30"
                onClick={resetFilters}
              >
                필터 초기화
              </Button>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="space-y-3">
            <div className="text-xs text-muted-foreground">태그 필터</div>
            <ToggleGroup
              type="multiple"
              value={selectedTags}
              onValueChange={(v) => setSelectedTags(v)}
              variant="outline"
              className="flex flex-wrap gap-2"
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
            <Link
              key={p.id}
              to={`/community/post/${p.id}`}
              className="block group"
              aria-label={`${p.title} 게시글로 이동`}
            >
              <Card className="border-primary/30 shadow-sm transition-colors transition-shadow hover:shadow-md group-hover:border-primary/40 group-hover:bg-primary/5">
                <CardContent className="pt-0">
                  <h3 className="text-base font-semibold group-hover:text-primary pt-4 pb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground pb-2">
                    {p.excerpt}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pb-3">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary border border-primary/20"
                    >
                      {p.game}
                    </Badge>
                    <Badge variant="outline">{p.topic}</Badge>
                    {p.tags.map((t) => (
                      <Badge
                        key={t}
                        variant="outline"
                        className="text-muted-foreground"
                      >
                        #{t}
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center gap-4">
                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5" /> {p.comments}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" /> {p.likes}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" /> {p.views.toLocaleString()}
                    </span>
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
          <StarBorder
            as="div"
            color="cyan"
            speed="5s"
            className="block w-full"
            style={{ borderRadius: 12 }}
          >
            <Card className="border-transparent shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">트렌딩 토픽</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {trending.map((t) => (
                  <div key={t.id} className="flex items-start justify-between">
                    <div>
                      <div className="text-sm">{t.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {t.time}
                      </div>
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
