import { FormEvent, useState } from "react";
import { Card, CardContent } from "../y_ui/base/card";
import { Input } from "../y_ui/base/input";
import { Label } from "../y_ui/base/label";
import { Button } from "../y_ui/base/button";
import { Alert, AlertDescription, AlertTitle } from "../y_ui/feedback/alert";
import { Checkbox } from "../y_ui/form-controls/checkbox";
import { Link, useNavigate } from "react-router-dom";
import { registerPublisher } from "./publisherStore";

const procedureSteps = [
  {
    title: "정보 입력",
    description: "회사 및 담당자 정보를 입력합니다",
  },
  {
    title: "심사 진행",
    description: "영업일 1-2일 이내 심사가 진행됩니다",
  },
  {
    title: "승인 알림",
    description: "승인 완료 시 이메일로 알려드립니다",
  },
  {
    title: "서비스 이용",
    description: "게임 등록 및 판매를 시작하세요",
  },
];

export default function PublisherSignupPage() {
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessRegNumber, setBusinessRegNumber] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setSuccess(null);

    if (!companyName.trim()) return setError("회사명을 입력하세요.");
    if (!email.trim()) return setError("이메일을 입력하세요.");
    if (!password) return setError("비밀번호를 입력하세요.");
    if (password !== confirmPassword)
      return setError("비밀번호 확인이 일치하지 않습니다.");
    if (!businessRegNumber.trim())
      return setError("사업자등록번호를 입력하세요.");
    if (!agreeTerms) return setError("약관에 동의해야 회원가입이 가능합니다.");

    setIsSubmitting(true);
    const res = await registerPublisher({
      companyName,
      email,
      password,
      businessRegNumber,
    });
    setIsSubmitting(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setSuccess("배급사 계정이 생성되었습니다. 로그인 후 이용해 주세요.");
    setCompanyName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setBusinessRegNumber("");
    setAgreeTerms(false);
    setAgreeMarketing(false);

    setTimeout(() => navigate("/publisher/login"), 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050716] py-16 px-6 text-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row">
        <Card className="relative w-full overflow-hidden border border-white/5 bg-[#0b1120]/95 text-white shadow-[0_24px_80px_rgba(8,13,35,0.65)]">
          <div className="pointer-events-none absolute -left-24 top-0 h-56 w-56 rounded-full bg-cyan-500/30 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-blue-600/40 blur-3xl" />
          <CardContent className="relative z-10 p-10">
            <div className="space-y-3 text-center">
              <span className="font-semibold tracking-[0.4em] text-cyan-300">
                NGS
              </span>
              <h1 className="text-3xl font-bold">배급사 회원가입</h1>
              <p className="text-sm text-white/60">
                새로운 배급사 파트너로 등록해 주세요.
              </p>
            </div>

            <form className="mt-10 grid gap-6" onSubmit={handleSubmit}>
              {error && (
                <Alert className="border-red-400/40 bg-red-500/10 text-red-100">
                  <AlertTitle>등록 실패</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="border-blue-400/40 bg-blue-500/10 text-blue-100">
                  <AlertTitle>등록 완료</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-2">
                <Label htmlFor="companyName" className="text-white">
                  회사명
                </Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(event) => setCompanyName(event.target.value)}
                  placeholder="회사명을 입력하세요"
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="publisher@example.com"
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                />
                <p className="text-xs text-white/40">
                  비즈니스 이메일을 사용해 주세요.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="8자 이상, 영문/숫자 포함"
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  비밀번호 확인
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="businessRegNumber" className="text-white">
                  사업자 등록번호
                </Label>
                <Input
                  id="businessRegNumber"
                  value={businessRegNumber}
                  onChange={(event) =>
                    setBusinessRegNumber(
                      event.target.value.replace(/[^\d-]/g, "")
                    )
                  }
                  placeholder="000-00-00000"
                  className="h-12 rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>

              <div className="space-y-3 text-sm text-white/60">
                <label className="flex items-start gap-3">
                  <Checkbox
                    checked={agreeTerms}
                    onCheckedChange={(value) => setAgreeTerms(!!value)}
                    className="mt-0.5 border-white/40 data-[state=checked]:bg-blue-500"
                  />
                  <span>
                    <span className="text-white">
                      이용약관 및 개인정보처리방침
                    </span>
                    에 동의합니다.
                  </span>
                </label>
                <label className="flex items-start gap-3">
                  <Checkbox
                    checked={agreeMarketing}
                    onCheckedChange={(value) => setAgreeMarketing(!!value)}
                    className="mt-0.5 border-white/40 data-[state=checked]:bg-blue-500"
                  />
                  <span>마케팅 정보 수신에 동의합니다 (선택).</span>
                </label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 h-12 rounded-xl bg-[#2563eb] text-base font-semibold text-white hover:bg-[#1d4ed8]"
              >
                {isSubmitting ? "등록 중..." : "회원가입"}
              </Button>

              <p className="text-center text-sm text-white/60">
                이미 계정이 있으신가요?{" "}
                <Link
                  to="/publisher01-1"
                  className="text-blue-300 hover:text-blue-200"
                >
                  로그인
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <aside className="flex w-full max-w-md flex-col justify-center gap-6 rounded-3xl border border-white/5 bg-gradient-to-br from-[#0b1120] to-[#050716] p-10 text-white/80">
          <h2 className="text-2xl font-semibold text-white">회원가입 절차</h2>
          <ol className="space-y-5 text-sm">
            {procedureSteps.map((step, index) => (
              <li key={step.title} className="flex items-start gap-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 text-sm font-semibold text-blue-200">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-white">{step.title}</p>
                  <p className="text-white/60">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
