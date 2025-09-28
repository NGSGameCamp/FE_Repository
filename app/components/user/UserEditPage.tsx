import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Input } from "../y_ui/base/input";
import { Label } from "../y_ui/base/label";
import { Button } from "../y_ui/base/button";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserEditPage() {
  const { user, updateNickname } = useAuth();
  const [nickname, setNickname] = useState(user?.name || "");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    setNickname(user?.name || "");
    try {
      setPhone(
        localStorage.getItem(`profile:phone:${user?.email}`) || "010-1234-5678"
      );
    } catch {
      setPhone("010-1234-5678");
    }
    try {
      setBirth(
        localStorage.getItem(`profile:birth:${user?.email}`) || "1996-03-14"
      );
    } catch {
      setBirth("1996-03-14");
    }
  }, [user?.name, user?.email]);

  const save = async () => {
    const next = nickname.trim();
    if (!next) return;
    await updateNickname(next);
    try {
      localStorage.setItem(`profile:phone:${user?.email}`, phone);
      localStorage.setItem(`profile:birth:${user?.email}`, birth);
    } catch {}
    nav("/user06");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border border-primary/10 bg-card/90">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
          {/* Avatar placeholder */}
          <CardTitle className="text-lg font-semibold text-center text-primary-foreground mt-4">
            {user?.name || "-"}
          </CardTitle>
          <div className="text-xs text-muted-foreground text-center">
            회원정보 수정
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-8 pb-8">
          <div className="space-y-4">
            <EditRow label="닉네임">
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
            </EditRow>
            <EditRow label="이메일">
              <Input
                id="email"
                value={user?.email || ""}
                readOnly
                className="opacity-70"
              />
            </EditRow>
            <EditRow label="연락처">
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
              />
            </EditRow>
            <EditRow label="생년월일">
              <Input
                id="birth"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                placeholder="YYYY-MM-DD"
                type="date"
              />
            </EditRow>
          </div>
          <div className="flex gap-3 justify-between pt-2">
            <Button
              variant="outline"
              className="flex-1 border-primary/30"
              onClick={() => nav("/user06")}
            >
              취소
            </Button>
            <Button className="flex-1" onClick={save}>
              정보수정
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-primary/30"
              onClick={() => nav("/user03")}
            >
              비밀번호 변경
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
  // 정보 수정 행 컴포넌트
  function EditRow({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="flex items-center justify-between border-b border-muted py-2 last:border-b-0 gap-4">
        <span className="text-xs text-muted-foreground font-medium w-32">
          {label}
        </span>
        <div className="flex-1">{children}</div>
      </div>
    );
  }
}
