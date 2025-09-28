import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Status = "접수대기" | "처리중" | "답변완료";

type BaseRec = {
  id: string;
  user: string;
  game?: string;
  createdAt?: string;
  status?: Status;
  kind: "게임 문의" | "환불 문의";
};

function loadAll(userEmail?: string): BaseRec[] {
  const userKey = userEmail || "guest";
  const safeParse = (raw: string | null) => {
    try {
      const v = raw ? JSON.parse(raw) : [];
      return Array.isArray(v) ? v : [];
    } catch { return []; }
  };
  const inq = safeParse(localStorage.getItem("support:inquiries")).map((r: any) => ({
    id: String(r.id),
    user: r.user || "guest",
    game: r.game,
    createdAt: r.createdAt,
    status: (r.status as Status) || "접수대기",
    kind: "게임 문의" as const,
  }));
  const ref = safeParse(localStorage.getItem("support:refunds")).map((r: any) => ({
    id: String(r.id),
    user: r.user || "guest",
    game: r.game,
    createdAt: r.createdAt,
    status: (r.status as Status) || "접수대기",
    kind: "환불 문의" as const,
  }));
  const all = [...inq, ...ref].filter((r) => (userEmail ? r.user === userKey : true));
  all.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  return all;
}

export default function SupportMyInquiriesPage() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<BaseRec[]>([]);

  useEffect(() => {
    setRecords(loadAll(isAuthenticated ? user?.email : "guest"));
  }, [isAuthenticated, user?.email]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      [r.id, r.kind, r.game || ""].some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [records, query]);

  const counts = useMemo(() => {
    const c: Record<Status, number> = { 접수대기: 0, 처리중: 0, 답변완료: 0 };
    for (const r of records) c[(r.status || "접수대기") as Status]++;
    return c;
  }, [records]);

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">나의 문의사항</h2>
          <div className="text-sm text-muted-foreground">총 {records.length}건</div>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="검색 (번호/유형/게임)" value={query} onChange={(e) => setQuery(e.target.value)} className="w-56" />
        </div>
      </div>

      <Card className="border-primary/20 mx-auto" style={{ maxWidth: 720 }}>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">상태별</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">접수대기 {counts["접수대기"]}</Badge>
            <Badge variant="secondary" className="bg-amber-500/20 text-amber-300 border border-amber-500/30">처리중 {counts["처리중"]}</Badge>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">답변완료 {counts["답변완료"]}</Badge>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mx-auto" style={{ maxWidth: 720 }}>
        {filtered.map((r) => (
          <Card key={r.id} className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="font-medium">#{r.id}</div>
                <div>
                  {r.status === "답변완료" && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">{r.status}</Badge>
                  )}
                  {r.status === "처리중" && (
                    <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">{r.status}</Badge>
                  )}
                  {(r.status === "접수대기" || !r.status) && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">접수대기</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">유형: <span className="font-medium">{r.kind}</span></div>
              {r.game && <div className="text-sm">게임: <span className="font-medium">{r.game}</span></div>}
              <div className="text-xs text-muted-foreground">접수: {r.createdAt ? new Date(r.createdAt).toLocaleString("ko-KR") : "-"}</div>
              <Separator />
              <div className="text-right">
                <Button size="sm" variant="outline" className="border-primary/30" onClick={() => navigate(`/support01/${r.id}`)}>상세보기</Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="border-primary/20">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">검색 조건에 맞는 문의가 없습니다.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
