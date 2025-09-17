import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { 
  Star, 
  Download, 
  Heart, 
  Share2, 
  PlayCircle 
} from "lucide-react";
import { Link } from "react-router-dom";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    image: string;
    rating: number;
    downloads: string;
    genre: string;
    tags: string[];
    price: string;
    description: string;
  };
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Card className="group relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5 hover:from-primary/10 hover:to-cyan-500/10 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-video overflow-hidden">
        <Link to={`/game/${game.id}`} aria-label={`${game.title} 상세보기`}>
          <ImageWithFallback
            src={game.image}
            alt={game.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              size="sm" 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              플레이
            </Button>
          </div>
        </div>
        
        {/* Price badge */}
        <div className="absolute top-2 right-2">
          <Badge 
            variant={game.price === "무료" ? "secondary" : "outline"}
            className={game.price === "무료" 
              ? "bg-green-500/20 text-green-400 border-green-500/30" 
              : "bg-primary/20 text-primary border-primary/30"
            }
          >
            {game.price}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <h3 className="font-medium truncate group-hover:text-primary transition-colors">
            <Link to={`/game/${game.id}`}>{game.title}</Link>
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {game.description}
          </p>
        </div>
        
        {/* Rating and Downloads */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm">{game.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Download className="h-3 w-3" />
              <span className="text-sm">{game.downloads}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-red-400"
            >
              <Heart className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-primary/20 hover:text-primary"
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          <Badge 
            variant="outline" 
            className="text-xs border-primary/30 text-primary"
          >
            {game.genre}
          </Badge>
          {game.tags.slice(0, 2).map((tag) => (
            <Badge 
              key={tag}
              variant="outline" 
              className="text-xs border-primary/20 text-muted-foreground"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
