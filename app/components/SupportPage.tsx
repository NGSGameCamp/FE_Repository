import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { HelpCircle, Gamepad2, RefreshCw, User, MoreHorizontal, Mail, Phone, Clock } from "lucide-react";
import StarBorder from "@/components/ui/StarBorder";
import { useAuth } from "./auth/AuthContext";

type Category = "전체" | "게임 문의" | "환불 문의" | "1:1 문의" | "기타 문의";

type Inquiry = {
  id: string;
  category: Exclude<Category, "전체">;
  title: string;
  summary: string;
  status: "접수" | "답변완료" | "처리중";
  game?: string;
  createdAt: string;
};

const inquiries: Inquiry[] = [
  {
    id: "q1",
    category: "게임 문의",
    title: "패치 이후 로그인 오류 발생",
    summary: "1.2 패치 적용 이후 '서버와의 연결이 종료되었습니다' 메시지가 뜹니다.",
    status: "처리중",
    game: "Cyberpunk 2087",
    createdAt: "2시간 전",
  },
  {
    id: "q2",
    category: "환불 문의",
    title: "결제 중복으로 결제 취소 요청",
    summary: "같은 상품이 두 번 결제되었습니다. 결제번호는 ...",
    status: "접수",
    createdAt: "어제",
  },
  {
    id: "q3",
    category: "1:1 문의",
    title: "계정 보안 및 변경 문의",
    summary: "2단계 인증 설정 방법과 이메일 변경 절차가 궁금합니다.",
    status: "답변완료",
    createdAt: "3일 전",
  },
  {
    id: "q4",
    category: "기타 문의",
    title: "커뮤니티 운영 정책 문의",
    summary: "가이드 게시글 승인 기준이 어떻게 되나요?",
    status: "접수",
    createdAt: "5일 전",
  },
  {
    id: "q5",
    category: "게임 문의",
    title: "콘트롤러 진동이 작동하지 않음",
    summary: "Neon Racing에서 듀얼센스 진동이 작동하지 않습니다.",
    status: "접수",
    game: "Neon Racing",
    createdAt: "1시간 전",
  },
];

const categories: Category[] = ["전체", "게임 문의", "환불 문의", "1:1 문의", "기타 문의"];

export function SupportPage() {
  const { isAuthenticated } = useAuth();
  const [keyword, setKeyword] = useState("");
  const [selected, setSelected] = useState<Category>("전체");

  const filtered = useMemo(() => {
    const byCategory = inquiries.filter((i) => selected === "전체" || i.category === selected);
    const k = keyword.trim().toLowerCase();
    if (!k) return byCategory;
    return byCategory.filter((i) =>
      [i.title, i.summary, i.game || "", i.category].some((v) => v.toLowerCase().includes(k)),
    );
  }, [keyword, selected]);

  return (
    <div className="container mx-auto px-6 py-6 space-y-8">
      {/* Intro */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-6 w-6 text-primary mt-0.5" />
          <div>
            <h2 className="text-3xl font-semibold text-white">고객센터</h2>
            <p className="text-sm text-muted-foreground">언제든지 도움이 필요하시면 문의해주세요. 빠르고 정확한 답변을 드리겠습니다.</p>
          </div>
        </div>
        {isAuthenticated && (
          <div className="flex gap-2">
            <a href="/support/new"><Button>문의 글 등록</Button></a>
            <a href="/support/refund"><Button variant="outline" className="border-primary/30">환불 문의</Button></a>
            <a href="/support/one-to-one"><Button variant="outline">1:1 문의</Button></a>
            <a href="/support/other"><Button variant="outline">기타 문의</Button></a>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="max-w-2xl">
        <Input
          placeholder="문의 검색 (제목/내용/게임/카테고리)"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="h-11 text-white"
        />
      </div>

      {/* Category chooser */}
      <Card className="border-primary/30 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">문의 유형 선택</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <CategoryItem icon={<Gamepad2 className="h-5 w-5" />} title="게임 문의" desc="게임 관련 문제나 궁금한 점" onClick={() => setSelected("게임 문의")} />
          <CategoryItem icon={<RefreshCw className="h-5 w-5" />} title="환불 문의" desc="환불 요청 및 결제 관련 문의" onClick={() => setSelected("환불 문의")} />
          <CategoryItem icon={<User className="h-5 w-5" />} title=" 문의" desc="개인적인 문의나 계정 관련 문제" onClick={() => setSelected("1:1 문의")} />
          <CategoryItem icon={<MoreHorizontal className="h-5 w-5" />} title="기타 문의" desc="기타 서비스 관련 문의" onClick={() => setSelected("기타 문의")} />
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <Button
            key={c}
            variant={selected === c ? "default" : "outline"}
            size="sm"
            onClick={() => setSelected(c)}
            className={selected === c ? "" : "border-primary/30"}
          >
            {c}
          </Button>
        ))}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 grid-7-3">
        <div className="lg:col-span-2 space-y-6">
          {filtered.map((q) => (
            <Card key={q.id} className="border-primary/30 hover:border-primary/40 shadow-sm hover:shadow-md transition-shadow transition-colors hover:bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{q.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{q.summary}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <Badge variant="outline">{q.category}</Badge>
                  {q.game && <Badge variant="secondary" className="bg-primary/10 text-primary border border-primary/20">{q.game}</Badge>}
                  <span>상태: {q.status}</span>
                  <span>· {q.createdAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {filtered.length === 0 && (
            <Card className="border-primary/30">
              <CardContent className="py-10 text-center text-sm text-muted-foreground">조건에 맞는 문의가 없습니다.</CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: contact */}
        <div className="space-y-6">
          <StarBorder as="div" color="cyan" speed="5s" className="block w-full" style={{ borderRadius: 12 }}>
            <Card className="border-transparent shadow-sm rounded-xl">
              <CardHeader>
                <CardTitle className="text-base">연락처 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <div>
                  <div className="text-sm">이메일</div>
                  <div className="text-xs text-muted-foreground">support@nexusgaming.com</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4" />
                <div>
                  <div className="text-sm">전화</div>
                  <div className="text-xs text-muted-foreground">1588-1234</div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4" />
                <div>
                  <div className="text-sm">운영시간</div>
                  <div className="text-xs text-muted-foreground">평일 09:00 - 18:00</div>
                </div>
              </div>
              </CardContent>
            </Card>
          </StarBorder>
        </div>
      </div>
    </div>
  );
}

function CategoryItem({ icon, title, desc, onClick }: { icon: React.ReactNode; title: Exclude<Category, "전체">; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-xl border border-primary/20 p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition">
      <div className="flex items-center gap-3">
        <div className="text-primary">{icon}</div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{desc}</div>
        </div>
        <div className="ml-auto text-muted-foreground">→</div>
      </div>
    </button>
  );
}

export default SupportPage;
