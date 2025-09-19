import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { isEmailTaken } from "./authStore";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sendMail = () => {
    setMsg(null); setError(null);
    const e = email.trim().toLowerCase();
    const ok = /\S+@\S+\.\S+/.test(e);
    if (!ok) return setError("올바른 이메일 형식을 입력하세요.");
    // Demo: 이메일 존재 여부 확인
    if (!isEmailTaken(e)) return setError("등록된 이메일을 찾을 수 없습니다.");
    // 실서비스: 여기서 /auth/forgot-password API 호출
    setMsg("재설정 링크가 포함된 메일을 발송했습니다. 메일함을 확인해주세요.");
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>비밀번호 찾기</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">등록된 이메일</Label>
              <Input id="email" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              <p className="text-xs text-muted-foreground">재설정 링크가 포함된 메일을 보내드립니다.</p>
            </div>
            {error && <div className="text-xs text-destructive">{error}</div>}
            {msg && <div className="text-xs text-green-400">{msg}</div>}
            <div className="flex items-center gap-2">
              <Button onClick={sendMail}>재설정 메일 발송</Button>
              <Button variant="outline" className="border-primary/30" onClick={() => navigate("/user01")}>로그인으로 돌아가기</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

