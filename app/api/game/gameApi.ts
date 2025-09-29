import { fetchApi } from "../fetchApi";
import { mockGameDetails, mockGames, mockSearchGames } from "./mocks";
import type {
  ApiResult,
  GameDetail,
  GameSearchItem,
  GameSummary,
} from "./types";

function cloneFallback<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) =>
      typeof item === "object" && item !== null ? { ...item } : item
    ) as T;
  }
  if (typeof value === "object" && value !== null) {
    return { ...(value as Record<string, unknown>) } as T;
  }
  return value;
}

async function requestWithFallback<T>(
  path: string,
  fallback: T
): Promise<ApiResult<T>> {
  try {
    const data = await fetchApi<T>(`${path}`);
    return { data, isMock: false };
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn(`[gameApi] ${path} 요청 실패로 mock 데이터 사용`, error);
    }
    return { data: cloneFallback(fallback), isMock: true };
  }
}

export async function getGames(): Promise<ApiResult<GameSummary[]>> {
  return requestWithFallback<GameSummary[]>("/games", mockGames);
}

export async function getGameDetail(
  slug: string
): Promise<ApiResult<GameDetail | null>> {
  const fallback =
    mockGameDetails[slug] ?? Object.values(mockGameDetails)[0] ?? null;
  const result = await requestWithFallback<GameDetail | null>(
    `/games/${slug}`,
    fallback
  );
  return result;
}

export async function searchGames(
  query: string
): Promise<ApiResult<GameSearchItem[]>> {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  const path = `/games/search${params.toString() ? `?${params}` : ""}`;
  const fallback = query
    ? mockSearchGames.filter((game) =>
        game.title.toLowerCase().includes(query.toLowerCase())
      )
    : mockSearchGames;
  return requestWithFallback<GameSearchItem[]>(path, fallback);
}

export async function getSearchFilters(): Promise<
  ApiResult<{
    genres: string[];
    features: string[];
    themes: string[];
  }>
> {
  const fallback = {
    genres: Array.from(
      new Set(mockSearchGames.flatMap((game) => game.genres))
    ).sort(),
    features: Array.from(
      new Set(mockSearchGames.flatMap((game) => game.features))
    ).sort(),
    themes: Array.from(
      new Set(mockSearchGames.flatMap((game) => game.themes))
    ).sort(),
  };
  return requestWithFallback("/games/filters", fallback);
}
