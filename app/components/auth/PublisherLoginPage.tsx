import { FormEvent, useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Check, LogOut } from "lucide-react";
import {
  clearPublisherSession,
  getPublisherSession,
  loginPublisher,
  persistPublisherSession,
  PublisherSession,
} from "./publisherStore";

const featureItems = [
  "게임 등록 및 관리",
  "실시간 판매 현황 모니터링",
  "상세한 수익 분석",
  "마케팅 도구 제공",
  "전담 지원팀",
];

export default function PublisherLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState<PublisherSession | null>(null);

  useEffect(() => {
    const stored = getPublisherSession();
    if (stored.session) {
      setSession(stored.session);
      setEmail(stored.session.email);
      setRemember(stored.remember);
      navigate("/publisher/dashboard", { replace: true });
      return;
    }
    setRemember(stored.remember);
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setError(null);

    if (!email.trim()) return setError("이메일을 입력하세요.");
    if (!password) return setError("비밀번호를 입력하세요.");

    setIsSubmitting(true);
    const res = await loginPublisher(email, password);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.error || "로그인에 실패했습니다.");
      return;
    }

    persistPublisherSession(res.account, remember);
    setSession({ id: res.account.id, companyName: res.account.companyName, email: res.account.email });
    setPassword("");
    navigate("/publisher/dashboard");
  };

  const handleLogout = () => {
    clearPublisherSession();
    setSession(null);
    setPassword("");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050716] py-16 px-6 text-white">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 lg:flex-row">
        <Card className="relative w-full overflow-hidden border-transparent bg-[#0b1120]/95 shadow-[0_24px_80px_rgba(8,13,35,0.65)]">
          <div className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-blue-600/40 blur-3xl" />
          <CardContent className="relative z-10 space-y-8 p-10">
            <div className="space-y-3 text-center">
              <span className="font-semibold tracking-[0.4em] text-cyan-300">NGS</span>
              <h1 className="text-3xl font-bold">배급사 로그인</h1>
              <p className="text-sm text-white/70">게임 배급 관리 시스템에 접속하세요</p>
            </div>

            {session && (
              <Alert className="border-cyan-400/40 bg-cyan-500/10 text-cyan-100">
                <AlertTitle>로그인 중</AlertTitle>
                <AlertDescription>
                  현재 <strong>{session.companyName}</strong> 계정으로 접속 중입니다.
                </AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert className="border-red-400/40 bg-red-500/10 text-red-100">
                <AlertTitle>로그인 실패</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="publisher-email" className="text-white">이메일</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <Input
                    id="publisher-email"
                    type="email"
                    autoComplete="email"
                    placeholder="publisher@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="publisher-password" className="text-white">비밀번호</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                  <Input
                    id="publisher-password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-xl border-white/10 bg-white/5 pl-10 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-white/70">
                <label className="flex items-center gap-2">
                  <Checkbox id="remember" checked={remember} onCheckedChange={(v) => setRemember(!!v)} className="border-white/40 data-[state=checked]:bg-blue-500" />
                  <span>로그인 상태 유지</span>
                </label>
                {session ? (
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" /> 로그아웃
                  </button>
                ) : (
                  <Link to="/publisher/signup" className="text-xs text-blue-300 hover:text-blue-200">
                    아직 계정이 없으신가요?
                  </Link>
                )}
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 w-full rounded-xl bg-[#2563eb] text-base font-semibold text-white hover:bg-[#1d4ed8]"
              >
                {isSubmitting ? "확인 중..." : "로그인"}
              </Button>
            </form>

            <div className="text-center text-xs text-white/50">
              배급사 회원가입이 필요하신가요?{" "}
              <Link to="/publisher/signup" className="text-blue-300 hover:text-blue-200">
                배급사 회원가입
              </Link>
            </div>

            {session && (
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  type="button"
                  className="h-11 rounded-2xl bg-gradient-to-r from-[#22d3ee] to-[#3b82f6] px-6 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(34,211,238,0.35)]"
                  onClick={() => navigate("/publisher/dashboard")}
                >
                  대시보드 바로가기
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-2xl border-blue-400/40 bg-blue-500/10 px-6 text-sm font-semibold text-blue-200 hover:bg-blue-500/20"
                  onClick={() => navigate("/publisher/notices")}
                >
                  공지사항 관리 바로가기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <aside className="flex w-full max-w-md flex-col justify-center rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b1120] to-[#050716] p-10 text-white/90">
          <h2 className="text-2xl font-semibold text-white">배급사 파트너가 되세요</h2>
          <p className="mt-3 text-sm text-white/60">
            성장하는 게임 생태계와 함께하세요. 실시간 데이터와 맞춤형 도구로 더 나은 배급 전략을 설계할 수 있습니다.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            {featureItems.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10 text-blue-300">
                  <Check className="h-4 w-4" />
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
