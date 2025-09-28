// 공통 fetch 함수
export async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
  ok?: boolean // 응답 본문 안 받고 ok만 받을 때 사용함
): Promise<T> {
  const response = await fetch("/api" + url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ message: "알 수 없는 오류가 발생했습니다." }));
    throw new Error(errorData.message || "API 요청에 실패했습니다.");
  }
  if (ok) return ok as unknown as T;
  return response.json();
}
