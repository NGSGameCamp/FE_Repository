export interface SupportRequest {
  gameId: number;
  orderId: number;
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
  createdAt: string;
}

// FormPayload은 게임 문의 화면에서 수집한 원본 데이터를 표현하며, 이후 API 요청용으로 변환된다.
export interface GameSupportFormPayload {
  gameTitle: string;
  issueTypes: string[];
  description: string;
  attachments: SupportAttachment[];
  orderId: string;
}

// SupportAttachment는 첨부 이미지의 메타 정보를 문자열 응답으로 정규화할 때 사용된다.
export interface SupportAttachment {
  name: string;
  size: number;
}
