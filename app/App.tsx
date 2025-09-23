import { useEffect, useState } from "react";
import { Header } from "./components/Header";
import { GameGrid } from "./components/GameGrid";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import { CommunityPage } from "./components/CommunityPage";
import CommunityAllPage from "./components/CommunityAllPage";
import CommunityWritePage from "./components/CommunityWritePage";
import CommunityEditPage from "./components/CommunityEditPage";
import CommunityPostDetailPage from "./components/CommunityPostDetailPage";
import CommunityBoardPage from "./components/CommunityBoardPage";
import { SupportPage } from "./components/SupportPage";
import { CartPage } from "./components/CartPage";
import { OrdersPage } from "./components/OrdersPage";
import SupportInquiryNewPage from "./components/SupportInquiryNewPage";
import SupportRefundPage from "./components/SupportRefundPage";
import SupportSuccessPage from "./components/SupportSuccessPage";
import SupportMyInquiriesPage from "./components/SupportMyInquiriesPage";
import SupportInquiryDetailPage from "./components/SupportInquiryDetailPage";
import SupportOneToOnePage from "./components/SupportOneToOnePage";
import SupportOtherInquiryPage from "./components/SupportOtherInquiryPage";
import SupportInquiryInfoPage from "./components/SupportInquiryInfoPage";
import { PaymentPage } from "./components/PaymentPage";
import { GameSearchView } from "./components/GameSearchView";
import { GameDetailView } from "./components/GameDetailView";
import { LoginPage, SignupPage, ScreenStub } from "./components/auth/AuthPages";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import { useCartStore } from "./stores/cartStore";

// Mock data for games
const mockGames = [
  {
    id: "1",
    title: "Cyberpunk 2087",
    image: "https://images.unsplash.com/photo-1689443111384-1cf214df988a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBnYW1pbmclMjBmdXR1cmlzdGljfGVufDF8fHx8MTc1NzMxOTA1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    downloads: "2.5M",
    genre: "액션",
    tags: ["사이버펑크", "오픈월드", "RPG"],
    price: "₩59,000",
    description: "미래 도시에서 펼쳐지는 사이버펑크 액션 RPG"
  },
  {
    id: "2",
    title: "Neon Controller",
    image: "https://images.unsplash.com/photo-1567027757540-7b572280fa22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwZ2FtaW5nJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTczMTkwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.6,
    downloads: "1.8M",
    genre: "아케이드",
    tags: ["레트로", "네온", "아케이드"],
    price: "무료",
    description: "네온 라이트가 빛나는 레트로 아케이드 게임"
  },
  {
    id: "3",
    title: "Sci-Fi Interface",
    image: "https://images.unsplash.com/photo-1697256936504-7c9177a74fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBnYW1lJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc1NzMxOTA1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.7,
    downloads: "3.2M",
    genre: "시뮬레이션",
    tags: ["SF", "우주", "전략"],
    price: "₩45,000",
    description: "우주를 배경으로 한 SF 시뮬레이션 게임"
  },
  {
    id: "4",
    title: "RGB Gaming Arena",
    image: "https://images.unsplash.com/photo-1628089700970-0012c5718efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMHJnYnxlbnwxfHx8fDE3NTcyMTM1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.9,
    downloads: "5.1M",
    genre: "멀티플레이어",
    tags: ["FPS", "경쟁", "온라인"],
    price: "무료",
    description: "최고의 RGB 환경에서 즐기는 FPS 게임"
  },
  {
    id: "5",
    title: "Digital Art Quest",
    image: "https://images.unsplash.com/photo-1625805866852-b2ab3e740530?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBhcnR3b3JrfGVufDF8fHx8MTc1NzMxOTA1OXww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.5,
    downloads: "1.2M",
    genre: "RPG",
    tags: ["판타지", "어드벤처", "스토리"],
    price: "₩35,000",
    description: "아름다운 디지털 아트로 표현된 판타지 RPG"
  },
  {
    id: "6",
    title: "Esports Champion",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwdG91cm5hbWVudHxlbnwxfHx8fDE3NTcyMTM1NjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.8,
    downloads: "4.7M",
    genre: "경쟁",
    tags: ["e스포츠", "토너먼트", "PvP"],
    price: "무료",
    description: "프로 e스포츠 선수가 되어 토너먼트에 참가하세요"
  },
  {
    id: "7",
    title: "Neon Racing",
    image: "https://images.unsplash.com/photo-1567027757540-7b572280fa22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwZ2FtaW5nJTIwY29udHJvbGxlcnxlbnwxfHx8fDE3NTczMTkwNTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.4,
    downloads: "2.8M",
    genre: "레이싱",
    tags: ["네온", "속도", "아케이드"],
    price: "₩25,000",
    description: "네온 도시를 질주하는 고속 레이싱 게임"
  },
  {
    id: "8",
    title: "Puzzle Matrix",
    image: "https://images.unsplash.com/photo-1697256936504-7c9177a74fc5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzY2ktZmklMjBnYW1lJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc1NzMxOTA1OHww&ixlib=rb-4.1.0&q=80&w=1080",
    rating: 4.3,
    downloads: "1.5M",
    genre: "퍼즐",
    tags: ["논리", "두뇌", "캐주얼"],
    price: "₩15,000",
    description: "복잡한 매트릭스를 해결하는 퍼즐 게임"
  }
];

function Payment02Stub() {
  const params = useParams();
  const id = params.method ? `payment02-${params.method}` : "payment02";
  return <ScreenStub id={id} />;
}

function Home({
  selectedCategory,
  setSelectedCategory,
}: {
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}) {
  return (
    <GameGrid
      games={mockGames}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
    />
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("recommended");
  const location = useLocation();
  const { fetchCart } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Ensure navigating to home resets to 추천
  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedCategory("recommended");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background dark">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <Routes>
        <Route
          path="/"
          element={<Home selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />}
        />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/community/all" element={<CommunityAllPage />} />
        <Route path="/community/write" element={<CommunityWritePage />} />
        <Route path="/community/edit/:id" element={<CommunityEditPage />} />
        <Route path="/community/post/:id" element={<CommunityPostDetailPage />} />
        <Route path="/community/board/:id" element={<CommunityBoardPage />} />
        <Route path="/search" element={<GameSearchView />} />
        <Route path="/game/:id" element={<GameDetailView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/new" element={<SupportInquiryNewPage />} />
        <Route path="/support/refund" element={<SupportRefundPage />} />
        <Route path="/support/one-to-one" element={<SupportOneToOnePage />} />
        <Route path="/support/other" element={<SupportOtherInquiryPage />} />
        <Route path="/support/success" element={<SupportSuccessPage />} />
        <Route path="/support/my" element={<SupportMyInquiriesPage />} />
        <Route path="/support/my/:id" element={<SupportInquiryDetailPage />} />
        <Route path="/support01" element={<SupportMyInquiriesPage />} />
        <Route path="/support01/:id" element={<SupportInquiryInfoPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/payment01" element={<PaymentPage />} />
        <Route path="/payment02-:method" element={<Payment02Stub />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/order02" element={<ScreenStub id="order02" />} />
        <Route path="/user01" element={<ScreenStub id="user01" />} />
        <Route path="/user02" element={<ScreenStub id="user02" />} />
        <Route path="/user03" element={<ScreenStub id="user03" />} />
        <Route path="/user04" element={<ScreenStub id="user04" />} />
      </Routes>

      {/* Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl"></div>
        <div className="absolute top-3/4 left-1/2 h-32 w-32 rounded-full bg-primary/3 blur-2xl"></div>
      </div>
    </div>
  );
}
