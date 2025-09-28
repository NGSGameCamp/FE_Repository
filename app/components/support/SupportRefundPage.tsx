import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const purchasedDemo = [
  "Cyber Knights 2077",
  "Forest Quest",
  "Mecha Arena",
  "Puzzle Matrix",
  "Neon Racing",
];

type Reason = {
  id: string;
  label: string;
  hint: string;
  tag?: "auto" | "review";
};

const reasons: Reason[] = [
  {
    id: "tech",
    label: "기술적 문제",
    hint: "게임이 실행되지 않거나 심각한 버그 발생",
    tag: "auto",
  },
  {
    id: "perf",
    label: "성능 문제",
    hint: "요구사양 충족하지만 비정상적인 성능",
    tag: "auto",
  },
  {
    id: "content",
    label: "콘텐츠 불만족",
    hint: "기대한 내용과 다름",
    tag: "review",
  },
  {
    id: "wrong",
    label: "실수 구매",
    hint: "의도하지 않은 구매",
    tag: "auto",
  },
  {
    id: "dup",
    label: "중복 구매",
    hint: "이미 보유한 게임을 실수로 재구매",
    tag: "auto",
  },
  {
    id: "other",
    label: "기타",
    hint: "위에 해당하지 않는 사유",
    tag: "review",
  },
];

export default function SupportRefundPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const purchased = useMemo(() => purchasedDemo, []);

  const [game, setGame] = useState("");
  const [reason, setReason] = useState<string>("");
  const [orderId, setOrderId] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState<string | null>(null);

  const valid = !!game && !!reason;

  const submit = () => {
    setError(null);
    if (!valid) {
      if (!game) return setError("환불 요청 게임을 선택하세요.");
      if (!reason) return setError("환불 사유를 선택하세요.");
    }
    try {
      const raw = localStorage.getItem("support:refunds");
      const arr = raw ? JSON.parse(raw) : [];
      const recId = String(Date.now());
      arr.push({
        id: recId,
        user: user?.email || "guest",
        game,
        reason,
        orderId: orderId.trim() || undefined,
        details: details.trim() || undefined,
        createdAt: new Date().toISOString(),
        status: "접수대기",
      });
      localStorage.setItem("support:refunds", JSON.stringify(arr));
      navigate("/support/success", {
        state: { id: `INQ-${recId}`, kind: "환불 문의" },
      });
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="flex items-start gap-3">
        <HelpCircle className="h-6 w-6 text-primary mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold text-white">환불 문의</h2>
          <p className="text-sm text-muted-foreground">
            구매하신 게임의 환불을 요청하실 수 있습니다. 환불 정책을 확인하고 필요한 정보를 제공해주세요.
          </p>
        </div>
      </div>

      {/* 환불 정책 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">환불 정책</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/30 bg-green-500 p-4">
            <div className="font-medium flex items-center gap-2">
              자동 환불 대상{" "}
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                자동 승인 가능
              </Badge>
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>구매 후 2시간 이내</li>
              <li>플레이타임 14일 이내</li>
              <li>플레이 시간 2시간 미만</li>
              <li>기술적 결함으로 인한 문제</li>
            </ul>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500 p-4">
            <div className="font-medium flex items-center gap-2">
              검토 대상{" "}
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30">
                검토 필요
              </Badge>
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>플레이 시간 2시간 초과</li>
              <li>구매 후 14일 경과</li>
              <li>개인적 변심 사유</li>
              <li>특별한 사정이 있는 경우</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* 게임 선택 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">환불 요청 게임 선택</CardTitle>
          <div className="text-xs text-muted-foreground">
            환불을 요청하실 게임을 선택해주세요
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <Select value={game} onValueChange={setGame}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="환불할 게임을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {purchased.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* 환불 사유 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">환불 사유</CardTitle>
          <div className="text-xs text-muted-foreground">
            환불 요청 사유를 선택해주세요
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="환불 사유를 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {reasons.map((r) => (
                <SelectItem key={r.id} value={r.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{r.label}</span>
                    {r.tag === "auto" && (
                      <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-500/30">
                        자동 승인 가능
                      </Badge>
                    )}
                    {r.tag === "review" && (
                      <Badge className="ml-2 bg-amber-500/20 text-amber-300 border-amber-500/30">
                        검토 필요
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {reason && (
            <div className="text-xs text-muted-foreground mt-2">
              {reasons.find((r) => r.id === reason)?.hint}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 추가 정보 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">상세 설명</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2 max-w-2xl"></div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">
              (선택)
            </div>
            <Textarea
              rows={6}
              placeholder="환불 요청과 관련된 상세 사유가 있다면 입력해주세요."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
          {error && <div className="text-xs text-destructive">{error}</div>}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          환불 정책에 동의하며, 제공한 정보가 정확함을 확인합니다. 자동 승인 대상인 경우 즉시 처리되며, 검토가 필요한 경우 3–5 영업일 이내에 결과를 알려드립니다.
        </div>
        <Button onClick={submit} disabled={!valid} className="px-6">
          환불 요청 제출
        </Button>
      </div>
    </div>
  );
}
