import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../y_ui/base/input";
import { Button } from "../y_ui/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Badge } from "../y_ui/base/badge";
import { metrics, games, GameStatus } from "./publisherDashboardData";
import {
  Search,
  Plus,
  ArrowUpRight,
  Star,
  Rocket,
  Sparkles,
} from "lucide-react";
import { cn } from "../y_ui/base/utils";
import { PublisherLayout } from "./PublisherLayout";

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
  const [filter, setFilter] =
    useState<(typeof statusFilters)[number]["id"]>("all");
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
    <PublisherLayout
      title="배급사 대시보드"
      subtitle="매출, 라이브 서비스 지표, 게임 퍼포먼스를 한눈에 모니터링하세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cyan-200">
          <Rocket className="h-3.5 w-3.5" /> Growth Studio
        </div>
      }
      actions={
        <>
          <div className="relative w-full min-w-[220px] sm:w-72">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <Input
              placeholder="게임명 또는 장르 검색..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border-white/15 bg-white/5 pl-12 text-sm text-white placeholder:text-white/40"
            />
          </div>
          <Button
            className="h-11 rounded-2xl bg-blue-500 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.45)] hover:bg-blue-500/90"
            onClick={() => navigate("/publisher/game/upload")}
          >
            <Plus className="mr-2 h-4 w-4" /> 새 게임 등록
          </Button>
        </>
      }
    >
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const delta = metric.delta;
          const isPositive = delta > 0;
          const isNegative = delta < 0;
          const badgeClass = isPositive
            ? "bg-emerald-500/15 text-emerald-200"
            : isNegative
            ? "bg-rose-500/15 text-rose-200"
            : "bg-white/10 text-white/60";
          const deltaText = `${delta > 0 ? "+" : ""}${delta}%`;
          return (
            <Card
              key={metric.id}
              className="group relative overflow-hidden border border-white/14 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]"
            >
              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                <div className="absolute -right-10 top-0 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl" />
              </div>
              <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-white/70">
                  {metric.label}
                </CardTitle>
                <Sparkles className="h-4 w-4 text-white/30" />
              </CardHeader>
              <CardContent className="relative space-y-4 pb-5">
                <p className="text-2xl font-semibold text-white">
                  {metric.value}
                </p>
                <div
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                    badgeClass
                  )}
                >
                  <ArrowUpRight
                    className={cn("h-3.5 w-3.5", isNegative && "rotate-180")}
                  />
                  {deltaText}
                  <span className="text-white/60">{metric.deltaLabel}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-5">
        <div className="flex flex-wrap items-center gap-4 rounded-3xl border border-white/12 bg-publisher-panel px-5 py-5 shadow-[0_16px_48px_rgba(5,12,30,0.45)]">
          {statusFilters.map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "rounded-2xl px-5 py-2 text-sm transition",
                filter === item.id
                  ? "border border-blue-400/50 bg-blue-500/20 text-blue-100 shadow-[0_10px_30px_rgba(59,130,246,0.25)]"
                  : "border border-white/12 bg-white/0 text-white/60 hover:text-white"
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

        <Card className="overflow-hidden border border-white/12 bg-publisher-card text-white shadow-[0_30px_80px_rgba(5,12,30,0.55)]">
          <CardHeader className="flex flex-col gap-3 border-b border-white/10 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg">최근 게임 현황</CardTitle>
              <p className="text-xs text-white/55">
                필터 조건에 맞는 게임들의 라이브 KPI를 확인합니다.
              </p>
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
          <CardContent className="space-y-3 p-0">
            <div className="grid grid-cols-[1.8fr_repeat(5,minmax(0,1fr))] gap-5 border-b border-white/10 bg-white/5 px-7 py-4 text-xs text-white/55">
              <span>게임명</span>
              <span className="text-center">상태</span>
              <span className="text-center">가격</span>
              <span className="text-center">판매량</span>
              <span className="text-center">수익</span>
              <span className="text-center">평점</span>
              <span className="text-center">작업</span>
            </div>

            <div className="space-y-4 px-5 pb-8">
              {filteredGames.map((game) => (
                <div
                  key={game.id}
                  className="grid grid-cols-[1.8fr_repeat(5,minmax(0,1fr))] items-center gap-4 rounded-2xl border border-white/12 bg-publisher-card-muted px-6 py-4 text-sm text-white/85 transition hover:border-blue-400/40 hover:bg-publisher-card-hover"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 text-sm font-semibold text-white">
                      {game.title.slice(0, 2)}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-white">{game.title}</p>
                      <p className="text-xs text-white/50">{game.genre}</p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Badge
                      className={cn(
                        "h-8 rounded-full px-4 text-xs font-medium",
                        statusStyles[game.status]
                      )}
                    >
                      {statusLabels[game.status]}
                    </Badge>
                  </div>
                  <div className="text-center">
                    {formatCurrency(game.price)}
                  </div>
                  <div className="text-center">
                    {formatUnits(game.unitsSold)}
                  </div>
                  <div className="text-center">
                    {formatCurrency(game.revenue)}
                  </div>
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
                      onClick={() => navigate(`/publisher/game/${game.id}`)}
                    >
                      상세
                    </Button>
                  </div>
                </div>
              ))}

              {filteredGames.length === 0 && (
                <div className="rounded-2xl border border-white/10 bg-publisher-panel px-6 py-10 text-center text-sm text-white/65">
                  조건에 맞는 게임이 없습니다. 다른 검색어나 필터를 시도해
                  보세요.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </PublisherLayout>
  );
}
