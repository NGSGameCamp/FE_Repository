import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PortOne from "@portone/browser-sdk/v2";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Separator } from "../y_ui/base/separator";
import { Checkbox } from "../y_ui/form-controls/checkbox";

type CartItem = {
  id: string;
  title: string;
  platform: string;
  price: number;
  quantity: number;
};

type OrderDetails = {
  merchantUid: string;
  totalPrice: number;
  orderName: string;
  items: CartItem[];
  customer: {
    fullName: string;
    email: string;
    phoneNumber: string;
  };
};

const KRW = (v: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    v
  );

export function PaymentPage() {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // [프론트엔드 → 백엔드] 현재 장바구니(PENDING 상태의 Order) 정보를 가져오는 API 호출
        const response = await fetch(
          "http://localhost:8080/api/orders/pending"
        );
        if (!response.ok) {
          throw new Error("주문 정보를 가져오는데 실패했습니다.");
        }
        const data: OrderDetails = await response.json();
        setOrderDetails(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  const summary = useMemo(() => {
    if (!orderDetails) return { subtotal: 0, discount: 0, total: 0 };
    const subtotal = orderDetails.items.reduce(
      (s, i) => s + i.price * i.quantity,
      0
    );
    // 일단은 할인이 totalPrice에 반영되어 오므로, subtotal - totalPrice로 계산
    const discount = subtotal - orderDetails.totalPrice;
    return { subtotal, discount, total: orderDetails.totalPrice };
  }, [orderDetails]);

  const pay = async () => {
    if (!agree || !orderDetails) return;

    const { merchantUid, orderName, totalPrice, customer } = orderDetails;

    try {
      // [프론트엔드] 백엔드로부터 받은 merchantUid와 totalPrice를 사용해서 PortOne 결제창을 띄움
      const response = await PortOne.requestPayment({
        storeId: "store-f183ffe0-0978-48b3-a993-b07f08f11a22", // 스토어 아이디
        channelKey: "channel-key-22367d5d-4d24-472c-84f4-7bdab9c50dbd", // 채널 키
        paymentId: merchantUid,
        orderName: orderName,
        totalAmount: totalPrice,
        currency: "KRW",
        payMethod: "CARD",
        customer: customer,
      });

      if (response?.code != null) {
        // 결제 실패 또는 취소
        console.log("결제 실패 또는 취소:", response);
        alert(response.message || "결제를 취소하셨습니다.");
        return;
      }

      // 결제 성공 시, 해당 주문 상세보기 페이지로 리디렉션
      console.log("PortOne 결제 성공:", response);
      navigate("/orders"); // 최종 성공 시 주문 내역 페이지로 이동(일단은 하드코딩된 페이지로 이동)
    } catch (error) {
      console.error("결제 처리 중 에러 발생:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-6 py-6">로딩 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-6 py-6">오류: {error}</div>;
  }

  if (!orderDetails) {
    return (
      <div className="container mx-auto px-6 py-6">주문 정보가 없습니다.</div>
    );
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
            {orderDetails.items.map((it) => (
              <div
                key={it.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <div className="font-medium">
                    {it.title} ({it.quantity}개)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {it.platform}
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {KRW(it.price * it.quantity)}
                </div>
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
                <Checkbox
                  checked={agree}
                  onCheckedChange={(v: boolean) => setAgree(v)}
                />
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
