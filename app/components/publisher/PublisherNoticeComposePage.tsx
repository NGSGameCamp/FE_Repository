import { FormEvent, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../y_ui/base/button";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Input } from "../y_ui/base/input";
import { Label } from "../y_ui/base/label";
import { Textarea } from "../y_ui/base/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../y_ui/form-controls/select";
import { Badge } from "../y_ui/base/badge";
import { NoticeCategory } from "./publisherNoticeData";
import { toast } from "sonner";
import { PublisherLayout } from "./PublisherLayout";
import { PenSquare } from "lucide-react";
import { useGameStore } from "../../stores/gameStore";

const categoryLabels: Record<Exclude<NoticeCategory, "all">, string> = {
  update: "게임 업데이트",
  event: "이벤트",
  patch: "패치 노트",
  system: "시스템 공지",
  news: "새 소식",
};

export default function PublisherNoticeComposePage() {
  const navigate = useNavigate();
  const games = useGameStore((state) => state.games);
  const fetchGames = useGameStore((state) => state.fetchGames);
  const gamesLoading = useGameStore((state) => state.loading);
  const gameOptions = useMemo(
    () => Array.from(new Set(games.map((game) => game.title))).sort(),
    [games]
  );

  useEffect(() => {
    if (!games.length && !gamesLoading) {
      fetchGames();
    }
  }, [fetchGames, games.length, gamesLoading]);

  const [selectedGame, setSelectedGame] = useState<string>("");
  const [category, setCategory] =
    useState<Exclude<NoticeCategory, "all">>("update");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (!selectedGame && gameOptions.length) {
      setSelectedGame(gameOptions[0]);
    }
  }, [gameOptions, selectedGame]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("제목과 내용을 모두 입력해 주세요.");
      return;
    }

    toast.success(
      "새 공지가 임시로 저장되었습니다. 실제 저장 API 연결 시 완료됩니다."
    );
    navigate("/publisher/notices");
  };

  return (
    <PublisherLayout
      title="새 공지 작성"
      subtitle="공지 제목, 대상 게임, 카테고리를 선택하고 상세 내용을 입력해 주세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
          <PenSquare className="h-3.5 w-3.5" /> Compose Notice
        </div>
      }
      actions={
        <div className="flex gap-3 text-xs text-white/55">
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-2">
            실시간 임시 저장 미지원
          </span>
          <span className="rounded-full border border-white/12 bg-white/5 px-3 py-2">
            작성 완료 후 검수 진행
          </span>
        </div>
      }
      className="max-w-5xl"
    >
      <form
        onSubmit={handleSubmit}
        className="grid gap-6 lg:grid-cols-[1.8fr_1fr]"
      >
        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_24px_70px_rgba(5,12,30,0.55)] lg:col-span-2">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="game">공지 대상 게임</Label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger
                  id="game"
                  className="h-11 rounded-2xl border-white/10 bg-white/5 text-white"
                >
                  <SelectValue placeholder="게임을 선택하세요" />
                </SelectTrigger>
                <SelectContent className="max-h-64 border-white/10 bg-publisher-card text-white">
                  {gameOptions.map((game) => (
                    <SelectItem key={game} value={game} className="text-sm">
                      {game}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select
                value={category}
                onValueChange={(value) =>
                  setCategory(value as Exclude<NoticeCategory, "all">)
                }
              >
                <SelectTrigger
                  id="category"
                  className="h-11 rounded-2xl border-white/10 bg-white/5 text-white"
                >
                  <SelectValue placeholder="카테고리를 선택하세요" />
                </SelectTrigger>
                <SelectContent className="border-white/10 bg-publisher-card text-white">
                  {(
                    Object.keys(categoryLabels) as Array<
                      Exclude<NoticeCategory, "all">
                    >
                  ).map((id) => (
                    <SelectItem key={id} value={id} className="text-sm">
                      {categoryLabels[id]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="title">공지 제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="예) [업데이트] 1.2.0 신규 시즌 오픈 안내"
                className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="summary">요약 문구 (선택)</Label>
              <Input
                id="summary"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                placeholder="예) 신규 지역 개방과 전용 이벤트, 밸런스 개선 내용 안내"
                className="h-11 rounded-2xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_24px_70px_rgba(5,12,30,0.55)] lg:col-span-2">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">공지 내용</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6">
            <Textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              placeholder={`업데이트 세부 내용, 점검 일정, 주의사항 등을 상세히 입력하세요.\nmarkdown 형식은 정식 에디터 연결 시 지원됩니다.`}
              rows={12}
              className="rounded-2xl border-white/10 bg-white/5 text-sm text-white placeholder:text-white/40"
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/60"
                >
                  작성자: 배급사 센터
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/60"
                >
                  자동 저장 준비 중
                </Badge>
              </div>
              <span>본문 최소 50자 이상을 권장합니다.</span>
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-4">
          <Card className="border border-white/12 bg-publisher-card-muted text-white shadow-[0_18px_50px_rgba(5,12,30,0.45)]">
            <CardHeader>
              <CardTitle className="text-base">작성 가이드</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-white/60">
              <p>• 제목에는 업데이트/이벤트 구분을 표시하세요.</p>
              <p>• 동일 게임의 중복 공지 여부를 확인한 뒤 등록하세요.</p>
              <p>
                • 긴급 공지는 시스템 카테고리를 선택하고 담당자에게 알림을
                전송하세요.
              </p>
            </CardContent>
          </Card>
          <Card className="border border-white/12 bg-publisher-card-muted text-white shadow-[0_18px_50px_rgba(5,12,30,0.45)]">
            <CardHeader>
              <CardTitle className="text-base">미리보기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-white/70">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-white/60">
                    {categoryLabels[category]}
                  </Badge>
                  <span className="text-xs text-white/40">
                    {selectedGame || "게임 미선택"}
                  </span>
                </div>
                <h3 className="line-clamp-2 text-base font-semibold text-white">
                  {title.trim() || "공지 제목이 표시됩니다"}
                </h3>
                <p className="line-clamp-3 text-xs text-white/50">
                  {summary.trim() || "요약 문구가 여기에 표시됩니다."}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-3 text-xs text-white/60">
                {content.trim()
                  ? content.slice(0, 160)
                  : "본문 미리보기 영역입니다."}
                {content.trim().length > 160 && " …"}
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row lg:justify-end">
          <Button
            type="button"
            variant="ghost"
            className="h-11 rounded-2xl border border-white/15 bg-white/5 px-6 text-sm text-white/70 hover:bg-white/10"
            onClick={() => navigate("/publisher/notices")}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="h-11 rounded-2xl bg-gradient-to-r from-[#2563eb] via-[#365df4] to-[#5a7bff] px-6 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(53,105,255,0.45)]"
          >
            공지 등록 요청
          </Button>
        </div>
      </form>
    </PublisherLayout>
  );
}
