"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Loader2, LogIn, LogOut, ChevronDown, Share2 } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { onAuthStateChanged, signInWithPopup, signOut, User } from "firebase/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { useProfile } from "@/hooks/use-profile";

// 신규 랜딩 컴포넌트 임포트
import LandingHero from "@/components/landing/landing-hero";
import LandingPreview from "@/components/landing/landing-preview";
import LandingFeatures from "@/components/landing/landing-features";
import LandingSteps from "@/components/landing/landing-steps";
import LandingFaq from "@/components/landing/landing-faq";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tempUsername, setTempUsername] = useState("");

  // Auth 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // React Query 프로필 정보 획득
  const { data: profileInfo, isLoading: profileLoading } = useProfile(user?.uid);

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

  const handleStartWithUsername = async (username: string) => {
    setTempUsername(username);
    await handleLogin();
  };

  const handleLogout = async () => {
    try {
      setAuthLoading(true);
      await signOut(auth);
      toast.success("로그아웃되었습니다.");
      setTempUsername(""); // 로그아웃 시 가상 주소 상태도 초기화
    } catch (error) {
      console.error("Firebase 로그아웃 에러:", error);
      toast.error("로그아웃에 실패했습니다.");
    } finally {
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

  return (
    <div className="min-h-svh bg-white text-slate-800 relative overflow-hidden flex flex-col font-sans">
      
      {/* 헤더 네비게이션 바 */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* 로고 영역 */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer hover:opacity-85 transition-opacity">
            <div className="w-7.5 h-7.5 rounded-lg bg-slate-900 flex items-center justify-center shadow-xs">
              <LinkIcon className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900">
              MyLink
            </span>
          </Link>

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
            <p className="text-xs text-slate-450 font-medium">데이터를 로드하는 중...</p>
          </div>
        ) : !user ? (
          // 비로그인 사용자용 고도화된 반응형 프리미엄 랜딩 페이지
          <div className="w-full bg-slate-50/40">
            
            {/* 1. 히어로 섹션 (가상 주소 입력 필드 포함) */}
            <LandingHero onStart={handleStartWithUsername} isLoading={authLoading} />
            
            {/* 2. 인터랙티브 프리뷰 (실시간 테마 쇼룸) */}
            <LandingPreview />
            
            {/* 3. 4대 주요 핵심 기능 그리드 */}
            <LandingFeatures />
            
            {/* 4. 서비스 동작 원리 3단계 안내 */}
            <LandingSteps />
            
            {/* 5. 자주 묻는 질문 FAQ (아코디언) */}
            <LandingFaq />

            {/* 6. 하단 CTA (최종 가입 유도 그라데이션 배너) */}
            <div className="w-full max-w-5xl mx-auto px-6 pb-24 pt-12 text-center relative overflow-hidden">
              <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-xl border border-slate-800">
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="max-w-2xl mx-auto space-y-6 relative z-10 flex flex-col items-center">
                  <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    지금 바로 나만의 마이링크를 무료로 만들어 보세요
                  </h2>
                  <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed font-medium">
                    복잡한 가입 과정 없이 Google 계정 하나만으로 즉시 포트폴리오, 블로그, SNS를 아우르는 원페이지 프로필을 생성할 수 있습니다.
                  </p>
                  <Button
                    onClick={handleLogin}
                    disabled={authLoading}
                    className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold h-12 px-8 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:-translate-y-0.5 transition-all text-xs sm:text-sm mt-4"
                  >
                    {authLoading ? (
                      <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4.5 h-4.5" />
                        Google 계정으로 바로 시작하기
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
          </div>
        ) : (
          // 로그인 사용자 대시보드 (온보딩 및 기존 대시보드 셸)
          <DashboardShell 
            user={user} 
            onLogout={handleLogout} 
            profileInfo={{
              nickname: profileInfo?.nickname || user.displayName || "사용자",
              bio: profileInfo?.bio || "",
              theme: profileInfo?.theme || "notion-white",
              username: profileInfo?.username || tempUsername || "", // 가상 주소 선점 정보 연동
              snsLinks: profileInfo?.snsLinks || {},
            }}
            loadingProfile={profileLoading}
          />
        )}
      </main>
      
      {/* 푸터 */}
      <footer className="w-full py-6 text-center border-t border-slate-100 bg-white text-slate-400 text-[10px] uppercase tracking-wider mt-auto z-10 font-mono font-bold">
        &copy; 2026 MyLink. Built with Notion style layout.
      </footer>
    </div>
  );
}
