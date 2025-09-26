import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Loader2 } from "lucide-react";
import {
  getMyOrders,
  type Order,
  type OrderStatus,
} from "../api/order/orderApi";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

const KRW = (v: number) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(
    v
  );

const statusMap: Record<OrderStatus, string> = {
  CART: "장바구니",
  PRE_ORDERED: "예약 주문",
  PENDING: "결제 대기 중",
  PAYMENT_COMPLETED: "결제 완료",
  PAYMENT_FAILED: "결제 실패",
  PURCHASED_CONFIRMED: "구매 확정",
  REFUND_REQUESTED: "환불 요청",
  PARTIALLY_REFUNDED: "부분 환불",
  FULLY_REFUNDED: "전체 환불",
};

// 필터 그룹 정의
const statusGroups = {
  전체: Object.keys(statusMap) as OrderStatus[],
  "결제 완료": ["PAYMENT_COMPLETED", "PURCHASED_CONFIRMED"] as OrderStatus[],
  "진행 중": ["PRE_ORDERED", "PENDING"] as OrderStatus[],
  "환불/취소": [
    "REFUND_REQUESTED",
    "PARTIALLY_REFUNDED",
    "FULLY_REFUNDED",
    "PAYMENT_FAILED",
  ] as OrderStatus[],
};

type StatusFilterGroup = keyof typeof statusGroups;

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [period, setPeriod] = useState<"전체 기간" | "30일" | "3개월">(
    "전체 기간"
  );
  const [statusGroup, setStatusGroup] = useState<StatusFilterGroup>("전체");
  const [orderQuery, setOrderQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const fetchedOrders = await getMyOrders();
        setOrders(fetchedOrders.filter((o) => o.status !== "CART"));
        setError(null);
      } catch (err: any) {
        setError(err.message || "주문 내역을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    let list = orders.filter((o) => inPeriod(o.createdAt, period));
    if (statusGroup !== "전체") {
      const allowedStatuses = statusGroups[statusGroup];
      list = list.filter((o) => allowedStatuses.includes(o.status));
    }
    const q = orderQuery.trim();
    if (q) list = list.filter((o) => String(o.id).includes(q));
    return list;
  }, [orders, period, statusGroup, orderQuery]);

  const getStatusBadgeVariant = (
    status: OrderStatus
  ): {
    variant: "secondary" | "outline" | "destructive";
    className: string;
  } => {
    switch (status) {
      case "PAYMENT_COMPLETED":
      case "PURCHASED_CONFIRMED":
        return {
          variant: "secondary",
          className: "bg-green-500/20 text-green-400 border-green-500/30",
        };
      case "PRE_ORDERED":
      case "PENDING":
        return {
          variant: "outline",
          className: "text-yellow-400 border-yellow-500/30",
        };
      case "REFUND_REQUESTED":
      case "PARTIALLY_REFUNDED":
        return {
          variant: "outline",
          className: "text-orange-400 border-orange-500/30",
        };
      case "FULLY_REFUNDED":
      case "PAYMENT_FAILED":
        return { variant: "destructive", className: "" };
      default:
        return { variant: "outline", className: "" };
    }
  };

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
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">주문 내역</h2>
          <div className="text-sm text-muted-foreground">
            총 {filtered.length}건 (전체 {orders.length}건)
          </div>
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
              <Button
                key={p}
                size="sm"
                variant={period === p ? "default" : "outline"}
                onClick={() => setPeriod(p)}
              >
                {p}
              </Button>
            ))}
            <Separator
              orientation="vertical"
              className="mx-2 hidden sm:block"
            />
            <span className="text-sm text-muted-foreground">상태:</span>
            {(Object.keys(statusGroups) as StatusFilterGroup[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={statusGroup === s ? "default" : "outline"}
                onClick={() => setStatusGroup(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        {filtered.map((o) => {
          const badgeStyle = getStatusBadgeVariant(o.status);
          return (
            <Card key={o.id} className="border-primary/20 overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <button
                      className="text-primary hover:underline"
                      onClick={() => setOrderQuery(String(o.id))}
                    >
                      주문번호: #{o.id}
                    </button>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(o.createdAt).toLocaleDateString("ko-KR")}
                    </div>
                  </div>
                  <Badge
                    variant={badgeStyle.variant}
                    className={badgeStyle.className}
                  >
                    {statusMap[o.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Separator className="mb-3" />
                <div className="space-y-3">
                  {o.orderItems.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-primary/5"
                    >
                      <div>
                        <div className="font-medium">{it.game.name}</div>
                        <div className="text-xs text-muted-foreground">
                          디지털 다운로드 | 수량: {it.quantity}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-primary font-medium">
                          {KRW(it.price)}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/orders/${o.id}`)}
                        >
                          상세
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-3" />
                <div className="text-right text-sm">
                  주문 합계:{" "}
                  <span className="text-primary font-semibold">
                    {KRW(o.totalPrice)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="border-primary/20">
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              조건에 맞는 주문 내역이 없습니다.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
