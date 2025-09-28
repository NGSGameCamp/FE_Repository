import { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Badge } from "../y_ui/base/badge";
import { Button } from "../y_ui/base/button";
import {
  HelpCircle,
  CalendarDays,
  Clock3,
  User2,
  MessageSquare,
} from "lucide-react";

type Status = "접수대기" | "처리중" | "답변완료";

type AnyRec = {
  id: string;
  kind: string;
  game?: string;
  createdAt?: string;
  status?: Status;
  desc?: string;
  reason?: string;
  category?: string;
  sub?: string;
};

function parse(raw: string | null) {
  try {
    const v = raw ? JSON.parse(raw) : [];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

function loadById(id: string): AnyRec | null {
  const stores = [
    { key: "support:inquiries", kind: "게임 문의" },
    { key: "support:refunds", kind: "환불 문의" },
    { key: "support:one2one", kind: "1:1 문의" },
    { key: "support:other", kind: "기타 문의" },
  ] as const;
  for (const s of stores) {
    const arr = parse(localStorage.getItem(s.key));
    const hit = arr.find((r: any) => String(r.id) === id);
    if (hit) return { kind: s.kind, ...hit, id: String(hit.id) } as AnyRec;
  }
  return null;
}

export default function SupportInquiryInfoPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const rec = useMemo(() => loadById(id), [id]);

  if (!rec) {
    return (
      <div className="container mx-auto px-6 py-10">
        <Card className="border-primary/20">
          <CardContent className="py-10 text-center">
            해당 문의를 찾을 수 없습니다.
          </CardContent>
        </Card>
      </div>
    );
  }

  const status: Status = (rec.status as Status) || "접수대기";

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      {/* Head */}
      <div className="flex items-start gap-3 justify-center">
        <HelpCircle className="h-6 w-6 text-primary mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold text-white">문의 상세 정보</h2>
          <p className="text-sm text-muted-foreground">
            문의 내용을 확인하고 추가 피드백을 남기실 수 있습니다.
          </p>
        </div>
      </div>

      {/* Narrow wrapper for all cards */}
      <div className="space-y-6 mx-auto" style={{ maxWidth: 720 }}>
        <Card className="border-primary/20">
          <CardContent className="py-4 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border border-primary/20"
                >
                  {rec.kind}
                </Badge>
                <Badge
                  variant="secondary"
                  className={
                    status === "답변완료"
                      ? "bg-green-500/20 text-green-400 border-green-500/30"
                      : status === "처리중"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                      : "bg-primary/10 text-primary border border-primary/20"
                  }
                >
                  {status}
                </Badge>
              </div>
              <div className="mt-1 font-semibold">#{id}</div>
              {rec.game && (
                <div className="text-sm">
                  관련 게임:{" "}
                  <Link to={`/search`} className="text-primary hover:underline">
                    {rec.game}
                  </Link>
                </div>
              )}
            </div>
            <div className="justify-self-end text-right text-sm text-muted-foreground">
              접수 번호: INQ-{id}
            </div>
          </CardContent>
        </Card>

        <div
          className="grid gap-6 lg:grid-cols-[2fr_1fr]"
          style={{ alignItems: "start" }}
        >
          {/* Left column */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">문의 내용</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-muted-foreground mb-2">
                  접수일시:{" "}
                  {rec.createdAt
                    ? new Date(rec.createdAt).toLocaleString("ko-KR")
                    : "-"}
                </div>
                <div className="whitespace-pre-wrap text-sm">
                  {rec.desc || "-"}
                </div>
              </CardContent>
            </Card>

            {/* Answers/timeline placeholders */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">처리 과정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-md border border-primary/20 p-3">
                  <div className="text-xs text-muted-foreground">문의 접수</div>
                  <div>고객센터에 문의가 접수되었습니다.</div>
                </div>
                {status !== "접수대기" && (
                  <div className="rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
                    <div className="text-xs text-muted-foreground">
                      담당자 배정
                    </div>
                    <div>담당자가 문의를 검토 중입니다.</div>
                  </div>
                )}
                {status === "답변완료" && (
                  <div className="rounded-md border border-green-500/30 bg-green-500/5 p-3">
                    <div className="text-xs text-muted-foreground">
                      답변 완료
                    </div>
                    <div>
                      답변이 등록되었습니다. 추가 문의가 필요하시면 새 문의를
                      작성해주세요.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">
                  추가 도움이 필요하신가요?
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                답변이 해결되지 않았거나 추가 질문이 있으시면 고객센터를 통해
                새롭게 문의를 접수해주세요.
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-4">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">문의 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  접수일
                </div>
                <div>
                  {rec.createdAt
                    ? new Date(rec.createdAt).toLocaleDateString("ko-KR")
                    : "-"}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <Clock3 className="h-4 w-4" />
                  답변 예상
                </div>
                <div>3–5 영업일</div>
                <div className="flex items-center gap-2 text-muted-foreground mt-2">
                  <User2 className="h-4 w-4" />
                  담당자
                </div>
                <div>배정 예정</div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">빠른 링크</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-primary/30"
                >
                  <Link to="/support01">문의 목록으로</Link>
                </Button>
                <Button asChild variant="ghost" className="w-full">
                  <Link to="/support">고객센터</Link>
                </Button>
                <Button asChild className="w-full">
                  <Link to="/support/new">새로운 문의 작성</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
