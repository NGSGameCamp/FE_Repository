import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useAuth } from "./auth/AuthContext";
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
    <div className="container mx-auto px-6 py-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-xl font-semibold">회원 정보 상세</h2>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">
              Screen ID: user06 · 회원가입 시 입력한 정보 상세 확인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              {/* 계정 정보 */}
              <div className="rounded-lg border border-primary/20 p-4 space-y-3">
                <div className="text-sm font-medium text-muted-foreground">계정 정보</div>
                <div className="rounded-md border border-primary/20 p-3">
                  <div className="text-xs text-muted-foreground">아이디(이메일)</div>
                  <div className="text-sm">{user?.email || "-"}</div>
                </div>
                <div className="rounded-md border border-primary/20 p-3">
                  <div className="text-xs text-muted-foreground">가입일</div>
                  <div className="text-sm">{createdAt}</div>
                </div>
                <div className="rounded-md border border-primary/20 p-6 bg-input/20" />
              </div>

              {/* 프로필 정보 */}
              <div className="rounded-lg border border-primary/20 p-4 space-y-3">
                <div className="text-sm font-medium text-muted-foreground">프로필 정보</div>
                <div className="rounded-md border border-primary/20 p-3">
                  <div className="text-xs text-muted-foreground">이름</div>
                  <div className="text-sm">{user?.name || "-"}</div>
                </div>
                <div className="rounded-md border border-primary/20 p-3">
                  <div className="text-xs text-muted-foreground">연락처</div>
                  <div className="text-sm">{phone}</div>
                </div>
                <div className="rounded-md border border-primary/20 p-3">
                  <div className="text-xs text-muted-foreground">생년월일</div>
                  <div className="text-sm">{birth}</div>
                </div>
                <div className="rounded-md border border-primary/20 p-6 bg-input/20" />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" className="border-primary/30" onClick={() => nav("/user05")}>마이페이지([mypage])</Button>
                <Button variant="outline" className="border-primary/30" onClick={() => nav("/user07")}>정보 수정([editpage])</Button>
              </div>
              <Button className="bg-destructive/80 hover:bg-destructive" onClick={() => nav("/user06-01")}>회원 탈퇴([godelete])</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
