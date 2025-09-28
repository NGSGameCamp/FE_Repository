import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Input } from "../y_ui/base/input";
import { Textarea } from "../y_ui/base/textarea";
import { Button } from "../y_ui/base/button";

type StoredPost = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  author?: string;
  date?: string;
  comments?: number;
  likes?: number;
  type?: string;
};

function loadPost(id: string): StoredPost | null {
  try {
    const raw = localStorage.getItem("community:posts");
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return null;
    const hit = arr.find((r: any) => String(r.id) === String(id));
    return hit || null;
  } catch {
    return null;
  }
}

function savePost(updated: StoredPost) {
  try {
    const raw = localStorage.getItem("community:posts");
    const arr = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(arr)) return;
    const idx = arr.findIndex((r: any) => String(r.id) === String(updated.id));
    if (idx >= 0) arr[idx] = updated;
    else arr.unshift(updated);
    localStorage.setItem("community:posts", JSON.stringify(arr));
  } catch {}
}

export default function CommunityEditPage() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const p = loadPost(id);
    if (p) {
      setTitle(p.title || "");
      setTags((p.tags || []).join(","));
      setContent(p.content || p.excerpt || "");
    }
    setLoaded(true);
  }, [id]);

  if (!loaded) return null;

  const onSave = () => {
    setError(null);
    if (!title.trim()) return setError("제목을 입력하세요.");
    if (content.trim().length < 10)
      return setError("내용을 10자 이상 입력하세요.");
    const tagList = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const updated: StoredPost = {
      id: id,
      title: title.trim(),
      excerpt: content.trim().split(/\n+/)[0].slice(0, 140),
      content: content.trim(),
      tags: tagList,
    };
    savePost(updated);
    navigate("/community/all");
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">글 수정</h2>
        <p className="text-sm text-muted-foreground">
          로컬 저장 데모 — 저장 후 전체 글 페이지로 이동합니다.
        </p>
      </div>

      <Card className="border-primary/20 mx-auto" style={{ maxWidth: 900 }}>
        <CardHeader>
          <CardTitle className="text-base">기존 글 수정</CardTitle>
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
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">태그</div>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="쉼표로 구분 (예: 레이드,가이드)"
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">내용</div>
            <Textarea
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 수정하세요"
            />
          </div>
          {error && <div className="text-xs text-destructive">{error}</div>}
          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              className="border-primary/30"
              onClick={() => navigate(-1)}
            >
              취소
            </Button>
            <Button onClick={onSave}>저장</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
