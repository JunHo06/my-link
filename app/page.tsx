"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Loader2, LogIn, LogOut, ChevronDown, Share2, Sparkles, Smartphone, Layers, ShieldCheck } from "lucide-react";
import { db, auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardShell from "@/components/dashboard/dashboard-shell";
import { toast } from "sonner";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      setAuthLoading(true);
      await signInWithPopup(auth, googleProvider);
      toast.success("로그인되었습니다.");
    } catch (error) {
      console.error("Firebase 로그인 에러:", error);
      toast.error("로그인에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await signOut(auth);
      toast.success("로그아웃되었습니다.");
    } catch (error) {
      console.error("Firebase 로그아웃 에러:", error);
      toast.error("로그아웃에 실패했습니다.");
    } finally {
      setAuthLoading(false);
    }
  };

  const copyShareLink = () => {
    if (!user) return;
    const shareUrl = `${window.location.origin}/${user.uid}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("내 공유 링크가 복사되었습니다!");
  };

  return (
    <div className="min-h-svh bg-white text-slate-800 relative overflow-hidden flex flex-col font-sans">
      
      {/* 헤더 네비게이션 바 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* 로고 영역 */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
              <LinkIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              MyLink
            </span>
          </div>

          {/* 우측 로그인/사용자 드롭다운 */}
          <div className="flex items-center gap-4">
            {authLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
            ) : user ? (
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
                      {user.displayName || "사용자"}
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
                      <span className="font-bold text-slate-800 text-sm">{user.displayName || "사용자"}</span>
                      {user.email && (
                        <span className="text-xs text-slate-400 truncate w-full mt-0.5" title={user.email}>{user.email}</span>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  
                  <div className="space-y-0.5">
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
            ) : (
              <Button
                onClick={handleLogin}
                className="bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs shadow-xs rounded-lg px-4 py-2 flex items-center gap-1.5 cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                로그인
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* 메인 영역 */}
      <main className={`flex-1 flex flex-col items-center justify-center relative z-10 ${user ? "bg-[#fbfbfa]" : "bg-white"}`}>
        {authLoading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            <p className="text-xs text-slate-450">데이터를 로드하는 중...</p>
          </div>
        ) : !user ? (
          // 비로그인 사용자 랜딩 및 로그인 페이지 (노션 스타일 미니멀 화이트)
          <div className="w-full max-w-4xl px-6 py-16 md:py-24 flex flex-col items-center text-center space-y-12">
            
            {/* 상단 뱃지 및 메인 카피 */}
            <div className="space-y-4.5 max-w-2xl animate-in fade-in slide-in-from-bottom-5 duration-400">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-500 text-[11px] font-semibold mb-1">
                <Sparkles className="w-3 h-3 text-slate-400" />
                Notion-style Link Tree
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
                모든 링크를 하나의 <br />
                <span className="underline decoration-slate-350 decoration-4 underline-offset-6">
                  심플한 프로필 페이지
                </span>
                에 담으세요.
              </h1>
              <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
                인스타그램, 깃허브, 블로그 등 흩어져 있는 개인 링크들을 단 하나의 깔끔한 정리 장표로 생성해 소통해보세요.
              </p>
            </div>

            {/* 로그인 시작하기 버튼 */}
            <div className="animate-in fade-in slide-in-from-bottom-7 duration-450">
              <Button
                onClick={handleLogin}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xs transition-transform hover:-translate-y-0.5 active:translate-y-0 rounded-lg h-12.5 px-8 flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <LogIn className="w-4 h-4" />
                Google 계정으로 시작하기
              </Button>
            </div>

            {/* 기능 하이라이트 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-3xl pt-6 text-left animate-in fade-in slide-in-from-bottom-9 duration-500">
              {/* 기능 1 */}
              <Card className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Smartphone className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">실시간 미리보기</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  정보를 바꾸거나 순서를 드래그 정렬하는 순간 오른쪽 가상 뷰어 스크린에 변경사항이 즉각 반영됩니다.
                </p>
              </Card>

              {/* 기능 2 */}
              <Card className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">노션형 모노 테마</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  노션 화이트/그레이, 웜 샌드 등 눈이 편안하고 차분한 파스텔 배경 프리셋을 자유롭게 스왑합니다.
                </p>
              </Card>

              {/* 기능 3 */}
              <Card className="p-5 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">직관적인 관리 도구</h3>
                <p className="text-[11px] text-slate-450 leading-relaxed">
                  인라인 편집기, 노션 스타일 공개 여부 스위치, 삭제 취소 피드백 기능 등으로 사용 동선을 최적화합니다.
                </p>
              </Card>
            </div>
            
          </div>
        ) : (
          // 로그인 사용자 대시보드
          <DashboardShell user={user} onLogout={handleLogout} />
        )}
      </main>
      
      {/* 푸터 */}
      <footer className="w-full py-6 text-center border-t border-slate-100 bg-white text-slate-400 text-[10px] uppercase tracking-wider mt-auto z-10">
        &copy; 2026 MyLink. Built with Notion style layout.
      </footer>
    </div>
  );
}
