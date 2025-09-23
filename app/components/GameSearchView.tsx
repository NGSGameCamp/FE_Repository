import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Star, Share2 } from "lucide-react";

type Game = {
  id: string;
  title: string;
  price: number; // KRW
  rating: number;
  released: string; // ISO
  genres: string[];
  features: string[];
  themes: string[];
};

const KRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

const allGenres = [
  "RPG",
  "액션",
  "어드벤처",
  "전략",
  "시뮬레이션",
  "레이싱",
  "퍼즐",
  "인디",
] as const;

const allFeatures = [
  "오픈월드",
  "멀티플레이어",
  "싱글플레이어",
  "협동",
  "PvP",
  "스토리 중심",
  "샌드박스",
] as const;

const allThemes = [
  "판타지",
  "SF",
  "사이버펑크",
  "중세",
  "현대",
  "호러",
] as const;

const gamesData: Game[] = [
  { id: "s1", title: "Eternal Odyssey", price: 65000, rating: 4.8, released: "2025-02-10", genres: ["RPG"], features: ["오픈월드", "싱글플레이어"], themes: ["판타지"] },
  { id: "s2", title: "Dragon Age: Legends", price: 42000, rating: 4.6, released: "2024-10-21", genres: ["RPG"], features: ["오픈월드", "멀티플레이어"], themes: ["판타지"] },
  { id: "s3", title: "Kingdom Chronicles", price: 55000, rating: 4.7, released: "2024-09-18", genres: ["전략", "RPG"], features: ["싱글플레이어"], themes: ["중세"] },
  { id: "s4", title: "Mystic Realms", price: 48000, rating: 4.5, released: "2023-12-03", genres: ["RPG"], features: ["스토리 중심", "싱글플레이어"], themes: ["판타지"] },
  { id: "s5", title: "Neon Rush", price: 32000, rating: 4.2, released: "2024-07-09", genres: ["레이싱"], features: ["멀티플레이어", "PvP"], themes: ["사이버펑크", "현대"] },
  { id: "s6", title: "Puzzle Matrix+", price: 19000, rating: 4.1, released: "2023-06-15", genres: ["퍼즐"], features: ["싱글플레이어"], themes: ["현대"] },
  { id: "s7", title: "Star Colony", price: 59000, rating: 4.4, released: "2024-11-01", genres: ["시뮬레이션"], features: ["오픈월드", "스토리 중심"], themes: ["SF"] },
  { id: "s8", title: "Shadow Streets", price: 46000, rating: 4.3, released: "2024-03-12", genres: ["액션", "어드벤처"], features: ["싱글플레이어"], themes: ["현대"] },
];

export function GameSearchView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [genres, setGenres] = useState<string[]>(searchParams.get("genres")?.split(",").filter(Boolean) || []);
  const [features, setFeatures] = useState<string[]>(searchParams.get("features")?.split(",").filter(Boolean) || []);
  const [themes, setThemes] = useState<string[]>(searchParams.get("themes")?.split(",").filter(Boolean) || []);
  const [period, setPeriod] = useState<string>(searchParams.get("period") || "모든 기간");
  const [price, setPrice] = useState<string>(searchParams.get("price") || "모든 가격");
  const [rating, setRating] = useState<string>(searchParams.get("rating") || "모든 평점");
  const [sort, setSort] = useState<string>(searchParams.get("sort") || "출시일");

  useEffect(() => {
    const params: Record<string, string> = {};
    if (genres.length) params.genres = genres.join(",");
    if (features.length) params.features = features.join(",");
    if (themes.length) params.themes = themes.join(",");
    if (period !== "모든 기간") params.period = period;
    if (price !== "모든 가격") params.price = price;
    if (rating !== "모든 평점") params.rating = rating;
    if (sort !== "출시일") params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [genres, features, themes, period, price, rating, sort, setSearchParams]);

  const filtered = useMemo(() => {
    const byTags = gamesData.filter((g) => {
      const gOK = genres.length === 0 || genres.some((t) => g.genres.includes(t));
      const fOK = features.length === 0 || features.some((t) => g.features.includes(t));
      const tOK = themes.length === 0 || themes.some((t) => g.themes.includes(t));
      return gOK && fOK && tOK;
    });

    const byPeriod = byTags.filter((g) => {
      if (period === "모든 기간") return true;
      const d = new Date(g.released).getTime();
      const now = Date.now();
      if (period === "1년") return d >= now - 365 * 24 * 60 * 60 * 1000;
      if (period === "6개월") return d >= now - 182 * 24 * 60 * 60 * 1000;
      if (period === "3개월") return d >= now - 91 * 24 * 60 * 60 * 1000;
      return true;
    });

    const byPrice = byPeriod.filter((g) => {
      if (price === "모든 가격") return true;
      if (price === "2만원 이하") return g.price <= 20000;
      if (price === "2만~5만원") return g.price > 20000 && g.price <= 50000;
      if (price === "5만원 이상") return g.price >= 50000;
      return true;
    });

    const byRating = byPrice.filter((g) => {
      if (rating === "모든 평점") return true;
      if (rating === "4.5+") return g.rating >= 4.5;
      if (rating === "4.0+") return g.rating >= 4.0;
      if (rating === "3.5+") return g.rating >= 3.5;
      return true;
    });

    const sorted = [...byRating].sort((a, b) => {
      switch (sort) {
        case "평점순":
          return b.rating - a.rating;
        case "가격낮은순":
          return a.price - b.price;
        case "가격높은순":
          return b.price - a.price;
        case "신작순":
          return new Date(b.released).getTime() - new Date(a.released).getTime();
        default:
          return 0; // 인기순: 데모에서는 원순서 유지
      }
    });

    return sorted;
  }, [genres, features, themes, period, price, rating, sort]);

  const pricePreview = useMemo(() => {
    if (!filtered.length) return "-";
    const prices = filtered.map((g) => g.price);
    return `${KRW(Math.min(...prices))} ~ ${KRW(Math.max(...prices))}`;
  }, [filtered]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다.");
    } catch {
      alert("클립보드 복사에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      {/* Filters: tags */}
      <Card className="border-primary/20">
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium">장르</div>
            <ToggleGroup type="multiple" value={genres} onValueChange={setGenres} variant="outline" className="flex flex-wrap">
              {allGenres.map((t) => (
                <ToggleGroupItem key={t} value={t} className="px-3">{t}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">특징</div>
            <ToggleGroup type="multiple" value={features} onValueChange={setFeatures} variant="outline" className="flex flex-wrap">
              {allFeatures.map((t) => (
                <ToggleGroupItem key={t} value={t} className="px-3">{t}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">테마</div>
            <ToggleGroup type="multiple" value={themes} onValueChange={setThemes} variant="outline" className="flex flex-wrap">
              {allThemes.map((t) => (
                <ToggleGroupItem key={t} value={t} className="px-3">{t}</ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Controls */}
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <div className="text-xs text-muted-foreground mb-1">출시일</div>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger><SelectValue placeholder="모든 기간" /></SelectTrigger>
                <SelectContent>
                  {(["모든 기간", "1년", "6개월", "3개월"] as const).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">가격 범위</div>
              <Select value={price} onValueChange={setPrice}>
                <SelectTrigger><SelectValue placeholder="모든 가격" /></SelectTrigger>
                <SelectContent>
                  {(["모든 가격", "2만원 이하", "2만~5만원", "5만원 이상"] as const).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">평점</div>
              <Select value={rating} onValueChange={setRating}>
                <SelectTrigger><SelectValue placeholder="모든 평점" /></SelectTrigger>
                <SelectContent>
                  {(["모든 평점", "4.5+", "4.0+", "3.5+"] as const).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">가격 미리보기: {pricePreview}</div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-muted-foreground">정렬:</div>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-32"><SelectValue placeholder="출시일" /></SelectTrigger>
                <SelectContent>
                  {(["출시일", "인기순", "평점순", "가격낮은순", "가격높은순"] as const).map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={copyLink} className="border-primary/30">
                <Share2 className="h-4 w-4 mr-1" /> 링크 공유
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected tag preview */}
      {(genres.length || features.length || themes.length) ? (
        <div className="flex flex-wrap gap-2">
          {[...genres.map((t) => ({ t, k: `G-${t}` })), ...features.map((t) => ({ t, k: `F-${t}` })), ...themes.map((t) => ({ t, k: `T-${t}` }))].map(({ t, k }) => (
            <Badge key={k} variant="secondary" className="bg-primary/10 text-primary border border-primary/20">#{t}</Badge>
          ))}
        </div>
      ) : null}

      {/* Results */}
      <div className="text-sm">{filtered.length}개의 게임</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((g) => (
          <Card key={g.id} className="border-primary/20 overflow-hidden hover:border-primary/40">
            <div className="h-28 bg-gradient-to-br from-primary/10 to-cyan-500/10" />
            <CardContent className="pt-4 space-y-3">
              <Link to={`/game/${g.id}`} className="font-medium hover:underline">{g.title}</Link>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{g.genres[0]}</Badge>
                {g.features.slice(0, 1).map((t) => (
                  <Badge key={t} variant="outline" className="text-muted-foreground">{t}</Badge>
                ))}
                {g.themes.slice(0, 1).map((t) => (
                  <Badge key={t} variant="outline" className="text-muted-foreground">{t}</Badge>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-primary font-semibold">{KRW(g.price)}</div>
                <div className="text-xs inline-flex items-center gap-1 text-muted-foreground"><Star className="h-4 w-4 text-yellow-400" /> {g.rating.toFixed(1)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card className="border-primary/20 sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">조건에 맞는 결과가 없습니다.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default GameSearchView;
