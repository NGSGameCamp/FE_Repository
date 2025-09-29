// api/supportApi.ts
import { fetchApi } from "../fetchApi";

export interface SupportRequest {
  gameId: string;
  orderId: string;
  title: string;
  content: string;
}

export interface SupportResponse {
  id: number;
  userId: number;
  orderId: number;
  categoryId: number;
  title: string;
  content: string;
  createdAt: Date;
}

/**
 * Support 문의 등록
 * @param category - game, refund, one-to-one, other
 * @param data - 문의 내용
 */
export async function createSupport(
  category: string,
  data: SupportRequest
): Promise<SupportResponse> {
  return fetchApi<SupportResponse>(`/support/${category}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * 내 문의 목록 조회 (추후 필요시)
 */
export async function getMySupportList(): Promise<SupportResponse[]> {
  return fetchApi<SupportResponse[]>("/support/my");
}

/**
 * 문의 상세 조회 (추후 필요시)
 */
export async function getSupportDetail(id: number): Promise<SupportResponse> {
  return fetchApi<SupportResponse>(`/support/${id}`);
}
