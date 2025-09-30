import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { GameGrid } from "./components/game/GameGrid";
import { Routes, Route, useParams, useLocation, Navigate } from "react-router-dom";
import { CommunityPage } from "./components/community/CommunityPage";
import CommunityAllPage from "./components/community/CommunityAllPage";
import CommunityWritePage from "./components/community/CommunityWritePage";
import CommunityEditPage from "./components/community/CommunityEditPage";
import CommunityPostDetailPage from "./components/community/CommunityPostDetailPage";
import CommunityBoardPage from "./components/community/CommunityBoardPage";
import { SupportPage } from "./components/support/SupportPage";
import { CartPage } from "./components/order/CartPage";
import { OrdersPage } from "./components/order/OrdersPage";
import SupportInquiryNewPage from "./components/support/SupportInquiryNewPage";
import SupportRefundPage from "./components/support/SupportRefundPage";
import SupportSuccessPage from "./components/support/SupportSuccessPage";
import SupportMyInquiriesPage from "./components/support/SupportMyInquiriesPage";
import SupportInquiryDetailPage from "./components/support/SupportInquiryDetailPage";
import SupportOneToOnePage from "./components/support/SupportOneToOnePage";
import SupportOtherInquiryPage from "./components/support/SupportOtherInquiryPage";
import SupportInquiryInfoPage from "./components/support/SupportInquiryInfoPage";
import { PaymentPage } from "./components/order/PaymentPage";
import { GameSearchView } from "./components/game/GameSearchView";
import { GameDetailView } from "./components/game/GameDetailView";
import { LoginPage, SignupPage, ScreenStub } from "./components/auth/AuthPages";
import PublisherLoginPage from "./components/auth/PublisherLoginPage";
import PublisherSignupPage from "./components/auth/PublisherSignupPage";
import PublisherNoticeManagementPage from "./components/publisher/PublisherNoticeManagementPage";
import PublisherNoticeDetailPage from "./components/publisher/PublisherNoticeDetailPage";
import PublisherNoticeComposePage from "./components/publisher/PublisherNoticeComposePage";
import PublisherDashboardPage from "./components/publisher/PublisherDashboardPage";
import PublisherCompanyInfoPage from "./components/publisher/PublisherCompanyInfoPage";
import PublisherGameManagementPage from "./components/publisher/PublisherGameManagementPage";
import PublisherGameUploadPage from "./components/publisher/PublisherGameUploadPage";
import PublisherGameEditPage from "./components/publisher/PublisherGameEditPage";
import PublisherGameDetailPage from "./components/publisher/PublisherGameDetailPage";
import PublisherGameDeletePage from "./components/publisher/PublisherGameDeletePage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import { useCartStore } from "./stores/cartStore";
import ForgotPasswordPage from "./components/auth/ForgotPasswordPage";
import ProfilePage from "./components/user/ProfilePage";
import LibraryPage from "./components/user/LibraryPage";
import UserEditPage from "./components/user/UserEditPage";
import UserInfoPage from "./components/user/UserInfoPage";
import UserDeletePage from "./components/user/UserDeletePage";
import { useGameStore } from "./stores/gameStore";
import { useAuth } from "./components/auth/AuthContext";

function Payment02Stub() {
  const params = useParams();
  const id = params.method ? `payment02-${params.method}` : "payment02";
  return <ScreenStub id={id} />;
}

function Home({
  games,
  loading,
  selectedCategory,
  setSelectedCategory,
}: {
  games: ReturnType<typeof useGameStore>["games"];
  loading: boolean;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
}) {
  return (
    <GameGrid
      games={games}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      loading={loading}
    />
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("recommended");
  const location = useLocation();
  const { fetchCart } = useCartStore();
  const { games, fetchGames, loading: gamesLoading } = useGameStore();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (!games.length && !gamesLoading) {
      fetchGames();
    }
  }, [games.length, gamesLoading, fetchGames]);

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
          element={
            <Home
              games={games}
              loading={gamesLoading}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          }
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
        <Route path="/publisher/login" element={<PublisherLoginPage />} />
        <Route path="/publisher/signup" element={<PublisherSignupPage />} />
        <Route path="/publisher/dashboard" element={<PublisherDashboardPage />} />
        <Route path="/publisher/info" element={<PublisherCompanyInfoPage />} />
        <Route path="/publisher/games" element={<PublisherGameManagementPage />} />
        <Route path="/publisher/game/upload" element={<PublisherGameUploadPage />} />
        <Route path="/publisher/game/:gameId" element={<PublisherGameDetailPage />} />
        <Route path="/publisher/game/:gameId/edit" element={<PublisherGameEditPage />} />
        <Route path="/publisher/game/:gameId/delete" element={<PublisherGameDeletePage />} />
        <Route path="/publisher/games/new" element={<PublisherGameUploadPage />} />
        <Route path="/publisher/notices" element={<PublisherNoticeManagementPage />} />
        <Route path="/publisher/notice/write" element={<PublisherNoticeComposePage />} />
        <Route path="/publisher/notices/new" element={<PublisherNoticeComposePage />} />
        <Route path="/publisher/:noticeId/notice" element={<PublisherNoticeDetailPage />} />
        <Route path="/publisher/notices/:id" element={<PublisherNoticeDetailPage />} />
        <Route path="/publisher01-1" element={<ScreenStub id="publisher01-1" />} />
        <Route path="/publisher03" element={<ScreenStub id="publisher03" />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
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
        <Route path="/game03" element={<ScreenStub id="game03" />} />
        <Route
          path="/library"
          element={
            isAuthenticated ? (
              <LibraryPage />
            ) : (
              <Navigate to="/login" replace state={{ from: location.pathname }} />
            )
          }
        />
        <Route path="/user01" element={<ScreenStub id="user01" />} />
        <Route path="/user02" element={<ScreenStub id="user02" />} />
        <Route path="/user03" element={<ScreenStub id="user03" />} />
        <Route path="/user04" element={<ScreenStub id="user04" />} />
        <Route path="/user05" element={<UserEditPage />} />
        <Route path="/user06" element={<UserInfoPage />} />
        <Route path="/user06-01" element={<UserDeletePage />} />
        <Route path="/user07" element={<UserEditPage />} />
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
