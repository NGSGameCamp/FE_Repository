import { fetchApi } from "../fetchApi";
import { mockCommunityBoardDetail, mockCommunityBoards } from "./mocks";
import type { ApiResult, CommunityBoard, CommunityBoardDetail } from "./types";

function clone<T>(value: T): T {
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
      console.warn(
        `[communityApi] ${path} 요청 실패로 mock 데이터 사용`,
        error
      );
    }
    return { data: clone(fallback), isMock: true };
  }
}

export async function getCommunityBoards(): Promise<
  ApiResult<CommunityBoard[]>
> {
  return requestWithFallback<CommunityBoard[]>(
    "/community/boards",
    mockCommunityBoards
  );
}

export async function getCommunityBoardDetail(
  boardId: string
): Promise<ApiResult<CommunityBoardDetail>> {
  const fallback = mockCommunityBoardDetail(boardId);
  return requestWithFallback<CommunityBoardDetail>(
    `/community/boards/${boardId}`,
    fallback
  );
}
