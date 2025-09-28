import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Star, ShoppingCart, CreditCard, Users, Heart } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { toast } from "sonner";
import { addGameToCart } from "../api/order/orderApi";
import { useCartStore } from "../stores/cartStore";

type GameDetail = {
  id: number;
  title: string;
  price: number;
  developer: string;
  publisher: string;
  released: string;
  genres: string[];
  features: string[];
  themes: string[];
  image?: string;
  requirements: { minimum: string[]; recommended: string[] };
  media: { type: "image"; url: string }[];
  news: { id: string; title: string; date: string }[];
};

const KRW = (v: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    v
  );

const MOCK: Record<string, GameDetail> = {
  "cyber-knights-2077": {
    id: 1,
    title: "Cyber Knights 2077",
    price: 45500,
    developer: "NetGame Studios",
    publisher: "NGS Publishing",
    released: "2024.03.15",
    genres: ["RPG"],
    features: ["오픈월드", "스토리 중심"],
    themes: ["사이버펑크"],
    image:
      "https://images.unsplash.com/photo-1689443111384-1cf214df988a?auto=format&fit=crop&w=1000&q=60",
    requirements: {
      minimum: [
        "OS: Windows 10",
        "CPU: Intel i5-8400",
        "RAM: 8GB",
        "GPU: GTX 1060",
        "Storage: 50GB",
      ],
      recommended: [
        "OS: Windows 11",
        "CPU: Intel i7-10700",
        "RAM: 16GB",
        "GPU: RTX 3060",
        "Storage: SSD 50GB",
      ],
    },
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=60",
      },
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1614292253061-2ab1e3ada214?auto=format&fit=crop&w=1200&q=60",
      },
    ],
    news: [
      { id: "n1", title: "패치 1.2 업데이트 노트", date: "2025-01-10" },
      { id: "n2", title: "스크린샷 콘테스트 결과 발표", date: "2024-12-02" },
    ],
  },
};

type Review = {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
};

export function GameDetailView() {
  const { id: gameSlug = "cyber-knights-2077" } = useParams();
  const navigate = useNavigate();
  const game = useMemo(
    () => MOCK[gameSlug!] ?? Object.values(MOCK)[0],
    [gameSlug]
  );
  const DEFAULT_HERO =
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=60";
  const DEFAULT_MEDIA =
    "https://images.unsplash.com/photo-1614292253061-2ab1e3ada214?auto=format&fit=crop&w=1200&q=60";
  const mediaItems = game.media?.length
    ? game.media
    : [{ type: "image", url: DEFAULT_MEDIA }];

  // Following state
  const [following, setFollowing] = useState<boolean>(false);
  useEffect(() => {
    const f = JSON.parse(
      localStorage.getItem("followingGames") || "[]"
    ) as number[];
    setFollowing(f.includes(game.id));
  }, [game.id]);

  const toggleFollow = () => {
    const f = new Set<number>(
      JSON.parse(localStorage.getItem("followingGames") || "[]")
    );
    if (f.has(game.id)) f.delete(game.id);
    else f.add(game.id);
    localStorage.setItem("followingGames", JSON.stringify(Array.from(f)));
    setFollowing(f.has(game.id));
  };

  const { fetchCart, gameIds } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const isAlreadyInCart = gameIds.includes(game.id);

  const handleAddToCart = async () => {
    if (isAlreadyInCart) return;
    setIsAddingToCart(true);
    try {
      await addGameToCart(game.id);
      toast.success("장바구니에 추가되었습니다.");
      fetchCart();
    } catch (error) {
      toast.error("장바구니 추가에 실패했습니다.");
      console.error(error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Reviews
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newText, setNewText] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    const key = `reviews:${game.id}`;
    const loaded = JSON.parse(localStorage.getItem(key) || "[]");
    setReviews(loaded);
  }, [game.id]);

  const saveReviews = (list: Review[]) => {
    setReviews(list);
    localStorage.setItem(`reviews:${game.id}`, JSON.stringify(list));
  };

  const addReview = () => {
    if (!newText.trim()) return;
    const r: Review = {
      id: String(Date.now()),
      author: "게스트",
      rating: newRating,
      text: newText.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    saveReviews([r, ...reviews]);
    setNewText("");
    setNewRating(5);
  };

  const startEdit = (r: Review) => {
    setEditingId(r.id);
    setEditText(r.text);
    setEditRating(r.rating);
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
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "-";
  // Compute community board slug for this game
  const boardSlug = useMemo(() => {
    const title = (game.title || "").toLowerCase();
    if (title.includes("neon") || title.includes("racing"))
      return "neon-racing";
    if (title.includes("cyber")) return "cyberpunk-2087";
    return "guide-hub"; // fallback topic board
  }, [game.title]);

  const originalPrice = Math.round(game.price / 0.7 / 100) * 100; // 예시: 30% 할인 기준
  const discountPercent = Math.round(100 - (game.price / originalPrice) * 100);

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
              onClick={() => onChange(score)}
              onKeyDown={handleKey}
              aria-pressed={active}
              className="p-1 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              <Star
                className={`h-5 w-5 ${
                  active
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
              <span className="sr-only">{`${score}점`}</span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20">
        <div
          className="h-56 sm:h-64 md:h-72 w-full bg-gradient-to-r from-indigo-600/40 via-purple-600/30 to-cyan-500/30"
          style={{
            backgroundImage: `linear-gradient( to right, rgba(37,99,235,0.35), rgba(168,85,247,0.25) ), url(${
              game.image || DEFAULT_HERO
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-12 -top-16 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -right-10 bottom-0 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
              {game.title}
            </h1>
            <div className="mt-3 text-sm text-muted-foreground flex flex-wrap items-center gap-3">
              <span>개발사: {game.developer}</span>
              <span>퍼블리셔: {game.publisher}</span>
              <span>출시일: {game.released}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {game.genres.map((t) => (
                <Badge
                  key={t}
                  variant="secondary"
                  className="bg-primary/15 text-primary border border-primary/30"
                >
                  {t}
                </Badge>
              ))}
              {game.features.map((t) => (
                <Badge
                  key={t}
                  variant="outline"
                  className="text-muted-foreground"
                >
                  {t}
                </Badge>
              ))}
              {/* Board link */}
              <Link
                to={`/community/board/${(game.title || "")
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="ml-2 text-primary underline-offset-2 hover:underline"
              >
                게시판 보기
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 grid-7-3">
        {/* Left: Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="relative">
            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {mediaItems.map((m, i) => (
                  <CarouselItem key={i}>
                    <img
                      src={m.url || DEFAULT_MEDIA}
                      alt={`${game.title} 미디어 ${i + 1}`}
                      className="h-96 sm:h-[28rem] md:h-[32rem] w-full rounded-2xl border border-primary/20 object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          DEFAULT_MEDIA;
                      }}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              {mediaItems.length > 1 && (
                <>
                  <CarouselPrevious className="hidden sm:flex bg-background/70 text-primary border-primary/30 shadow-lg absolute left-4 top-1/2 -translate-y-1/2" />
                  <CarouselNext className="hidden sm:flex bg-background/70 text-primary border-primary/30 shadow-lg absolute right-4 top-1/2 -translate-y-1/2" />
                </>
              )}
            </Carousel>
          </div>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">개요</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div className="text-sm text-muted-foreground">
                미래 도시를 배경으로 한 오픈월드 액션 RPG. 네온 메트로폴리스를
                누비며 당신만의 전설을 만드세요.
              </div>
              <ul className="list-disc pl-6 text-sm space-y-1">
                <li>방대한 오픈월드 탐험</li>
                <li>선택에 따른 분기 스토리</li>
                <li>다양한 사이버웨어 빌드</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">시스템 요구사항</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 grid sm:grid-cols-2 gap-6">
              <div>
                <div className="font-medium mb-2">최소 사양</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {game.requirements.minimum.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">권장 사양</div>
                <ul className="list-disc pl-5 text-sm space-y-1">
                  {game.requirements.recommended.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">뉴스/업데이트</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              {game.news.length ? (
                game.news.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="font-medium text-sm md:text-base">
                      {n.title}
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {n.date}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">
                  등록된 소식이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">리뷰</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">평균 평점</div>
                <div className="inline-flex items-center gap-1 text-yellow-400">
                  <Star className="h-4 w-4" />
                  {averageRating}
                </div>
              </div>
              <Separator />
              <Textarea
                placeholder="리뷰를 입력하세요"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
              />
              <div className="flex items-center justify-between gap-4">
                <StarRatingSelector value={newRating} onChange={setNewRating} />
                <Button onClick={addReview}>등록</Button>
              </div>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-md border border-primary/20 p-3 mb-2"
                  >
                    {editingId === r.id ? (
                      <div className="grid gap-3 sm:grid-cols-4">
                        <div className="sm:col-span-3">
                          <Textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                        </div>
                        <div className="sm:col-span-1 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                          <StarRatingSelector
                            value={editRating}
                            onChange={setEditRating}
                          />
                          <Button size="sm" onClick={applyEdit}>
                            수정 완료
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{r.author}</div>
                          <div className="inline-flex items-center gap-1 text-yellow-400">
                            <Star className="h-4 w-4" />
                            {r.rating.toFixed(1)}
                          </div>
                        </div>
                        <div className="text-sm mt-1 whitespace-pre-wrap">
                          {r.text}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2 flex items-center justify-between">
                          <span>{r.date}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(r)}
                          >
                            수정
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {reviews.length === 0 && (
                  <div className="text-sm text-muted-foreground">
                    첫 리뷰를 작성해보세요.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Buy panel */}
        <div className="space-y-4 lg:sticky lg:top-20 h-fit">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base">구매</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="text-sm line-through text-muted-foreground">
                  {KRW(originalPrice)}
                </div>
                <Badge className="bg-red-500/80">-{discountPercent}%</Badge>
              </div>
              <div className="text-3xl font-extrabold text-primary">{KRW(game.price)}</div>
              <Button className="w-full mb-2" onClick={() => navigate("/payment")}>지금 구매</Button>
              <Button className="w-full mb-2" style={{ backgroundColor: '#10b981' }} onClick={handleAddToCart} disabled={isAddingToCart || isAlreadyInCart}>
                {isAddingToCart ? '추가 중...' : isAlreadyInCart ? '장바구니에 있음' : '장바구니에 추가'}
              </Button>
              <Button
                variant="outline"
                className={`w-full mb-2 inline-flex items-center gap-2 btn-follow ${
                  following ? "btn-follow-active" : ""
                }`}
                onClick={toggleFollow}
              >
                <Heart
                  className={`h-4 w-4 transition-transform heart-icon ${
                    following ? "scale-110" : ""
                  }`}
                />
                {following ? "팔로잉 중" : "팔로잉"}
              </Button>
              <Button
                variant="default"
                className="w-full mb-2 inline-flex items-center gap-2 btn-community"
                asChild
              >
                <Link to={`/community/board/${boardSlug}`}>
                  <Users className="h-4 w-4" />
                  커뮤니티로 이동
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 mt-4">
            <CardHeader>
              <CardTitle className="text-base">태그</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[...game.genres, ...game.features, ...game.themes].map((t) => (
                <Badge key={t} variant="outline">
                  #{t}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Content tabs */}
    </div>
  );
}

export default GameDetailView;
