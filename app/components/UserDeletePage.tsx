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
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border border-primary/10 bg-card/90">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
          {/* Avatar placeholder */}
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-3xl font-bold text-primary mb-2">
            {user?.name ? user.name[0] : "U"}
          </div>
          <CardTitle className="text-lg font-semibold text-center text-primary-foreground">
            {user?.name || "-"}
          </CardTitle>
          <div className="text-xs text-muted-foreground text-center">회원 탈퇴</div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-8 pb-8">
          <div className="bg-amber-500/10 text-amber-200 border border-amber-400/30 rounded-md px-4 py-3 text-center text-sm font-medium">
            정말 탈퇴하시겠습니까? 탈퇴 시 모든 데이터는 복구되지 않습니다.
          </div>
          <label className="flex items-center gap-2 text-sm justify-center">
            <Checkbox checked={agree} onCheckedChange={(v: boolean | unknown) => setAgree(Boolean(v))} />
            안내사항을 모두 확인했으며 탈퇴에 동의합니다.
          </label>
          <div className="flex gap-3 justify-between pt-2">
            <Button variant="outline" className="flex-1 border-primary/30" onClick={() => nav("/user06")}>취소</Button>
            <Button className="flex-1 bg-destructive/80 hover:bg-destructive" disabled={!agree} onClick={doDelete}>탈퇴 확인</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

