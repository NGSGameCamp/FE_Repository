import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Trash2, Loader2 } from "lucide-react";
import { getCart, removeGameFromCart, type Order } from "../api/orderApi";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { useCartStore } from "../stores/cartStore";
import { useAuth } from "./auth/AuthContext";
import { getLocalCart, removeGameFromLocalCart } from "../stores/localCartStore";

const formatKRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

export function CartPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchCart: updateGlobalCartCount } = useCartStore();

  const loadCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (isAuthenticated) {
        const cartData = await getCart();
        setCart(cartData);
      } else {
        const localCart = getLocalCart();
        setCart(localCart);
      }
    } catch (err: any) {
        if (err.message.includes("401")) {
            setError("로그인이 필요합니다.");
        } else {
            setError(err.message || "장바구니를 불러오는 중 오류가 발생했습니다.");
        }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const handleRemoveItem = async (gameId: number) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await removeGameFromCart(gameId);
        setCart(updatedCart);
        updateGlobalCartCount(); // 장바구니 전역 상태 업데이트
      } catch (err: any) {
        setError(err.message || "아이템 삭제 중 오류가 발생했습니다.");
      }
    } else {
      const updatedCart = removeGameFromLocalCart(gameId);
      setCart(updatedCart);
    }
  };

  const handleProceedToPayment = () => {
    if (!isAuthenticated) {
      alert("결제를 진행하려면 로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (cart && cart.orderItems.length > 0) {
      navigate("/payment");
    }
  };

  const orderItems = cart?.orderItems || [];
  const itemCount = orderItems.length;
  const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
  // NOTE: 할인 로직은 백엔드와 협의 후 적용해야 합니다. 임시로 0으로 설정합니다.
  const discount = 0;
  const total = subtotal - discount;

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-6 flex justify-center items-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-6">
        <Alert variant="destructive">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-3xl font-semibold mb-6 px-4 text-white">장바구니</h2>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 grid-7-3">
        {/* List */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">담긴 게임 ({itemCount})</CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-primary/10 p-0">
            {orderItems.map((it) => (
              <div key={it.id} className="flex items-center gap-4 p-4">
                {/* TODO: Game entity에 이미지 URL이 필요합니다. */}
                <img src={`https://via.placeholder.com/96x56.png?text=${it.game.name}`} alt={it.game.name} className="h-14 w-24 rounded-md object-cover border border-primary/20" />
                <div className="flex-1">
                  <div className="font-medium">{it.game.name}</div>
                  {/* TODO: Game entity에 플랫폼 정보가 필요합니다. */}
                  <div className="text-xs text-muted-foreground">PC</div>
                </div>
                <div className="text-sm font-medium mr-4">{formatKRW(it.price)}</div>
                <Button variant="ghost" size="icon" aria-label="remove" onClick={() => handleRemoveItem(it.game.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {itemCount === 0 && (
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
              <span>{formatKRW(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">할인</span>
              <span>- {formatKRW(discount)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>총 합계</span>
              <span className="text-primary">{formatKRW(total)}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">{itemCount}개의 아이템</div>

            <Button className="w-full mt-4" disabled={itemCount === 0} onClick={handleProceedToPayment}>
              결제 진행
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CartPage;