export type NoticeStatus = "waiting" | "progress" | "answered";

export type NoticeCategory = "all" | "update" | "event" | "patch" | "system" | "news";

export type PublisherNotice = {
  id: string;
  title: string;
  summary: string;
  game: string;
  category: NoticeCategory;
  status: NoticeStatus;
  views: number;
  createdAt: string; // ISO string
  content: string;
};

const notices: PublisherNotice[] = [
  {
    id: "n-101",
    title: "[UPDATE] v1.2.0 대규모 업데이트 안내",
    summary: "신규 콘텐츠와 시스템 최적화가 포함된 대규모 패치",
    game: "Cyber Knights 2077",
    category: "update",
    status: "waiting",
    views: 325,
    createdAt: "2024-11-28T09:00:00+09:00",
    content: `안녕하세요, NGS 배급 파트너 여러분.

Cyber Knights 2077 v1.2.0 업데이트가 예정되어 있습니다.
- 신규 임무 4종 추가
- 레이드 매칭 개선
- 그래픽 퍼포먼스 향상

점검 시간: 2024-11-28 02:00 ~ 08:00 (KST)
점검 중에는 게임 이용이 제한되며, 완료 즉시 공지 드리겠습니다.

감사합니다.`,
  },
  {
    id: "n-102",
    title: "[이벤트] 론칭 기념 50% 할인!",
    summary: "Forest Quest 론칭 기념 할인 프로모션",
    game: "Forest Quest",
    category: "event",
    status: "progress",
    views: 208,
    createdAt: "2024-11-25T12:00:00+09:00",
    content: `Forest Quest의 글로벌 론칭을 기념하여 50% 할인 이벤트를 진행합니다.

- 기간: 11월 25일 ~ 12월 5일
- 대상: Forest Quest 본편 및 DLC 전품목
- 혜택: 구매 금액의 20% 마케팅 크레딧 추가 지급

배급사 여러분의 홍보 협조 부탁드립니다.`,
  },
  {
    id: "n-103",
    title: "[패치] v1.1.5 버그 수정 및 성능 개선",
    summary: "버그 수정과 안정화 작업 진행 안내",
    game: "Cyber Knights 2077",
    category: "patch",
    status: "answered",
    views: 415,
    createdAt: "2024-11-15T08:30:00+09:00",
    content: `v1.1.5 패치가 배포되었습니다.

- 간헐적으로 발생하던 접속 끊김 현상 해결
- 도시 지역 로딩 최적화
- PvP 매칭 대기열 표시 정확도 개선

패치 노트를 확인하시고 커뮤니티 공지에 반영해 주세요.`,
  },
  {
    id: "n-104",
    title: "[신규] Racing Pro 2024 출시 예정",
    summary: "Racing Pro 2024 출시 일정 공유",
    game: "Racing Pro 2024",
    category: "news",
    status: "waiting",
    views: 152,
    createdAt: "2024-11-10T15:00:00+09:00",
    content: `Racing Pro 2024 출시 일정을 공유드립니다.

- 사전 예약: 12월 1일 시작
- 정식 출시: 12월 15일 00시 (KST)
- 주요 특징: 신규 트랙 12종, 커스텀 리플레이 시스템, 크로스 플랫폼 멀티플레이

추가 문의 사항이 있을 경우 담당 CSM에게 연락 부탁드립니다.`,
  },
  {
    id: "n-105",
    title: "[시스템] 서버 점검 안내",
    summary: "정기 서버 점검 일정 공지",
    game: "-",
    category: "system",
    status: "progress",
    views: 189,
    createdAt: "2024-11-05T18:00:00+09:00",
    content: `전체 서비스 점검이 예정되어 있습니다.

- 일시: 11월 6일 01:00 ~ 05:00 (KST)
- 영향 범위: 전체 게임 서비스, 인증 시스템
- 비고: 긴급 배포 요청 시 점검 전일까지 등록 필요

점검 완료 후 정상화 공지를 제공하겠습니다.`,
  },
  {
    id: "n-106",
    title: "[이벤트] 할로윈 특별 할인 행사",
    summary: "Mystic Tower 할로윈 주간 프로모션",
    game: "Mystic Tower",
    category: "event",
    status: "answered",
    views: 267,
    createdAt: "2024-10-31T10:00:00+09:00",
    content: `Mystic Tower 할로윈 특별 프로모션을 진행했습니다.

- 기간: 10월 25일 ~ 10월 31일
- 내용: 한정 스킨 3종, 누적 결제 혜택
- 결과: 목표 대비 145% 성과 달성

감사의 의미로 마케팅 크레딧을 지급해 드립니다.`,
  },
];

export function fetchPublisherNotices(): PublisherNotice[] {
  return notices;
}
