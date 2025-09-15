import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Mail, Lock, Search, LogIn, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

const existingIds = new Set(["user", "demo", "admin"]);
const existingEmails = new Set(["demo@example.com", "admin@example.com"]);

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  const onSocial = (provider: "google" | "naver" | "kakao") => {
    alert(`${provider} 로그인은 데모로 연결됩니다.`);
    // 실제 구현: OAuth 시작 → 콜백 처리 후 메인 이동
    navigate("/");
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="mx-auto max-w-lg">
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>로그인</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pwd">비밀번호</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="pwd"
                  type="password"
                  placeholder="password"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex justify-center">
              <Button className="" style={{ width: "35%" }} onClick={() => navigate("/")}>로그인</Button>
            </div>

            <div className="text-center text-sm text-muted-foreground">
              아직 계정이 없으신가요? <Link className="text-primary hover:underline" to="/signup">회원가입</Link>
            </div>

            <Separator />

            <div className="space-y-100">
              <div className="flex justify-center">
                <Button className="" style={{ backgroundColor: "#FFFFFF", color: "#000",  width: "35%" }} onClick={() => onSocial("google")}>
                <img alt="google" src="https://www.google.com/favicon.ico" className="h-4 w-4" />
                &nbsp;구글 로그인
                </Button>
              </div>
              <div className="flex justify-center">
                <Button className="" style={{ backgroundColor: "#03C75A",  width: "35%" }} onClick={() => onSocial("naver")}>
                  네이버 로그인
                </Button>
              </div>
              <div className="flex justify-center">
                <Button className="" style={{ backgroundColor: "#FEE500", color: "#000",  width: "35%" }} onClick={() => onSocial("kakao")}>
                  카카오 로그인
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <Link to="/user03" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"><Search className="h-4 w-4" />아이디 찾기</Link>
              <Link to="/user04" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"><Search className="h-4 w-4" />비밀번호 찾기</Link>
            </div>

            <div className="flex items-center justify-between text-sm">
              <Link to="/user02" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"><UserPlus className="h-4 w-4" />sign up → user02</Link>
              <Link to="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-primary"><LogIn className="h-4 w-4" />login → Main</Link>
            </div>
          </CardContent>
        </Card>
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
