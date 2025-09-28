import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Badge } from "../y_ui/base/badge";
import { Separator } from "../y_ui/base/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../y_ui/form-controls/select";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "../y_ui/form-controls/toggle-group";
import { Star, Share2 } from "lucide-react";
import { searchGames, getSearchFilters } from "../../api/game/gameApi";
import type { GameSearchItem } from "../../api/game/types";

const KRW = (v: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    v
  );

const defaultGenres = [
  "RPG",
  "액션",
  "어드벤처",
  "전략",
  "시뮬레이션",
  "레이싱",
  "퍼즐",
  "인디",
];

const defaultFeatures = [
  "오픈월드",
  "멀티플레이어",
  "싱글플레이어",
  "협동",
  "PvP",
  "스토리 중심",
  "샌드박스",
];

const defaultThemes = [
  "판타지",
  "SF",
  "사이버펑크",
  "중세",
  "현대",
  "호러",
];

export function GameSearchView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("query") || "").trim();

  const [genres, setGenres] = useState<string[]>(
    searchParams.get("genres")?.split(",").filter(Boolean) || []
  );
  const [features, setFeatures] = useState<string[]>(
    searchParams.get("features")?.split(",").filter(Boolean) || []
  );
  const [themes, setThemes] = useState<string[]>(
    searchParams.get("themes")?.split(",").filter(Boolean) || []
  );
  const [period, setPeriod] = useState<string>(
    searchParams.get("period") || "모든 기간"
  );
  const [price, setPrice] = useState<string>(
    searchParams.get("price") || "모든 가격"
  );
  const [rating, setRating] = useState<string>(
    searchParams.get("rating") || "모든 평점"
  );
  const [sort, setSort] = useState<string>(
    searchParams.get("sort") || "출시일"
  );

  const [games, setGames] = useState<GameSearchItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    genres: defaultGenres,
    features: defaultFeatures,
    themes: defaultThemes,
  });

  useEffect(() => {
    let canceled = false;
    const loadFilters = async () => {
      const { data } = await getSearchFilters();
      if (!canceled) {
        setFilters({
          genres: data.genres.length ? data.genres : defaultGenres,
          features: data.features.length ? data.features : defaultFeatures,
          themes: data.themes.length ? data.themes : defaultThemes,
        });
      }
    };
    loadFilters();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;
    const loadGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, isMock } = await searchGames(query);
        if (!canceled) {
          setGames(data);
          setUsingMock(isMock);
        }
      } catch (err) {
        if (!canceled) {
          setGames([]);
          setUsingMock(true);
          setError(
            err instanceof Error
              ? err.message
              : "게임 검색 중 오류가 발생했습니다."
          );
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };
    loadGames();
    return () => {
      canceled = true;
    };
  }, [query]);

  const currentParamString = searchParams.toString();
  useEffect(() => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (genres.length) params.set("genres", genres.join(","));
    if (features.length) params.set("features", features.join(","));
    if (themes.length) params.set("themes", themes.join(","));
    if (period !== "모든 기간") params.set("period", period);
    if (price !== "모든 가격") params.set("price", price);
    if (rating !== "모든 평점") params.set("rating", rating);
    if (sort !== "출시일") params.set("sort", sort);

    const next = params.toString();
    if (next !== currentParamString) {
      setSearchParams(params, { replace: true });
    }
  }, [
    currentParamString,
    features,
    genres,
    period,
    price,
    query,
    rating,
    sort,
    themes,
    setSearchParams,
  ]);

  const filtered = useMemo(() => {
    const base = query
      ? games.filter((game) =>
          game.title.toLowerCase().includes(query.toLowerCase())
        )
      : games;

    const byTags = base.filter((g) => {
      const genreOk =
        genres.length === 0 || genres.some((t) => g.genres.includes(t));
      const featureOk =
        features.length === 0 || features.some((t) => g.features.includes(t));
      const themeOk =
        themes.length === 0 || themes.some((t) => g.themes.includes(t));
      return genreOk && featureOk && themeOk;
    });

    const byPeriod = byTags.filter((g) => {
      if (period === "모든 기간") return true;
      const releasedAt = new Date(g.released).getTime();
      const now = Date.now();
      switch (period) {
        case "최근 1개월":
          return now - releasedAt <= 30 * 24 * 60 * 60 * 1000;
        case "최근 3개월":
          return now - releasedAt <= 90 * 24 * 60 * 60 * 1000;
        case "최근 1년":
          return now - releasedAt <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });

    const byPrice = byPeriod.filter((g) => {
      switch (price) {
        case "무료":
          return g.price === 0;
        case "₩30,000 이하":
          return g.price <= 30000;
        case "₩60,000 이하":
          return g.price <= 60000;
        case "₩60,000 이상":
          return g.price >= 60000;
        default:
          return true;
      }
    });

    const byRating = byPrice.filter((g) => {
      if (rating === "모든 평점") return true;
      const threshold = Number(rating.replace("점 이상", ""));
      return g.rating >= threshold;
    });

    const sorted = [...byRating];
    switch (sort) {
      case "가격":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "평점":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      default:
        sorted.sort(
          (a, b) => new Date(b.released).getTime() - new Date(a.released).getTime()
        );
        break;
    }

    return sorted;
  }, [features, games, genres, period, price, query, rating, sort, themes]);

  return (
    <div className="container mx-auto px-6 py-6">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full space-y-6 lg:w-72">
          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">장르</CardTitle>
            </CardHeader>
            <CardContent>
              <ToggleGroup
                type="multiple"
                value={genres}
                onValueChange={setGenres}
                className="flex flex-wrap gap-2"
              >
                {filters.genres.map((genre) => (
                  <ToggleGroupItem key={genre} value={genre}>
                    {genre}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardContent>
          </Card>

          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">특징</CardTitle>
            </CardHeader>
            <CardContent>
              <ToggleGroup
                type="multiple"
                value={features}
                onValueChange={setFeatures}
                className="flex flex-wrap gap-2"
              >
                {filters.features.map((feature) => (
                  <ToggleGroupItem key={feature} value={feature}>
                    {feature}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardContent>
          </Card>

          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">테마</CardTitle>
            </CardHeader>
            <CardContent>
              <ToggleGroup
                type="multiple"
                value={themes}
                onValueChange={setThemes}
                className="flex flex-wrap gap-2"
              >
                {filters.themes.map((theme) => (
                  <ToggleGroupItem key={theme} value={theme}>
                    {theme}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </CardContent>
          </Card>
        </aside>

        <main className="flex-1 space-y-6">
          <Card className="border border-primary/20">
            <CardHeader className="space-y-4">
              <div>
                <CardTitle className="text-2xl font-semibold">
                  게임 검색 결과
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  원하시는 장르와 특징을 선택해 게임을 찾아보세요.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">기간</label>
                  <Select value={period} onValueChange={setPeriod}>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 기간" />
                    </SelectTrigger>
                    <SelectContent>
                      {["모든 기간", "최근 1개월", "최근 3개월", "최근 1년"].map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">가격</label>
                  <Select value={price} onValueChange={setPrice}>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 가격" />
                    </SelectTrigger>
                    <SelectContent>
                      {["모든 가격", "무료", "₩30,000 이하", "₩60,000 이하", "₩60,000 이상"].map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">평점</label>
                  <Select value={rating} onValueChange={setRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="모든 평점" />
                    </SelectTrigger>
                    <SelectContent>
                      {["모든 평점", "4.0점 이상", "4.5점 이상", "4.8점 이상"].map(
                        (option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">정렬</label>
                  <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger>
                      <SelectValue placeholder="출시일" />
                    </SelectTrigger>
                    <SelectContent>
                      {["출시일", "가격", "평점"].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                총 {filtered.length}개의 게임이 검색되었습니다.
                {usingMock && !error && (
                  <span className="ml-2 text-xs text-muted-foreground/80">
                    (Mock 데이터 기반)
                  </span>
                )}
              </p>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="정렬" />
                </SelectTrigger>
                <SelectContent>
                  {["출시일", "가격", "평점"].map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {loading && (
                <p className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-muted-foreground">
                  검색 중...
                </p>
              )}
              {error && !loading && (
                <p className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-destructive">
                  {error}
                </p>
              )}
              {filtered.map((game) => (
                <Card key={game.id} className="border border-primary/20">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-semibold">
                        {game.title}
                      </CardTitle>
                      <Badge>평점 {game.rating.toFixed(1)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      출시일: {new Date(game.released).toLocaleDateString()}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-semibold text-primary">
                        {game.price === 0 ? "무료" : KRW(game.price)}
                      </p>
                      <div className="space-x-2">
                        <Button size="sm" variant="outline">
                          장바구니 담기
                        </Button>
                        <Button size="sm">
                          구매하기
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>장르: {game.genres.join(", ")}</div>
                      <div>특징: {game.features.join(", ")}</div>
                      <div>테마: {game.themes.join(", ")}</div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-4 w-4" />
                      <span>{game.rating.toFixed(1)}</span>
                      <Share2 className="h-4 w-4 ml-auto" />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        asChild
                        variant="ghost"
                        className="flex-1 border border-primary/20"
                      >
                        <Link to={`/game/${game.id}`}>상세 보기</Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 border border-primary/30"
                      >
                        <Link to={`/community/board/${game.id}`}>커뮤니티</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
