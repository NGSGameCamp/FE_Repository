import { ChangeEvent, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Input } from "../y_ui/base/input";
import { Textarea } from "../y_ui/base/textarea";
import { Button } from "../y_ui/base/button";
import { Label } from "../y_ui/base/label";
import { PublisherLayout } from "./PublisherLayout";
import { Badge } from "../y_ui/base/badge";
import { toast } from "sonner";
import { Building2, Upload } from "lucide-react";

const mockCompany = {
  name: "퍼블리셔 회사",
  registrationNumber: "123-45-67890",
  registeredAt: "2024-01-15",
  description: "혁신적인 게임을 만들고 배급하는 회사입니다.",
  website: "https://example.com",
  contactEmail: "contact@publisher.com",
  contactPhone: "02-1234-5678",
  address: "서울특별시 강남구 테헤란로 123",
  logoColor: "#2563eb",
};

export default function PublisherCompanyInfoPage() {
  const [company, setCompany] = useState(mockCompany);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const logoLetter = useMemo(
    () => company.name.slice(0, 1).toUpperCase(),
    [company.name]
  );

  const onLogoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!/image\/(png|jpeg|jpg)/.test(file.type)) {
      toast.error("PNG 또는 JPG 이미지를 선택해 주세요.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
      toast.success("로고 미리보기를 업데이트했습니다.");
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success(
      "회사 정보를 임시로 저장했습니다. 추후 API 연동 후 반영됩니다."
    );
  };

  return (
    <PublisherLayout
      title="설정"
      subtitle="회사 정보를 최신 상태로 유지하고 브랜드 자산을 관리하세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
          <Building2 className="h-3.5 w-3.5" /> Company Settings
        </div>
      }
      actions={
        <Badge className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] text-white/60">
          마지막 수정 2024.05.11
        </Badge>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <aside className="rounded-3xl border border-white/12 bg-publisher-panel p-5 shadow-[0_16px_45px_rgba(5,12,30,0.45)]">
          <nav className="space-y-2">
            <Button className="w-full justify-start rounded-2xl bg-blue-500 text-white hover:bg-blue-500/90">
              회사 정보
            </Button>
          </nav>
        </aside>

        <form onSubmit={onSubmit} className="space-y-6">
          <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
            <CardHeader>
              <CardTitle className="text-lg">회사 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="company-name">회사명 *</Label>
                <Input
                  id="company-name"
                  value={company.name}
                  onChange={(event) =>
                    setCompany((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>회사 로고</Label>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-2xl font-semibold">
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company logo preview"
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    ) : (
                      logoLetter
                    )}
                  </div>
                  <div className="space-y-2">
                    <Button
                      type="button"
                      className="rounded-2xl bg-blue-500 px-4 text-sm font-semibold text-white hover:bg-blue-500/90"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="mr-2 h-4 w-4" /> 로고 변경
                    </Button>
                    <p className="text-xs text-white/50">
                      권장 크기: 200x200px, JPG/PNG
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/png,image/jpeg"
                      className="hidden"
                      onChange={onLogoChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="registration">사업자 등록번호</Label>
                  <Input
                    id="registration"
                    value={company.registrationNumber}
                    onChange={(event) =>
                      setCompany((prev) => ({
                        ...prev,
                        registrationNumber: event.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registeredAt">등록일</Label>
                  <Input
                    id="registeredAt"
                    value={company.registeredAt}
                    onChange={(event) =>
                      setCompany((prev) => ({
                        ...prev,
                        registeredAt: event.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">회사 소개</Label>
                <Textarea
                  id="description"
                  value={company.description}
                  onChange={(event) =>
                    setCompany((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={4}
                  className="rounded-2xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트</Label>
                  <Input
                    id="website"
                    value={company.website}
                    onChange={(event) =>
                      setCompany((prev) => ({
                        ...prev,
                        website: event.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">대표 이메일</Label>
                  <Input
                    id="email"
                    value={company.contactEmail}
                    onChange={(event) =>
                      setCompany((prev) => ({
                        ...prev,
                        contactEmail: event.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">대표 전화번호</Label>
                  <Input
                    id="phone"
                    value={company.contactPhone}
                    onChange={(event) =>
                      setCompany((prev) => ({
                        ...prev,
                        contactPhone: event.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    value={company.address}
                    onChange={(event) =>
                      setCompany((prev) => ({
                        ...prev,
                        address: event.target.value,
                      }))
                    }
                    className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="h-11 rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.45)] hover:bg-blue-500/90"
                >
                  변경 사항 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </PublisherLayout>
  );
}
