import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Badge } from "../y_ui/base/badge";
import { Textarea } from "../y_ui/base/textarea";
import { Separator } from "../y_ui/base/separator";
import { Star, ShoppingCart, CreditCard, Users, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../y_ui/data-display/carousel";
import { toast } from "sonner";
import { addGameToCart } from "../../api/order/orderApi";
import { useCartStore } from "../../stores/cartStore";
import { getGameDetail } from "../../api/game/gameApi";
import type { GameDetail as GameDetailType } from "../../api/game/types";

const KRW = (v: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    v
  );

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export function GameDetailView() {
  const { id: slugParam } = useParams();
  const gameSlug = slugParam || "cyber-knights-2077";
  const navigate = useNavigate();

  const [game, setGame] = useState<GameDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState<boolean>(false);

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, isMock } = await getGameDetail(gameSlug);
        if (!canceled) {
          if (data) {
            setGame(data);
          } else {
            setGame(null);
            setError("게임 정보를 찾을 수 없습니다.");
          }
          setUsingMock(isMock);
        }
      } catch (err) {
        if (!canceled) {
          setGame(null);
          setError(
            err instanceof Error
              ? err.message
              : "게임 정보를 불러오는 중 오류가 발생했습니다."
          );
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    load();
    return () => {
      canceled = true;
    };
  }, [gameSlug]);

  const DEFAULT_HERO =
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=60";
  const DEFAULT_MEDIA =
    "https://images.unsplash.com/photo-1614292253061-2ab1e3ada214?auto=format&fit=crop&w=1200&q=60";
  const mediaItems = game?.media?.length
    ? game.media
    : [{ type: "image" as const, url: DEFAULT_MEDIA }];

  const [following, setFollowing] = useState<boolean>(false);
  useEffect(() => {
    if (!game) return;
    const saved = JSON.parse(
      localStorage.getItem("followingGames") || "[]"
    ) as number[];
    setFollowing(saved.includes(game.id));
  }, [game?.id]);

  const toggleFollow = () => {
    if (!game) return;
    const saved = new Set<number>(
      JSON.parse(localStorage.getItem("followingGames") || "[]")
    );
    if (saved.has(game.id)) saved.delete(game.id);
    else saved.add(game.id);
    localStorage.setItem("followingGames", JSON.stringify(Array.from(saved)));
    setFollowing(saved.has(game.id));
  };

  const { fetchCart, gameIds } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const isAlreadyInCart = game ? gameIds.includes(game.id) : false;

  const handleAddToCart = async () => {
    if (!game || isAlreadyInCart) return;
    setIsAddingToCart(true);
    try {
      await addGameToCart(game.id);
      toast.success("장바구니에 추가되었습니다.");
      fetchCart();
    } catch (err) {
      toast.error("장바구니 추가에 실패했습니다.");
      console.error(err);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    if (!game) return;
    const key = `reviews:${game.id}`;
    const loaded = JSON.parse(localStorage.getItem(key) || "[]");
    setReviews(loaded);
  }, [game?.id]);

  const saveReviews = (list: Review[]) => {
    if (!game) return;
    const key = `reviews:${game.id}`;
    setReviews(list);
    localStorage.setItem(key, JSON.stringify(list));
  };

  const addReview = () => {
    if (!game || !newText.trim()) return;
    const review: Review = {
      id: String(Date.now()),
      author: "게스트",
      rating: newRating,
      text: newText.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    saveReviews([review, ...reviews]);
    setNewText("");
    setNewRating(5);
  };

  const startEdit = (review: Review) => {
    setEditingId(review.id);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  const applyEdit = () => {
    if (!editingId) return;
    const updated = reviews.map((r) =>
      r.id === editingId ? { ...r, text: editText, rating: editRating } : r
    );
    saveReviews(updated);
    setEditingId(null);
  };

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "-";

  const boardSlug = useMemo(() => {
    const title = (game?.title || "").toLowerCase();
    if (title.includes("neon") || title.includes("racing"))
      return "neon-racing";
    if (title.includes("cyber")) return "cyberpunk-2087";
    return "guide-hub";
  }, [game?.title]);

  const originalPrice = game
    ? Math.max(0, Math.round((game.price / 0.7) / 100) * 100)
    : 0;
  const discountPercent = game && originalPrice
    ? Math.round(100 - (game.price / originalPrice) * 100)
    : 0;

  const StarRatingSelector = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (next: number) => void;
  }) => {
    const handleKey = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        onChange(Math.min(5, value + 1));
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        onChange(Math.max(1, value - 1));
      }
    };

    return (
      <div
        className="flex items-center gap-1"
        role="radiogroup"
        aria-label="별점 선택"
      >
        {[1, 2, 3, 4, 5].map((score) => {
          const active = score <= value;
          return (
            <button
              key={score}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(score)}
              onKeyDown={handleKey}
              className={`rounded-full p-1 transition ${
                active
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              <Star className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <Card className="border-primary/20">
          <CardContent className="py-10 text-center">로딩 중...</CardContent>
        </Card>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="container mx-auto px-6 py-10">
        <Card className="border-primary/20">
          <CardContent className="py-10 text-center">
            {error || "게임 정보를 불러오지 못했습니다."}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-primary/20">
        <div
          className="h-56 w-full bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient( to right, rgba(2,6,23,0.6), rgba(2,6,23,0.1) ), url(${game.image || DEFAULT_HERO})`,
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="flex w-full items-end justify-between gap-4 p-6 md:p-8">
            <div>
              <h1 className="text-3xl font-bold md:text-4xl">{game.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span>발매일 {game.released}</span>
                <span>
                  장르: {game.genres.join(", ") || "알 수 없음"}
                </span>
                <span>
                  개발: {game.developer} / 배급: {game.publisher}
                </span>
                {usingMock && (
                  <Badge variant="outline" className="border-primary/30 text-xs">
                    모의 데이터
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={following ? "default" : "outline"}
                onClick={toggleFollow}
                className="rounded-full"
              >
                <Users className="mr-2 h-4 w-4" />
                {following ? "팔로잉 중" : "팔로우"}
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate(`/community/board/${boardSlug}`)}
              >
                커뮤니티 이동
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <section className="space-y-6">
          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle>게임 소개</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Carousel className="w-full">
                <CarouselContent>
                  {mediaItems.map((item, index) => (
                    <CarouselItem key={`${item.url}-${index}`} className="relative">
                      <img
                        src={item.url}
                        alt={`${game.title} 미디어 ${index + 1}`}
                        className="h-64 w-full rounded-xl object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    주요 특징
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {game.features.map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    테마
                  </h3>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {game.themes.map((theme) => (
                      <Badge key={theme} variant="secondary">
                        {theme}
                      </Badge>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    최소 사양
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {game.requirements.minimum.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    권장 사양
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    {game.requirements.recommended.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle>뉴스 & 업데이트</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {game.news.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-primary/10 bg-primary/5 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.date}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    자세히 보기
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6">
          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">구매 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>정상가</span>
                <span className="line-through">
                  {originalPrice ? KRW(originalPrice) : "-"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>할인율</span>
                <Badge variant="secondary">-{discountPercent}%</Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-2xl font-semibold text-primary">
                <span>현재가</span>
                <span>{KRW(game.price)}</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={isAlreadyInCart || isAddingToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isAlreadyInCart ? "장바구니에 있음" : "장바구니"}
                </Button>
                <Button variant="outline" className="flex-1">
                  <CreditCard className="mr-2 h-4 w-4" /> 지금 구매
                </Button>
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => toast.info("위시리스트 기능은 준비 중입니다.")}
              >
                <Heart className="mr-2 h-4 w-4" /> 위시리스트에 추가
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                커뮤니티 활동
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>평균 사용자 평점</span>
                <span className="font-semibold text-primary">{averageRating}</span>
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/community/board/${boardSlug}`)}
              >
                <Users className="mr-2 h-4 w-4" /> 커뮤니티 게시판 이동
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>리뷰 작성</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <StarRatingSelector value={newRating} onChange={setNewRating} />
              <span className="text-sm text-muted-foreground">
                {newRating} / 5
              </span>
            </div>
            <Textarea
              placeholder="게임 플레이 경험을 공유해주세요."
              value={newText}
              onChange={(event) => setNewText(event.target.value)}
              rows={4}
            />
            <div className="flex justify-end">
              <Button onClick={addReview}>리뷰 등록</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>최근 패치 노트</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• 1.2 업데이트 - 전투 시스템 개선 및 버그 수정</p>
            <p>• 신규 사이드 퀘스트 3종 추가</p>
            <p>• 레이드 매칭 시스템 안정화</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4">
        <Card className="border border-primary/20">
          <CardHeader>
            <CardTitle>커뮤니티 리뷰</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-sm text-muted-foreground">
                아직 작성된 리뷰가 없습니다. 첫 리뷰를 남겨보세요!
              </p>
            )}
            {reviews.map((review) => (
              <div
                key={review.id}
                className="rounded-lg border border-primary/10 bg-primary/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <p className="text-xs text-muted-foreground">
                      {review.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  {review.text}
                </p>
                <div className="mt-3 flex justify-end gap-2 text-xs">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => startEdit(review)}
                  >
                    수정
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      saveReviews(reviews.filter((r) => r.id !== review.id))
                    }
                  >
                    삭제
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {editingId && (
          <Card className="border border-primary/20">
            <CardHeader>
              <CardTitle>리뷰 수정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <StarRatingSelector value={editRating} onChange={setEditRating} />
              <Textarea
                value={editText}
                onChange={(event) => setEditText(event.target.value)}
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setEditingId(null)}>
                  취소
                </Button>
                <Button onClick={applyEdit}>저장</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
