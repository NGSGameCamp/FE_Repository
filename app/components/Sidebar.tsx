import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Flame, 
  Trophy, 
  Tag, 
  Zap,
  Target,
  Sword,
  Car,
  Users,
  Puzzle,
  Globe
} from "lucide-react";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const categories = [
    { id: "recommended", label: "추천", icon: Flame, color: "text-orange-400" },
    { id: "trending", label: "트렌딩", icon: Trophy, color: "text-yellow-400" },
    { id: "new", label: "신작", icon: Zap, color: "text-green-400" },
  ];

  const genres = [
    { id: "action", label: "액션", icon: Target, color: "text-red-400" },
    { id: "rpg", label: "RPG", icon: Sword, color: "text-purple-400" },
    { id: "racing", label: "레이싱", icon: Car, color: "text-blue-400" },
    { id: "multiplayer", label: "멀티플레이어", icon: Users, color: "text-green-400" },
    { id: "puzzle", label: "퍼즐", icon: Puzzle, color: "text-yellow-400" },
    { id: "simulation", label: "시뮬레이션", icon: Globe, color: "text-cyan-400" },
  ];

  const tags = [
    "무료게임", "인디게임", "VR", "모바일", "PC", "콘솔", 
    "온라인", "오프라인", "협동", "경쟁", "스토리", "아케이드"
  ];

  return (
    <aside className="w-64 min-h-screen border-r border-blue-500/20 bg-background/50 backdrop-blur p-4">
      {/* 추천 & 트렌딩 */}
      <Card className="mb-6 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-cyan-500/5">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-blue-400">추천 & 트렌딩</h3>
          <div className="space-y-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    selectedCategory === category.id 
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                      : "hover:bg-blue-500/10 hover:text-blue-400"
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  <Icon className={`h-4 w-4 ${category.color}`} />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 장르별 */}
      <Card className="mb-6 border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-blue-400">장르별</h3>
          <div className="space-y-2">
            {genres.map((genre) => {
              const Icon = genre.icon;
              return (
                <Button
                  key={genre.id}
                  variant={selectedCategory === genre.id ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    selectedCategory === genre.id 
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                      : "hover:bg-blue-500/10 hover:text-blue-400"
                  }`}
                  onClick={() => onCategoryChange(genre.id)}
                >
                  <Icon className={`h-4 w-4 ${genre.color}`} />
                  {genre.label}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 태그별 */}
      <Card className="border-blue-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
        <CardContent className="p-4">
          <h3 className="mb-3 font-medium text-cyan-400">
            <Tag className="inline h-4 w-4 mr-2" />
            태그별
          </h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="cursor-pointer border-blue-500/30 text-blue-300 hover:bg-blue-500/20 hover:border-blue-500 transition-colors"
                onClick={() => onCategoryChange(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}