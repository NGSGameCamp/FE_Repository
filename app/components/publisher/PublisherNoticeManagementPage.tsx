import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { fetchPublisherNotices, NoticeCategory, NoticeStatus, PublisherNotice } from "./publisherNoticeData";
import { Plus, ChevronDown, Eye, NotebookPen } from "lucide-react";
import { PublisherLayout } from "./PublisherLayout";

const categoryLabels: Record<NoticeCategory, string> = {
  all: "전체",
  update: "게임 업데이트",
  event: "이벤트",
  patch: "패치노트",
  system: "시스템 공지",
  news: "새 소식",
};


const categoryBadges: Record<Exclude<NoticeCategory, "all">, string> = {
  update: "bg-indigo-500/15 text-indigo-200 border-indigo-400/30",
  event: "bg-pink-500/15 text-pink-200 border-pink-400/30",
  patch: "bg-purple-500/15 text-purple-200 border-purple-400/30",
  system: "bg-slate-500/20 text-slate-200 border-slate-400/30",
  news: "bg-cyan-500/15 text-cyan-200 border-cyan-400/30",
};

const statusLabels: Record<NoticeStatus, string> = {
  waiting: "접수대기",
  progress: "처리중",
  answered: "답변완료",
};

const statusBadges: Record<NoticeStatus, string> = {
  waiting: "bg-sky-500/15 text-sky-200 border-sky-400/30",
  progress: "bg-amber-500/15 text-amber-200 border-amber-400/30",
  answered: "bg-emerald-500/15 text-emerald-200 border-emerald-400/30",
};

const sortOptions = [
  { id: "latest", label: "최신순" },
  { id: "oldest", label: "오래된순" },
  { id: "views", label: "조회수순" },
] as const;

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function PublisherNoticeManagementPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<NoticeCategory>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["id"]>("latest");

  const notices = useMemo(() => fetchPublisherNotices(), []);

  const filtered = useMemo(() => {
    let list = [...notices];
    if (category !== "all") {
      list = list.filter((notice) => notice.category === category);
    }
    if (query.trim()) {
      const lower = query.trim().toLowerCase();
      list = list.filter((notice) =>
        [notice.title, notice.summary, notice.game].join("\u200b").toLowerCase().includes(lower),
      );
    }
    switch (sort) {
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "views":
        list.sort((a, b) => b.views - a.views);
        break;
      default:
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }
    return list;
  }, [category, query, notices, sort]);

  const renderRow = (notice: PublisherNotice) => (
    <div
      key={notice.id}
      className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto_auto_auto] items-center gap-4 rounded-2xl border border-white/12 bg-publisher-card-muted px-5 py-4 text-sm text-white/85 shadow-[0_16px_44px_rgba(5,12,30,0.4)] transition hover:border-blue-500/45 hover:bg-publisher-card-hover"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-base font-semibold text-white">{notice.title}</h3>
          <Badge
            className={`hidden sm:inline-flex h-6 items-center rounded-full border px-2 text-[11px] font-medium uppercase tracking-wide ${
              notice.category === "all"
                ? "border-white/15 bg-white/5 text-white/60"
                : categoryBadges[(notice.category as Exclude<NoticeCategory, "all">)] ?? "border-white/15 bg-white/5 text-white/60"
            }`}
          >
            {categoryLabels[notice.category]}
          </Badge>
        </div>
        <p className="line-clamp-1 text-xs text-white/50">{notice.summary}</p>
      </div>
      <div className="hidden flex-col text-xs text-white/65 sm:flex">
        <span className="font-medium text-white">{notice.game}</span>
        <span>조회수 {notice.views.toLocaleString()}</span>
      </div>
      <Badge className={`inline-flex h-8 items-center justify-center rounded-full border px-3 text-xs font-medium ${statusBadges[notice.status]}`}>
        {statusLabels[notice.status]}
      </Badge>
      <span className="text-sm font-medium text-white/70">{formatDate(notice.createdAt)}</span>
      <span className="hidden text-sm text-white/60 lg:block">{notice.views.toLocaleString()}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20"
        onClick={() => navigate(`/publisher/${notice.id}/notice`)}
      >
        보기
      </Button>
    </div>
  );

  return (
    <PublisherLayout
      title="공지사항 관리"
      subtitle="공지 등록부터 상태 추적, 조회수 분석까지 한곳에서 관리하세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200">
          <NotebookPen className="h-3.5 w-3.5" /> Notice Center
        </div>
      }
      actions={
        <>
          <div className="relative w-full min-w-[220px] sm:w-72">
            <Input
              placeholder="공지사항 검색..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-11 rounded-2xl border-white/15 bg-white/5 px-4 text-sm text-white placeholder:text-white/40"
            />
          </div>
          <Button
            className="h-11 rounded-2xl bg-blue-500 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.45)] hover:bg-blue-500/90"
            onClick={() => navigate("/publisher/notice/write")}
          >
            <Plus className="mr-2 h-4 w-4" /> 새 공지 작성
          </Button>
        </>
      }
    >
      <section className="space-y-12">
        <div className="flex flex-wrap items-center gap-5 rounded-3xl border border-white/12 bg-publisher-panel px-6 py-6 shadow-[0_18px_52px_rgba(5,12,30,0.45)]">
          {(Object.keys(categoryLabels) as NoticeCategory[]).map((key) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`rounded-2xl px-5 py-2 text-sm transition ${
                category === key
                  ? "border border-blue-400/50 bg-blue-500/20 text-blue-100 shadow-[0_10px_30px_rgba(59,130,246,0.25)]"
                  : "border border-white/10 bg-white/0 text-white/60 hover:text-white"
              }`}
            >
              {categoryLabels[key]}
            </button>
          ))}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 text-sm text-white/70 hover:bg-white/10"
              >
                <Eye className="h-4 w-4" />
                {sortOptions.find((option) => option.id === sort)?.label ?? "정렬"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 border border-white/10 bg-publisher-card text-white">
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

        <div className="space-y-5">
          <div className="hidden items-center rounded-2xl border border-white/12 bg-publisher-panel px-6 py-4 text-xs font-medium text-white/65 sm:grid sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto_auto_auto_auto]">
            <span>제목</span>
            <span className="hidden sm:inline">게임 / 조회수</span>
            <span>상태</span>
            <span>작성일</span>
            <span className="hidden lg:inline">조회수</span>
            <span>작업</span>
          </div>
          {filtered.length === 0 ? (
            <Card className="border border-white/12 bg-publisher-card text-center text-white/70">
              <CardContent className="py-16 text-sm">
                검색 결과가 없습니다. 다른 조건을 시도해 보세요.
              </CardContent>
            </Card>
          ) : (
            filtered.map((notice) => (
              <div key={notice.id} className="space-y-4">
                {renderRow(notice)}
              </div>
            ))
          )}
        </div>
      </section>
    </PublisherLayout>
  );
}
