import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type NewPost = {
  id: string;
  title: string;
  excerpt: string;
  content?: string;
  tags: string[];
  author: string;
  date: string; // ISO
  comments: number;
  likes: number;
  type: "토론" | "스크린샷" | "가이드" | "리뷰" | "방송" | "워크샵";
};

function savePost(p: NewPost) {
  try {
    const raw = localStorage.getItem("community:posts");
    const arr = raw ? JSON.parse(raw) : [];
    arr.unshift(p);
    localStorage.setItem("community:posts", JSON.stringify(arr));
  } catch {}
}

export default function CommunityWritePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = () => {
    setError(null);
    if (!title.trim()) return setError("제목을 입력하세요.");
    if (content.trim().length < 10) return setError("내용을 10자 이상 입력하세요.");
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const excerpt = content.trim().split(/\n+/)[0].slice(0, 140);
    const rec: NewPost = {
      id: String(Date.now()),
      title: title.trim(),
      excerpt,
      content: content.trim(),
      tags: tagList,
      author: user?.name || user?.email || "게스트",
      date: new Date().toISOString(),
      comments: 0,
      likes: 0,
      type: "토론",
    };
    savePost(rec);
    navigate("/community/all");
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">글 쓰기</h2>
        <p className="text-sm text-muted-foreground">
          로컬 저장 데모 — 등록 후 전체 글 페이지로 이동합니다.
        </p>
      </div>

      <Card className="border-primary/20 mx-auto max-w-[900px] w-full">
        <CardHeader>
          <CardTitle className="text-base">새 글 작성</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">제목</div>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="space-y-2 mt-2">
            <div className="text-sm text-muted-foreground">태그</div>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="쉼표로 구분 (예: 레이드,가이드)"
            />
          </div>

          <div className="space-y-2 mt-2">
            <div className="text-sm text-muted-foreground">내용</div>
            <Textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 작성하세요. 빈 줄로 단락이 구분됩니다."
            />
          </div>

          {error && <div className="text-xs text-destructive">{error}</div>}
        </CardContent>

        {/* 카드 우측 정렬: 왼쪽에 flex-1 스페이서를 두고 버튼을 오른쪽으로 밀기 */}
        <CardFooter className="flex items-center gap-2 p-6 pt-0">
          <div className="flex-1" />
          <Button
            variant="outline"
            className="border-primary/30"
            onClick={() => navigate(-1)}
          >
            취소
          </Button>
          <Button onClick={onSubmit}>등록</Button>
        </CardFooter>
      </Card>
    </div>
  );
}