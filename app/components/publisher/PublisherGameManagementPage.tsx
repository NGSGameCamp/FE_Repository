import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { mockGames } from "@/data/mockGames";
import { PublisherLayout } from "./PublisherLayout";
import { Search, Plus, ChevronDown, Star, Gamepad } from "lucide-react";

const sortOptions = [
  { id: "latest", label: "최신순" },
  { id: "sales", label: "판매량순" },
  { id: "revenue", label: "수익순" },
  { id: "rating", label: "평점순" },
] as const;

const statusFilters = [
  { id: "all", label: "전체" },
  { id: "selling", label: "판매 중" },
  { id: "review", label: "심사 중" },
  { id: "paused", label: "판매 중지" },
  { id: "upcoming", label: "준비 중" },
] as const;

function formatCurrency(value?: number | string) {
  if (value == null) return "-";
  if (typeof value === "string" && value.includes("₩")) return value;
  const number = typeof value === "string" ? parseInt(value, 10) : value;
  if (Number.isNaN(number)) return "-";
  if (number >= 1_000_000) return `₩${(number / 1_000_000).toFixed(1)}M`;
  return `₩${number.toLocaleString()}`;
}

const extendedGames = mockGames.map((game, index) => ({
  ...game,
  status: index % 4 === 0 ? "selling" : index % 4 === 1 ? "review" : index % 4 === 2 ? "paused" : "upcoming",
  revenue: 20000000 + index * 6000000,
  unitsSold: 500 + index * 120,
  rating: Number(game.rating) || 4.5,
  priceValue: Number(String(game.price).replace(/[^0-9]/g, "")) || 0,
}));

export default function PublisherGameManagementPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]["id"]>("all");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["id"]>("latest");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    let list = [...extendedGames];

    if (status !== "all") {
      list = list.filter((game) => game.status === status);
    }
    if (normalized) {
      list = list.filter((game) =>
        `${game.title} ${game.genre}`.toLowerCase().includes(normalized),
      );
    }

    switch (sort) {
      case "sales":
        list.sort((a, b) => (b.unitsSold || 0) - (a.unitsSold || 0));
        break;
      case "revenue":
        list.sort((a, b) => (b.revenue || 0) - (a.revenue || 0));
        break;
      case "rating":
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        list.sort((a, b) => Number(b.id) - Number(a.id));
        break;
    }

    return list;
  }, [query, status, sort]);

  return (
    <PublisherLayout
      title="게임 관리"
      subtitle="등록된 게임의 판매 현황을 살펴보고 빠르게 수정하거나 새 게임을 등록하세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
          <Gamepad className="h-3.5 w-3.5" /> Game Center
        </div>
      }
      actions={
        <>
          <div className="relative w-full min-w-[220px] sm:w-72">
            <Input
              placeholder="게임 검색..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40"
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
      <section className="space-y-12">
        <div className="flex flex-wrap items-center gap-5 rounded-3xl border border-white/12 bg-publisher-panel px-6 py-6 shadow-[0_18px_52px_rgba(5,12,30,0.45)]">
          {statusFilters.map((filterItem) => (
            <button
              key={filterItem.id}
              onClick={() => setStatus(filterItem.id)}
              className={`rounded-2xl px-5 py-2 text-sm transition ${
                status === filterItem.id
                  ? "border border-blue-400/50 bg-blue-500/20 text-blue-100 shadow-[0_10px_30px_rgba(59,130,246,0.25)]"
                  : "border border-white/10 bg-white/0 text-white/60 hover:text-white"
              }`}
            >
              {filterItem.label}
            </button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/70 hover:bg-white/10"
              >
                {sortOptions.find((option) => option.id === sort)?.label ?? "정렬"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 border border-white/10 bg-publisher-card text-white">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.id}
                  className="cursor-pointer text-sm text-white/80 focus:bg-blue-500/20"
                  onClick={() => setSort(option.id)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((game) => (
            <Card
              key={game.id}
              className="group overflow-hidden rounded-[28px] border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)] transition hover:border-blue-400/50"
            >
              <div
                className="h-32 w-full bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(37,99,235,0.45), rgba(14,31,62,0.85))`,
                }}
              />
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{game.title}</h3>
                    <p className="text-xs text-white/65">
                      {game.genre} {game.price}
                    </p>
                  </div>
                  <Badge className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">
                    {game.status === "selling"
                      ? "판매 중"
                      : game.status === "review"
                      ? "심사 중"
                      : game.status === "paused"
                      ? "판매 중지"
                      : "준비 중"}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center text-xs text-white/60">
                  <div>
                    <p className="text-white/50">판매량</p>
                    <p className="text-sm font-semibold text-white">
                      {(game.unitsSold || 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50">수익</p>
                    <p className="text-sm font-semibold text-white">
                      {formatCurrency(game.revenue)}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-white/50">평점</p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-white">
                      <Star className="h-4 w-4 text-amber-300" />
                      {game.rating?.toFixed(1) ?? "-"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="h-10 flex-1 rounded-2xl border border-white/12 bg-white/5 text-sm text-white/70 hover:bg-white/10"
                    onClick={() => navigate(`/publisher/game/${game.id}`)}
                  >
                    상세 보기
                  </Button>
                  <Button
                    variant="ghost"
                    className="h-10 flex-1 rounded-2xl border border-blue-500/40 bg-blue-500/10 text-sm text-blue-200 hover:bg-blue-500/20"
                    onClick={() => navigate(`/publisher/game/${game.id}/edit`)}
                  >
                    수정
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {filtered.length === 0 && (
            <Card className="border border-white/12 bg-publisher-panel text-center text-white/70">
              <CardContent className="py-16 text-sm">
                조건에 맞는 게임이 없습니다. 다른 검색어나 필터를 시도해 보세요.
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </PublisherLayout>
  );
}
