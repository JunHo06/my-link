"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, query, orderBy } from "firebase/firestore";
import { LinkItem } from "@/data/links";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link2, User as UserIcon } from "lucide-react";
import LinkManager from "./link-manager";
import ProfileEditor from "./profile-editor";
import { Toaster } from "@/components/ui/sonner";

export interface DashboardLinkItem extends LinkItem {
  active?: boolean;
  order?: number;
}

export interface ProfileInfo {
  nickname: string;
  bio: string;
  theme: string;
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
}

export default function DashboardShell({ user, onLogout }: DashboardShellProps) {
  const [links, setLinks] = useState<DashboardLinkItem[]>([]);
  const [profileInfo, setProfileInfo] = useState<ProfileInfo>({
    nickname: user.displayName || "사용자",
    bio: "",
    theme: "notion-white",
    snsLinks: {},
  });
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // 1. 링크 데이터 실시간 구독
  useEffect(() => {
    const q = query(
      collection(db, `users/${user.uid}/links`),
      orderBy("order", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const linkData: DashboardLinkItem[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          linkData.push({
            id: doc.id,
            title: data.title || "",
            url: data.url || "",
            active: data.active !== undefined ? data.active : true,
            order: data.order !== undefined ? data.order : 0,
          });
        });
        
        setLinks(linkData);
        setLoadingLinks(false);
      },
      (error) => {
        console.error("실시간 링크 로드 에러:", error);
        setLoadingLinks(false);
      }
    );

    return () => unsubscribe();
  }, [user.uid]);

  // 2. 프로필 정보 실시간 구독
  useEffect(() => {
    const profileRef = doc(db, `users/${user.uid}/profile/info`);
    const unsubscribe = onSnapshot(
      profileRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileInfo({
            nickname: data.nickname || user.displayName || "사용자",
            bio: data.bio || "",
            theme: data.theme || "notion-white",
            snsLinks: data.snsLinks || {},
          });
        } else {
          setProfileInfo({
            nickname: user.displayName || "사용자",
            bio: "",
            theme: "notion-white",
            snsLinks: {},
          });
        }
        setLoadingProfile(false);
      },
      (error) => {
        console.error("실시간 프로필 로드 에러:", error);
        setLoadingProfile(false);
      }
    );

    return () => unsubscribe();
  }, [user.uid, user.displayName]);

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto px-4 py-8 md:py-12">
      <Tabs defaultValue="links" className="w-full">
        {/* 노션 스타일의 플랫 언더라인 탭 리스트 */}
        <TabsList className="flex bg-transparent border-b border-slate-200 rounded-none p-0 mb-6 gap-6 w-full justify-start h-auto">
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
