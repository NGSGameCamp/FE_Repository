export interface CommunityBoard {
  id: string;
  name: string;
  type: "game" | "topic";
  tags: string[];
  rating?: number;
  info?: string;
  publisher?: { name: string; banner: string };
  hero?: string;
  genres?: string[];
  released?: string;
  ratingCount?: number;
  concurrent?: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  excerpt: string;
  tags: string[];
  author: string;
  date: string;
  comments: number;
  likes: number;
}

export type CommunityMedia = string[];

export interface CommunityBoardDetail {
  board: CommunityBoard | null;
  posts: CommunityPost[];
  media: CommunityMedia;
}

export interface ApiResult<T> {
  data: T;
  isMock: boolean;
}
