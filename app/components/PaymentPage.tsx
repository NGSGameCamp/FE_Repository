import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PortOne from "@portone/browser-sdk/v2";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";

type Item = { id: string; title: string; platform: string; price: number };

const items: Item[] = [
  { id: "g1", title: "Cyberpunk 2077", platform: "PC", price: 1000 },
  { id: "g2", title: "The Witcher 3: Wild Hunt", platform: "PlayStation 5", price: 500 },
  { id: "g3", title: "Red Dead Redemption 2", platform: "Xbox Series X", price: 101 },
];

const KRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

export function PaymentPage() {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<{ status: string; message?: string } | null>(null);

  const summary = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const discount = Math.floor(subtotal * 0.1); // 데모 할인 10%
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, []);

  const pay = async () => {
    if (!agree) return;

    try {
      const response = await PortOne.requestPayment({
        storeId: "store-f183ffe0-0978-48b3-a993-b07f08f11a22",
        channelKey: "channel-key-22367d5d-4d24-472c-84f4-7bdab9c50dbd",
        paymentId: `PAY-${crypto.randomUUID()}`,
        orderName: items.length > 1 ? `${items[0].title} 외 ${items.length - 1}건` : items[0].title,
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
        // 결제 실패 또는 취소
        console.log("결제 실패 또는 취소:", response);
        alert(response?.message || "결제를 취소하셨습니다.");
        return;
      }

      // 백엔드에 결제 검증 요청
      const completeResponse = await fetch("http://localhost:8080/api/payment/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: response.paymentId }),
      });

      if (completeResponse.ok) {
        const paymentComplete = await completeResponse.json();
        setPaymentStatus({ status: paymentComplete.status });

        if (paymentComplete.status === 'PAID') {
          console.log("백엔드 검증 성공:", paymentComplete);
          navigate("/orders"); // 최종 성공 시 주문 내역 페이지로 이동
        } else {
          // 백엔드에서 결제 실패 처리
          setPaymentStatus({ status: 'FAILED', message: paymentComplete.message });
          alert(`결제 검증에 실패했습니다: ${paymentComplete.message}`);
        }
      } else {
        // 백엔드 API 호출 실패
        const errorText = await completeResponse.text();
        setPaymentStatus({ status: 'FAILED', message: errorText });
        alert(`결제 검증 중 오류가 발생했습니다: ${errorText}`);
      }

    } catch (error) {
      console.error("결제 처리 중 에러 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

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