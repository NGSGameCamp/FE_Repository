import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Gamepad,
  AlertTriangle,
  Calendar,
  Edit3,
  BarChart3,
  Star,
  Users,
  Activity,
  type LucideIcon,
} from "lucide-react";
import { PublisherLayout } from "./PublisherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Badge } from "../y_ui/base/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../y_ui/navigation/tabs";
import { Separator } from "../y_ui/base/separator";
import { Textarea } from "../y_ui/base/textarea";
import { toast } from "sonner";
import { mockGames } from "@/data/mockGames";
import type { MockGame } from "@/data/mockGames";

interface SystemRequirement {
  os: string;
  processor: string;
  memory: string;
  graphics: string;
  storage: string;
}

interface GameOverview {
  releaseDate: string;
  saleStatus: "판매 중" | "판매 중지" | "출시 예정" | "심사 중";
  price: number;
  revenue: number;
  totalSales: number;
  rating: number;
  reviewCount: number;
  activePlayers: number;
  refundRate: number;
  description: string;
  platforms: string[];
  genre: string;
  tags: string[];
  updates: Array<{ version: string; date: string; summary: string }>;
  notices: Array<{ id: string; title: string; date: string; views: number }>;
  minimumSpec: SystemRequirement;
  recommendedSpec: SystemRequirement;
  features: string[];
}

const gameDetails: Record<string, GameOverview> = {
  "1": {
    releaseDate: "2024-03-15",
    saleStatus: "판매 중",
    price: 65000,
    revenue: 802100000,
    totalSales: 1234,
    rating: 4.7,
    reviewCount: 426,
    activePlayers: 1840,
    refundRate: 1.8,
    description:
      "미래 도시를 배경으로 한 오픈월드 RPG입니다. 당신의 선택이 도시의 운명을 결정합니다. 최첨단 사이버웨어 강화와 함께 나만의 전설을 만들어보세요.",
    platforms: ["PC", "PlayStation", "Xbox"],
    genre: "RPG",
    tags: ["사이버펑크", "오픈월드", "액션"],
    updates: [
      {
        version: "v1.2.0",
        date: "2024-11-28",
        summary: "새로운 퀘스트와 버그 수정",
      },
      {
        version: "v1.1.5",
        date: "2024-11-15",
        summary: "성능 최적화 및 안정성 개선",
      },
      {
        version: "v1.1.0",
        date: "2024-10-30",
        summary: "신규 맵 추가 및 밸런스 조정",
      },
    ],
    notices: [
      {
        id: "notice-1",
        title: "크로스플레이 베타 일정 안내",
        date: "2024-11-10",
        views: 1520,
      },
      {
        id: "notice-2",
        title: "겨울 프로모션 사전 공지",
        date: "2024-10-25",
        views: 980,
      },
    ],
    minimumSpec: {
      os: "Windows 10 64-bit",
      processor: "Intel Core i5-3570K",
      memory: "8 GB RAM",
      graphics: "NVIDIA GTX 780 3GB",
      storage: "70 GB",
    },
    recommendedSpec: {
      os: "Windows 11 64-bit",
      processor: "Intel Core i7-8700",
      memory: "16 GB RAM",
      graphics: "NVIDIA RTX 2070",
      storage: "70 GB SSD",
    },
    features: [
      "실시간 전투 시스템",
      "분기형 스토리",
      "크로스플레이 지원",
      "시즌제 콘텐츠",
    ],
  },
};

const saleStatusCycle = [
  "판매 중",
  "검수 중",
  "판매 중지",
  "출시 예정",
] as const;
const platformSets: string[][] = [
  ["PC"],
  ["PC", "PlayStation"],
  ["PC", "Xbox"],
  ["PC", "PlayStation", "Xbox"],
  ["PC", "macOS"],
  ["PC", "Nintendo Switch"],
  ["PC", "PlayStation", "Nintendo Switch"],
];
const featureLibrary = [
  "실시간 협동 모드",
  "시즌제 진행",
  "크로스플레이 지원",
  "모드 제작 툴",
  "랭킹 시스템",
  "스토리 확장팩",
  "커뮤니티 이벤트",
];
const updateTopics = ["콘텐츠 확장", "버그 수정", "최적화 개선", "밸런스 조정"];
const noticeTopics = ["서버 점검", "이벤트", "프로모션", "패치 노트"];
const minimumSpecTemplates: SystemRequirement[] = [
  {
    os: "Windows 10 64-bit",
    processor: "Intel Core i5-3570K",
    memory: "8 GB RAM",
    graphics: "NVIDIA GTX 780 3GB",
    storage: "60 GB",
  },
  {
    os: "Windows 10 64-bit",
    processor: "AMD Ryzen 5 2600",
    memory: "8 GB RAM",
    graphics: "AMD RX 580 4GB",
    storage: "70 GB",
  },
  {
    os: "Windows 11 64-bit",
    processor: "Intel Core i5-10400",
    memory: "12 GB RAM",
    graphics: "NVIDIA GTX 1660",
    storage: "80 GB",
  },
];
const recommendedSpecTemplates: SystemRequirement[] = [
  {
    os: "Windows 11 64-bit",
    processor: "Intel Core i7-8700",
    memory: "16 GB RAM",
    graphics: "NVIDIA RTX 2060",
    storage: "70 GB SSD",
  },
  {
    os: "Windows 11 64-bit",
    processor: "AMD Ryzen 7 3700X",
    memory: "16 GB RAM",
    graphics: "AMD RX 6700 XT",
    storage: "80 GB SSD",
  },
  {
    os: "Windows 11 64-bit",
    processor: "Intel Core i7-12700",
    memory: "32 GB RAM",
    graphics: "NVIDIA RTX 3070",
    storage: "90 GB SSD",
  },
];

function parseNumber(value: string | number | undefined) {
  if (value == null) return 0;
  if (typeof value === "number") return value;
  const numeric = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function buildOverviewFromGame(game: MockGame, index: number): GameOverview {
  const normalizedIndex = index >= 0 ? index : 0;
  const saleStatus = saleStatusCycle[normalizedIndex % saleStatusCycle.length];
  const priceValue = parseNumber(game.price);
  const totalSales = 900 + normalizedIndex * 140;
  const reviewCount =
    parseNumber(game.reviews) || Math.round(totalSales * 0.32);
  const revenue =
    priceValue > 0
      ? priceValue * totalSales
      : (900 + normalizedIndex * 220) * 15000;
  const releaseDate = `2024-${String((normalizedIndex % 12) + 1).padStart(
    2,
    "0"
  )}-${String(12 + (normalizedIndex % 10)).padStart(2, "0")}`;
  const platforms = platformSets[normalizedIndex % platformSets.length];
  const features = Array.from(
    new Set([
      ...game.tags,
      featureLibrary[normalizedIndex % featureLibrary.length],
      featureLibrary[(normalizedIndex + 3) % featureLibrary.length],
    ])
  );
  const updates = Array.from({ length: 3 }, (_, idx) => ({
    version: `v1.${normalizedIndex + idx + 1}.${(idx + 2) % 5}`,
    date: `2024-${String(((normalizedIndex + 11 - idx) % 12) + 1).padStart(
      2,
      "0"
    )}-${String(20 - idx * 4).padStart(2, "0")}`,
    summary: `${game.title} ${
      updateTopics[(idx + normalizedIndex) % updateTopics.length]
    } 업데이트`,
  }));
  const notices = Array.from({ length: 2 }, (_, idx) => ({
    id: `notice-${game.id}-${idx + 1}`,
    title: `${
      noticeTopics[(idx + normalizedIndex) % noticeTopics.length]
    } 안내`,
    date: `2024-${String(((normalizedIndex + idx + 8) % 12) + 1).padStart(
      2,
      "0"
    )}-${String(8 + idx * 7).padStart(2, "0")}`,
    views: 600 + normalizedIndex * 160 + idx * 210,
  }));
  const minimumSpecTemplate =
    minimumSpecTemplates[normalizedIndex % minimumSpecTemplates.length];
  const recommendedSpecTemplate =
    recommendedSpecTemplates[normalizedIndex % recommendedSpecTemplates.length];

  return {
    releaseDate,
    saleStatus,
    price: priceValue,
    revenue,
    totalSales,
    rating:
      typeof game.rating === "number"
        ? game.rating
        : parseFloat(String(game.rating)) || 4.5,
    reviewCount,
    activePlayers: Math.max(320, Math.round(totalSales * 0.6)),
    refundRate: Number((1.2 + (normalizedIndex % 4) * 0.35).toFixed(1)),
    description: game.description,
    platforms,
    genre: game.genre,
    tags: [...game.tags],
    updates,
    notices,
    minimumSpec: { ...minimumSpecTemplate },
    recommendedSpec: { ...recommendedSpecTemplate },
    features,
  };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    value
  );

const formatNumber = (value: number) =>
  new Intl.NumberFormat("ko-KR").format(value);

export default function PublisherGameDetailPage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const [updateContent, setUpdateContent] = useState("");

  const game = useMemo(
    () => mockGames.find((item) => item.id === gameId),
    [gameId]
  );
  const detail = useMemo(() => {
    if (!game) return undefined;
    const index = mockGames.findIndex((item) => item.id === game.id);
    return gameDetails[game.id] ?? buildOverviewFromGame(game, index);
  }, [game]);

  if (!game || !detail) {
    return (
      <PublisherLayout
        title="게임 상세"
        subtitle="선택한 게임 데이터를 찾을 수 없습니다."
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

  const handlePostUpdate = () => {
    if (!updateContent.trim()) {
      toast.error("업데이트 내용을 입력해 주세요.");
      return;
    }
    toast.success("업데이트가 게시되었습니다.");
    setUpdateContent("");
  };

  const handleDelete = () => {
    navigate(`/publisher/game/${game.id}/delete`);
  };

  return (
    <PublisherLayout
      title={`게임 관리 / ${game.title}`}
      subtitle="게임의 성과와 콘텐츠를 한 곳에서 관리하세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
          <Gamepad className="h-3.5 w-3.5" /> Game Detail
        </div>
      }
      actions={
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="ghost"
            className="h-10 rounded-2xl border border-white/12 bg-white/5 px-5 text-xs text-white/75 hover:bg-white/10"
            onClick={() => navigate(`/publisher/game/${game.id}/edit`)}
          >
            <Edit3 className="mr-2 h-4 w-4" /> 수정
          </Button>
          <Button
            variant="ghost"
            className="h-10 rounded-2xl border border-red-500/40 bg-red-500/15 px-5 text-xs text-red-100 hover:bg-red-500/25"
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      }
      className="max-w-6xl"
    >
      <section className="space-y-12">
        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardContent className="space-y-8 p-8">
            <div className="grid gap-8 lg:grid-cols-[2fr_3fr]">
              <div className="relative rounded-[26px] bg-gradient-to-br from-blue-500/30 to-purple-500/20 p-6">
                <div className="absolute inset-2 rounded-[22px] border border-white/10" />
                <div className="relative flex h-56 items-center justify-center text-sm text-white/60">
                  게임 대표 이미지가 여기에 노출됩니다.
                </div>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-white/60">
                    <span>장르: {detail.genre}</span>
                    <Separator
                      orientation="vertical"
                      className="hidden h-3 sm:block"
                    />
                    <span>플랫폼: {detail.platforms.join(", ")}</span>
                    <Separator
                      orientation="vertical"
                      className="hidden h-3 sm:block"
                    />
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> 출시일{" "}
                      {detail.releaseDate}
                    </span>
                  </div>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                    {game.title}
                  </h1>
                  <Badge className="mt-4 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-4 py-1 text-xs text-emerald-100">
                    {detail.saleStatus}
                  </Badge>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <StatCard
                    label="현재 가격"
                    value={formatCurrency(detail.price)}
                  />
                  <StatCard
                    label="총 판매량"
                    value={formatNumber(detail.totalSales)}
                  />
                  <StatCard
                    label="총 수익"
                    value={formatCurrency(detail.revenue)}
                  />
                  <StatCard
                    label="평균 평점"
                    value={`${detail.rating.toFixed(1)} / 5`}
                  />
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="h-11 rounded-2xl border border-white/12 bg-white/5 text-white/60">
                <TabsTrigger
                  value="overview"
                  className="rounded-2xl data-[state=active]:bg-white/15 data-[state=active]:text-white"
                >
                  개요
                </TabsTrigger>
                <TabsTrigger
                  value="stats"
                  className="rounded-2xl data-[state=active]:bg-white/15 data-[state=active]:text-white"
                >
                  판매 통계
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-2xl data-[state=active]:bg-white/15 data-[state=active]:text-white"
                >
                  리뷰
                </TabsTrigger>
                <TabsTrigger
                  value="updates"
                  className="rounded-2xl data-[state=active]:bg-white/15 data-[state=active]:text-white"
                >
                  업데이트
                </TabsTrigger>
                <TabsTrigger
                  value="dlc"
                  className="rounded-2xl data-[state=active]:bg-white/15 data-[state=active]:text-white"
                >
                  DLC
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8 pt-6">
                <OverviewSection detail={detail} />
              </TabsContent>
              <TabsContent value="stats" className="space-y-8 pt-6">
                <SalesStats detail={detail} />
              </TabsContent>
              <TabsContent value="reviews" className="space-y-8 pt-6">
                <ReviewSection detail={detail} />
              </TabsContent>
              <TabsContent value="updates" className="space-y-8 pt-6">
                <UpdateSection
                  detail={detail}
                  updateContent={updateContent}
                  onChange={setUpdateContent}
                  onPost={handlePostUpdate}
                />
              </TabsContent>
              <TabsContent value="dlc" className="space-y-8 pt-6">
                <DlcPlaceholder />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
          <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_22px_60px_rgba(5,12,30,0.55)]">
            <CardHeader className="border-b border-white/10">
              <CardTitle className="text-lg">최근 공지</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {detail.notices.map((notice) => (
                <div
                  key={notice.id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
                >
                  <div>
                    <p className="font-medium text-white">{notice.title}</p>
                    <p className="text-xs text-white/50">
                      {notice.date} · 조회수 {formatNumber(notice.views)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    className="h-9 rounded-xl border border-white/10 bg-white/5 px-3 text-xs text-white/70 hover:bg-white/10"
                    onClick={() =>
                      toast.info("공지 상세는 곧 연결될 예정입니다.")
                    }
                  >
                    조회
                  </Button>
                </div>
              ))}
              {detail.notices.length === 0 && (
                <p className="text-sm text-white/50">등록된 공지가 없습니다.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-red-500/30 bg-red-950/30 text-white shadow-[0_22px_60px_rgba(59,10,10,0.45)]">
            <CardHeader className="border-b border-red-500/20">
              <CardTitle className="text-lg text-red-100">위험 구역</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6 text-sm text-red-100/90">
              <p>
                게임을 완전히 삭제하거나 판매 중지를 요청할 수 있습니다. 승인 후
                적용됩니다.
              </p>
              <div className="flex flex-col gap-3">
                <Button
                  variant="ghost"
                  className="h-10 rounded-xl border border-red-400/40 bg-red-500/25 text-sm font-semibold text-white hover:bg-red-500"
                  onClick={() => toast("판매 중지 요청이 접수되었습니다.")}
                >
                  판매 중지 요청
                </Button>
                <Button
                  className="h-10 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-500/90"
                  onClick={handleDelete}
                >
                  게임 삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PublisherLayout>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white/70">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function OverviewSection({ detail }: { detail: GameOverview }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-white">게임 소개</h3>
        <p className="mt-3 text-sm leading-6 text-white/70">
          {detail.description}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-white">핵심 기능</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {detail.features.map((feature) => (
            <Badge
              key={feature}
              className="rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs text-blue-100"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SpecCard title="최소 사양" spec={detail.minimumSpec} />
        <SpecCard title="권장 사양" spec={detail.recommendedSpec} />
      </div>
    </div>
  );
}

function SalesStats({ detail }: { detail: GameOverview }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border border-white/12 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-base">실시간 KPI</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Metric
            label="활성 플레이어"
            value={formatNumber(detail.activePlayers)}
            icon={Users}
          />
          <Metric
            label="평균 평점"
            value={`${detail.rating.toFixed(1)} / 5`}
            icon={Star}
          />
          <Metric
            label="환불률"
            value={`${detail.refundRate.toFixed(1)}%`}
            icon={Activity}
          />
          <Metric
            label="리뷰 수"
            value={formatNumber(detail.reviewCount)}
            icon={BarChart3}
          />
        </CardContent>
      </Card>

      <Card className="border border-white/12 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-base">판매 추이 (요약)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/65">
          <p>· 최근 7일 매출이 전주 대비 12% 증가했습니다.</p>
          <p>· 신규 유입 유저의 35%가 튜토리얼을 완수했습니다.</p>
          <p>· 인기 DLC 번들의 전환율이 8%포인트 상승했습니다.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function ReviewSection({ detail }: { detail: GameOverview }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border border-white/12 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-base">요약</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <p>
            평점 {detail.rating.toFixed(1)}점 · 총{" "}
            {formatNumber(detail.reviewCount)}개의 리뷰가 수집되었습니다.
          </p>
          <p>
            긍정 리뷰는 게임의 풍부한 스토리와 도시 디자인을 높게 평가하고
            있습니다.
          </p>
          <p>
            부정 리뷰는 일부 구간의 최적화 문제 및 온라인 매칭 대기를
            지적합니다.
          </p>
        </CardContent>
      </Card>

      <Card className="border border-white/12 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-base">운영 메모</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-white/70">
          <p>· 커뮤니티 팀이 24시간 이내 응답률 92%를 유지 중입니다.</p>
          <p>
            · 다음 패치에서 최적화 개선 및 보안 패치를 우선 적용 예정입니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function UpdateSection({
  detail,
  updateContent,
  onChange,
  onPost,
}: {
  detail: GameOverview;
  updateContent: string;
  onChange: (value: string) => void;
  onPost: () => void;
}) {
  return (
    <div className="space-y-6">
      <Card className="border border-white/12 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-base">최근 업데이트</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {detail.updates.map((update) => (
            <div
              key={update.version}
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/75"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{update.version}</p>
                  <p className="text-xs text-white/50">{update.date}</p>
                </div>
                <Badge className="rounded-full border border-blue-400/40 bg-blue-500/15 px-2 py-1 text-[11px] text-blue-100">
                  적용 완료
                </Badge>
              </div>
              <p className="mt-3 text-sm text-white/70">{update.summary}</p>
            </div>
          ))}
          {detail.updates.length === 0 && (
            <p className="text-sm text-white/50">등록된 업데이트가 없습니다.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border border-white/12 bg-white/5 text-white">
        <CardHeader>
          <CardTitle className="text-base">업데이트 게시</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="업데이트 내용을 입력하세요."
            value={updateContent}
            onChange={(event) => onChange(event.target.value)}
            className="min-h-[120px] rounded-2xl border-white/15 bg-black/20 text-sm text-white placeholder:text-white/40"
          />
          <div className="flex justify-end">
            <Button
              className="h-10 rounded-2xl bg-blue-500 px-5 text-sm font-semibold text-white hover:bg-blue-500/90"
              onClick={onPost}
            >
              게시하기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function DlcPlaceholder() {
  return (
    <Card className="border border-white/12 bg-white/5 text-white">
      <CardContent className="py-12 text-center text-sm text-white/60">
        준비 중인 DLC 정보가 여기에 표시됩니다.
      </CardContent>
    </Card>
  );
}

function SpecCard({ title, spec }: { title: string; spec: SystemRequirement }) {
  return (
    <Card className="border border-white/12 bg-white/5 text-white">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-white/70">
        <SpecRow label="OS" value={spec.os} />
        <SpecRow label="Processor" value={spec.processor} />
        <SpecRow label="Memory" value={spec.memory} />
        <SpecRow label="Graphics" value={spec.graphics} />
        <SpecRow label="Storage" value={spec.storage} />
      </CardContent>
    </Card>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-white/40">{label}</p>
      <p className="text-sm text-white/80">{value}</p>
    </div>
  );
}

function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-100">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-white/50">{label}</p>
        <p className="text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
