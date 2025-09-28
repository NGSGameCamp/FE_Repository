import type {
  CommunityBoard,
  CommunityBoardDetail,
  CommunityMedia,
  CommunityPost,
} from "./types";

export const mockCommunityBoards: CommunityBoard[] = [
  {
    id: "cyberpunk-2087",
    name: "Cyberpunk 2087",
    type: "game",
    tags: ["레이드", "가이드", "패치"],
    genres: ["액션 RPG", "레이드", "협동", "PvE"],
    rating: 4.7,
    ratingCount: 12304,
    concurrent: "동시 접속자 23,421",
    released: "2024.11.05",
    info: "미래 도시에서 펼쳐지는 사이버펑크 액션 RPG",
    publisher: {
      name: "Nexus Games",
      banner: "사이버펑크 2087 최신 패치 1.2 배포!",
    },
    hero: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: "neon-racing",
    name: "Neon Racing",
    type: "game",
    tags: ["스샷", "커뮤니티", "하이라이트"],
    genres: ["아케이드", "레이싱"],
    rating: 4.4,
    ratingCount: 8021,
    concurrent: "동시 접속자 9,102",
    released: "2024.05.01",
    info: "네온 도시를 질주하는 고속 레이싱 게임",
    publisher: {
      name: "RGB Studio",
      banner: "네온 시티 챔피언십 시즌 4 개최",
    },
    hero: "https://images.unsplash.com/photo-1567027757540-7b572280fa22?auto=format&fit=crop&w=1600&q=60",
  },
  {
    id: "guide-hub",
    name: "가이드 허브",
    type: "topic",
    tags: ["뉴비", "성장", "엔드게임"],
  },
];

export const mockCommunityPosts: Record<string, CommunityPost[]> = {
  "cyberpunk-2087": [
    {
      id: "p1",
      title: "레이드 공략 업데이트",
      excerpt: "최신 패치 기준 공략 갱신…",
      tags: ["레이드"],
      author: "RaiderKim",
      date: new Date().toISOString(),
      comments: 18,
      likes: 90,
    },
    {
      id: "p2",
      title: "엔드게임 성장 루트",
      excerpt: "자원 수급과 세팅 우선순위…",
      tags: ["가이드"],
      author: "이수현",
      date: new Date(Date.now() - 86400000).toISOString(),
      comments: 7,
      likes: 45,
    },
  ],
  "neon-racing": [
    {
      id: "p3",
      title: "네온 트랙 하이라이트",
      excerpt: "지난 주 스크린샷 모음",
      tags: ["스샷"],
      author: "Jin Park",
      date: new Date().toISOString(),
      comments: 6,
      likes: 33,
    },
  ],
  "guide-hub": [
    {
      id: "p4",
      title: "뉴비 종합 가이드",
      excerpt: "처음 시작부터 엔드게임까지…",
      tags: ["뉴비", "가이드"],
      author: "Helper",
      date: new Date().toISOString(),
      comments: 12,
      likes: 88,
    },
  ],
};

export const mockCommunityMedia: Record<string, CommunityMedia> = {
  "cyberpunk-2087": [
    "https://images.unsplash.com/photo-1689443111384-1cf214df988a?w=600&q=60",
    "https://images.unsplash.com/photo-1697256936504-7c9177a74fc5?w=600&q=60",
  ],
  "neon-racing": [
    "https://images.unsplash.com/photo-1567027757540-7b572280fa22?w=600&q=60",
  ],
  "guide-hub": [],
};

export const mockCommunityBoardDetail = (
  boardId: string
): CommunityBoardDetail => ({
  board: mockCommunityBoards.find((board) => board.id === boardId) ?? null,
  posts: mockCommunityPosts[boardId] ?? [],
  media: mockCommunityMedia[boardId] ?? [],
});
