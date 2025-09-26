import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { fetchPublisherNotices, type NoticeCategory } from "./publisherNoticeData";
import { AlertTriangle, Calendar, ChevronRight, Eye, Gamepad2, Trash2 } from "lucide-react";
import { PublisherLayout } from "./PublisherLayout";
import type { ReactNode } from "react";
import { toast } from "sonner";

const categoryLabels: Record<NoticeCategory, string> = {
  all: "전체",
  update: "업데이트",
  event: "이벤트",
  patch: "패치",
  system: "시스템",
  news: "소식",
};

const categoryTone: Record<NoticeCategory, string> = {
  all: "border-white/20 bg-white/10 text-white/80",
  update: "border-blue-400/40 bg-blue-500/15 text-blue-100",
  event: "border-pink-400/40 bg-pink-500/15 text-pink-100",
  patch: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
  system: "border-amber-400/40 bg-amber-500/15 text-amber-100",
  news: "border-purple-400/40 bg-purple-500/15 text-purple-100",
};

const sectionIcons = ["✨", "🛠️", "📌", "🧭", "🗂️"];

interface NoticeSection {
  title: string;
  description?: string;
  items?: string[];
}

const enhancedContent: Record<
  string,
  {
    intro: string;
    sections: NoticeSection[];
  }
> = {
  "n-101": {
    intro:
      "오늘 Cyber Knights 2077의 대규모 업데이트 v1.2.0을 배포합니다. 이번 업데이트는 여러분의 피드백을 바탕으로 많은 개선과 새로운 콘텐츠를 포함하고 있습니다.",
    sections: [
      {
        title: "주요 업데이트 내용",
        items: [
          "새로운 지역 추가: ‘네온 디스트릭트’ – 사이버펑크 도시의 중심부를 탐험해보세요",
          "신규 퀘스트라인: 15개의 새로운 사이드 퀘스트 추가",
          "무기 밸런스 조정: 모든 무기의 데미지와 사거리를 재조정",
          "AI 개선: NPC의 행동 패턴과 전투 AI 개선",
          "그래픽 향상: 레이 트레이싱 기술 적용 및 텍스처 품질 향상",
        ],
      },
      {
        title: "버그 수정",
        items: [
          "특정 상황에서 게임이 크래시되던 문제 해결",
          "캐릭터가 벽에 끼이던 문제 수정",
          "퀘스트 진행이 불가능하던 버그 해결",
        ],
      },
    ],
  },
};

export default function PublisherNoticeDetailPage() {
  const params = useParams<{ id?: string; noticeId?: string }>();
  const noticeId = params.noticeId ?? params.id;
  const navigate = useNavigate();

  const notice = useMemo(
    () => fetchPublisherNotices().find((item) => item.id === noticeId),
    [noticeId],
  );

  const detail = useMemo(() => buildNoticeDetail(notice), [notice]);

  if (!notice || !detail) {
    return (
      <PublisherLayout
        title="공지사항을 찾을 수 없습니다"
        subtitle="삭제되었거나 존재하지 않는 공지입니다. 목록에서 다시 확인해 주세요."
        heroBadge={<AlertBadge tone="danger">Notice Missing</AlertBadge>}
        actions={
          <Button
            className="h-11 rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(59,130,246,0.45)] hover:bg-blue-500/90"
            onClick={() => navigate("/publisher/notices")}
          >
            공지 목록으로 이동
          </Button>
        }
        className="max-w-4xl"
      >
        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_24px_70px_rgba(5,12,30,0.55)]">
          <CardContent className="px-8 py-14 text-center text-sm text-white/65">
            요청하신 공지가 존재하지 않습니다. URL을 다시 확인하거나 최신 공지를 확인해 주세요.
          </CardContent>
        </Card>
      </PublisherLayout>
    );
  }

  const formattedDate = formatDate(notice.createdAt);
  const categoryLabel = categoryLabels[notice.category];

  const handleDelete = () => {
    if (!window.confirm("해당 공지를 삭제하시겠습니까?")) return;
    toast.error("공지 삭제 요청이 접수되었습니다.");
    navigate("/publisher/notices");
  };

  return (
    <PublisherLayout
      title={notice.title}
      subtitle={`${notice.game} · ${formattedDate} · 조회수 ${notice.views.toLocaleString()}`}
      heroBadge={
        <Badge className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryTone[notice.category]}`}>
          {categoryLabel}
        </Badge>
      }
      actions={
        <Button
          variant="ghost"
          className="h-10 rounded-2xl border border-red-400/40 bg-red-500/15 px-4 text-xs font-semibold text-red-100 hover:bg-red-500/25"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> 삭제
        </Button>
      }
      className="max-w-4xl"
    >
      <div className="space-y-8">
        <Breadcrumb />

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_22px_60px_rgba(5,12,30,0.55)]">
          <CardContent className="space-y-6 p-8">
            <div className="flex flex-wrap items-center gap-3 text-xs text-white/55">
              <Badge className={`rounded-full border px-3 py-1 text-[11px] ${categoryTone[notice.category]}`}>
                {categoryLabel}
              </Badge>
              <Divider />
              <span className="inline-flex items-center gap-2">
                <Gamepad2 className="h-4 w-4 text-white/50" />
                {notice.game}
              </span>
              <Divider />
              <span className="inline-flex items-center gap-2">
                <Calendar className="h-4 w-4 text-white/50" />
                {formattedDate}
              </span>
              <Divider />
              <span className="inline-flex items-center gap-2">
                <Eye className="h-4 w-4 text-white/50" />
                조회수 {notice.views.toLocaleString()}
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl font-semibold leading-tight tracking-tight text-white">
                {notice.title}
              </h1>
              {notice.summary ? (
                <p className="text-sm text-white/65">{notice.summary}</p>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-400/20 bg-blue-500/10 text-white shadow-[0_18px_50px_rgba(29,78,216,0.35)]">
          <CardHeader>
            <CardTitle className="text-base">안녕하세요, 배급 파트너 여러분!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-7 text-white/85">
            {detail.intro.split("\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>

        {detail.sections.map((section, index) => (
          <Card key={section.title} className="border border-white/12 bg-publisher-panel text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-white">
                <span>{sectionIcons[index % sectionIcons.length]}</span>
                {section.title}
              </CardTitle>
              {section.description ? (
                <p className="text-sm text-white/60">{section.description}</p>
              ) : null}
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/80">
              {section.items ? (
                <ul className="space-y-2">
                  {section.items.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/60" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
              {!section.items?.length && section.description ? (
                <p>{section.description}</p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </PublisherLayout>
  );
}

function buildNoticeDetail(notice?: ReturnType<typeof fetchPublisherNotices>[number]) {
  if (!notice) return undefined;
  const enhancement = enhancedContent[notice.id];
  if (enhancement) return enhancement;

  const lines = notice.content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const introLines: string[] = [];
  const bulletItems: string[] = [];
  const additional: string[] = [];

  lines.forEach((line) => {
    if (line.startsWith("-") || line.startsWith("•")) {
      bulletItems.push(line.replace(/^[-•]\s*/, ""));
    } else if (introLines.length < 2) {
      introLines.push(line);
    } else {
      additional.push(line);
    }
  });

  const sections: NoticeSection[] = [];
  if (bulletItems.length) {
    sections.push({ title: "주요 안내", items: bulletItems });
  }
  if (additional.length) {
    sections.push({ title: "추가 정보", items: additional });
  }

  return {
    intro: introLines.length ? introLines.join("\n") : notice.summary || "",
    sections: sections.length
      ? sections
      : [{ title: "공지 내용", items: lines.length ? lines : [notice.summary || notice.title] }],
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(value));
}

function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-xs text-white/50">
      <span>공지사항</span>
      <ChevronRight className="h-3 w-3" />
      <span>공지 상세</span>
    </div>
  );
}

function Divider() {
  return <span className="hidden h-3 w-px bg-white/10 sm:block" />;
}

function AlertBadge({ children, tone }: { children: ReactNode; tone: "danger" | "warning" | "info" }) {
  const toneClasses =
    tone === "danger"
      ? "border-red-400/40 bg-red-500/15 text-red-100"
      : tone === "warning"
      ? "border-amber-400/40 bg-amber-500/15 text-amber-100"
      : "border-blue-400/40 bg-blue-500/15 text-blue-100";

  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${toneClasses}`}>
      <AlertTriangle className="h-3.5 w-3.5" />
      {children}
    </div>
  );
}
