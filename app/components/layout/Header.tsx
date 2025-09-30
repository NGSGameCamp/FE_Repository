import { Button } from "../y_ui/base/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../y_ui/base/avatar";
import { Input } from "~/components/y_ui/base/input";
import {
  Users,
  ShoppingCart,
  HelpCircle,
  LogIn,
  Search,
  Gamepad2,
  Flame,
  Trophy,
  Zap,
  Target,
  Sword,
  Car,
  Globe,
  Puzzle,
  ChevronDown,
  Building2,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../y_ui/overlay/dropdown-menu";
import { useAuth } from "../auth/AuthContext";
import { useCartStore } from "../../stores/cartStore";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getPublisherSession,
  clearPublisherSession,
  type PublisherSession,
} from "../auth/publisherStore";
import { useGameStore } from "../../stores/gameStore";

interface HeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Header({ selectedCategory, onCategoryChange }: HeaderProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const { itemCount } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);
  const [publisherSession, setPublisherSession] =
    useState<PublisherSession | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const games = useGameStore((state) => state.games);
  const fetchGames = useGameStore((state) => state.fetchGames);
  const gamesLoading = useGameStore((state) => state.loading);
  const hasCatalog = games.length > 0;

  useEffect(() => {
    try {
      const key = user?.email ? `profile:avatar:${user.email}` : undefined;
      const src = key ? localStorage.getItem(key) || undefined : undefined;
      setAvatarSrc(src);
    } catch {
      setAvatarSrc(undefined);
    }
  }, [user?.email]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateSession = () => {
      try {
        const { session } = getPublisherSession();
        setPublisherSession(session);
      } catch {
        setPublisherSession(null);
      }
    };

    updateSession();
    window.addEventListener("storage", updateSession);
    return () => window.removeEventListener("storage", updateSession);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const { session } = getPublisherSession();
      setPublisherSession(session);
    } catch {
      setPublisherSession(null);
    }
  }, [location.pathname]);

  const isPublisher = !!publisherSession;
  const categories = [
    { id: "recommended", label: "추천", icon: Flame },
    { id: "trending", label: "트렌딩", icon: Trophy },
    { id: "new", label: "신작", icon: Zap },
  ];

  const genres = [
    { id: "action", label: "액션", icon: Target },
    { id: "rpg", label: "RPG", icon: Sword },
    { id: "racing", label: "레이싱", icon: Car },
    { id: "simulation", label: "시뮬레이션", icon: Globe },
    { id: "puzzle", label: "퍼즐", icon: Puzzle },
  ];

  const navItems = useMemo(() => {
    if (isPublisher) {
      return [
        {
          to: "/publisher/dashboard",
          label: "배급사 센터",
          Icon: Building2,
        },
        {
          to: "/publisher/dashboard?panel=overview",
          label: "대시보드",
          Icon: LayoutDashboard,
        },
        {
          to: "/publisher/games",
          label: "게임 관리",
          Icon: Gamepad2,
        },
        {
          to: "/publisher/notices",
          label: "공지 관리",
          Icon: ClipboardList,
        },
        {
          to: "/publisher/info",
          label: "회사 정보",
          Icon: Building2,
        },
      ];
    }

    const items = [
      {
        to: "/search",
        label: "검색",
        Icon: Search,
      },
      {
        to: "/community",
        label: "커뮤니티",
        Icon: Users,
      },
    ];

    if (isAuthenticated) {
      items.unshift({
        to: "/library",
        label: "라이브러리",
        Icon: Gamepad2,
      });
    }

    return items;
  }, [isPublisher, isAuthenticated]);

  useEffect(() => {
    if (!hasCatalog && !gamesLoading) {
      fetchGames();
    }
  }, [fetchGames, gamesLoading, hasCatalog]);

  const handleSearch = useCallback(
    (term: string) => {
      const normalized = term.trim().toLowerCase();
      if (!normalized) return;

      const match = games.find((game) =>
        game.title.toLowerCase().includes(normalized)
      );

      if (match) {
        navigate(`/game/${match.id}`);
      } else {
        navigate(`/search?query=${encodeURIComponent(term.trim())}`);
      }
    },
    [games, navigate]
  );

  const onSubmitSearch = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleSearch(searchQuery);
    },
    [handleSearch, searchQuery]
  );

  const onKeyDownSearch = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSearch(searchQuery);
      }
    },
    [handleSearch, searchQuery]
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={isPublisher ? "/publisher/dashboard" : "/"}
            className="flex items-center"
          >
            <img
              src="/NGS logo.png"
              alt="NGS New Game Studio"
              className="h-16 w-[200px] object-contain"
            />
          </Link>

          {/* Search Bar */}
          {!isPublisher && (
            <form onSubmit={onSubmitSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={onKeyDownSearch}
                  className="pl-10 pr-4 h-9 placeholder:text-muted-foreground"
                  placeholder="게임 검색..."
                  type="search"
                />
              </div>
            </form>
          )}

          {/* User Actions */}
          <nav className="flex items-center space-x-4">
            {navItems.map(({ to, label, Icon }) => (
              <Button
                key={label}
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Link to={to} className="inline-flex items-center">
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Link>
              </Button>
            ))}

            <Button
              asChild
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-primary hover:bg-primary/10"
            >
              <Link to="/support" className="inline-flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />
                고객센터
              </Link>
            </Button>
            {isAuthenticated && (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-primary hover:bg-primary/10"
              >
                <Link to="/cart" className="inline-flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  장바구니
                  {itemCount > 0 && (
                    <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-primary rounded-full">
                      {itemCount}
                    </span>
                  )}
                </Link>
              </Button>
            )}

            {!isAuthenticated && !isPublisher && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
              >
                <Link to="/login" className="inline-flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Sign in
                </Link>
              </Button>
            )}
            {isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Sign out
              </Button>
            )}
            {isPublisher && (
              <Button
                variant="outline"
                size="sm"
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary"
                onClick={() => {
                  clearPublisherSession();
                  setPublisherSession(null);
                  navigate("/publisher/login");
                }}
              >
                Publisher Sign out
              </Button>
            )}
            {isAuthenticated && (
              <Link to="/profile" aria-label="내 프로필">
                <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                  <AvatarImage src={avatarSrc || ""} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    게
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}
          </nav>
        </div>

        {/* Navigation Menu (Home only) */}
        {isHome && (
          <div className="flex h-12 items-center justify-center space-x-1 border-t border-primary/10">
            {/* Quick Categories */}
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${
                    selectedCategory === category.id
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className="h-4 w-4" />
                  {category.label}
                </Button>
              );
            })}

            {/* Genres Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5"
                >
                  장르별
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {genres.map((genre) => {
                  const Icon = genre.icon;
                  return (
                    <DropdownMenuItem
                      key={genre.id}
                      onClick={() => onCategoryChange(genre.id)}
                      className="gap-2 cursor-pointer"
                    >
                      <Icon className="h-4 w-4" />
                      {genre.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="sm"
              className={`${
                selectedCategory === "무료게임"
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              }`}
              onClick={() => onCategoryChange("무료게임")}
            >
              무료게임
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
