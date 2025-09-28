import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Textarea } from "../y_ui/base/textarea";
import { Checkbox } from "../y_ui/form-controls/checkbox";
import {
  HelpCircle,
  ShieldCheck,
  Info,
  User,
  CreditCard,
  ShieldAlert,
  Cog,
  MoreHorizontal,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Badge } from "../y_ui/base/badge";

type DetailCategory =
  | "계정 관련"
  | "결제 문의"
  | "설정 문의"
  | "보안 문제"
  | "개인정보"
  | "기타 개인 문의";

const detailCategories: {
  id: DetailCategory;
  desc: string;
  alert?: "주의" | "보안";
}[] = [
  { id: "계정 관련", desc: "로그인, 비밀번호, 계정 복구 등" },
  { id: "결제 문의", desc: "결제 오류, 구독 관리, 영수증 등" },
  { id: "설정 문의", desc: "프로필, 알림, 환경설정 등" },
  { id: "보안 문제", desc: "해킹, 비정상 접근, 보안 설정 등", alert: "보안" },
  { id: "개인정보", desc: "개인정보 수정, 삭제, 다운로드 요청", alert: "주의" },
  { id: "기타 개인 문의", desc: "위에 해당하지 않는 개인적 문의" },
];

export default function SupportOneToOnePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<DetailCategory | "">("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState<string | null>(null);

  const valid = !!selected && desc.trim().length >= 10;

  const submit = () => {
    setError(null);
    if (!selected) return setError("문의 상세 분류를 선택하세요.");
    if (desc.trim().length < 10)
      return setError("상세 내용을 10자 이상 입력하세요.");
    try {
      const raw = localStorage.getItem("support:one2one");
      const arr = raw ? JSON.parse(raw) : [];
      const id = String(Date.now());
      arr.push({
        id,
        user: user?.email || "guest",
        category: selected,
        desc: desc.trim(),
        createdAt: new Date().toISOString(),
        status: "접수대기",
        kind: "1:1 문의",
      });
      localStorage.setItem("support:one2one", JSON.stringify(arr));
      navigate("/support/success", {
        state: { id: `INQ-${id}`, kind: "1:1 문의" },
      });
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    }
  };

  const iconFor = (c: DetailCategory) => {
    switch (c) {
      case "계정 관련":
        return <User className="h-5 w-5" />;
      case "결제 문의":
        return <CreditCard className="h-5 w-5" />;
      case "설정 문의":
        return <Cog className="h-5 w-5" />;
      case "보안 문제":
        return <ShieldAlert className="h-5 w-5" />;
      case "개인정보":
        return <ShieldCheck className="h-5 w-5" />;
      default:
        return <MoreHorizontal className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      {/* Title */}
      <div className="flex items-start gap-3">
        <HelpCircle className="h-6 w-6 text-primary mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold text-white">1:1 문의</h2>
          <p className="text-sm text-muted-foreground">
            개인적인 문의나 계정 관련 문제를 안전하게 상담받을 수 있습니다.
            민감한 정보는 보안 처리됩니다.
          </p>
        </div>
      </div>

      {/* Policy */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">보안 및 개인정보 보호</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <div className="font-medium flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-300" /> 보안 조치
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>모든 통신은 암호화되어 전송됩니다</li>
              <li>민감정보는 최소한으로 요청됩니다</li>
              <li>처리 완료 후 관련 정보는 안전하게 삭제됩니다</li>
            </ul>
          </div>
          <div className="rounded-lg border border-primary/20 p-4">
            <div className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" /> 처리 안내
            </div>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>일반 문의: 24시간 이내 답변</li>
              <li>결제 문의: 영업일 기준 1–2일</li>
              <li>보안/개인정보: 추가 확인 시 지연 가능</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Category selection */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">문의 분류 선택</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {detailCategories.map((c) => {
            const isActive = selected === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c.id)}
                className={`text-left rounded-lg border p-3 transition flex items-start gap-3 ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-primary/20 hover:border-primary/40"
                }`}
              >
                <Checkbox
                  checked={isActive}
                  readOnly
                  className="mt-0.5 pointer-events-none data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    {iconFor(c.id)}
                    <div className="font-medium">{c.id}</div>
                    {c.alert === "보안" && (
                      <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30">
                        보안
                      </Badge>
                    )}
                    {c.alert === "주의" && (
                      <Badge className="ml-auto bg-amber-500/20 text-amber-300 border-amber-500/30">
                        주의
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">{c.desc}</div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Description */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">문의 내용</CardTitle>
          <div className="text-xs text-muted-foreground">
            문제 상황이나 요청사항을 자세히 설명해주세요. (10자 이상)
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={8}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={`예시)\n- 로그인하면 '계정이 잠겼습니다' 메시지가 표시됩니다.\n- 본인 확인 절차와 해제 방법을 안내받고 싶습니다.`}
          />
          {error && <div className="text-xs text-destructive">{error}</div>}
          <div className="text-right mt-4">
            <Button onClick={submit} disabled={!valid}>
              1:1 문의 보내기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
