import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert } from "./ui/alert";
import { Checkbox } from "./ui/checkbox";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserDeletePage() {
  const { user, logout } = useAuth();
  const [agree, setAgree] = useState(false);
  const nav = useNavigate();

  const doDelete = async () => {
    if (!user?.email || !agree) return;
    try {
      const mod = await import("./auth/authStore");
      mod.deleteUser(user.email);
    } catch {}
    // cleanup local profile extras
    try {
      localStorage.removeItem("auth:user");
      localStorage.removeItem(`profile:avatar:${user.email}`);
      localStorage.removeItem(`profile:phone:${user.email}`);
      localStorage.removeItem(`profile:birth:${user.email}`);
    } catch {}
    logout();
    nav("/login");
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">회원 탈퇴</h2>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">Screen ID: user06-01 · 탈퇴 확인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-amber-500/10 text-amber-200 border-amber-400/30">
              정말 탈퇴하시겠습니까? 탈퇴 시 모든 데이터는 복구되지 않습니다.
            </Alert>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
              안내사항을 모두 확인했으며 탈퇴에 동의합니다.
            </label>

            <div className="pt-2 flex gap-2">
              <Button variant="outline" className="border-primary/30" onClick={() => nav("/user06")}>취소([cancel])</Button>
              <Button className="bg-destructive/80 hover:bg-destructive" disabled={!agree} onClick={doDelete}>탈퇴 확인([delete])</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

