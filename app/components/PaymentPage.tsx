import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PortOne from "@portone/browser-sdk/v2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";

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

const KRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

export function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [agree, setAgree] = useState(false);
  
  // 장바구니에서 넘겨받은 데이터
  const orderData: Order | undefined = location.state?.orderData;

  // If no order data, redirect to cart
  useEffect(() => {
    if (!orderData) {
      alert("주문 정보가 없습니다. 장바구니로 돌아갑니다.");
      navigate("/cart");
    }
  }, [orderData, navigate]);

  const items = useMemo(() => {
    return orderData?.orderDetails.map(detail => ({
      id: detail.game.id.toString(),
      title: detail.game.name,
      platform: "Mac",
      price: detail.priceSnapshot,
    })) || [];
  }, [orderData]);

  const summary = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const discount = 0; // 우선 할인 로직은 배제
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, [items]);

  const pay = async () => {
    if (!agree || !orderData) return;

    try {
      const orderName = items.length > 1 ? `${items[0].title} 외 ${items.length - 1}건` : items[0].title;

      const response = await PortOne.requestPayment({
        storeId: "store-f183ffe0-0978-48b3-a993-b07f08f11a22",
        channelKey: "channel-key-22367d5d-4d24-472c-84f4-7bdab9c50dbd",
        paymentId: orderData.merchantUid,
        orderName: orderName,
        totalAmount: summary.total,
        currency: "KRW",
        payMethod: "CARD",
        customer: {
          customerId: "1",
          fullName: "홍길동",
          email: "test@portone.io",
          phoneNumber: "010-1234-5678",
        },
      });

      if (!response || response.code != null) {
        alert(response?.message || "결제를 취소하셨습니다.");
        return;
      }

      // The paymentId from the response should match our merchantUid
      if (response.paymentId !== orderData.merchantUid) {
          alert("주문 정보가 일치하지 않습니다.");
          return;
      }

      const completeResponse = await fetch("/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            paymentId: response.paymentId, 
            orderId: orderData.orderId 
        }),
      });

      if (completeResponse.ok) {
        const paymentComplete = await completeResponse.json();
        if (paymentComplete.status === 'PAID' || paymentComplete.status === 'PAYMENT_COMPLETED') {
          alert("결제가 성공적으로 완료되었습니다.");
          navigate("/orders");
        } else {
          alert(`결제는 완료되었으나, 서버 검증에 실패했습니다: ${paymentComplete.message}`);
        }
      } else {
        const errorText = await completeResponse.text();
        alert(`결제 검증 중 오류가 발생했습니다: ${errorText}`);
      }

    } catch (error) {
      console.error("결제 처리 중 에러 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

  if (!orderData) {
    return <div className="container mx-auto px-6 py-6 text-center">Loading payment details...</div>;
  }

  return (
    <div className="container mx-auto px-6 py-6">
      <h2 className="text-xl font-semibold mb-6">주문/결제</h2>
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 grid-7-3">
        {/* 주문 상품 */}
        <Card className="lg:col-span-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">주문 상품</CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-primary/10">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-medium">{it.title}</div>
                  <div className="text-xs text-muted-foreground">{it.platform}</div>
                </div>
                <div className="text-sm font-medium">{KRW(it.price)}</div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 결제 요약 */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">최종 결제금액</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">상품금액</span>
              <span>{KRW(summary.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">할인금액</span>
              <span>- {KRW(summary.discount)}</span>
            </div>
            <Separator className="my-3" />
            <div className="flex items-center justify-between text-base font-semibold">
              <span>총 합계</span>
              <span className="text-primary">{KRW(summary.total)}</span>
            </div>

            <div className="rounded-md border border-primary/20 p-3 mt-4 text-sm">
              <label className="flex items-center gap-3">
                <Checkbox checked={agree} onCheckedChange={(v: boolean) => setAgree(v)} />
                주문 내용을 확인했으며, 결제에 동의합니다.
              </label>
            </div>

            <Button className="w-full mt-5" disabled={!agree} onClick={pay}>
              결제하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PaymentPage;