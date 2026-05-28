"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link as LinkIcon, Loader2, ChevronDown, Share2, LogOut, ArrowLeft } from "lucide-react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useProfile } from "@/hooks/use-profile";
import { useLinks } from "@/hooks/use-links";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import dynamic from "next/dynamic";

const StatsDashboard = dynamic(() => import("@/components/dashboard/stats-dashboard"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center gap-3 py-20 my-auto">
      <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      <p className="text-xs text-slate-450">통계 데이터를 분석하는 중...</p>
    </div>
  ),
});

export default function StatsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth 상태 체크
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        // 비로그인 시 메인 페이지로 강제 리다이렉트
        setUser(null);
        setAuthLoading(false);
        router.replace("/");
        toast.error("통계를 보려면 로그인이 필요합니다.");
      } else {
        setUser(currentUser);
        setAuthLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  // React Query 프로필 정보 획득
  const { data: profileInfo, isLoading: profileLoading } = useProfile(user?.uid);
  
  // React Query 링크 목록 획득 (클릭 수 포함)
  const { data: links = [], isLoading: linksLoading } = useLinks(user?.uid);

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await signOut(auth);
      toast.success("로그아웃되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("Firebase 로그아웃 에러:", error);
      toast.error("로그아웃에 실패했습니다.");
      setAuthLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!user) return;
    const identifier = profileInfo?.username || user.uid;
    const shareUrl = `${window.location.origin}/${identifier}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("내 공유 링크가 복사되었습니다!");
  };

  const isLoading = authLoading || profileLoading;

  if (isLoading) {
    return (
      <div className="min-h-svh bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-xs text-slate-450">보안 인증 상태 확인 중...</p>
      </div>
    );
  }

  // user가 없을 경우 리다이렉트 처리 중이므로 로더를 유지
  if (!user) {
    return (
      <div className="min-h-svh bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        <p className="text-xs text-slate-450">로그인 페이지로 이동하는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-[#fbfbfa] text-slate-800 relative overflow-hidden flex flex-col font-sans">
      
      {/* 헤더 네비게이션 바 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* 로고 영역 */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
              <LinkIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              MyLink
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-bold ml-1 uppercase">
              Stats
            </span>
          </div>

          {/* 우측 네비게이션 & 드롭다운 */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/")}
              className="text-xs font-semibold hover:bg-slate-50 cursor-pointer hidden sm:flex items-center gap-1"
            >
              대시보드
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-[#f4f4f5]/60 hover:bg-[#e4e4e7]/60 border border-slate-200/80 rounded-full p-1 pl-1 pr-3 transition-all duration-200 focus:outline-none cursor-pointer">
                  <Avatar className="w-7 h-7 border border-slate-200/80 shadow-2xs">
                    {user.photoURL ? (
                      <AvatarImage src={user.photoURL} alt={user.displayName || "User"} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-slate-100 font-bold text-slate-600 text-xs">
                        {user.displayName?.[0] || "U"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <span className="text-xs font-semibold text-slate-650 max-w-[100px] truncate hidden sm:inline">
                    {profileInfo?.nickname || user.displayName || "사용자"}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent className="w-60 bg-white border border-slate-200 text-slate-700 rounded-xl shadow-md p-1.5 z-50" align="end">
                <DropdownMenuLabel className="font-normal p-2.5">
                  <div className="flex flex-col items-center text-center pb-2 border-b border-slate-100">
                    <Avatar className="w-12 h-12 mb-2 border border-slate-200 shadow-2xs">
                      {user.photoURL ? (
                        <AvatarImage src={user.photoURL} alt={user.displayName || "User"} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-slate-100 font-bold text-slate-600 text-base">
                          {user.displayName?.[0] || "U"}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-bold text-slate-800 text-sm">{profileInfo?.nickname || user.displayName || "사용자"}</span>
                    {user.email && (
                      <span className="text-xs text-slate-450 truncate w-full mt-0.5" title={user.email}>{user.email}</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                
                <div className="space-y-0.5">
                  <DropdownMenuItem
                    onClick={() => router.push("/")}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 rounded-lg cursor-pointer flex items-center gap-2"
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                    대시보드 가기
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={copyShareLink}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 focus:bg-slate-50 focus:text-slate-800 rounded-lg cursor-pointer flex items-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-400" />
                    내 공유 링크 복사
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-slate-100" />
                  
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:bg-red-50 focus:text-red-650 rounded-lg px-3 py-2 flex items-center gap-2 cursor-pointer text-xs font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    로그아웃
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* 메인 통계 영역 */}
      <main className="flex-1 flex flex-col items-center py-6">
        {linksLoading ? (
          <div className="flex flex-col items-center gap-3 py-20 my-auto">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            <p className="text-xs text-slate-450">통계 데이터를 분석하는 중...</p>
          </div>
        ) : (
          <StatsDashboard
            links={links}
            username={profileInfo?.username || ""}
          />
        )}
      </main>
      
      {/* 푸터 */}
      <footer className="w-full py-6 text-center border-t border-slate-100 bg-white text-slate-400 text-[10px] uppercase tracking-wider mt-auto z-10">
        &copy; 2026 MyLink. Built with Notion style layout.
      </footer>

      {/* 토스트 컨테이너 */}
      <Toaster position="bottom-center" toastOptions={{
        className: "bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl p-4 shadow-xl",
      }} />
    </div>
  );
}
