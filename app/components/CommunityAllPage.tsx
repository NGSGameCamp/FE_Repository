import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Link } from "react-router-dom";

type Post = {
  id: string;
  title: string;
  excerpt: string;
  type: "토론" | "스크린샷" | "가이드" | "리뷰" | "방송" | "워크샵";
  tags: string[];
  author: string;
  date: string; // ISO
  comments: number;
  likes: number;
};

const seedPosts: Post[] = [
  { id: "a1", title: "레이드 매칭 개선 아이디어 공유", excerpt: "대기 시간을 줄이고 포지션 충족도를 높이기 위한 매칭 개선 아이디어를 정리했습니다.", type: "토론", tags: ["레이드", "매칭"], author: "RaiderKim", date: new Date(Date.now() - 2*60*60*1000).toISOString(), comments: 89, likes: 241 },
  { id: "a2", title: "엔드게임 성장 루트 총정리", excerpt: "자원 수급과 세팅 우선순위를 단계별로 안내합니다.", type: "가이드", tags: ["엔드게임", "성장"], author: "이수현", date: new Date(Date.now() - 3*24*60*60*1000).toISOString(), comments: 12, likes: 97 },
  { id: "a3", title: "커뮤니티 스크린샷 콘테스트 하이라이트", excerpt: "지난달 수상작을 모아봤습니다. 광원과 구도가 훌륭한 작품들!", type: "스크린샷", tags: ["아트", "콘테스트"], author: "Jin Park", date: new Date(Date.now() - 30*24*60*60*1000).toISOString(), comments: 21, likes: 180 },
  { id: "a4", title: "패치 1.2 밸런스 체감 리뷰", excerpt: "힐러 관점에서 달라진 로테이션과 파티 시너지를 분석했습니다.", type: "리뷰", tags: ["패치", "밸런스"], author: "HealerJ", date: new Date(Date.now() - 5*24*60*60*1000).toISOString(), comments: 33, likes: 120 },
  { id: "a5", title: "초보자 질문 모음 (9월)", excerpt: "처음 시작할 때 필수로 알아두면 좋은 팁들입니다.", type: "가이드", tags: ["뉴비", "팁"], author: "Newbie", date: new Date(Date.now() - 60*60*1000).toISOString(), comments: 54, likes: 210 },
];

const allTypes = ["전체", "토론", "스크린샷", "가이드", "리뷰", "방송", "워크샵"] as const;
const periodOptions = ["전체", "오늘", "이번 주", "이번 달"] as const;
const popularTags = ["레이드", "매칭", "가이드", "뉴비", "아트", "패치", "밸런스"];

function inPeriod(dateISO: string, period: typeof periodOptions[number]) {
  const d = new Date(dateISO).getTime();
  const now = Date.now();
  if (period === "전체") return true;
  if (period === "오늘") return d >= now - 1 * 24 * 60 * 60 * 1000;
  if (period === "이번 주") return d >= now - 7 * 24 * 60 * 60 * 1000;
  if (period === "이번 달") return d >= now - 30 * 24 * 60 * 60 * 1000;
  return true;
}

export default function CommunityAllPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<(typeof allTypes)[number]>("전체");
  const [period, setPeriod] = useState<(typeof periodOptions)[number]>("전체");
  const [tagFilters, setTagFilters] = useState<string[]>([]);
  const [sort, setSort] = useState<"최신" | "인기" | "댓글순">("최신");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => { setPage(1); }, [query, type, period, tagFilters.join("|"), sort]);

  const filtered = useMemo(() => {
    // merge local posts with seeds
// {/* Right: filters */}
// <div className="space-y-4">
//   <Card className="border-primary/20">
//     <CardHeader>
//       <CardTitle className="text-base">유형</CardTitle>
//     </CardHeader>
//     <CardContent className="flex flex-wrap gap-2">
//       {allTypes.map((t) => (
//         <Button key={t} size="sm" variant={type === t ? "default" : "outline"} className={type === t ? "" : "border-primary/30"} onClick={() => setType(t)}>{t}</Button>
//       ))}
//       <Button size="sm" variant="ghost" onClick={() => setType("전체")}>초기화</Button>
//     </CardContent>
//   </Card>

//   <Card className="border-primary/20">
//     <CardHeader>
//       <CardTitle className="text-base">기간</CardTitle>
//     </CardHeader>
//     <CardContent className="flex flex-wrap gap-2">
//       {periodOptions.map((p) => (
//         <Button key={p} size="sm" variant={period === p ? "default" : "outline"} className={period === p ? "" : "border-primary/30"} onClick={() => setPeriod(p)}>{p}</Button>
//       ))}
//     </CardContent>
//   </Card>

//   <Card className="border-primary/20">
//     <CardHeader>
//       <CardTitle className="text-base">인기 태그</CardTitle>
//     </CardHeader>
//     <CardContent className="flex flex-wrap gap-2">
//       {popularTags.map((t) => (
//         <Button key={t} size="sm" variant={tagFilters.includes(t) ? "default" : "outline"} className={tagFilters.includes(t) ? "" : "border-primary/30"} onClick={() => toggleTag(t)}>{t}</Button>
//       ))}
//       {!!tagFilters.length && (
//         <Button size="sm" variant="ghost" onClick={() => setTagFilters([])}>초기화</Button>
//       )}
//     </CardContent>
//   </Card>
// </div>
    let local: Post[] = [];
    try {
      const raw = localStorage.getItem("community:posts");
      const arr = raw ? JSON.parse(raw) : [];
      if (Array.isArray(arr)) {
        local = arr.map((r: any) => ({
          id: String(r.id),
          title: String(r.title),
          excerpt: String(r.excerpt || ""),
          tags: Array.isArray(r.tags) ? r.tags : [],
          author: String(r.author || "익명"),
          date: String(r.date || new Date().toISOString()),
          comments: Number(r.comments || 0),
          likes: Number(r.likes || 0),
          type: (r.type as Post["type"]) || "토론",
        })) as Post[];
      }
    } catch {}

    let list = [...local, ...seedPosts];
    if (type !== "전체") list = list.filter((p) => p.type === type);
    if (period !== "전체") list = list.filter((p) => inPeriod(p.date, period));
    if (tagFilters.length) list = list.filter((p) => tagFilters.some((t) => p.tags.includes(t)));
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((p) => [p.title, p.excerpt, p.author, ...p.tags].some((v) => String(v).toLowerCase().includes(q)));

    if (sort === "최신") list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sort === "인기") list.sort((a, b) => b.likes - a.likes);
    if (sort === "댓글순") list.sort((a, b) => b.comments - a.comments);
    return list;
  }, [query, type, period, tagFilters, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleTag = (t: string) => setTagFilters((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  return (
    <div className="container mx-auto px-6 py-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
      {/* Left: list */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">전체 글</h2>
          <p className="text-sm text-muted-foreground mb-4">커뮤니티의 모든 게시글을 검색하고 필터링하세요.</p>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Input placeholder="게시글 검색 (제목, 태그, 작성자)" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-md mb-4" />
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">표시:</span>
            {(["최신", "인기", "댓글순"] as const).map((s) => (
              <Button key={s} size="sm" variant={sort === s ? "default" : "outline"} className={sort === s ? "" : "border-primary/30"} onClick={() => setSort(s)}>
                {s}
              </Button>
            ))}
          <div className="flex justify-end">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="border-primary/30"
            >
              <Link to="/community/write">글쓰기</Link>
            </Button>
          </div>
          </div>
        </div>

        {pageItems.map((p) => (
          <Link
            key={p.id}
            to={`/community/post/${p.id}`}
            className="block group"
            aria-label={`${p.title} 게시글로 이동`}
          >
            <Card className="border-primary/20 transition-colors transition-shadow hover:shadow-md group-hover:border-primary/40 group-hover:bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base group-hover:text-primary">{p.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">{p.excerpt}</p>

                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="outline" className="text-muted-foreground">
                      #{t}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-muted-foreground flex items-center gap-3">
                  <span>작성자 {p.author}</span>
                  <span>댓글 {p.comments}</span>
                  <span>좋아요 {p.likes}</span>
                  <span>
                    {new Date(p.date).toLocaleDateString("ko-KR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}

        {/* Pagination */}
        <div className="flex items-center justify-end gap-2 text-white">
          <Button size="sm" variant="outline" className="border-primary/30" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>이전</Button>
          <span className="text-sm">{page} / {totalPages}</span>
          <Button size="sm" variant="outline" className="border-primary/30" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>다음</Button>
        </div>
      </div>

    </div>
  );
}
