import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Trash2 } from "lucide-react";

interface Game {
  id: number;          
  name: string;        
  env: string;         
  price: number;
  tag: string;         
  isActive: boolean;   
  createdAt: string;   
  // image: string;    // 파일 시스템 구현 후 추가 예정
  }

interface OrderDetails {
  orderDetailsId: number;
  game: Game;
  priceSnapshot: number;
}

interface Order {
  orderId: number;
  userId: number;
  orderDetails: OrderDetails[];
  status: string;
  merchantUid: string;
  createdAt: string;
  updatedAt: string;
}

const formatKRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

export function CartPage() {
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/orders/cart");
      if (!response.ok) {
        throw new Error("Failed to fetch cart data.");
      }
      const data: Order = await response.json();
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const items = useMemo(() => {
    return order?.orderDetails.map(detail => ({
      id: detail.game.id,
      title: detail.game.name,
      platform: "PC",
      price: detail.priceSnapshot,
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=60",
    })) || [];
  }, [order]);

  const summary = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const discount = 0; // Discount logic can be applied here if needed
    const total = subtotal - discount;
    return { subtotal, discount, total, count: items.length };
  }, [items]);

  const removeItem = async (gameId: number) => {
    try {
      const response = await fetch(`/api/orders/cart/remove/${gameId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to remove item from cart.");
      }
      // Refetch cart to get the latest state
      await fetchCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "장바구니 아이템 삭제 실패");
    }
  };

  const handleProceedToPayment = () => {
    if (order && order.orderDetails.length > 0) {
      navigate("/payment", { state: { orderData: order } });
    }
  };
  
  if (isLoading) {
    return <div className="container mx-auto px-6 py-6 text-center">Loading cart...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-6 py-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-3xl font-semibold mb-6 px-4 text-white">장바구니</h2>
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

            <Button className="w-full mt-4" disabled={summary.count === 0} onClick={handleProceedToPayment}>
              결제 진행
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CartPage;