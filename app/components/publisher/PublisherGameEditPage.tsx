import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Search,
  Gamepad,
  ChevronDown,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { PublisherLayout } from "./PublisherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Input } from "../y_ui/base/input";
import { Label } from "../y_ui/base/label";
import { Textarea } from "../y_ui/base/textarea";
import { Button } from "../y_ui/base/button";
import { Badge } from "../y_ui/base/badge";
import { Checkbox } from "../y_ui/form-controls/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../y_ui/overlay/dropdown-menu";
import { toast } from "sonner";
import { useGameStore } from "../../stores/gameStore";
import type { GameSummary } from "../../api/game/types";

const categories = [
  "액션",
  "RPG",
  "어드벤처",
  "시뮬레이션",
  "레이싱",
  "퍼즐",
  "슈팅",
  "전략",
];
const saleStatuses = [
  { id: "selling", label: "판매 중" },
  { id: "paused", label: "판매 중지" },
  { id: "review", label: "검수 중" },
  { id: "upcoming", label: "출시 예정" },
] as const;
const platforms = [
  "Windows",
  "macOS",
  "Linux",
  "PlayStation",
  "Xbox",
  "Nintendo Switch",
];

type SaleStatus = (typeof saleStatuses)[number]["id"];

type GameDetail = {
  saleStatus: SaleStatus;
  price: string;
  category: string;
  description: string;
  tags: string[];
  discountRate: string;
  discountStart: string;
  discountEnd: string;
  promotionName: string;
  platforms: string[];
  features: string[];
  updates: Array<{ version: string; date: string; note: string }>;
  featureSummary: string;
};

const defaultDetails: Record<string, GameDetail> = {
  "1": {
    saleStatus: "selling",
    price: "59000",
    category: "액션",
    description: "미래 도시를 배경으로 한 프리미엄 액션 RPG입니다.",
    tags: ["사이버펑크", "오픈월드", "RPG"],
    discountRate: "10",
    discountStart: "2024-12-01",
    discountEnd: "2024-12-15",
    promotionName: "겨울 할인전",
    platforms: ["Windows", "PlayStation", "Xbox"],
    features: ["실시간 전투", "커스텀 사이버웨어", "분기형 스토리"],
    updates: [
      {
        version: "v1.2.0",
        date: "2024-11-28",
        note: "새로운 퀘스트와 버그 수정",
      },
      {
        version: "v1.1.5",
        date: "2024-11-15",
        note: "성능 최적화 및 안정성 개선",
      },
      {
        version: "v1.1.0",
        date: "2024-10-30",
        note: "신규 맵 추가 및 밸런스 조정",
      },
    ],
    featureSummary: "거대 도시에서 펼쳐지는 선택형 사이버펑크 모험",
  },
};

const fallbackDetails: GameDetail = {
  saleStatus: "selling",
  price: "0",
  category: categories[0],
  description: "",
  tags: [],
  discountRate: "0",
  discountStart: "",
  discountEnd: "",
  promotionName: "",
  platforms: ["Windows"],
  features: [],
  updates: [],
  featureSummary: "",
};

const platformTemplates: string[][] = [
  ["Windows"],
  ["Windows", "PlayStation"],
  ["Windows", "Xbox"],
  ["Windows", "macOS"],
  ["Windows", "PlayStation", "Xbox"],
  ["Windows", "Nintendo Switch"],
];
const featureSeeds = [
  "싱글 플레이 집중",
  "협동 플레이 지원",
  "시즌제 운영",
  "크로스플레이",
  "엔드게임 레이드",
  "커뮤니티 챌린지",
];
const updateNoteTemplates = [
  "성능 최적화와 안정성 개선",
  "신규 콘텐츠 추가",
  "핵심 시스템 밸런스 조정",
  "커뮤니티 피드백 반영",
];
const seasonLabels = ["봄", "여름", "가을", "겨울"];

function generateDetailFromGame(
  game: GameSummary,
  collection: GameSummary[]
): GameDetail {
  const index = collection.findIndex((item) => item.id === game.id);
  const normalizedIndex = index >= 0 ? index : 0;
  const priceValue = extractPrice(game.price);
  const hasDiscount = normalizedIndex % 2 === 0 && priceValue !== "0";
  const discountRate = hasDiscount
    ? String(10 + ((normalizedIndex * 5) % 15))
    : "0";
  const patternMonth = (normalizedIndex % 12) + 1;

  return {
    saleStatus: saleStatuses[normalizedIndex % saleStatuses.length].id,
    price: priceValue,
    category: game.genre || categories[0],
    description: game.description,
    tags: [...game.tags],
    discountRate,
    discountStart: hasDiscount
      ? `2024-${String(patternMonth).padStart(2, "0")}-01`
      : "",
    discountEnd: hasDiscount
      ? `2024-${String((patternMonth % 12) + 1).padStart(2, "0")}-14`
      : "",
    promotionName: hasDiscount
      ? `${seasonLabels[normalizedIndex % seasonLabels.length]} 프로모션`
      : "",
    platforms: platformTemplates[normalizedIndex % platformTemplates.length],
    features: Array.from(
      new Set([
        ...game.tags,
        featureSeeds[normalizedIndex % featureSeeds.length],
        featureSeeds[(normalizedIndex + 2) % featureSeeds.length],
      ])
    ),
    updates: Array.from({ length: 2 }, (_, idx) => ({
      version: `v1.${normalizedIndex + idx + 1}.0`,
      date: `2024-${String(((patternMonth + idx) % 12) + 1).padStart(
        2,
        "0"
      )}-${String(10 + idx * 6).padStart(2, "0")}`,
      note: `${game.title} ${
        updateNoteTemplates[
          (normalizedIndex + idx) % updateNoteTemplates.length
        ]
      }`,
    })),
    featureSummary: `${game.genre} 장르의 핵심 경험을 강화한 주요 기능을 정리했습니다.`,
  };
}

function extractPrice(value?: string) {
  if (!value) return "0";
  const numeric = value.replace(/[^0-9]/g, "");
  return numeric || "0";
}

function getReviewStatusCounts(games: GameSummary[]) {
  const counts = { waiting: 0, progress: 0, answered: 0 };
  games.forEach((_, index) => {
    const key =
      index % 3 === 0 ? "waiting" : index % 3 === 1 ? "progress" : "answered";
    counts[key as keyof typeof counts] += 1;
  });
  return counts;
}

export default function PublisherGameEditPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const games = useGameStore((state) => state.games);
  const fetchGames = useGameStore((state) => state.fetchGames);
  const gamesLoading = useGameStore((state) => state.loading);
  const counts = useMemo(() => getReviewStatusCounts(games), [games]);
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [price, setPrice] = useState("0");
  const [saleStatus, setSaleStatus] = useState<SaleStatus>("selling");
  const [description, setDescription] = useState("");
  const [featureSummary, setFeatureSummary] = useState("");
  const [promotionName, setPromotionName] = useState("");
  const [discountRate, setDiscountRate] = useState("0");
  const [discountStart, setDiscountStart] = useState("");
  const [discountEnd, setDiscountEnd] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [platformSelection, setPlatformSelection] = useState<string[]>([
    "Windows",
  ]);
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [updates, setUpdates] = useState<
    Array<{ version: string; date: string; note: string }>
  >([]);

  useEffect(() => {
    if (!games.length && !gamesLoading) {
      fetchGames();
    }
  }, [fetchGames, games.length, gamesLoading]);

  const game = useMemo(
    () => games.find((item) => item.id === gameId),
    [games, gameId]
  );
  const detail = useMemo(() => {
    if (!game) return fallbackDetails;
    if (game.id && defaultDetails[game.id]) return defaultDetails[game.id];
    return generateDetailFromGame(game, games);
  }, [game, games]);

  useEffect(() => {
    if (!game) return;

    const base = detail ?? fallbackDetails;
    setTitle(game.title);
    setCategory(base.category || game.genre || categories[0]);
    setPrice(base.price || extractPrice(game.price));
    setSaleStatus(base.saleStatus);
    setDescription(base.description || game.description || "");
    setFeatureSummary(base.featureSummary);
    setPromotionName(base.promotionName);
    setDiscountRate(base.discountRate);
    setDiscountStart(base.discountStart);
    setDiscountEnd(base.discountEnd);
    setTags(base.tags.length ? [...base.tags] : [...(game.tags || [])]);
    setPlatformSelection(
      base.platforms.length ? [...base.platforms] : ["Windows"]
    );
    setFeatures([...base.features]);
    setUpdates(
      base.updates.length ? base.updates.map((entry) => ({ ...entry })) : []
    );
    setTagInput("");
    setFeatureInput("");
  }, [game?.id, detail, game]);

  const suggestions = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return [];
    return games.filter((item) =>
      `${item.title} ${item.genre}`.toLowerCase().includes(value)
    );
  }, [games, searchTerm]);

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const removeTag = (target: string) => {
    setTags((prev) => prev.filter((tag) => tag !== target));
  };

  const togglePlatform = (platform: string) => {
    setPlatformSelection((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
  };

  const addFeature = (value?: string) => {
    const next = value ?? featureInput.trim();
    if (!next || features.includes(next)) return;
    setFeatures((prev) => [...prev, next]);
    if (!value) setFeatureInput("");
  };

  const removeFeature = (target: string) => {
    setFeatures((prev) => prev.filter((feature) => feature !== target));
  };

  const applyTemplate = (item: GameSummary) => {
    const template = defaultDetails[item.id] ?? fallbackDetails;
    setTitle(item.title);
    setCategory(template.category || item.genre || categories[0]);
    setPrice(template.price || extractPrice(item.price));
    setSaleStatus(template.saleStatus);
    setDescription(template.description || item.description || "");
    setFeatureSummary(template.featureSummary);
    setPromotionName(template.promotionName);
    setDiscountRate(template.discountRate);
    setDiscountStart(template.discountStart);
    setDiscountEnd(template.discountEnd);
    setTags(template.tags.length ? [...template.tags] : [...(item.tags || [])]);
    setPlatformSelection(
      template.platforms.length ? [...template.platforms] : ["Windows"]
    );
    setFeatures([...template.features]);
    setUpdates(
      template.updates.length
        ? template.updates.map((entry) => ({ ...entry }))
        : []
    );
    setTagInput("");
    setFeatureInput("");
    toast.success(`${item.title} 정보를 불러왔습니다.`);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) {
      toast.error("게임 제목을 입력해 주세요.");
      return;
    }
    toast.success("게임 정보가 저장되었습니다. 검수 후 반영됩니다.");
    navigate("/publisher/games");
  };

  const addUpdate = () => {
    setUpdates((prev) => [
      { version: `v${(prev.length + 1).toFixed(1)}`, date: "", note: "" },
      ...prev,
    ]);
  };

  const updateChange = (
    index: number,
    field: "version" | "date" | "note",
    value: string
  ) => {
    setUpdates((prev) => {
      const clone = [...prev];
      clone[index] = { ...clone[index], [field]: value };
      return clone;
    });
  };

  const deleteUpdate = (index: number) => {
    setUpdates((prev) => prev.filter((_, idx) => idx !== index));
  };

  if (!game && gamesLoading) {
    return (
      <PublisherLayout
        title="게임 정보 수정"
        subtitle="게임 데이터를 불러오는 중입니다."
        heroBadge={
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
            <Sparkles className="h-3.5 w-3.5" /> Loading
          </div>
        }
      >
        <Card className="border border-white/12 bg-publisher-card text-center text-white/70">
          <CardContent className="py-16">로딩 중...</CardContent>
        </Card>
      </PublisherLayout>
    );
  }

  if (!game) {
    return (
      <PublisherLayout
        title="게임 정보 수정"
        subtitle="선택한 게임 정보를 찾을 수 없습니다."
        heroBadge={
          <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-200">
            <AlertTriangle className="h-3.5 w-3.5" /> Not Found
          </div>
        }
      >
        <Card className="border border-white/12 bg-publisher-card text-center text-white/70">
          <CardContent className="py-16">
            존재하지 않는 게임입니다. 게임 관리 페이지로 돌아가 다시 시도해
            주세요.
            <div className="mt-6 flex justify-center">
              <Button
                className="h-11 rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white"
                onClick={() => navigate("/publisher/games")}
              >
                게임 관리로 이동
              </Button>
            </div>
          </CardContent>
        </Card>
      </PublisherLayout>
    );
  }

  return (
    <PublisherLayout
      title={`${game.title} / 정보 수정`}
      subtitle="게임의 판매 정보와 플랫폼 설정, 기능을 최신 상태로 유지하세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
          <Gamepad className="h-3.5 w-3.5" /> Game Update
        </div>
      }
      actions={
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/65">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
            접수대기
            <Badge className="rounded-full border border-blue-400/40 bg-blue-500/15 px-2 py-0 text-[11px] text-blue-100">
              {counts.waiting}
            </Badge>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
            처리중
            <Badge className="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0 text-[11px] text-amber-100">
              {counts.progress}
            </Badge>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
            답변완료
            <Badge className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0 text-[11px] text-emerald-100">
              {counts.answered}
            </Badge>
          </span>
        </div>
      }
      className="max-w-6xl"
    >
      <form onSubmit={handleSubmit} className="space-y-10">
        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="game-search">게임 검색</Label>
              <div className="relative">
                <Input
                  id="game-search"
                  placeholder="게임 이름 또는 장르로 검색"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 px-10 text-sm text-white placeholder:text-white/40"
                />
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                {searchTerm && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 space-y-1 rounded-2xl border border-white/12 bg-publisher-card-muted p-3 shadow-[0_18px_40px_rgba(5,12,30,0.45)]">
                    {suggestions.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          applyTemplate(item);
                          setSearchTerm("");
                        }}
                        className="w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10"
                      >
                        {item.title} · {item.genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">게임 제목 *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">가격 *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
                <p className="text-xs text-white/50">
                  무료 게임의 경우 0을 입력하세요.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10"
                    >
                      {category}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 border border-white/12 bg-publisher-card text-white">
                    {categories.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        className="cursor-pointer text-sm text-white/80 focus:bg-blue-500/20"
                        onClick={() => setCategory(option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sale-status">판매 상태</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      id="sale-status"
                      type="button"
                      variant="ghost"
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10"
                    >
                      {saleStatuses.find((item) => item.id === saleStatus)
                        ?.label ?? "선택"}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 border border-white/12 bg-publisher-card text-white">
                    {saleStatuses.map((option) => (
                      <DropdownMenuItem
                        key={option.id}
                        className="cursor-pointer text-sm text-white/80 focus:bg-blue-500/20"
                        onClick={() => setSaleStatus(option.id)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">게임 소개 *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="게임에 대한 상세 설명을 입력하세요."
                className="rounded-2xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="feature-summary">주요 하이라이트</Label>
              <Textarea
                id="feature-summary"
                value={featureSummary}
                onChange={(event) => setFeatureSummary(event.target.value)}
                rows={3}
                placeholder="게임 기능 요약을 입력하세요."
                className="rounded-2xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tag-input">태그</Label>
              <Input
                id="tag-input"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="태그 입력 후 Enter"
                className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="cursor-pointer rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs text-blue-100"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-xs text-white/40">
                    등록된 태그가 없습니다.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">가격 및 프로모션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="promotion-name">프로모션 이름</Label>
                <Input
                  id="promotion-name"
                  value={promotionName}
                  onChange={(event) => setPromotionName(event.target.value)}
                  placeholder="예) 겨울 할인전"
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-rate">할인율 (%)</Label>
                <Input
                  id="discount-rate"
                  type="number"
                  min={0}
                  max={100}
                  value={discountRate}
                  onChange={(event) => setDiscountRate(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label>할인 기간</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="date"
                    value={discountStart}
                    onChange={(event) => setDiscountStart(event.target.value)}
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white"
                  />
                  <Input
                    type="date"
                    value={discountEnd}
                    onChange={(event) => setDiscountEnd(event.target.value)}
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">플랫폼 및 요구사항</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>지원 플랫폼 *</Label>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <label
                    key={platform}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <Checkbox
                      checked={platformSelection.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                      className="border-white/30 data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-500"
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Sparkles className="h-4 w-4 text-blue-200" /> 주요 기능
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-input">기능 추가</Label>
              <Input
                id="feature-input"
                value={featureInput}
                onChange={(event) => setFeatureInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="예) 실시간 PvP, 시즌제 운영"
                className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature) => (
                <Badge
                  key={feature}
                  className="cursor-pointer rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs text-blue-100"
                  onClick={() => removeFeature(feature)}
                >
                  {feature} ×
                </Badge>
              ))}
              {features.length === 0 && (
                <p className="text-xs text-white/40">등록된 기능이 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="flex flex-col gap-3 border-b border-white/10 md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-lg">업데이트 이력</CardTitle>
            <Button
              type="button"
              variant="ghost"
              onClick={addUpdate}
              className="h-10 rounded-2xl border border-white/15 bg-white/5 text-sm text-white/80 hover:bg-white/10"
            >
              + 업데이트 추가
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {updates.length === 0 && (
              <p className="text-sm text-white/50">
                등록된 업데이트가 없습니다.
              </p>
            )}
            {updates.map((entry, index) => (
              <div
                key={`${entry.version}-${index}`}
                className="rounded-2xl border border-white/10 bg-white/5 p-4"
              >
                <div className="grid gap-3 md:grid-cols-[160px_160px_1fr]">
                  <div className="space-y-2">
                    <Label htmlFor={`version-${index}`}>버전</Label>
                    <Input
                      id={`version-${index}`}
                      value={entry.version}
                      onChange={(event) =>
                        updateChange(index, "version", event.target.value)
                      }
                      className="h-10 rounded-xl border-white/15 bg-black/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`date-${index}`}>배포일</Label>
                    <Input
                      id={`date-${index}`}
                      type="date"
                      value={entry.date}
                      onChange={(event) =>
                        updateChange(index, "date", event.target.value)
                      }
                      className="h-10 rounded-xl border-white/15 bg-black/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`note-${index}`}>내용</Label>
                    <Textarea
                      id={`note-${index}`}
                      value={entry.note}
                      onChange={(event) =>
                        updateChange(index, "note", event.target.value)
                      }
                      rows={2}
                      className="rounded-xl border-white/15 bg-black/20 text-sm text-white"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => deleteUpdate(index)}
                    className="h-9 rounded-xl border border-red-500/40 bg-red-500/10 text-xs text-red-200 hover:bg-red-500/20"
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border border-red-500/30 bg-red-950/30 text-white shadow-[0_26px_70px_rgba(59,10,10,0.45)]">
          <CardHeader className="border-b border-red-500/20">
            <CardTitle className="text-lg text-red-100">위험 구역</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-100/90">
              <h4 className="text-base font-semibold text-red-100">
                판매 중지
              </h4>
              <p className="text-xs text-red-100/70">
                게임 판매를 일시적으로 중지합니다.
              </p>
              <Button
                type="button"
                onClick={() => toast("판매 중지 요청이 접수되었습니다.")}
                className="h-10 rounded-xl bg-red-500/80 text-sm font-semibold text-white hover:bg-red-500"
              >
                판매 중지
              </Button>
            </div>
            <div className="space-y-2 rounded-2xl border border-red-500/30 bg-red-900/20 p-4 text-sm text-red-100/90">
              <h4 className="text-base font-semibold text-red-100">
                게임 삭제
              </h4>
              <p className="text-xs text-red-100/70">
                게임을 완전히 삭제합니다. 이 작업은 되돌릴 수 없습니다.
              </p>
              <Button
                type="button"
                onClick={() => navigate(`/publisher/game/${gameId}/delete`)}
                className="h-10 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-500/90"
              >
                게임 삭제
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm text-white/70 hover:bg-white/10"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.45)] hover:bg-blue-500/90"
          >
            변경사항 저장
          </Button>
        </div>
      </form>
    </PublisherLayout>
  );
}
