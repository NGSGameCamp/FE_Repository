import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Mail, Lock, Search, LogIn, UserPlus, Shield, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import GradientText from "@/components/ui/GradientText";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

const existingIds = new Set(["user", "demo", "admin"]);
const existingEmails = new Set(["demo@example.com", "admin@example.com"]);

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const onSubmit = () => {
    if (!email.trim()) return alert("이메일을 입력해주세요.");
    login({ email });
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
                <Label htmlFor="email">Username</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="Type your username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    type="password"
                    placeholder="Type your password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex justify-end items-center gap-3 text-xs">
                  <Link to="/user04" className="text-muted-foreground hover:text-primary">Forgot password?</Link>
                  <span className="text-muted-foreground">|</span>
                  <Link to="/signup" className="text-primary hover:underline">Sign up</Link>
                </div>
              </div>

              <Button className="w-full h-11 rounded-full" onClick={onSubmit} variant="outline">
                <GradientText
                  colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
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
                  <img alt="google" src="https://www.google.com/favicon.ico" className="h-6 w-6 rounded-full object-contain" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="group rounded-full p-0 bg-transparent hover:bg-transparent transition-transform hover:scale-105 size-10"
                  onClick={() => onSocial("naver")}
                  aria-label="네이버 로그인"
                >
                  <img alt="naver" src="/social-naver-round.svg" className="h-6 w-6 object-contain" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="group rounded-full p-0 bg-transparent hover:bg-transparent transition-transform hover:scale-105 size-10"
                  onClick={() => onSocial("kakao")}
                  aria-label="카카오 로그인"
                >
                  <img alt="kakao" src="/social-kakao.svg" className="h-6 w-6 rounded-full object-contain" />
                </Button>
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
  const [userId, setUserId] = useState("");
  const [idChecked, setIdChecked] = useState<boolean | null>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState<boolean | null>(null);
  const [agree1, setAgree1] = useState(false);
  const [agree2, setAgree2] = useState(false);
  const [agree3, setAgree3] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      idChecked === true &&
      emailChecked === true &&
      nickname.trim().length > 0 &&
      agree1 &&
      agree2
    );
  }, [idChecked, emailChecked, nickname, agree1, agree2]);

  const checkId = () => {
    setIdChecked(!existingIds.has(userId.trim()));
  };
  const checkEmail = () => {
    setEmailChecked(!existingEmails.has(email.trim().toLowerCase()));
  };

  const helper = (v: boolean | null) => v === null ? "검사 전" : v ? "사용 가능" : "이미 사용 중";

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>회원가입</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Row>
              <div className="space-y-2">
                <Label htmlFor="userId">아이디</Label>
                <div className="flex gap-2">
                  <Input id="userId" placeholder="아이디" value={userId} onChange={(e) => { setUserId(e.target.value); setIdChecked(null); }} />
                  <Button variant="outline" onClick={checkId}>중복확인</Button>
                </div>
                <p className="text-xs text-muted-foreground">{helper(idChecked)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">닉네임</Label>
                <Input id="nickname" placeholder="닉네임" value={nickname} onChange={(e) => setNickname(e.target.value)} />
              </div>
            </Row>

            <Row>
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <div className="flex gap-2">
                  <Input id="email" placeholder="name@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setEmailChecked(null); }} />
                  <Button variant="outline" onClick={checkEmail}>중복확인</Button>
                </div>
                <p className="text-xs text-muted-foreground">{helper(emailChecked)}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pwd">비밀번호</Label>
                <Input id="pwd" type="password" placeholder="영문, 숫자 포함 8자 이상" />
              </div>
            </Row>

            <div className="space-y-3">
              <Label>약관 동의</Label>
              <div className="space-y-2 rounded-md border p-4 border-primary/20">
                <label className="flex items-center gap-3 text-sm"><Checkbox checked={agree1} onCheckedChange={(v) => setAgree1(Boolean(v))} /> (필수) 개인정보 수집 및 이용 동의</label>
                <label className="flex items-center gap-3 text-sm"><Checkbox checked={agree2} onCheckedChange={(v) => setAgree2(Boolean(v))} /> (필수) 서비스 이용 약관 동의</label>
                <label className="flex items-center gap-3 text-sm"><Checkbox checked={agree3} onCheckedChange={(v) => setAgree3(Boolean(v))} /> (선택) 광고성 정보 수신 동의</label>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" disabled={!canSubmit} onClick={() => navigate("/user01")}>가입 완료</Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate("/user01")}>로그인</Button>
            </div>

            <div className="text-right text-sm">
              <Link to="/login" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"><LogIn className="h-4 w-4" /> 로그인 페이지로</Link>
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
          <p className="text-sm text-muted-foreground mt-2">요청하신 네비게이션 동작 확인용 더미 화면입니다.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link className="text-primary hover:underline" to="/">메인으로</Link>
            <Link className="text-primary hover:underline" to="/login">로그인으로</Link>
            <Link className="text-primary hover:underline" to="/signup">회원가입으로</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
