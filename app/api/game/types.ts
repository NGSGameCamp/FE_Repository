export interface GameSummary {
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

export interface GameSearchItem {
  id: string;
  title: string;
  price: number;
  rating: number;
  released: string;
  genres: string[];
  features: string[];
  themes: string[];
}

export type GameDetailMedia = {
  type: "image";
  url: string;
};

export interface GameDetail {
  slug: string;
  id: number;
  title: string;
  price: number;
  developer: string;
  publisher: string;
  released: string;
  genres: string[];
  features: string[];
  themes: string[];
  image?: string;
  requirements: {
    minimum: string[];
    recommended: string[];
  };
  media: GameDetailMedia[];
  news: {
    id: string;
    title: string;
    date: string;
  }[];
}

export interface ApiResult<T> {
  data: T;
  isMock: boolean;
}
