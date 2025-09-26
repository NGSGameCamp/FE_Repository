import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Link } from "react-router-dom";
import { Star, MessageSquare, Play } from "lucide-react";

interface Game {
  id: string;
  title: string;
  image: string;
  rating: number;
  reviews: string;
  genre: string;
  tags: string[];
  price: string;
  description: string;
}

interface FeaturedGameProps {
  game: Game;
  embed?: boolean;
}

export function FeaturedGame({ game, embed = false }: FeaturedGameProps) {
  return (
    <div className={`relative ${embed ? 'mb-0 h-full' : 'mb-12'} overflow-hidden rounded-2xl bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border border-primary/20`}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={game.image} 
          alt={game.title}
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 lg:p-12">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Game Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                  오늘의 추천
                </Badge>
                <Badge variant="secondary" className="bg-secondary/50">
                  {game.genre}
                </Badge>
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                {game.title}
              </h1>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                {game.description}
              </p>
            </div>

            {/* Stats */}
              <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="font-semibold text-white">{game.rating}</span>
                <span className="text-sm text-muted-foreground">평점</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                <span className="font-semibold text-white">{game.reviews}</span>
                <span className="text-sm text-muted-foreground">리뷰</span>
              </div>
              
              <div className="text-2xl font-bold text-primary">
                {game.price}
              </div>
              </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                상세 페이지
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
              >
                팔로잉
              </Button>
            </div>
          </div>

          {/* Game Image */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-xl">
              <img 
                src={game.image} 
                alt={game.title}
                className="w-full h-80 lg:h-96 object-cover transition-transform duration-500 hover:scale-105"
              />
              
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent"></div>
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50">
                <Button size="lg" className="bg-primary/90 hover:bg-primary backdrop-blur-sm">
                  <Play className="h-6 w-6 mr-2" />
                  트레일러 보기
                </Button>
              </div>
            </div>

            {/* Floating Elements */}
            {/* <div className="absolute -top-4 -right-4 bg-primary/20 backdrop-blur-sm rounded-full p-4 border border-primary/30">
              <Star className="h-6 w-6 text-primary" />
            </div> */}
            
            {/* <div className="absolute -bottom-4 -left-4 bg-cyan-500/20 backdrop-blur-sm rounded-full p-3 border border-cyan-500/30">
              <Download className="h-5 w-5 text-cyan-400" />
            </div> */}
          </div>
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full bg-primary/5 blur-2xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 h-24 w-24 rounded-full bg-cyan-500/5 blur-xl animate-pulse delay-1000"></div>
    </div>
  );
}
