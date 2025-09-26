import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import {
  Mail,
  Lock,
  Search,
  LogIn,
  UserPlus,
  Shield,
  Sparkles,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import * as React from "react";
import GradientText from "@/components/ui/GradientText";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

// const existingIds = new Set(["user", "demo", "admin"]);
// const existingEmails = new Set(["demo@example.com", "admin@example.com"]);

export function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWithPassword } = useAuth();
  const [loginId, setLoginId] = useState("");
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!loginId.trim()) return setError("이메일 또는 아이디를 입력하세요.");
    if (!pwd) return setError("비밀번호를 입력하세요.");
    const res = await loginWithPassword(loginId, pwd);
    if (!res.ok) return setError(res.error || "로그인에 실패했습니다.");
    navigate("/");
  };

  const onSocial = (provider: "google" | "naver" | "kakao") => {
    alert(`${provider} 로그인은 데모로 연결됩니다.`);
    login({ email: `${provider}@demo.local`, name: provider.toUpperCase() });
    navigate("/");
  };

  return (
    <div className="relative">
      {/* Page gradient background similar to mock */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-cyan-500/40 via-blue-500/30 to-fuchsia-500/40" />
      <div className="absolute -z-10 left-10 top-10 h-56 w-56 rotate-12 rounded-3xl bg-white/5 blur-2xl" />
      <div className="absolute -z-10 right-20 bottom-16 h-60 w-60 -rotate-6 rounded-3xl bg-black/10 blur-2xl" />

      <div className="container mx-auto px-6 min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="border-transparent bg-card/95 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Sign in</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="login">Email or ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login"
                    placeholder="이메일 또는 아이디"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pwd">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pwd"
                    type={showPwd ? "text" : "password"}
                    placeholder="비밀번호"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    aria-label="toggle password"
                    onClick={() => setShowPwd((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex justify-end items-center gap-3 text-xs">
                  <Link
                    to="/forgot-password"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Forgot password?
                  </Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/signup" className="text-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </div>

              {error && <div className="text-xs text-destructive">{error}</div>}

              <Button
                className="w-full h-11 rounded-full"
                onClick={onSubmit}
                variant="outline"
              >
                <GradientText
                  colors={[
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                    "#4079ff",
                    "#40ffaa",
                  ]}
                  animationSpeed={3}
                  showBorder={false}
                  className="px-2"
                >
                  Sign In
                </GradientText>
              </Button>

              <div className="flex justify-center gap-4">
                <Button
                  size="icon"
                  variant="ghost"
                  className="group rounded-full p-0 bg-transparent hover:bg-transparent transition-transform hover:scale-105 size-10"
                  onClick={() => onSocial("google")}
                >
                  <img
                    alt="google"
                    src="https://www.google.com/favicon.ico"
                    className="h-6 w-6 rounded-full object-contain"
                  />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="group rounded-full p-0 bg-transparent hover:bg-transparent transition-transform hover:scale-105 size-10"
                  onClick={() => onSocial("naver")}
                  aria-label="네이버 로그인"
                >
                  <img
                    alt="naver"
                    src="/social-naver-round.svg"
                    className="h-6 w-6 object-contain"
                  />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="group rounded-full p-0 bg-transparent hover:bg-transparent transition-transform hover:scale-105 size-10"
                  onClick={() => onSocial("kakao")}
                  aria-label="카카오 로그인"
                >
                  <img
                    alt="kakao"
                    src="/social-kakao.svg"
                    className="h-6 w-6 rounded-full object-contain"
                  />
                </Button>
              </div>

              <div className="text-center text-xs text-muted-foreground">
                배급사 파트너이신가요?{" "}
                <Link
                  to="/publisher/login"
                  className="text-primary hover:underline"
                >
                  배급사 로그인
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function SignupPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { register } = useAuth();

  const canSubmit = useMemo(() => {
    return (
      nicknameChecked === true &&
      emailChecked === true &&
      nickname.trim().length > 0 &&
      agree1 &&
      agree2
    );
  }, [nicknameChecked, emailChecked, nickname, agree1, agree2]);

  const checkNickname = () => {
    const name = nickname.trim();
    if (!name) {
      setNicknameChecked(false);
      return;
    }
    import("./authStore").then((m) =>
      setNicknameChecked(!m.isNicknameTaken(name))
    );
  };
  const checkEmail = () => {
    import("./authStore").then((m) =>
      setEmailChecked(!m.isEmailTaken(email.trim().toLowerCase()))
    );
  };

  const helper = (v: boolean | null) =>
    v === null ? "검사 전" : v ? "사용 가능" : "이미 사용 중";

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <div className="flex gap-2">
                <Input
                  id="nickname"
                  placeholder="닉네임"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value);
                    setNicknameChecked(null);
                  }}
                />
                <Button variant="outline" onClick={checkNickname}>
                  중복확인
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {helper(nicknameChecked)}
              </p>
            </div>

            <Row>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailChecked(null);
                    }}
                  />
                  <Button variant="outline" onClick={checkEmail}>
                    중복확인
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {helper(emailChecked)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pwd">비밀번호</Label>
                <Input
                  id="pwd"
                  type="password"
                  placeholder="영문, 숫자 포함 8자 이상"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                />
              </div>
            </Row>

            <div className="space-y-2">
              <Label htmlFor="pwd2">비밀번호 확인</Label>
              <Input
                id="pwd2"
                type="password"
                placeholder="비밀번호 재입력"
                value={pwd2}
                onChange={(e) => setPwd2(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              <Label>약관 동의</Label>
              <div className="space-y-2 rounded-md border p-4 border-primary/20">
                <label className="flex items-center gap-3 text-sm">
                  <Checkbox
                    checked={agree1}
                    onCheckedChange={(v) => setAgree1(Boolean(v))}
                  />{" "}
                  (필수) 개인정보 수집 및 이용 동의
                </label>
                <label className="flex items-center gap-3 text-sm">
                  <Checkbox
                    checked={agree2}
                    onCheckedChange={(v) => setAgree2(Boolean(v))}
                  />{" "}
                  (필수) 서비스 이용 약관 동의
                </label>
              </div>
            </div>

            {error && <div className="text-xs text-destructive">{error}</div>}

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="flex-1"
                disabled={!canSubmit}
                onClick={async () => {
                  setError(null);
                  if (pwd !== pwd2)
                    return setError("비밀번호가 일치하지 않습니다.");
                  const res = await register({
                    nickname,
                    email,
                    password: pwd,
                  });
                  if (!res.ok)
                    return setError(res.error || "가입에 실패했습니다.");
                  navigate("/");
                }}
              >
                가입 완료
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/login")}
              >
                로그인
              </Button>
            </div>

            <div className="text-right text-sm">
              <Link
                to="/login"
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"
              >
                <LogIn className="h-4 w-4" /> 로그인 페이지로
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ScreenStub({ id }: { id: string }) {
  return (
    <div className="container mx-auto px-6 py-10">
      <Card className="border-primary/20">
        <CardContent className="py-12 text-center">
          <div className="text-xl font-semibold">Screen {id}</div>
          <p className="text-sm text-muted-foreground mt-2">
            요청하신 네비게이션 동작 확인용 더미 화면입니다.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link className="text-primary hover:underline" to="/">
              메인으로
            </Link>
            <Link className="text-primary hover:underline" to="/login">
              로그인으로
            </Link>
            <Link className="text-primary hover:underline" to="/signup">
              회원가입으로
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
