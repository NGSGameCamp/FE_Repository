import { API_BASE_URL, fetchApi } from "../fetchApi";
import { mockPublisherCompany } from "./mocks";
import type { ApiResult, PublisherCompany } from "./types";

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

export async function getPublisherCompany(): Promise<
  ApiResult<PublisherCompany>
> {
  try {
    const data = await fetchApi<PublisherCompany>(
      `${API_BASE_URL}/publisher/company`
    );
    return { data, isMock: false };
  } catch (error) {
    if (import.meta.env?.DEV) {
      console.warn(
        "[publisherApi] /publisher/company 요청 실패로 mock 데이터 사용",
        error
      );
    }
    return { data: clone(mockPublisherCompany), isMock: true };
  }
}
