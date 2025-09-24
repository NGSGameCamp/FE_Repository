import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { metrics, games, GameStatus } from "./publisherDashboardData";
import { Search, Plus, ArrowUpRight, Star } from "lucide-react";
import { cn } from "../ui/utils";

const statusFilters: { id: "all" | GameStatus; label: string }[] = [
  { id: "all", label: "전체" },
  { id: "selling", label: "판매중" },
  { id: "review", label: "심사 중" },
  { id: "paused", label: "판매 중지" },
];

const statusLabels: Record<GameStatus, string> = {
  selling: "판매중",
  review: "심사 중",
  paused: "판매 중지",
};

const statusStyles: Record<GameStatus, string> = {
  selling: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
  review: "bg-amber-500/20 text-amber-200 border-amber-400/40",
  paused: "bg-rose-500/20 text-rose-200 border-rose-400/40",
};

function formatCurrency(value?: number) {
  if (value == null) return "-";
  return `₩${value.toLocaleString()}`;
}

function formatUnits(value?: number) {
  if (value == null) return "-";
  return value.toLocaleString();
}

export default function PublisherDashboardPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<typeof statusFilters[number]["id"]>("all");
  const [query, setQuery] = useState("");

  const filteredGames = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return games.filter((game) => {
      const matchesStatus = filter === "all" ? true : game.status === filter;
      const matchesQuery = normalizedQuery
        ? `${game.title} ${game.genre}`.toLowerCase().includes(normalizedQuery)
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050716] py-14 px-6 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">대시보드</h1>
            <p className="text-sm text-white/60">배급사 실적과 게임 현황을 한눈에 확인하세요.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full min-w-[250px] sm:w-80">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="게임명 또는 장르 검색..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 rounded-2xl border-white/10 bg-white/5 pl-12 text-sm text-white placeholder:text-white/40"
              />
            </div>
            <Button
              className="h-12 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.45)]"
              onClick={() => navigate("/publisher/games/new")}
            >
              <Plus className="mr-2 h-4 w-4" /> 새 게임 등록
            </Button>
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const delta = metric.delta;
            const isPositive = delta > 0;
            const isNegative = delta < 0;
            const badgeClass = isPositive
              ? "bg-emerald-500/10 text-emerald-200"
              : isNegative
              ? "bg-rose-500/10 text-rose-200"
              : "bg-white/10 text-white/60";
            const deltaText = `${delta > 0 ? "+" : ""}${delta}%`;
            return (
            <Card key={metric.id} className="border border-white/10 bg-[#0b1120]/90 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-white/70">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-2xl font-semibold text-white">{metric.value}</p>
                <div
                  className={cn(
                    "flex items-center gap-2 text-xs",
                    isPositive && "text-emerald-200",
                    isNegative && "text-rose-200",
                    !isPositive && !isNegative && "text-white/60"
                  )}
                >
                  <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-1", badgeClass)}>
                    <ArrowUpRight
                      className={cn(
                        "h-3 w-3",
                        isNegative && "rotate-180",
                        !isPositive && !isNegative && "text-white/60"
                      )}
                    />
                    {deltaText}
                  </span>
                  <span className="text-white/50">{metric.deltaLabel}</span>
                </div>
              </CardContent>
            </Card>
            );
          })}
        </section>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            {statusFilters.map((item) => (
              <button
                key={item.id}
                onClick={() => setFilter(item.id)}
                className={cn(
                  "rounded-2xl px-5 py-2 text-sm transition",
                  filter === item.id
                    ? "bg-blue-500/20 text-blue-200 border border-blue-400/40"
                    : "border border-white/10 bg-white/0 text-white/60 hover:text-white"
                )}
              >
                {item.label}
              </button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto gap-2 rounded-2xl border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10"
              onClick={() => navigate("/publisher03")}
            >
              모두 보기
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Card className="border border-white/10 bg-[#0b1120]/95 text-white shadow-[0_18px_60px_rgba(8,13,35,0.5)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">최근 게임 현황</CardTitle>
                <p className="text-xs text-white/50">최근 업데이트된 게임 리스트를 확인합니다.</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 rounded-2xl border border-white/10 bg-white/5 text-xs text-white/70 hover:bg-white/10"
                onClick={() => navigate("/publisher03")}
              >
                모두 보기
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-[2fr_repeat(5,minmax(0,1fr))] gap-4 rounded-2xl border border-white/5 bg-[#111933] px-6 py-3 text-xs text-white/40">
                <span>게임명</span>
                <span className="text-center">상태</span>
                <span className="text-center">가격</span>
                <span className="text-center">판매량</span>
                <span className="text-center">수익</span>
                <span className="text-center">평점</span>
                <span className="text-center">작업</span>
              </div>

              <div className="space-y-3">
                {filteredGames.map((game) => (
                  <div
                    key={game.id}
                    className="grid grid-cols-[2fr_repeat(5,minmax(0,1fr))] items-center gap-4 rounded-2xl border border-white/5 bg-[#0d1326]/90 px-6 py-4 text-sm text-white/80"
                  >
                    <div>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500" />
                        <div className="space-y-0.5">
                          <p className="font-semibold text-white">{game.title}</p>
                          <p className="text-xs text-white/50">{game.genre}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <Badge className={cn("h-8 rounded-full px-4 text-xs font-medium", statusStyles[game.status])}>
                        {statusLabels[game.status]}
                      </Badge>
                    </div>
                    <div className="text-center">{formatCurrency(game.price)}</div>
                    <div className="text-center">{formatUnits(game.unitsSold)}</div>
                    <div className="text-center">{formatCurrency(game.revenue)}</div>
                    <div className="flex items-center justify-center gap-1 text-white">
                      {game.rating ? (
                        <>
                          <Star className="h-4 w-4 text-amber-300" />
                          <span>{game.rating}</span>
                        </>
                      ) : (
                        <span className="text-white/40">-</span>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20"
                        onClick={() => navigate(`/publisher/games/${game.id}`)}
                      >
                        상세
                      </Button>
                    </div>
                  </div>
                ))}

                {filteredGames.length === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-[#0b1120]/80 px-6 py-10 text-center text-sm text-white/60">
                    조건에 맞는 게임이 없습니다. 다른 검색어나 필터를 시도해 보세요.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
