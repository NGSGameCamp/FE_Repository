import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Badge } from "../y_ui/base/badge";
import { Button } from "../y_ui/base/button";
import { Textarea } from "../y_ui/base/textarea";
import { useAuth } from "../auth/AuthContext";

type Post = {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  author?: string;
  date?: string;
  comments?: number;
  likes?: number;
};

type Comment = {
  id: string;
  author: string;
  date: string;
  text: string;
  replies?: Comment[];
};

function loadPost(id: string): Post | null {
  try {
    const raw = localStorage.getItem("community:posts");
    const arr = raw ? JSON.parse(raw) : [];
    const hit = Array.isArray(arr)
      ? arr.find((r: any) => String(r.id) === id)
      : null;
    return hit || null;
  } catch {
    return null;
  }
}

function loadComments(postId: string): Comment[] {
  try {
    const raw = localStorage.getItem(`community:comments:${postId}`);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveComments(postId: string, list: Comment[]) {
  try {
    localStorage.setItem(`community:comments:${postId}`, JSON.stringify(list));
  } catch {}
}

export default function CommunityPostDetailPage() {
  const { id = "" } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newText, setNewText] = useState("");
  const [replyFor, setReplyFor] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    setPost(loadPost(id));
    setComments(loadComments(id));
  }, [id]);

  const isAuthor = useMemo(() => {
    if (!post) return false;
    const me = user?.name || user?.email;
    return !!me && me === post.author;
  }, [post, user?.name, user?.email]);

  if (!post) {
    return (
      <div className="container mx-auto px-6 py-10">
        <Card className="border-primary/20">
          <CardContent className="py-10 text-center">
            게시글을 찾을 수 없습니다.
          </CardContent>
        </Card>
      </div>
    );
  }

  const addComment = () => {
    const t = newText.trim();
    if (!t) return;
    const c: Comment = {
      id: String(Date.now()),
      author: user?.name || user?.email || "게스트",
      date: new Date().toISOString(),
      text: t,
      replies: [],
    };
    const list = [c, ...comments];
    setComments(list);
    saveComments(id, list);
    setNewText("");
    // update comment count in post store
    try {
      const raw = localStorage.getItem("community:posts");
      const arr = raw ? JSON.parse(raw) : [];
      const idx = Array.isArray(arr)
        ? arr.findIndex((r: any) => String(r.id) === id)
        : -1;
      if (idx >= 0) {
        arr[idx].comments = (arr[idx].comments || 0) + 1;
        localStorage.setItem("community:posts", JSON.stringify(arr));
      }
    } catch {}
  };

  const addReply = (cid: string) => {
    const t = replyText.trim();
    if (!t) return;
    const list = comments.map((c) => {
      if (c.id !== cid) return c;
      const replies = [
        ...(c.replies || []),
        {
          id: String(Date.now()),
          author: user?.name || user?.email || "게스트",
          date: new Date().toISOString(),
          text: t,
        },
      ];
      return { ...c, replies };
    });
    setComments(list);
    saveComments(id, list);
    setReplyFor(null);
    setReplyText("");
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <div className="text-xs text-muted-foreground">
          <Link to="/community/all" className="text-primary hover:underline">
            전체 글
          </Link>{" "}
          · 토론
        </div>
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <div className="text-sm text-muted-foreground">
          작성자 {post.author || "익명"} ·{" "}
          {post.date ? new Date(post.date).toLocaleString("ko-KR") : "-"}
        </div>
        <div className="flex flex-wrap gap-2">
          {(post.tags || []).map((t) => (
            <Badge key={t} variant="outline" className="text-muted-foreground">
              #{t}
            </Badge>
          ))}
        </div>
        {isAuthor && (
          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              className="border-primary/30"
              onClick={() => nav(`/community/edit/${post.id}`)}
            >
              수정
            </Button>
          </div>
        )}
      </div>

      {/* Content */}
      <Card className="border-primary/20">
        <CardContent className="py-4">
          <div className="whitespace-pre-wrap text-sm">
            {post.content || post.excerpt || "내용이 없습니다."}
          </div>
        </CardContent>
      </Card>

      {/* Comments */}
      <div className="space-y-3">
        <div className="text-sm font-medium">댓글 {comments.length}</div>
        {comments.map((c) => (
          <Card key={c.id} className="border-primary/20">
            <CardContent className="py-3 space-y-2">
              <div className="text-xs text-muted-foreground">
                {c.author} • {new Date(c.date).toLocaleString("ko-KR")}
              </div>
              <div className="text-sm whitespace-pre-wrap">{c.text}</div>
              {/* replies */}
              {(c.replies || []).length > 0 && (
                <div className="mt-2 space-y-2 pl-4 border-l border-primary/20">
                  {c.replies!.map((r) => (
                    <div key={r.id} className="text-sm">
                      <div className="text-xs text-muted-foreground">
                        {r.author} • {new Date(r.date).toLocaleString("ko-KR")}
                      </div>
                      <div className="whitespace-pre-wrap">{r.text}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* reply box */}
              {replyFor === c.id ? (
                <div className="space-y-2">
                  <Textarea
                    rows={3}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="대댓글을 입력하세요"
                  />
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={() => addReply(c.id)}>
                      등록
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary/30"
                      onClick={() => {
                        setReplyFor(null);
                        setReplyText("");
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyFor(c.id)}
                >
                  답글
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {/* new comment */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-base">새 댓글</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Textarea
              rows={5}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="댓글을 입력하세요..."
            />
            <div className="text-right">
              <Button onClick={addComment}>등록</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
