import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "@/components/ui/input";
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
  LayoutDashboard
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAuth } from "./auth/AuthContext";
import { useEffect, useState } from "react";

interface HeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Header({ selectedCategory, onCategoryChange }: HeaderProps) {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [avatarSrc, setAvatarSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      const key = user?.email ? `profile:avatar:${user.email}` : undefined;
      const src = key ? localStorage.getItem(key) || undefined : undefined;
      setAvatarSrc(src);
    } catch {
      setAvatarSrc(undefined);
    }
  }, [user?.email]);
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-6">
        {/* Main Header */}
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/NGS logo.png"
              alt="NGS New Game Studio"
              className="h-16 w-[200px] object-contain"
            />
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10 pr-4 h-9 placeholder:text-muted-foreground"
                placeholder="게임 검색..."
                type="search"
              />
            </div>
          </div>

          {/* User Actions */}
          <nav className="flex items-center space-x-4">
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link to="/library" className="inline-flex items-center">
                <Gamepad2 className="h-4 w-4 mr-2" />라이브러리
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link to="/search" className="inline-flex items-center">
                <Search className="h-4 w-4 mr-2" />검색
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link to="/community" className="inline-flex items-center">
                <Users className="h-4 w-4 mr-2" />커뮤니티
              </Link>
            </Button>
            
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link to="/support" className="inline-flex items-center">
                <HelpCircle className="h-4 w-4 mr-2" />고객센터
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link to="/publisher/dashboard" className="inline-flex items-center">
                <Building2 className="h-4 w-4 mr-2" />배급사 센터
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link to="/publisher/dashboard" className="inline-flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />대시보드
              </Link>
            </Button>

            <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
              <Link to="/publisher/notices" className="inline-flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />공지 관리
              </Link>
            </Button>
            
            {isAuthenticated && (
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                <Link to="/cart" className="inline-flex items-center">
                  <ShoppingCart className="h-4 w-4 mr-2" />장바구니
                </Link>
              </Button>
            )}

            {!isAuthenticated ? (
              <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary">
                <Link to="/login" className="inline-flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />Sign in
                </Link>
              </Button>
            ) : (
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
            {isAuthenticated && (
              <Link to="/profile" aria-label="내 프로필">
                <Avatar className="h-8 w-8 ring-2 ring-primary/30">
                  <AvatarImage src={avatarSrc || ""} />
                  <AvatarFallback className="bg-primary/20 text-primary">게</AvatarFallback>
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
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5">
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
