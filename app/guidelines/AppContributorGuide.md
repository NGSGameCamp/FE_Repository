# app 디렉토리 편집 가이드

`app/` 아래 파일을 안전하게 수정할 수 있도록 구조와 수정 포인트, 주의사항을 정리했습니다.

## 구조 개요
- 엔트리: `app/main.tsx`가 `App`을 마운트하고 전역 스타일을 가져옵니다.
- 루트 UI: `app/App.tsx`가 최상위 상태(예: `selectedCategory`)를 관리하고 섹션들을 조합합니다.
- 레이아웃: `app/components/layout/*` (`Header.tsx`, `Sidebar.tsx`).
- 게임 홈 UI: `app/components/game/*` (`GameGrid.tsx`, `FeaturedGame.tsx`, `NewGamesSection.tsx`, `CategoriesSection.tsx`, `GameSection.tsx`, `GameCard.tsx`).
- 커뮤니티: `app/components/community/*` (`CommunityPage.tsx` 외 다중 페이지).
- 주문/결제: `app/components/order/*` (`CartPage.tsx`, `OrdersPage.tsx`, `PaymentPage.tsx`).
- 고객지원: `app/components/support/*`.
- 사용자: `app/components/user/*`.
- UI 프리미티브: `app/components/ui/{base,form-controls,navigation,overlay,feedback,data-display,motion-effects,hooks}`에 분류되어 있으며(`base/button.tsx`, `form-controls/select.tsx` 등) 필요 시 기존 변형을 확장하세요.
- 스타일: `app/global.css`(토큰/베이스), `app/index.css`(미리 컴파일된 Tailwind 유틸), `app/custom.css`(헬퍼: `grid-7-3` 등).

## 자주 하는 변경
- 홈 섹션 추가: `app/components/game/`에 컴포넌트를 만들고 `GameGrid.tsx`의 카테고리 바 아래에 포함하세요. 섹션 간격은 `space-y-8` 유지.
- 히어로 비율 변경: `app/components/game/GameGrid.tsx`에서 `grid-7-3` ↔ `grid-6-4`로 교체(`app/custom.css`에 헬퍼 정의).
- 카테고리 추가: `app/components/game/GameGrid.tsx`의 카테고리 배열을 확장하고, 필터 로직이 해당 id를 처리하는지 확인.
- 헤더 드롭다운: Radix 트리거는 `<DropdownMenuTrigger asChild>`를 사용하고, 우리 `<Button>`을 자식으로 넣으세요(ref 전달됨).

## 스타일 규칙
- 우선순위: `app/global.css`의 토큰 + `app/index.css` 유틸리티.
- 필요한 Tailwind 유틸이 없으면 `app/custom.css`에 작은 헬퍼를 추가(예: `.grid-7-3`).
- 강조 제목엔 `bg-gradient-to-r from-primary to-cyan-400` 그라디언트를 권장.

## UI 프리미티브
- `cva`로 변형을 정의(`ui/button.tsx`, `ui/badge.tsx` 참조). 인라인 스타일 대신 변형 확장.
- 상호작용 컴포넌트는 반드시 `React.forwardRef` 사용(이미 `Button` 적용됨).

## 데이터와 프롭스
- 게임 데이터는 `useGameStore`가 `app/api/game/gameApi.ts`의 `getGames()`를 통해 불러오며, 실패 시 `app/api/game/mocks.ts`의 목 데이터를 사용합니다. 새 필드를 추가하면 `GameSummary` 타입과 소비처(`GameGrid`, `GameCard`)를 함께 갱신하세요.
- 프롭스는 최소/명확하게, 상위(`App.tsx`)로 상태를 승격하고 핸들러(`onCategoryChange`)를 내려주세요.

## 주의사항
- `lg:grid-cols-10`처럼 없는 유틸에 의존하지 말고 헬퍼를 사용.
- `asChild` 사용 시 버튼/링크 시맨틱이 겹치지 않도록 주의.
- 히어로 동일 높이: 임베드 사용 시 자식에 `h-full` 적용(`embed` prop).

## 실행/검증
- 개발: `npm run dev` (http://localhost:3000)
- 빌드: `npm run build` (`build/` 출력). 타입 에러 없고 UI가 정상 렌더링되는지 확인하세요.
