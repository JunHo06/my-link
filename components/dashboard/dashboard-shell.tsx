"use client";

import { User } from "firebase/auth";
import { LinkItem } from "@/data/links";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, User as UserIcon, ExternalLink, BarChart2 } from "lucide-react";
import { useRouter } from "next/navigation";
import LinkManager from "./link-manager";
import ProfileEditor from "./profile-editor";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useLinks } from "@/hooks/use-links";

export interface DashboardLinkItem extends LinkItem {
  active?: boolean;
  order?: number;
  clicks?: number;
}

export interface ProfileInfo {
  nickname: string;
  bio: string;
  theme: string;
  username?: string;
  snsLinks: {
    instagram?: string;
    youtube?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface DashboardShellProps {
  user: User;
  onLogout: () => void;
  profileInfo: ProfileInfo;
  loadingProfile: boolean;
}

export default function DashboardShell({ user, onLogout, profileInfo, loadingProfile }: DashboardShellProps) {
  const router = useRouter();
  // React Query 기반 링크 목록 획득
  const { data: links = [], isLoading: loadingLinks } = useLinks(user.uid);

  const handleOpenPreview = () => {
    const username = profileInfo.username?.trim();
    if (!username) {
      toast.error("먼저 프로필 설정에서 고유 주소 아이디(Username)를 설정해 주세요!");
      return;
    }
    window.open(`/${username}`, "_blank");
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
      <Tabs defaultValue="links" className="w-full">
        {/* 노션 스타일의 플랫 언더라인 탭 리스트 */}
        <TabsList className="flex bg-transparent border-b border-slate-200 rounded-none p-0 mb-6 w-full justify-between items-center h-auto">
          <div className="flex gap-6">
            <TabsTrigger
              value="links"
              className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 text-slate-400 data-[state=active]:text-slate-800 bg-transparent data-[state=active]:bg-transparent shadow-none transition-all py-2.5 h-auto font-bold text-sm cursor-pointer px-1 focus:outline-none"
            >
              <Link2 className="w-4 h-4" />
              링크 관리
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="flex items-center gap-1.5 rounded-none border-b-2 border-transparent data-[state=active]:border-slate-800 text-slate-400 data-[state=active]:text-slate-800 bg-transparent data-[state=active]:bg-transparent shadow-none transition-all py-2.5 h-auto font-bold text-sm cursor-pointer px-1 focus:outline-none"
            >
              <UserIcon className="w-4 h-4" />
              프로필 설정
            </TabsTrigger>
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/stats")}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer py-1.5 px-2.5 h-auto rounded-lg"
            >
              <BarChart2 className="w-3.5 h-3.5" />
              통계 보기
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleOpenPreview}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer py-1.5 px-2.5 h-auto rounded-lg"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              내 페이지 보기
            </Button>
          </div>
        </TabsList>

        {/* 링크 관리 탭 */}
        <TabsContent value="links" className="focus-visible:outline-none focus-visible:ring-0">
          <LinkManager
            user={user}
            links={links}
            isLoading={loadingLinks}
          />
        </TabsContent>

        {/* 프로필 설정 탭 */}
        <TabsContent value="profile" className="focus-visible:outline-none focus-visible:ring-0">
          <ProfileEditor
            user={user}
            profileInfo={profileInfo}
            isLoading={loadingProfile}
          />
        </TabsContent>
      </Tabs>
      
      {/* 토스트 컨테이너 */}
      <Toaster position="bottom-center" toastOptions={{
        className: "bg-slate-900 border border-slate-800 text-slate-200 rounded-2xl p-4 shadow-xl",
      }} />
    </div>
  );
}
