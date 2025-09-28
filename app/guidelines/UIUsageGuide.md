# UI Usage Guide

이 문서는 새로운 페이지나 기능을 구현할 때 `app/components/y_ui` 프리미티브를 일관되게 활용하기 위한 지침입니다. 아래 원칙을 따르면 팀과 에이전트 모두가 통일된 비주얼 언어를 유지할 수 있습니다.

## 1. 기본 원칙
- **토큰 우선:** 색상·타이포·간격은 `app/global.css`와 `app/index.css` 유틸을 먼저 사용하고, 꼭 필요할 때만 `app/custom.css`에 헬퍼를 추가합니다.
- **경로 규약:** UI 컴포넌트는 `@/components/y_ui/<카테고리>/<컴포넌트>`로 임포트하세요. 예) `import { Card } from "@/components/y_ui/base/card";`.
- **클래스 머지:** 커스텀 클래스를 덧붙일 때는 `@/components/y_ui/base/utils`의 `cn` 헬퍼로 병합합니다.
- **접근성:** 모든 인터랙티브 요소는 `asChild`나 ARIA 속성을 통해 시맨틱을 유지하고, 포커스 링을 제거하지 않습니다.

## 2. 레이아웃 & 컨테이너
- 페이지 루트는 `div.container.mx-auto.space-y-8` 조합을 기본으로 사용합니다.
- 섹션은 `Card` 컴포넌트로 감싸고, 헤더/콘텐츠/액션은 `CardHeader`, `CardContent`, `CardAction`, `CardFooter` 슬롯으로 구분합니다.
- 복수 열 레이아웃이 필요하면 Tailwind 헬퍼(`grid`, `gap-x-*`, `grid-cols-*`) 또는 `data-display`의 `Resizable`·`ScrollArea` 컴포넌트를 고려합니다.

## 3. Base 프리미티브 (`y_ui/base`)
- `Button`은 `variant`(`default`, `secondary`, `outline`, `ghost`, `link`, `destructive`)와 `size`(`sm`, `default`, `lg`, `icon`)를 조합하며, 다른 컴포넌트에서 버튼 스타일이 필요하면 `buttonVariants`로 클래스를 가져옵니다.
- `Card`, `Badge`, `Avatar`, `Separator`, `Skeleton`, `Textarea`, `Input`, `Label`은 공통 스타일을 포함하고 있으므로 추가적인 Tailwind 설정 없이 바로 사용합니다.
- `aspect-ratio` 등 헬퍼는 미디어 컨텐츠 비율을 규정할 때 사용합니다.

## 4. Form Controls (`y_ui/form-controls`)
- **입력 필드:** `Input`, `Textarea`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`, `InputOTP` 등은 사용자 피드백 상태를 포함하고 있으며, form 라이브러리와 연동할 때 `Form`, `FormField`, `FormItem` 컴포넌트를 사용하면 라벨·에러·설명 slot이 자동 배치됩니다.
- **Select & ToggleGroup:** Radix 기반으로 제작되었습니다. `SelectTrigger`와 `SelectContent`를 조합하고, 토글형 필터는 `ToggleGroup` + `ToggleGroupItem`으로 구성하세요.
- **Validation UI:** `aria-invalid`나 `state` props를 전달하면 디자인 토큰에 맞는 경고 색상이 적용됩니다.

## 5. Navigation (`y_ui/navigation`)
- `Tabs`, `Pagination`, `Breadcrumb`, `NavigationMenu`, `Command`, `Sidebar`, `Menubar`가 포함되어 있습니다.
- 상단 네비게이션이나 필터는 `Tabs`를, 검색/명령 팔레트는 `Command` + `dialog` 조합을 사용하세요.
- `Sidebar`는 반응형 상태를 내장하고 있으므로 `SidebarProvider`로 감싸 사용하며, 모바일에서는 자동으로 `Sheet` 기반 UI로 전환됩니다.

## 6. Overlay & Feedback (`y_ui/overlay`, `y_ui/feedback`)
- 모달 계열은 Radix 래퍼(`Dialog`, `AlertDialog`, `Drawer`, `Sheet`, `Popover`, `Tooltip`, `HoverCard`, `DropdownMenu`, `ContextMenu`)를 사용합니다. 트리거에는 `asChild`를 사용해 버튼/아이콘을 그대로 전달하세요.
- 알림·상태 표현은 `Alert`, `Progress`, `Calendar`, `Sonner`로 처리하며, `alert`은 아이콘 영역과 설명 Slot을 지원합니다.

## 7. Data Display & Motion (`y_ui/data-display`, `y_ui/motion-effects`)
- 리스트나 반복 콘텐츠는 `Card` + `ScrollArea` 혹은 `AnimatedList`로 구현해 부드러운 스크롤과 포커스 피드백을 제공합니다.
- 캐러셀/차트 등 시각화는 `Carousel`, `Chart`, `Table`, `Accordion`, `Collapsible`, `Resizable`로 시작하세요.
- 시각적 강조가 필요하면 `StarBorder`, `ElectricBorder`, `GradientText`, `SplitText`, `ChromaGrid`, `AnimatedContent` 등을 섹션 헤더나 CTA 주변에 제한적으로 사용합니다.

## 8. 새로운 페이지 작성 절차 예시
1. **페이지 프레임**: `export default function Page()` 내부에 `div className="container mx-auto space-y-8 py-8"` 생성.
2. **헤더 섹션**: `Card`와 `CardHeader`로 제목/설명을 배치하고, 기본 행동 버튼은 `CardAction`에 `Button variant="secondary"`로 배치.
3. **필터/탭**: 필터가 필요하면 `Select`, `ToggleGroup`, `Tabs` 등을 조합하고 상태는 상위 컴포넌트에서 관리.
4. **내용 배치**: 목록은 `ScrollArea` + `AnimatedList` 또는 `Table`을 사용, 상세 영역은 `Grid`로 7:3 또는 6:4 비율을 유지 (`grid-7-3` 헬퍼 참고).
5. **상태/알림**: 로딩·에러 상태는 `Skeleton`, `Alert`, `Progress`로 표시하고, 제출 이후 피드백은 `Sonner` 토스트 사용.
6. **반응형 점검**: 각 섹션에서 `sm`, `lg`, `xl` 브레이크포인트를 확인하여 overflow나 padding이 깨지지 않는지 검증합니다.

## 9. 커스터마이징 규칙
- 기본 변형으로 해결되지 않는 경우에만 Tailwind 클래스를 추가하고, 항상 `className={cn("기본클래스", className)}` 패턴을 지키세요.
- 새로운 UI 프미티브가 필요하면 `y_ui` 하위에 추가하되, 문서에 사용처·props·예제를 업데이트하세요.
- 디자인 토큰과 면적 대비 애니메이션이 과하지 않도록 `motion-effects` 컴포넌트는 한 섹션에 하나 정도만 사용합니다.

이 가이드를 따르고 기존 페이지(예: `SupportPage`, `CommunityPage`)를 참고하면 새로운 화면도 스타일·동작이 자연스럽게 맞춰집니다. 변경 사항이나 새 패턴을 도입할 때는 `app/guidelines/UIUsageGuide.md`와 관련 문서를 반드시 함께 갱신하세요.
