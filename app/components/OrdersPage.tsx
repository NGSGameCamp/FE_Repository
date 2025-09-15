import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";

type OrderItem = {
  id: string;
  title: string;
  platform: string;
  price: number; // KRW
};

type Order = {
  id: string; // 주문번호
  date: string; // ISO
  status: "구매 완료" | "환불";
  items: OrderItem[];
};

const KRW = (v: number) => new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(v);

const orders: Order[] = [
  {
    id: "2024112001",
    date: "2024-11-20",
    status: "구매 완료",
    items: [
      { id: "i1", title: "Cyber Knights 2077", platform: "디지털 다운로드", price: 45500 },
      { id: "i2", title: "Forest Quest", platform: "디지털 다운로드", price: 32000 },
    ],
  },
  {
    id: "2024101501",
    date: "2024-10-15",
    status: "환불",
    items: [
      { id: "i3", title: "Mecha Arena", platform: "디지털 다운로드", price: 29900 },
    ],
  },
  {
    id: "2024090102",
    date: "2024-09-01",
    status: "구매 완료",
    items: [
      { id: "i4", title: "Puzzle Matrix", platform: "디지털 다운로드", price: 19000 },
      { id: "i5", title: "Neon Racing", platform: "디지털 다운로드", price: 25000 },
    ],
  },
];

function inPeriod(dateISO: string, period: string) {
  const d = new Date(dateISO).getTime();
  const now = Date.now();
  if (period === "전체 기간") return true;
  if (period === "30일") return d >= now - 30 * 24 * 60 * 60 * 1000;
  if (period === "3개월") return d >= now - 90 * 24 * 60 * 60 * 1000;
  return true;
}

export function OrdersPage() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<"전체 기간" | "30일" | "3개월">("전체 기간");
  const [status, setStatus] = useState<"전체" | "구매 완료" | "환불">("전체");
  const [orderQuery, setOrderQuery] = useState("");

  const filtered = useMemo(() => {
    let list = orders.filter((o) => inPeriod(o.date, period));
    if (status !== "전체") list = list.filter((o) => o.status === status);
    const q = orderQuery.trim();
    if (q) list = list.filter((o) => o.id.includes(q));
    return list;
  }, [period, status, orderQuery]);

  const totalCount = orders.length;

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">주문 내역</h2>
          <div className="text-sm text-muted-foreground">총 {totalCount}건</div>
        </div>
        <div className="flex items-center gap-2">
          <Input
            placeholder="주문번호 검색"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            className="w-44"
          />
        </div>
      </div>

      <Card className="border-primary/20">
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">기간:</span>
            {(["전체 기간", "30일", "3개월"] as const).map((p) => (
              <Button key={p} size="sm" variant={period === p ? "default" : "outline"} onClick={() => setPeriod(p)}>
                {p}
              </Button>
            ))}
            <Separator orientation="vertical" className="mx-2 hidden sm:block" />
            <span className="text-sm text-muted-foreground">상태:</span>
            {(["전체", "구매 완료", "환불"] as const).map((s) => (
              <Button key={s} size="sm" variant={status === s ? "default" : "outline"} onClick={() => setStatus(s)}>
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {filtered.map((o) => {
          const sum = o.items.reduce((acc, it) => acc + it.price, 0);
          return (
            <Card key={o.id} className="border-primary/20 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <button className="text-primary hover:underline" onClick={() => setOrderQuery(o.id)}>
                      주문번호: #{o.id}
                    </button>
                    <div className="text-xs text-muted-foreground mt-1">{new Date(o.date).toLocaleDateString("ko-KR")}</div>
                  </div>
                  <Badge variant={o.status === "구매 완료" ? "secondary" : "outline"} className={o.status === "구매 완료" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}>
                    {o.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Separator className="mb-3" />
                <div className="space-y-3">
                  {o.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-primary/5">
                      <div>
                        <div className="font-medium">{it.title}</div>
                        <div className="text-xs text-muted-foreground">{it.platform} | 수량: 1</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-primary font-medium">{KRW(it.price)}</div>
                        <Button size="sm" variant="outline" onClick={() => navigate("/order02")}>
                          상세
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="text-right text-sm">주문 합계: <span className="text-primary font-semibold">{KRW(sum)}</span></div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="border-primary/20">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">조건에 맞는 주문 내역이 없습니다.</CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
