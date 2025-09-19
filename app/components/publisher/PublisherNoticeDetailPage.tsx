import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { fetchPublisherNotices, NoticeStatus } from "./publisherNoticeData";
import { ArrowLeft, Clock, Eye } from "lucide-react";

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

export default function PublisherNoticeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const notice = useMemo(() => fetchPublisherNotices().find((item) => item.id === id), [id]);

  if (!notice) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-[#050716] py-16 px-6 text-white">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 text-center">
          <h1 className="text-2xl font-semibold">공지사항을 찾을 수 없습니다.</h1>
          <p className="text-sm text-white/60">목록으로 돌아가 다시 시도해 주세요.</p>
          <Button onClick={() => navigate("/publisher/notices")}>공지사항 목록</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050716] py-12 px-6 text-white">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로가기
          </Button>
          <Link to="/publisher/notices" className="text-sm text-white/60 hover:text-white">
            공지 목록 보기
          </Link>
        </div>

        <Card className="border border-white/10 bg-[#0b1120]/95 text-white shadow-[0_18px_60px_rgba(8,13,35,0.55)]">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-white/50">
              <Badge className={`h-8 rounded-xl border px-4 text-xs font-medium ${statusBadges[notice.status]}`}>
                {statusLabels[notice.status]}
              </Badge>
              <span className="flex items-center gap-2 text-xs text-white/40">
                <Clock className="h-4 w-4" /> {new Date(notice.createdAt).toLocaleString("ko-KR")}
              </span>
              <span className="flex items-center gap-2 text-xs text-white/40">
                <Eye className="h-4 w-4" /> 조회수 {notice.views.toLocaleString()}
              </span>
            </div>
            <CardTitle className="text-3xl font-bold">{notice.title}</CardTitle>
            <p className="text-sm text-white/60">{notice.summary}</p>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-7 text-white/80">
            <div className="rounded-2xl border border-white/5 bg-white/5 px-4 py-3 text-xs text-white/60">
              연관 게임 <span className="ml-2 font-medium text-white">{notice.game}</span>
            </div>
            {notice.content.split("\n").map((line, index) => (
              <p key={index}>{line || "\u00a0"}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
