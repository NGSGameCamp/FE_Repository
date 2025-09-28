import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Input } from "../y_ui/base/input";
import { Button } from "../y_ui/base/button";
import { Label } from "../y_ui/base/label";
import { changePassword } from "./authStore";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const emailOrId = params.get("email") || params.get("id") || "";

  const [pwd1, setPwd1] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setOk(null);
    if (pwd1 !== pwd2) return setError("비밀번호가 일치하지 않습니다.");
    const res = await changePassword(emailOrId || ("guest" as string), pwd1);
    if (!res.ok) return setError(res.error || "변경 중 오류가 발생했습니다.");
    setOk("비밀번호가 변경되었습니다.");
    // 요구사항: [gologin]user01으로 이동
    navigate("/user01");
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>비밀번호 재설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              메일 링크를 통해 진입하셨다면 계정 식별자(이메일/아이디)가
              자동으로 채워질 수 있습니다.
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd1">새 비밀번호 (필수)</Label>
              <Input
                id="pwd1"
                type="password"
                placeholder="영문/숫자 포함 8자 이상"
                value={pwd1}
                onChange={(e) => setPwd1(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd2">비밀번호 확인 (필수)</Label>
              <Input
                id="pwd2"
                type="password"
                placeholder="비밀번호를 다시 입력"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
              />
            </div>
            {error && <div className="text-xs text-destructive">{error}</div>}
            {ok && <div className="text-xs text-green-400">{ok}</div>}
            <div className="flex items-center gap-2">
              <Button onClick={onSubmit}>비밀번호 변경</Button>
              <Button
                variant="outline"
                className="border-primary/30"
                onClick={() => navigate("/login")}
              >
                로그인으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
