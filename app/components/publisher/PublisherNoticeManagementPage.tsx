import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { fetchPublisherNotices, NoticeCategory, NoticeStatus, PublisherNotice } from "./publisherNoticeData";
import { Search, Plus, ChevronDown, Eye } from "lucide-react";

const categoryLabels: Record<NoticeCategory, string> = {
  all: "전체",
  update: "게임 업데이트",
  event: "이벤트",
  patch: "패치노트",
  system: "시스템 공지",
  news: "새 소식",
};

const statusLabels: Record<NoticeStatus, string> = {
  waiting: "접수대기",
  progress: "처리중",
  answered: "답변완료",
};

const statusBadges: Record<NoticeStatus, string> = {
  waiting: "bg-blue-500/20 text-blue-200 border-blue-400/40",
  progress: "bg-amber-500/20 text-amber-200 border-amber-400/40",
  answered: "bg-emerald-500/20 text-emerald-200 border-emerald-400/40",
};

const sortOptions = [
  { id: "latest", label: "최신순" },
  { id: "oldest", label: "오래된순" },
  { id: "views", label: "조회수순" },
] as const;

export default function PublisherNoticeManagementPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<NoticeCategory>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<(typeof sortOptions)[number]["id"]>("latest");

  const notices = useMemo(() => fetchPublisherNotices(), []);

  const statusCounts = useMemo(() => {
    return notices.reduce(
      (acc, notice) => {
        acc[notice.status] += 1;
        return acc;
      },
      { waiting: 0, progress: 0, answered: 0 } as Record<NoticeStatus, number>,
    );
  }, [notices]);

  const filtered = useMemo(() => {
    let list = [...notices];
    if (category !== "all") {
      list = list.filter((notice) => notice.category === category);
    }
    if (query.trim()) {
      const lower = query.trim().toLowerCase();
      list = list.filter((notice) =>
        [notice.title, notice.summary, notice.game]
          .join("\u200b")
          .toLowerCase()
          .includes(lower),
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
      className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center gap-6 rounded-2xl border border-white/5 bg-[#0d1326]/90 px-6 py-4 text-sm text-white/80 shadow-[0_10px_40px_rgba(3,7,18,0.35)]"
    >
      <Badge variant="secondary" className="h-9 rounded-xl border border-white/10 bg-white/5 px-4 text-xs text-white/70">
        {categoryLabels[notice.category] ?? "카테고리"}
      </Badge>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-white">{notice.title}</h3>
        <p className="text-xs text-white/50">{notice.summary}</p>
        <div className="flex gap-2 text-xs text-white/40">
          <span>게임: {notice.game}</span>
          <span className="before:mr-2 before:inline-block before:h-1 before:w-1 before:rounded-full before:bg-white/30"></span>
          <span>조회수 {notice.views.toLocaleString()}</span>
        </div>
      </div>
      <Badge className={`h-8 rounded-xl border ${statusBadges[notice.status]} text-xs font-medium`}>{statusLabels[notice.status]}</Badge>
      <span className="text-sm font-medium text-white/70">{new Date(notice.createdAt).toLocaleDateString("ko-KR")}</span>
      <Button
        variant="ghost"
        size="sm"
        className="h-9 rounded-xl border border-blue-500/40 bg-blue-500/10 text-blue-200 hover:bg-blue-500/20"
        onClick={() => navigate(`/publisher/notices/${notice.id}`)}
      >
        보기
      </Button>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050716] py-12 px-6 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">공지사항 관리</h1>
            <p className="text-sm text-white/60">배급사 공지 및 문의 응답 현황을 한눈에 확인하세요.</p>
          </div>
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full min-w-[250px] sm:w-72">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <Input
                placeholder="공지사항 검색..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-11 rounded-2xl border-white/10 bg-white/5 pl-11 text-sm text-white placeholder:text-white/40"
              />
            </div>
            <Button
              className="h-11 rounded-2xl bg-gradient-to-r from-[#2563eb] to-[#3b82f6] px-5 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(37,99,235,0.45)]"
              onClick={() => navigate("/publisher/notices/new")}
            >
              <Plus className="mr-2 h-4 w-4" /> 새 공지 작성
            </Button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {["waiting", "progress", "answered"].map((key) => {
            const id = key as NoticeStatus;
            return (
              <Card key={id} className="border border-white/5 bg-[#0b1120]/90 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-white/70">{statusLabels[id]}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-baseline gap-2 pt-0">
                  <span className="text-3xl font-semibold text-white">{statusCounts[id]}</span>
                  <span className="text-xs text-white/40">건</span>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="space-y-5">
          <div className="flex flex-wrap items-center gap-3">
            {(Object.keys(categoryLabels) as NoticeCategory[]).map((key) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`rounded-2xl px-5 py-2 text-sm transition ${
                  category === key
                    ? "bg-blue-500/20 text-blue-200 border border-blue-400/40"
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
              <DropdownMenuContent align="end" className="w-36 bg-[#0b1120] text-white">
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

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <Card className="border border-white/10 bg-[#0b1120]/90 text-center text-white/60">
                <CardContent className="py-16 text-sm">
                  검색 결과가 없습니다. 다른 조건을 시도해 보세요.
                </CardContent>
              </Card>
            ) : (
              filtered.map(renderRow)
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
