import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Clock3, CalendarDays, FileText } from "lucide-react";
import SplitText from "@/components/ui/SplitText";
import { useLocation, useNavigate } from "react-router-dom";

type State = {
  id?: string;
  kind?: string; // ex) 게임 문의, 환불 문의
};

export default function SupportSuccessPage() {
  const nav = useNavigate();
  const location = useLocation();
  const state = (location.state || {}) as State;
  const id = state.id || `INQ-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const kind = state.kind || "문의";
  const submittedAt = new Date();

  return (
    <div className="container mx-auto px-6 py-10 space-y-8">
      <div className="text-center space-y-3 flex flex-col items-center justify-center" style={{ minHeight: "30vh" }}>
        <SplitText
          text="문의가 성공적으로 접수되었습니다"
          className="text-2xl font-semibold text-green-400"
          delay={40}
          duration={0.55}
          splitType="chars"
          fromY={28}
          fromOpacity={0}
          tag="h2"
        />
        <SplitText
          text="소중한 의견을 전달받았습니다. 빠른 시일 내에 답변드리겠습니다."
          className="text-sm text-muted-foreground"
          delay={18}
          duration={0.45}
          splitType="words"
          fromY={18}
          fromOpacity={0}
          tag="p"
        />
      </div>

      <Card className="border-primary/20 mx-auto" style={{ maxWidth: 720 }}>
        <CardHeader>
          <CardTitle className="text-base">접수 완료 정보</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-md border border-primary/20 p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-2"><CalendarDays className="h-4 w-4" />접수 번호</div>
            <div className="font-medium mt-1">{id}</div>
          </div>
          <div className="rounded-md border border-primary/20 p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-2"><Clock3 className="h-4 w-4" />예상 답변 시간</div>
            <div className="font-medium mt-1">3–5 영업일 이내</div>
          </div>
          <div className="rounded-md border border-primary/20 p-3">
            <div className="text-xs text-muted-foreground flex items-center gap-2"><FileText className="h-4 w-4" />문의 유형</div>
            <div className="mt-1"><Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">{kind}</Badge></div>
          </div>
          <div className="rounded-md border border-primary/20 p-3">
            <div className="text-xs text-muted-foreground">접수 일시</div>
            <div className="font-medium mt-1">{submittedAt.toLocaleString("ko-KR")}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-amber-500/30 bg-amber-500/5 mx-auto" style={{ maxWidth: 720 }}>
        <CardHeader>
          <CardTitle className="text-base">중요 안내사항</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          <p>• 접수 번호를 보관해주세요. 추가 문의 시 필요할 수 있습니다.</p>
          <p>• 스팸 폴더도 확인해주세요. 답변 이메일이 스팸으로 분류될 수 있습니다.</p>
          <p>• 급한 문제는 고객센터로 직접 연락 부탁드립니다.</p>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button variant="outline" className="border-primary/30" onClick={() => nav("/")}>홈으로 돌아가기</Button>
        <Button onClick={() => nav("/support/my", { replace: true })}>나의 문의사항 보기</Button>
        <Button variant="outline" onClick={() => nav("/support")}>고객센터로 돌아가기</Button>
      </div>
    </div>
  );
}
