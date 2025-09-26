import { useMemo } from "react";
import type { ReactNode } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle, Trash2 } from "lucide-react";
import { PublisherLayout } from "./PublisherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { mockGames } from "@/data/mockGames";
import { toast } from "sonner";
import { formatCurrencyKRW } from "./utils/format";

const warningPoints = [
  "플랫폼에서 게임이 비공개 처리됩니다.",
  "사용자들이 더 이상 게임을 구매할 수 없습니다.",
  "모든 판매 데이터는 보존되지만 접근할 수 없게 됩니다.",
  "공지사항 및 업데이트 기록이 보존됩니다.",
];

const saleStatusCycle = ["판매 중", "검수 중", "판매 중지", "출시 예정"] as const;

export default function PublisherGameDeletePage() {
  const navigate = useNavigate();
  const { gameId } = useParams<{ gameId: string }>();

  const game = useMemo(() => mockGames.find((item) => item.id === gameId), [gameId]);
  const index = game ? mockGames.findIndex((item) => item.id === game.id) : -1;
  const normalizedIndex = index >= 0 ? index : 0;
  const parsedPrice = game ? parsePrice(game.price) : 0;
  const totalSales = 900 + normalizedIndex * 140;
  const saleStatus = saleStatusCycle[normalizedIndex % saleStatusCycle.length];
  const totalRevenue =
    parsedPrice > 0
      ? parsedPrice * totalSales
      : (900 + normalizedIndex * 220) * 15000;

  if (!game) {
    return (
      <PublisherLayout
        title="게임 삭제"
        subtitle="선택한 게임 정보를 찾을 수 없습니다."
        heroBadge={
          <BadgePill label={<span className="flex items-center gap-2"><AlertTriangle className="h-3.5 w-3.5" /> Not Found</span>} tone="danger" />
        }
      >
        <Card className="border border-white/12 bg-publisher-card text-center text-white/70">
          <CardContent className="py-16">
            존재하지 않는 게임입니다. 게임 관리 페이지로 돌아가 다시 시도해 주세요.
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

  const handleCancel = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    toast.error(`${game.title} 삭제 요청이 접수되었습니다.`);
    navigate("/publisher02");
  };

  const handleDeleteAndReport = () => {
    toast.error(`${game.title} 삭제 후 보고 페이지로 이동합니다.`);
    navigate("/publisher03-01");
  };

  return (
    <PublisherLayout
      title={`게임 관리 / ${game.title}`}
      subtitle="게임 삭제는 되돌릴 수 없습니다. 삭제 전에 모든 영향을 검토하세요."
      heroBadge={
        <BadgePill
          label={<BadgeLabel icon={<Trash2 className="h-3.5 w-3.5" />} text="Delete Game" />}
          tone="warning"
        />
      }
      className="max-w-5xl"
    >
      <Card className="border border-red-500/30 bg-red-950/30 text-white shadow-[0_30px_80px_rgba(59,10,10,0.55)]">
        <CardHeader className="flex flex-col items-center gap-4 border-b border-red-500/20 py-10 text-center">
          <AlertTriangle className="h-14 w-14 text-amber-300" />
          <div className="space-y-3">
            <CardTitle className="text-2xl font-semibold">게임을 삭제하시겠습니까?</CardTitle>
            <p className="text-sm text-white/70">이 작업은 되돌릴 수 없으며, 삭제 후 게임은 모든 스토어에서 비활성화됩니다.</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-8 p-10">
          <InfoPanel
            entries={[
              { label: "게임명", value: game.title },
              { label: "카테고리", value: game.genre },
              { label: "현재 상태", value: saleStatus },
              { label: "총 판매량", value: `${formatNumber(totalSales)}개` },
              { label: "총 수익", value: formatCurrencyKRW(totalRevenue) },
            ]}
          />

          <div className="rounded-3xl border border-red-500/35 bg-red-900/20 p-6 text-sm text-red-100">
            <div className="flex items-center gap-2 text-base font-semibold text-red-200">
              <AlertTriangle className="h-5 w-5" /> 경고
            </div>
            <p className="mt-3 text-sm text-red-100/80">이 작업은 되돌릴 수 없습니다. 게임을 삭제하면:</p>
            <ul className="mt-4 space-y-2 text-sm text-red-100/80">
              {warningPoints.map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-red-300" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
            <Button
              variant="ghost"
              className="h-11 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm text-white/75 hover:bg-white/10"
              onClick={handleCancel}
            >
              취소
            </Button>
            <Button
              variant="ghost"
              className="h-11 rounded-2xl border border-red-400/40 bg-red-500/15 px-6 text-sm font-semibold text-red-100 hover:bg-red-500/25"
              onClick={handleDelete}
            >
              삭제 후 대시보드
            </Button>
            <Button
              className="h-11 rounded-2xl bg-red-500 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(239,68,68,0.45)] hover:bg-red-500/90"
              onClick={handleDeleteAndReport}
            >
              삭제 후 보고 페이지 이동
            </Button>
          </div>
        </CardContent>
      </Card>
    </PublisherLayout>
  );
}

function parsePrice(value: string) {
  const numeric = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function parseNumber(value: string | number) {
  if (typeof value === "number") return value;
  const numeric = Number(String(value).replace(/[^0-9]/g, ""));
  return Number.isNaN(numeric) ? 0 : numeric;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("ko-KR").format(value);
}

function InfoPanel({ entries }: { entries: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid gap-3 rounded-3xl border border-white/10 bg-publisher-card/80 p-6 text-sm text-white/75">
      {entries.map((entry) => (
        <div key={entry.label} className="flex flex-wrap justify-between gap-2">
          <span className="text-white/50">{entry.label}</span>
          <span className="font-medium text-white">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

function BadgePill({ label, tone }: { label: ReactNode; tone: "warning" | "danger" | "brand" }) {
  const toneClasses =
    tone === "warning"
      ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
      : tone === "danger"
      ? "border-red-400/40 bg-red-500/15 text-red-100"
      : "border-blue-400/40 bg-blue-500/15 text-blue-100";

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses}`}
    >
      {label}
    </div>
  );
}

function BadgeLabel({ icon, text }: { icon: ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2">
      {icon}
      {text}
    </span>
  );
}
