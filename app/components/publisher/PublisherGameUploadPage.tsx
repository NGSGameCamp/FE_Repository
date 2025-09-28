import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { PublisherLayout } from "./PublisherLayout";
import { Input } from "../y_ui/base/input";
import { Label } from "../y_ui/base/label";
import { Textarea } from "../y_ui/base/textarea";
import { Button } from "../y_ui/base/button";
import { Badge } from "../y_ui/base/badge";
import { Checkbox } from "../y_ui/form-controls/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../y_ui/overlay/dropdown-menu";
import { toast } from "sonner";
import { mockGames } from "@/data/mockGames";
import { Gamepad, Search, ChevronDown, Wand2 } from "lucide-react";

const categories = [
  "액션",
  "RPG",
  "어드벤처",
  "시뮬레이션",
  "레이싱",
  "퍼즐",
  "슈팅",
];
const platforms = [
  "Windows",
  "macOS",
  "Linux",
  "PlayStation",
  "Xbox",
  "Nintendo Switch",
];
const featurePresets = [
  "멀티플레이어",
  "싱글플레이",
  "오픈월드",
  "크로스플레이",
  "시즌제",
  "지원 언어 12개",
];

function getReviewStatusCounts() {
  const counts = { waiting: 0, progress: 0, answered: 0 };
  mockGames.forEach((_, index) => {
    const key =
      index % 3 === 0 ? "waiting" : index % 3 === 1 ? "progress" : "answered";
    counts[key as keyof typeof counts] += 1;
  });
  return counts;
}

export default function PublisherGameUploadPage() {
  const navigate = useNavigate();
  const counts = useMemo(getReviewStatusCounts, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<string>(categories[0]);
  const [price, setPrice] = useState("0");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [platformSelection, setPlatformSelection] = useState<string[]>([
    "Windows",
  ]);
  const [minSpec, setMinSpec] = useState("");
  const [recSpec, setRecSpec] = useState("");
  const [discountRate, setDiscountRate] = useState("0");
  const [discountStart, setDiscountStart] = useState("");
  const [discountEnd, setDiscountEnd] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");

  const suggestions = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();
    if (!value) return [];
    return mockGames.filter((game) =>
      `${game.title} ${game.genre}`.toLowerCase().includes(value)
    );
  }, [searchTerm]);

  const applyTemplate = (id: string) => {
    const template = mockGames.find((game) => game.id === id);
    if (!template) return;
    setTitle(template.title);
    setCategory(template.genre);
    setDescription(template.description);
    setTags([...template.tags]);
    const amount = template.price.replace(/[^0-9]/g, "");
    setPrice(amount || "0");
    toast.success(`${template.title} 정보를 불러왔습니다.`);
  };

  const addTag = () => {
    const value = tagInput.trim();
    if (!value || tags.includes(value)) return;
    setTags((prev) => [...prev, value]);
    setTagInput("");
  };

  const removeTag = (tag: string) =>
    setTags((prev) => prev.filter((item) => item !== tag));

  const togglePlatform = (platform: string) => {
    setPlatformSelection((prev) =>
      prev.includes(platform)
        ? prev.filter((item) => item !== platform)
        : [...prev, platform]
    );
  };

  const addFeature = (value?: string) => {
    const target = value ?? featureInput.trim();
    if (!target || features.includes(target)) return;
    setFeatures((prev) => [...prev, target]);
    if (!value) setFeatureInput("");
  };

  const removeFeature = (feature: string) =>
    setFeatures((prev) => prev.filter((item) => item !== feature));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("필수 항목을 입력해 주세요.");
      return;
    }
    toast.success("새 게임 등록 요청이 제출되었습니다. 검수 후 반영됩니다.");
    navigate("/publisher/games");
  };

  return (
    <PublisherLayout
      title="새 게임 등록"
      subtitle="기존 템플릿을 불러오거나 정보를 입력해 게임을 빠르게 등록하세요."
      heroBadge={
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-200">
          <Gamepad className="h-3.5 w-3.5" /> Upload Game
        </div>
      }
      actions={
        <div className="flex flex-wrap items-center gap-3 text-xs text-white/65">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
            접수대기{" "}
            <Badge className="rounded-full border border-blue-400/40 bg-blue-500/15 px-2 py-0 text-[11px] text-blue-100">
              {counts.waiting}
            </Badge>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
            처리중{" "}
            <Badge className="rounded-full border border-amber-400/40 bg-amber-500/15 px-2 py-0 text-[11px] text-amber-100">
              {counts.progress}
            </Badge>
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2">
            답변완료{" "}
            <Badge className="rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0 text-[11px] text-emerald-100">
              {counts.answered}
            </Badge>
          </span>
        </div>
      }
      className="max-w-6xl"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="template-search">템플릿 검색</Label>
              <div className="relative">
                <Input
                  id="template-search"
                  placeholder="게임 이름 또는 장르로 검색"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 px-10 text-sm text-white placeholder:text-white/40"
                />
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                {searchTerm && suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 space-y-1 rounded-2xl border border-white/12 bg-publisher-card-muted p-3 shadow-[0_18px_40px_rgba(5,12,30,0.45)]">
                    {suggestions.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => applyTemplate(game.id)}
                        className="w-full rounded-xl bg-white/5 px-3 py-2 text-left text-sm text-white/70 transition hover:bg-white/10"
                      >
                        {game.title} · {game.genre}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">게임 제목 *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  placeholder="게임 제목을 입력하세요"
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">가격 *</Label>
                <Input
                  id="price"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
                <p className="text-xs text-white/50">
                  무료 게임의 경우 0을 입력하세요.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">카테고리 *</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="flex h-11 w-full items-center justify-between rounded-2xl border border-white/15 bg-white/5 px-4 text-sm text-white/80 hover:bg-white/10"
                    >
                      {category}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 border border-white/12 bg-publisher-card text-white">
                    {categories.map((option) => (
                      <DropdownMenuItem
                        key={option}
                        className="cursor-pointer text-sm text-white/80 focus:bg-blue-500/20"
                        onClick={() => setCategory(option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">게임 소개 *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={5}
                placeholder="게임에 대한 상세한 설명을 입력하세요."
                className="rounded-2xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                required
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="tag-input">태그</Label>
              <Input
                id="tag-input"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="태그 입력 후 Enter"
                className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag}
                    className="cursor-pointer rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs text-blue-100"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">플랫폼 및 요구사항</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>지원 플랫폼 *</Label>
              <div className="flex flex-wrap gap-4">
                {platforms.map((platform) => (
                  <label
                    key={platform}
                    className="flex items-center gap-2 text-sm text-white/70"
                  >
                    <Checkbox
                      checked={platformSelection.includes(platform)}
                      onCheckedChange={() => togglePlatform(platform)}
                      className="border-white/30 data-[state=checked]:border-blue-400 data-[state=checked]:bg-blue-500"
                    />
                    {platform}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="min-spec">최소 사양</Label>
                <Textarea
                  id="min-spec"
                  value={minSpec}
                  onChange={(event) => setMinSpec(event.target.value)}
                  rows={3}
                  placeholder="최소 시스템 요구사항을 입력하세요"
                  className="rounded-2xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rec-spec">권장 사양</Label>
                <Textarea
                  id="rec-spec"
                  value={recSpec}
                  onChange={(event) => setRecSpec(event.target.value)}
                  rows={3}
                  placeholder="권장 시스템 요구사항을 입력하세요"
                  className="rounded-2xl border-white/15 bg-white/5 text-sm text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">가격 및 프로모션</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="discount">할인율 (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min={0}
                  max={100}
                  value={discountRate}
                  onChange={(event) => setDiscountRate(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-start">할인 시작</Label>
                <Input
                  id="discount-start"
                  type="date"
                  value={discountStart}
                  onChange={(event) => setDiscountStart(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount-end">할인 종료</Label>
                <Input
                  id="discount-end"
                  type="date"
                  value={discountEnd}
                  onChange={(event) => setDiscountEnd(event.target.value)}
                  className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-white/12 bg-publisher-card text-white shadow-[0_26px_70px_rgba(5,12,30,0.55)]">
          <CardHeader className="border-b border-white/10">
            <CardTitle className="text-lg">핵심 기능</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="feature-input">주요 기능</Label>
              <Input
                id="feature-input"
                value={featureInput}
                onChange={(event) => setFeatureInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addFeature();
                  }
                }}
                placeholder="예) 실시간 PvP, 크로스 플랫폼 지원"
                className="h-11 rounded-2xl border-white/15 bg-white/5 text-white placeholder:text-white/40"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {featurePresets.map((preset) => (
                <Button
                  key={preset}
                  type="button"
                  variant="ghost"
                  className="h-9 rounded-full border border-white/12 bg-white/5 px-3 text-xs text-white/70 hover:bg-white/10"
                  onClick={() => addFeature(preset)}
                >
                  <Wand2 className="mr-1 h-3.5 w-3.5" />
                  {preset}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature) => (
                <Badge
                  key={feature}
                  className="cursor-pointer rounded-full border border-blue-400/40 bg-blue-500/15 px-3 py-1 text-xs text-blue-100"
                  onClick={() => removeFeature(feature)}
                >
                  {feature} ×
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="h-11 rounded-2xl bg-blue-500 px-6 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(59,130,246,0.45)] hover:bg-blue-500/90"
          >
            제출하기
          </Button>
        </div>
      </form>
    </PublisherLayout>
  );
}
