import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserEditPage() {
  const { user, updateNickname } = useAuth();
  const [nickname, setNickname] = useState(user?.name || "");
  const nav = useNavigate();

  useEffect(() => {
    setNickname(user?.name || "");
  }, [user?.name]);

  const save = async () => {
    const next = nickname.trim();
    if (!next) return;
    await updateNickname(next);
    nav("/user06");
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <h2 className="text-xl font-semibold">회원정보 수정</h2>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">기본 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="닉네임을 입력하세요" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" value={user?.email || ""} readOnly className="opacity-70" />
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={save}>정보수정([edit])</Button>
            <Button variant="outline" className="border-primary/30" onClick={() => nav("/user06")}>취소([cancel])</Button>
            <Button variant="outline" className="border-primary/30" onClick={() => nav("/user03")}>비밀번호 변경([editpwd])</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

