import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

type Item = { id: string; title: string; platform: string; price: number };

const items: Item[] = [
  { id: "g1", title: "Cyberpunk 2077", platform: "PC", price: 59900 },
  { id: "g2", title: "The Witcher 3: Wild Hunt", platform: "PlayStation 5", price: 39900 },
  { id: "g3", title: "Red Dead Redemption 2", platform: "Xbox Series X", price: 49900 },
];

const KRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

export function PaymentPage() {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [method, setMethod] = useState<string>("card");

  const summary = useMemo(() => {
    const subtotal = items.reduce((s, i) => s + i.price, 0);
    const discount = Math.floor(subtotal * 0.1); // 데모 할인 10%
    const total = subtotal - discount;
    return { subtotal, discount, total };
  }, []);

  const pay = () => {
    if (!agree) return;
    navigate(`/payment02-${method}`);
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

        {/* 결제 요약 + 수단 */}
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
                <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} />
                주문 내용을 확인했으며, 결제에 동의합니다.
              </label>
            </div>

            <div className="mt-5">
              <div className="font-medium mb-2">결제 수단</div>
              <RadioGroup value={method} onValueChange={setMethod}>
                <label className="flex items-center justify-between rounded-md border border-primary/20 px-3 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="card" id="m-card" />
                    <span>신용/체크카드</span>
                  </div>
                </label>
                <label className="flex items-center justify-between rounded-md border border-primary/20 px-3 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="kakao" id="m-kakao" />
                    <span>카카오페이</span>
                  </div>
                </label>
                <label className="flex items-center justify-between rounded-md border border-primary/20 px-3 py-2 mb-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="naver" id="m-naver" />
                    <span>네이버페이</span>
                  </div>
                </label>
                <label className="flex items-center justify-between rounded-md border border-primary/20 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="toss" id="m-toss" />
                    <span>토스페이</span>
                  </div>
                </label>
              </RadioGroup>
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
