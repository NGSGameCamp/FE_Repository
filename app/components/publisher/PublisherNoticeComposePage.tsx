import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function PublisherNoticeComposePage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#050716] py-16 px-6 text-white">
      <div className="mx-auto w-full max-w-3xl">
        <Card className="border border-white/10 bg-[#0b1120]/95 text-white">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">새 공지 작성</CardTitle>
            <p className="text-sm text-white/60">
              실제 작성 기능은 아직 연결되지 않았습니다. 정식 서비스 시 배급사 전용 에디터가 열립니다.
            </p>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-sm text-white/70">
              현재는 목업 상태의 페이지이며, 공지 작성 워크플로우 연결 전까지 안내 메시지를 표시합니다.
            </p>
            <Button asChild className="self-start">
              <Link to="/publisher/notices">공지 목록으로 돌아가기</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
