import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
  ChevronDown
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Header({ selectedCategory, onCategoryChange }: HeaderProps) {
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
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 h-8 w-8 bg-primary blur-lg opacity-30"></div>
            </div>
            <h1 className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text font-bold text-transparent">
              NGS GAME CAMP
            </h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="w-full rounded-lg border border-primary/30 bg-background/50 pl-10 pr-4 py-2 text-sm backdrop-blur focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="게임 검색..."
                type="search"
              />
            </div>
          </div>

          {/* User Actions */}
          <nav className="flex items-center space-x-4">
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
              <Link to="/cart" className="inline-flex items-center">
                <ShoppingCart className="h-4 w-4 mr-2" />장바구니
              </Link>
            </Button>

            <Button asChild variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary">
              <Link to="/login" className="inline-flex items-center">
                <LogIn className="h-4 w-4 mr-2" />로그인
              </Link>
            </Button>
            
            <Avatar className="h-8 w-8 ring-2 ring-primary/30">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary">게</AvatarFallback>
            </Avatar>
          </nav>
        </div>

        {/* Navigation Menu */}
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
      </div>
    </header>
  );
}
