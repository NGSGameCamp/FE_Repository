import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { useAuth } from "../auth/AuthContext";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function UserInfoPage() {
  const { user } = useAuth();
  const nav = useNavigate();

  const createdAt = useMemo(() => {
    try {
      const email = user?.email?.toLowerCase();
      const raw = localStorage.getItem("auth:users");
      if (!email || !raw) return "-";
      const arr = JSON.parse(raw);
      const u = Array.isArray(arr) ? arr.find((x: any) => x.email?.toLowerCase() === email) : null;
      return u?.createdAt ? new Date(u.createdAt).toISOString().slice(0, 10) : "-";
    } catch {
      return "-";
    }
  }, [user?.email]);

  const phone = useMemo(() => {
    try { return localStorage.getItem(`profile:phone:${user?.email}`) || "010-1234-5678"; } catch { return "010-1234-5678"; }
  }, [user?.email]);
  const birth = useMemo(() => {
    try { return localStorage.getItem(`profile:birth:${user?.email}`) || "1996-03-14"; } catch { return "1996-03-14"; }
  }, [user?.email]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md shadow-xl border border-primary/10 bg-card/90">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-4">
          {/* Avatar placeholder */}
          <CardTitle className="text-lg font-semibold text-center text-primary-foreground mt-4">
            {user?.name || "-"}
          </CardTitle>
          <div className="text-xs text-muted-foreground text-center">회원 정보</div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 px-8 pb-8">
          <div className="space-y-4">
            <InfoRow label="이름(닉네임)" value={user?.name || "-"} />
            <InfoRow label="아이디(이메일)" value={user?.email || "-"} />
            <InfoRow label="연락처" value={phone} />
            <InfoRow label="생년월일" value={birth} />
            <InfoRow label="가입일" value={createdAt} />
          </div>
          <div className="flex gap-3 justify-between pt-2">
            <Button variant="outline" className="flex-1 border-primary/30" onClick={() => nav("/profile")}>취소</Button>

            <Button variant="outline" className="flex-1 border-primary/30" onClick={() => nav("/user07")}>정보 수정</Button>
            <Button className="flex-1 bg-destructive/80 hover:bg-destructive" onClick={() => nav("/user06-01")}>회원 탈퇴</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
// 정보 행 컴포넌트
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-muted py-2 last:border-b-0">
      <span className="text-xs text-muted-foreground font-medium w-32">{label}</span>
      <span className="text-sm text-primary-foreground text-right flex-1">{value}</span>
    </div>
  );
}
}
