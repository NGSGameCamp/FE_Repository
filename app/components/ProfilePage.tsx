import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { useAuth } from "./auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const email = user?.email || "guest";
  const avatarKey = `profile:avatar:${email}`;
  const [avatar, setAvatar] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try { setAvatar(localStorage.getItem(avatarKey)); } catch {}
  }, [avatarKey]);

  const changeAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result);
      try { localStorage.setItem(avatarKey, data); } catch {}
      setAvatar(data);
    };
    reader.readAsDataURL(f);
    e.currentTarget.value = "";
  };

  const followingBoards: string[] = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("community:follows") || "[]"); } catch { return []; }
  }, []);

  const followingGames: string[] = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("followingGames") || "[]"); } catch { return []; }
  }, []);

  const myPosts: any[] = useMemo(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("community:posts") || "[]");
      const me = user?.name || user?.email || "게스트";
      return Array.isArray(raw) ? raw.filter((p: any) => p.author === me).slice(0, 5) : [];
    } catch { return []; }
  }, [user?.name, user?.email]);

  const addToCart = () => {
    const extra = JSON.parse(localStorage.getItem("cartExtraItems") || "[]");
    extra.push({ id: `extra-profile-${Date.now()}`, title: "프로필 데모 아이템", platform: "디지털 다운로드", price: 1000, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=200&q=60", extra: true });
    localStorage.setItem("cartExtraItems", JSON.stringify(extra));
    navigate("/cart");
  };

  return (
    <div className="container mx-auto px-6 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">내 프로필</h2>
        <div className="flex gap-2">
        </div>
      </div>

      {/* Avatar + basic */}
      <Card className="border-primary/20">
        <CardHeader><CardTitle className="text-base">프로필</CardTitle></CardHeader>
        <CardContent className="flex items-center gap-4">
          <img src={avatar || "https://avatars.githubusercontent.com/u/9919?v=4"} alt="avatar" className="h-16 w-16 rounded-full border border-primary/20 object-cover" />
          <div className="flex-1">
            <div className="font-medium">{user?.name || user?.email || "게스트"}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={changeAvatar} />
            <Button size="sm" variant="outline" className="border-primary/30 mt-2" onClick={() => inputRef.current?.click()}>프로필 이미지 수정</Button>
           <Button size="sm" variant="outline" className="border-primary/30 mt-2"><Link to="/user06">내 정보</Link></Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Owned / Following games */}
        <Card className="border-primary/20">
          <CardHeader><CardTitle className="text-base">보유/팔로우 게임</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            {followingGames.length === 0 && <div className="text-muted-foreground">팔로우한 게임이 없습니다.</div>}
            {followingGames.map((g) => (
              <div key={g} className="rounded-md border border-primary/20 p-2">{g}</div>
            ))}
          </CardContent>
        </Card>

        {/* Following Boards */}
        <Card className="border-primary/20">
          <CardHeader><CardTitle className="text-base">팔로잉 유저</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            {followingBoards.length === 0 && <div className="text-muted-foreground">팔로우 중인 유저가 없습니다.</div>}
            {followingBoards.map((b) => (
              <div key={b} className="rounded-md border border-primary/20 p-2">{b}</div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader><CardTitle className="text-base">구독 중인 배급사</CardTitle></CardHeader>
          <CardContent className="text-sm space-y-2">
            {followingBoards.length === 0 && <div className="text-muted-foreground">구독 중인 배급사가 없습니다.</div>}
            {followingBoards.map((b) => (
              <div key={b} className="rounded-md border border-primary/20 p-2">{b}</div>
            ))}
          </CardContent>
        </Card>

        {/* Recent posts */}
        <Card className="border-primary/20 lg:col-span-2">
          <CardHeader><CardTitle className="text-base">최근 작성한 포스트</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {myPosts.length === 0 && <div className="text-muted-foreground">작성한 포스트가 없습니다.</div>}
            {myPosts.map((p) => (
              <div key={p.id} className="rounded-md border border-primary/20 p-3">
                <div className="font-medium">{p.title}</div>
                <div className="text-xs text-muted-foreground">{new Date(p.date || Date.now()).toLocaleString("ko-KR")}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

