import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../y_ui/base/card";
import { Badge } from "../y_ui/base/badge";
import { Button } from "../y_ui/base/button";
import { Separator } from "../y_ui/base/separator";
import {
  getCommunityBoardDetail,
} from "../../api/community/communityApi";
import type {
  CommunityBoard,
  CommunityBoardDetail,
  CommunityPost,
} from "../../api/community/types";

export default function CommunityBoardPage() {
  const params = useParams();
  const boardId = params.id || "";
  const [detail, setDetail] = useState<CommunityBoardDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMock, setUsingMock] = useState<boolean>(false);
  const [tab, setTab] = useState<"posts" | "media">("posts");
  const [followed, setFollowed] = useState(false);

  useEffect(() => {
    let canceled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, isMock } = await getCommunityBoardDetail(boardId);
        if (!canceled) {
          setDetail(data);
          setUsingMock(isMock);
        }
      } catch (err) {
        if (!canceled) {
          setDetail(null);
          setError(
            err instanceof Error
              ? err.message
              : "게시판 정보를 불러오는 중 오류가 발생했습니다."
          );
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    if (boardId) {
      load();
    }

    return () => {
      canceled = true;
    };
  }, [boardId]);

  const board = detail?.board ?? null;
  const posts = detail?.posts ?? [];
  const media = detail?.media ?? [];

  useEffect(() => {
    try {
      const raw = localStorage.getItem("community:follows");
      const set = new Set<string>(raw ? JSON.parse(raw) : []);
      setFollowed(set.has(boardId));
    } catch {}
  }, [boardId]);

  const toggleFollow = () => {
    if (!boardId) return;
    try {
      const raw = localStorage.getItem("community:follows");
      const arr: string[] = raw ? JSON.parse(raw) : [];
      const set = new Set(arr);
      if (set.has(boardId)) set.delete(boardId);
      else set.add(boardId);
      localStorage.setItem(
        "community:follows",
        JSON.stringify(Array.from(set))
      );
      setFollowed((v) => !v);
    } catch {}
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-10">
        <Card className="border-primary/20">
          <CardContent className="py-10 text-center">로딩 중...</CardContent>
        </Card>
      </div>
    );
  }

  if (!board) {
    return (
      <div className="container mx-auto px-6 py-10">
        <Card className="border-primary/20">
          <CardContent className="py-10 text-center">
            존재하지 않는 게시판입니다.
            {error && <div className="mt-4 text-sm text-destructive">{error}</div>}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-0 md:px-6 py-6 space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-primary/20">
        <div
          className="h-56 sm:h-64 md:h-72 w-full"
          style={{
            backgroundImage: `linear-gradient( to right, rgba(2,6,23,0.6), rgba(2,6,23,0.1) ), url(${
              board.hero ||
              "https://images.unsplash.com/photo-1542751371-adc38448a05e"
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 flex items-end">
          <div className="w-full p-6 md:p-8 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{board.name}</h1>
              <div className="mt-2 flex flex-wrap gap-2">
                {(board.genres || board.tags).map((t) => (
                  <Badge
                    key={t}
                    variant="secondary"
                    className="bg-primary/15 text-primary border border-primary/30"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
              {board.type === "game" && (
                <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-3">
                  {board.concurrent && <span>{board.concurrent}</span>}
                  {typeof board.rating === "number" && (
                    <span>
                      평점 {board.rating.toFixed(1)} (
                      {board.ratingCount?.toLocaleString()})
                    </span>
                  )}
                  {board.released && <span>출시 {board.released}</span>}
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={followed ? "default" : "outline"}
                className={followed ? "" : "border-primary/30"}
                onClick={toggleFollow}
              >
                {followed ? "팔로잉" : "팔로우"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div
        className="grid gap-6 lg:grid-cols-[2fr_1fr]"
        style={{ alignItems: "start" }}
      >
        <div className="space-y-6">
          {/* 최신 공지 */}
          <Card className="border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">최신 공지</CardTitle>
              <Button size="sm" variant="ghost">
                모두 보기
              </Button>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-md border border-primary/20 p-3">
                2025.09.08 · 버전 1.2 — 레이드 매칭 및 직업 밸런스 조정
              </div>
              <div className="rounded-md border border-primary/20 p-3">
                2025.08.22 · 주간 점검 안내
              </div>
            </CardContent>
          </Card>

          {/* 인기 토론 */}
          <Card className="border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">인기 토론</CardTitle>
              <Button size="sm" variant="ghost">
                더 보기
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {posts.map((p) => (
                <div
                  key={p.id}
                  className="rounded-md border border-primary/20 p-3"
                >
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    댓글 {p.comments} · 추천 {p.likes} ·{" "}
                    {new Date(p.date).toLocaleDateString("ko-KR")}
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  게시글이 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {/* 스크린샷 */}
          <Card className="border-primary/20">
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">스크린샷</CardTitle>
              <Button size="sm" variant="ghost">
                더 보기
              </Button>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {media.slice(0, 6).map((src, i) => (
                <div
                  key={i}
                  className="rounded-lg overflow-hidden border border-primary/20"
                >
                  <img src={src} className="w-full h-32 object-cover" />
                </div>
              ))}
              {media.length === 0 && (
                <div className="text-sm text-muted-foreground">
                  등록된 미디어가 없습니다.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {board.type === "game" && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">게임 정보</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="text-muted-foreground">{board.info}</div>
                <Separator />
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-muted-foreground">
                  <div>개발사</div>
                  <div>Studio NGS</div>
                  <div>퍼블리셔</div>
                  <div>{board.publisher?.name || "—"}</div>
                  <div>지원</div>
                  <div>컨트롤러, 자막 한글</div>
                </div>
              </CardContent>
            </Card>
          )}

          {board.publisher && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-base">공식 링크</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <a className="text-primary hover:underline" href="#">
                  공식 홈페이지
                </a>
                <a className="text-primary hover:underline" href="#">
                  패치 노트
                </a>
                <a className="text-primary hover:underline" href="#">
                  고객 지원
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
