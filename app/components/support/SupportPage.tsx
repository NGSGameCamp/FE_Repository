import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Input } from "../y_ui/base/input";
import { Separator } from "../y_ui/base/separator";
import {
  HelpCircle,
  Gamepad2,
  RefreshCw,
  User,
  MoreHorizontal,
  Mail,
  Phone,
  Clock,
} from "lucide-react";
import StarBorder from "~/components/y_ui/motion-effects/StarBorder";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export function SupportPage() {
  const { isAuthenticated } = useAuth();
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-6 py-6">
      <div
        className="mx-auto w-full space-y-8"
        style={{ width: "min(100%, 50vw)", minWidth: "320px" }}
      >
      {/* Intro */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <HelpCircle className="h-6 w-6 text-primary mt-0.5" />
          <div>
            <h2 className="text-3xl font-semibold text-white">고객센터</h2>
            <p className="text-sm text-muted-foreground">
              언제든지 도움이 필요하시면 문의해주세요. 빠르고 정확한 답변을
              드리겠습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Category chooser and Contact info side by side */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category chooser */}
        <div className="flex-1">
          <StarBorder
            as="div"
            color="cyan"
            speed="5s"
            className="block w-full h-full"
            style={{ borderRadius: 12 }}
          >
            <Card className="shadow-sm h-full">
              <CardHeader>
                <CardTitle className="text-base">문의 유형 선택</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <CategoryItem
                  icon={<Gamepad2 className="h-5 w-5" />}
                  title="게임 문의"
                  desc="게임 관련 문제나 궁금한 점"
                  onClick={() => navigate("/support/new?category=game")}
                />
                <CategoryItem
                  icon={<RefreshCw className="h-5 w-5" />}
                  title="환불 문의"
                  desc="환불 요청 및 결제 관련 문의"
                  onClick={() => navigate("/support/refund")}
                />
                <CategoryItem
                  icon={<User className="h-5 w-5" />}
                  title="1:1 문의"
                  desc="개인적인 문의나 계정 관련 문제"
                  onClick={() => navigate("/support/one-to-one")}
                />
                <CategoryItem
                  icon={<MoreHorizontal className="h-5 w-5" />}
                  title="기타 문의"
                  desc="기타 서비스 관련 문의"
                  onClick={() => navigate("/support/other")}
                />
              </CardContent>
            </Card>
          </StarBorder>
        </div>

        {/* Contact info */}
        <div className="w-full lg:w-80">
          <StarBorder
            as="div"
            color="cyan"
            speed="5s"
            className="block w-full h-full"
            style={{ borderRadius: 12 }}
          >
            <Card className="border-transparent shadow-sm rounded-xl h-full">
              <CardHeader>
                <CardTitle className="text-base">연락처 정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  <div>
                    <div className="text-sm">이메일</div>
                    <div className="text-xs text-muted-foreground">
                      support@nexusgaming.com
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4" />
                  <div>
                    <div className="text-sm">전화</div>
                    <div className="text-xs text-muted-foreground">
                      1588-1234
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4" />
                  <div>
                    <div className="text-sm">운영시간</div>
                    <div className="text-xs text-muted-foreground">
                      평일 09:00 - 18:00
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StarBorder>
        </div>
      </div>
      </div>
    </div>
  );
}

function CategoryItem({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-primary/20 p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition"
    >
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
