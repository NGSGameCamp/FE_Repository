import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Badge } from "../y_ui/base/badge";

type Status = "접수대기" | "처리중" | "답변완료";

function loadById(id: string) {
  const parse = (raw: string | null) => {
    try {
      const v = raw ? JSON.parse(raw) : [];
      return Array.isArray(v) ? v : [];
    } catch {
      return [];
    }
  };
  const inq = parse(localStorage.getItem("support:inquiries"));
  const foundInq = inq.find((r: any) => String(r.id) === id);
  if (foundInq) return { ...foundInq, kind: "게임 문의" };
  const ref = parse(localStorage.getItem("support:refunds"));
  const foundRef = ref.find((r: any) => String(r.id) === id);
  if (foundRef) return { ...foundRef, kind: "환불 문의" };
  return null;
}

export default function SupportInquiryDetailPage() {
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
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">문의 상세</h2>
        <Button
          variant="outline"
          className="border-primary/30"
          onClick={() => nav(-1)}
        >
          목록으로
        </Button>
      </div>

      <Card className="border-primary/20 mx-auto" style={{ maxWidth: 720 }}>
        <CardHeader>
          <CardTitle className="text-base">#{id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            유형: <span className="font-medium">{rec.kind}</span>
          </div>
          {rec.game && (
            <div className="text-sm">
              게임: <span className="font-medium">{rec.game}</span>
            </div>
          )}
          <div className="text-sm">
            상태:{" "}
            {status === "답변완료" ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {status}
              </Badge>
            ) : status === "처리중" ? (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                {status}
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border border-primary/20"
              >
                {status}
              </Badge>
            )}
          </div>

          {rec.types && Array.isArray(rec.types) && (
            <div className="text-sm">
              문제 유형: {(rec.types as any[]).join(", ")}
            </div>
          )}
          {rec.reason && (
            <div className="text-sm">환불 사유: {String(rec.reason)}</div>
          )}
          {rec.orderId && (
            <div className="text-sm">주문번호: {String(rec.orderId)}</div>
          )}
          {rec.desc && (
            <div className="text-sm">
              <div className="text-muted-foreground mb-1">상세 설명</div>
              <div className="whitespace-pre-wrap">{String(rec.desc)}</div>
            </div>
          )}
          <div className="text-xs text-muted-foreground">
            접수 일시:{" "}
            {rec.createdAt
              ? new Date(rec.createdAt).toLocaleString("ko-KR")
              : "-"}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
