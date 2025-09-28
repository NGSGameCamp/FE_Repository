import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { HelpCircle, Briefcase, Cpu, Users, MessageSquare, Newspaper, Scale, Puzzle, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type MainType = "일반 문의" | "비즈니스 문의" | "기술 문의";
type SubType =
| "건의사항"
| "파트너십"
| "언론/미디어"
| "기술 문의"
| "커뮤니티"
| "콘텐츠 문의"
| "법무/규정"
| "일반 문의";

const subTypes: { id: SubType; desc: string; icon: JSX.Element }[] = [
  { id: "건의사항", desc: "서비스 개선 제안/요청", icon: <Lightbulb className="h-5 w-5" /> },
  { id: "파트너십", desc: "비즈니스 협업/파트너십 제안", icon: <Briefcase className="h-5 w-5" /> },
  { id: "언론/미디어", desc: "보도자료, 인터뷰, 미디어 문의", icon: <Newspaper className="h-5 w-5" /> },
  { id: "기술 문의", desc: "API, 개발자 지원, 기술적 질문", icon: <Cpu className="h-5 w-5" /> },
  { id: "커뮤니티", desc: "이벤트/커뮤니티 활동/사용자 모임", icon: <Users className="h-5 w-5" /> },
  { id: "콘텐츠 문의", desc: "게임 리뷰/제작/스트리밍 관련", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "법무/규정", desc: "저작권, 이용약관, 법적 문의", icon: <Scale className="h-5 w-5" /> },
  { id: "일반 문의", desc: "기타 일반적인 문의", icon: <Puzzle className="h-5 w-5" /> },
];

export default function SupportOtherInquiryPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [main, setMain] = useState<MainType>("일반 문의");
  const [sub, setSub] = useState<SubType | "">("");
  const [desc, setDesc] = useState("");
  const [hasAttachment, setHasAttachment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = !!sub && desc.trim().length >= 10;

  const submit = () => {
    setError(null);
    if (!sub) return setError("문의 상세 유형을 선택하세요.");
    if (desc.trim().length < 10) return setError("문의 내용을 10자 이상 입력하세요.");
    try {
      const raw = localStorage.getItem("support:other");
      const arr = raw ? JSON.parse(raw) : [];
      const id = String(Date.now());
      arr.push({
        id,
        user: user?.email || "guest",
        main,
        sub,
        desc: desc.trim(),
        hasAttachment,
        status: "접수대기",
        kind: "기타 문의",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("support:other", JSON.stringify(arr));
      navigate("/support/success", { state: { id: `INQ-${id}`, kind: "기타 문의" } });
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="flex items-start gap-3">
        <HelpCircle className="h-6 w-6 text-primary mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold text-white">기타 문의</h2>
          <p className="text-sm text-muted-foreground">게임이나 계정 외 다양한 문의사항을 접수하실 수 있습니다. 적절한 담당 부서로 전달해 드립니다.</p>
        </div>
      </div>

      {/* 메인/서브 유형 선택 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">문의 유형 선택</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {subTypes.map((c) => (
      <label 
        key={c.id} 
        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${
          sub === c.id 
            ? "border-primary bg-primary/5" 
            : "border-primary/20 hover:border-primary/40"
        }`}
      >
        <Checkbox 
          checked={sub === c.id} 
          onCheckedChange={() => setSub(c.id)} 
          className="mt-0.5"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {c.icon}
            <span className="text-sm font-medium">{c.id}</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{c.desc}</div>
        </div>
      </label>
    ))}
  </div>
</CardContent>
      </Card>

      {/* 내용 */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">문의 내용</CardTitle>
            <div className="text-xs text-muted-foreground">상세 내용을 구체적으로 작성해 주세요. (최소 10자)</div>
        </CardHeader>
        <CardContent className="space-y-6">
          <Textarea rows={8} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="문의하실 내용을 자세히 설명해주세요" />
          {error && <div className="text-xs text-destructive">{error}</div>}
          <div className="text-right">
            <Button onClick={submit} disabled={!valid}>문의 보내기</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
