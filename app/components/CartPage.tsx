import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Trash2 } from "lucide-react";

type CartItem = {
  id: string;
  title: string;
  platform: string;
  price: number; // KRW
  image: string;
  extra?: boolean;
};

const initialItems: CartItem[] = [
  {
    id: "g1",
    title: "Cyberpunk 2077",
    platform: "PC",
    price: 59900,
    image:
      "https://images.unsplash.com/photo-1689443111384-1cf214df988a?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "g2",
    title: "The Witcher 3: Wild Hunt",
    platform: "PlayStation 5",
    price: 39900,
    image:
      "https://images.unsplash.com/photo-1614292253061-2ab1e3ada214?auto=format&fit=crop&w=200&q=60",
  },
  {
    id: "g3",
    title: "Red Dead Redemption 2",
    platform: "Xbox Series X",
    price: 49900,
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=60",
  },
];

const formatKRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

export function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>(() => {
    const extra = JSON.parse(localStorage.getItem("cartExtraItems") || "[]");
    return [...initialItems, ...extra];
  });

  const summary = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const discount = Math.floor(subtotal * 0.1); // 데모: 10% 할인 미리보기
    const total = Math.max(subtotal - discount, 0);
    return { subtotal, discount, total, count: items.length };
  }, [items]);

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  // persist extras when items change
  useEffect(() => {
    const extras = items.filter((i) => i.extra);
    localStorage.setItem("cartExtraItems", JSON.stringify(extras));
  }, [items]);

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-xl font-semibold mb-6">Cart</h2>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 grid-7-3">
        {/* List */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">담긴 게임 ({items.length})</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-primary/10 p-0">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-4 p-4">
                <img src={it.image} alt={it.title} className="h-14 w-24 rounded-md object-cover border border-primary/20" />
                <div className="flex-1">
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{it.platform}</div>
                </div>
                <div className="text-sm font-medium mr-4">{formatKRW(it.price)}</div>
                <Button variant="ghost" size="icon" aria-label="remove" onClick={() => removeItem(it.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {items.length === 0 && (
              <div className="p-8 text-center text-sm text-muted-foreground">장바구니가 비었습니다.</div>
            )}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">주문 요약</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">정상 가격</span>
              <span>{formatKRW(summary.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">할인</span>
              <span>- {formatKRW(summary.discount)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>총 합계</span>
              <span className="text-primary">{formatKRW(summary.total)}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{summary.count}개의 아이템</div>

            <Button className="w-full mt-4" disabled={summary.count === 0} onClick={() => navigate("/payment01")}>
              결제 진행
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CartPage;
