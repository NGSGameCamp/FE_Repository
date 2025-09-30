import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Button } from "../y_ui/base/button";
import { Textarea } from "../y_ui/base/textarea";
import { Checkbox } from "../y_ui/form-controls/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../y_ui/form-controls/select";
import { HelpCircle, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createSupport } from "../../api/support/supportApi";
import type {
  GameSupportFormPayload,
  SupportAttachment,
  SupportRequest,
} from "../../api/support/types";

type ProblemType =
  | "설치 문제"
  | "실행 문제"
  | "버그 신고"
  | "성능 문제"
  | "설정 문제"
  | "기타";

const types: ProblemType[] = [
  "설치 문제",
  "실행 문제",
  "버그 신고",
  "성능 문제",
  "설정 문제",
  "기타",
];

const defaultPurchased = [
  "Cyber Knights 2077",
  "Forest Quest",
  "Mecha Arena",
  "Puzzle Matrix",
  "Neon Racing",
];

type ImagePreview = { id: string; url: string; file: File };

export function SupportInquiryNewPage() {
  const navigate = useNavigate();
  const [game, setGame] = useState<string>("");
  const [selected, setSelected] = useState<ProblemType[]>([]);
  const [desc, setDesc] = useState<string>("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // API 전송 중 중복 제출을 방지하기 위한 상태값을 둔다.

  const purchased = useMemo(() => {
    return defaultPurchased;
  }, []);

  const valid = game && selected.length > 0 && desc.trim().length >= 10;

  useEffect(
    () => () => {
      images.forEach((im) => URL.revokeObjectURL(im.url));
    },
    [images]
  );

  const onFiles: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5);
    const next: ImagePreview[] = files.map((f) => ({
      id: `${f.name}-${f.lastModified}`,
      file: f,
      url: URL.createObjectURL(f),
    }));
    setImages((prev) => [...prev, ...next].slice(0, 5));
    e.currentTarget.value = "";
  };

  const toggleType = (t: ProblemType) => {
    setSelected((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const mapFormToRequest = (
    payload: GameSupportFormPayload
  ): SupportRequest => {
    // mapFormToRequest는 화면에서 수집한 데이터를 API 스펙이 요구하는 필드로 재구성한다.
    const primaryIssue = payload.issueTypes[0] ?? "기타";
    const title = `[${primaryIssue}] ${payload.gameTitle}`;
    const attachmentSummary = payload.attachments
      .map(
        (attachment) => `${attachment.name} (${formatBytes(attachment.size)})`
      )
      .join(", ");
    const attachmentBlock = attachmentSummary
      ? `\n\n첨부 파일: ${attachmentSummary}`
      : "";
    // TODO:

    // console.log("content:", payload.issueTypes, payload.description);
    return {
      gameId: 0 /*payload.gameTitle*/,
      orderId: 0 /*payload.orderId*/,
      title,
      content: `문제 유형: ${
        payload.issueTypes.join(", ") || "미지정"
      }\n\n상세 설명:\n${payload.description}${attachmentBlock}`,
    };
  };

  const formatBytes = (size: number) => {
    // formatBytes는 첨부 파일 크기를 사람이 읽기 쉬운 단위(KB/MB)로 변환해 문자열을 만든다.
    if (size === 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const idx = Math.min(
      Math.floor(Math.log(size) / Math.log(1024)),
      units.length - 1
    );
    const formatted = size / Math.pow(1024, idx);
    return `${formatted.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
  };

  const buildFormPayload = (): GameSupportFormPayload => {
    // buildFormPayload는 폼 상태를 모아 API 전송 전 중간 데이터 객체를 구성한다.
    const attachments: SupportAttachment[] = images.map((im) => ({
      name: im.file.name,
      size: im.file.size,
    }));
    return {
      gameTitle: game,
      issueTypes: selected,
      description: desc.trim(),
      attachments,
      orderId: deriveOrderId(game),
    };
  };

  const deriveOrderId = (title: string) => {
    // deriveOrderId는 실제 주문번호가 없는 상태를 가정하고 더미 주문번호를 규칙적으로 만든다.
    if (!title) return "ORDER-UNKNOWN";
    const index = purchased.findIndex((item) => item === title);
    return index >= 0 ? `ORDER-${index + 1}` : "ORDER-CUSTOM";
  };

  const submit = async () => {
    setError(null);
    if (isSubmitting) return; // 이미 제출 중이라면 추가 요청을 차단한다.
    if (!valid) {
      if (!game) return setError("문의할 게임을 선택하세요.");
      if (!selected.length)
        return setError("문제 유형을 하나 이상 선택하세요.");
      if (desc.trim().length < 10)
        return setError("상세 설명을 10자 이상 입력하세요.");
    }
    try {
      setIsSubmitting(true); // API 호출이 시작되면 로딩 플래그를 켜서 중복 클릭을 막는다.
      const formPayload = buildFormPayload(); // 폼 데이터를 한곳에 모은다.
      const requestPayload = mapFormToRequest({
        ...formPayload,
        orderId: formPayload.orderId,
      }); // API 스펙에 맞는 구조로 변환한다.
      const response = await createSupport("game", requestPayload); // support API에 게임 문의 등록 요청을 전송한다.

      navigate("/support/success", {
        state: { id: `INQ-${response.id}`, kind: "게임 문의" },
      }); // 응답 ID를 이용해 성공 화면으로 이동한다.
    } catch (apiError) {
      setError("문의 등록 중 오류가 발생했습니다."); // API 실패 시 사용자에게 에러를 표시한다.
    } finally {
      setIsSubmitting(false); // 호출 완료 후에는 다시 제출할 수 있도록 상태를 복구한다.
    }
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <div
        className="mx-auto w-full space-y-6"
        style={{ width: "min(100%, 50vw)", minWidth: "320px" }}
      >
      <div className="flex items-start gap-3">
        <HelpCircle className="h-6 w-6 text-primary mt-0.5" />
        <div>
          <h2 className="text-xl font-semibold text-white">게임 문의</h2>
          <p className="text-sm text-muted-foreground">
            구매하신 게임에 대한 문제를 상세히 알려주세요. 정확한 정보를
            제공해주실수록 빠르게 도와드릴 수 있어요.
          </p>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">문제가 발생한 게임 선택</CardTitle>
          <div className="text-xs text-muted-foreground">
            문의하실 게임을 선택해주세요
          </div>
        </CardHeader>
        <CardContent className="space-y-1">
          <Select value={game} onValueChange={setGame}>
            <SelectTrigger className="max-w-md">
              <SelectValue placeholder="게임을 선택해주세요" />
            </SelectTrigger>
            <SelectContent>
              {purchased.map((g) => (
                <SelectItem key={g} value={g}>
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">문제 유형 선택</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {types.map((t) => (
            <label
              key={t}
              className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${
                selected.includes(t)
                  ? "border-primary bg-primary/5"
                  : "border-primary/20 hover:border-primary/40"
              }`}
            >
              <Checkbox
                checked={selected.includes(t)}
                onCheckedChange={() => toggleType(t)}
              />
              <span className="text-sm">{t}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">문제 상세 설명</CardTitle>
          <div className="text-xs text-muted-foreground">
            문제 상황과 발생 시점, 에러 메시지 등을 자세히 작성해주세요.
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            className="mb-4"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={7}
            placeholder={`예시)
- 언제부터 문제가 발생했는지
- 에러 메시지 또는 화면에 보이는 현상
- 시도해본 해결 방법이 있다면
`}
          />

          <div className="space-y-2">
            <div className="text-sm font-medium mb-2">
              스크린샷 첨부 (최대 5장)
            </div>

            {/* 파일 선택 버튼 + 전체 삭제(쓰레기통) 버튼을 같은 줄에 배치 */}
            <div className="flex items-center gap-3">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={onFiles}
                className="hidden"
              />

              <label
                htmlFor="file-upload"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                <Upload className="h-4 w-4 mr-2" />
                파일 선택
              </label>

              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() => setImages([])}
                  className="inline-flex items-center justify-center rounded-md border border-input bg-background p-2 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="첨부 이미지 모두 삭제"
                  title="첨부 이미지 모두 삭제"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>

            {!!images.length && (
              <div className="flex flex-wrap gap-3 pt-2">
                {images.map((im) => (
                  <img
                    key={im.id}
                    src={im.url}
                    alt="첨부"
                    className="h-16 w-16 object-cover rounded-md border border-primary/20"
                  />
                ))}
              </div>
            )}
          </div>

          {error && <div className="text-xs text-destructive">{error}</div>}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          일반적으로 24시간 이내에 답변드리며, 기술적 이슈는 더 소요될 수
          있습니다.
        </div>
        <Button
          onClick={submit}
          disabled={!valid || isSubmitting}
          className="px-6"
        >
          게임 문의 보내기
        </Button>
      </div>
      </div>
    </div>
  );
}

export default SupportInquiryNewPage;
