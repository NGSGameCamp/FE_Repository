export type GameStatus = "selling" | "review" | "paused";

export type PublisherGame = {
  id: string;
  title: string;
  genre: string;
  status: GameStatus;
  price: number;
  unitsSold?: number;
  revenue?: number;
  rating?: number;
};

export type DashboardMetric = {
  id: string;
  label: string;
  value: string;
  deltaLabel: string;
  delta: number;
  helper: string;
};

export const metrics: DashboardMetric[] = [
  {
    id: "revenue",
    label: "총 수익",
    value: "₩125,430,000",
    deltaLabel: "이번 달 기준",
    delta: 12.5,
    helper: "",
  },
  {
    id: "sales",
    label: "판매량",
    value: "3,247",
    deltaLabel: "이번 달 판매",
    delta: 8.3,
    helper: "",
  },
  {
    id: "active",
    label: "등록 게임",
    value: "15",
    deltaLabel: "활성 게임",
    delta: 0,
    helper: "",
  },
  {
    id: "averageRating",
    label: "평균 평점",
    value: "4.6",
    deltaLabel: "전체 게임 평균",
    delta: 0.2,
    helper: "",
  },
];

export const games: PublisherGame[] = [
  {
    id: "cyber-knights-2077",
    title: "Cyber Knights 2077",
    genre: "RPG",
    status: "selling",
    price: 65000,
    unitsSold: 1234,
    revenue: 80210000,
    rating: 4.8,
  },
  {
    id: "forest-quest",
    title: "Forest Quest",
    genre: "어드벤처",
    status: "selling",
    price: 32000,
    unitsSold: 892,
    revenue: 28544000,
    rating: 4.5,
  },
  {
    id: "racing-pro-2024",
    title: "Racing Pro 2024",
    genre: "레이싱",
    status: "review",
    price: 55000,
  },
  {
    id: "mystic-tower",
    title: "Mystic Tower",
    genre: "퍼즐",
    status: "paused",
    price: 28000,
    unitsSold: 456,
    revenue: 12768000,
    rating: 4.2,
  },
];
