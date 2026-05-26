"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, orderBy } from "firebase/firestore";
import { DashboardLinkItem, ProfileInfo } from "@/components/dashboard/dashboard-shell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Youtube,
  Github,
  Twitter,
  Linkedin,
  Share2,
  Loader2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import FaviconImage from "@/components/dashboard/favicon-image";
import { toast } from "sonner";

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const uid = params.uid as string;

  const [profile, setProfile] = useState<ProfileInfo | null>(null);
  const [links, setLinks] = useState<DashboardLinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Firestore에서 프로필 정보 및 활성화된 링크 로드
  useEffect(() => {
    if (!uid) return;

    const fetchPublicData = async () => {
      setLoading(true);
      setError(false);
      try {
        // 1. 프로필 정보 획득
        const profileRef = doc(db, `users/${uid}/profile/info`);
        const profileSnap = await getDoc(profileRef);

        let profileData: ProfileInfo;
        if (profileSnap.exists()) {
          const data = profileSnap.data();
          profileData = {
            nickname: data.nickname || "사용자",
            bio: data.bio || "",
            theme: "notion-white",
            snsLinks: data.snsLinks || {},
          };
        } else {
          setError(true);
          setLoading(false);
          return;
        }

        // 2. 링크 목록 획득 (active !== false)
        const linksRef = collection(db, `users/${uid}/links`);
        const querySnapshot = await getDocs(query(linksRef, orderBy("order", "asc")));
        const linkData: DashboardLinkItem[] = [];
        
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.active !== false) {
            linkData.push({
              id: docSnap.id,
              title: data.title || "",
              url: data.url || "",
              active: true,
              order: data.order !== undefined ? data.order : 0,
            });
          }
        });

        setProfile(profileData);
        setLinks(linkData);
      } catch (err) {
        console.error("공개 프로필 로딩 실패:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [uid]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-svh bg-white text-slate-800 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-slate-450" />
        <p className="text-xs text-slate-450 font-medium">프로필을 불러오는 중...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-svh bg-[#fbfbfa] text-slate-800 flex flex-col items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-6 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-500 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-base font-bold text-slate-800">페이지를 찾을 수 없습니다</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              요청하신 프로필이 존재하지 않거나 비공개 상태입니다. 주소를 다시 확인해 주세요.
            </p>
          </div>
          <Button
            onClick={() => router.push("/")}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg h-11 cursor-pointer text-xs"
          >
            MyLink 시작하기
          </Button>
        </Card>
      </div>
    );
  }

  // SNS 링크 필터링
  const snsList = [
    { key: "instagram", icon: Instagram, url: profile.snsLinks.instagram },
    { key: "youtube", icon: Youtube, url: profile.snsLinks.youtube },
    { key: "github", icon: Github, url: profile.snsLinks.github },
    { key: "twitter", icon: Twitter, url: profile.snsLinks.twitter },
    { key: "linkedin", icon: Linkedin, url: profile.snsLinks.linkedin },
  ].filter((sns) => sns.url && sns.url.trim() !== "");

  return (
    <div className="min-h-svh flex flex-col items-center relative overflow-hidden transition-all duration-350 bg-white text-slate-850">
      {/* 공유하기 버튼 */}
      <div className="absolute top-5 right-5 z-50">
        <Button
          onClick={handleShare}
          variant="outline"
          size="icon"
          className="rounded-full bg-white hover:bg-slate-50 border-slate-200 text-slate-650 hover:text-slate-950 transition-all shadow-xs cursor-pointer h-9 w-9"
          title="이 페이지 주소 복사"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      {/* 내부 콘텐츠 */}
      <main className="w-full max-w-md px-6 pt-16 pb-12 flex flex-col items-center z-10 flex-grow">
        {/* 아바타 */}
        <Avatar className="w-18 h-18 rounded-full border border-slate-200 shadow-sm mb-4 shrink-0">
          <AvatarFallback className="bg-slate-100 font-extrabold text-slate-605 text-xl">
            {profile.nickname[0] || "U"}
          </AvatarFallback>
        </Avatar>

        {/* 닉네임 */}
        <h1 className="font-extrabold text-xl tracking-tight text-center mb-1.5 text-slate-950">
          {profile.nickname}
        </h1>

        {/* Bio */}
        {profile.bio && (
          <p className="text-xs text-center text-slate-500 max-w-[280px] leading-relaxed mb-5 font-medium">
            {profile.bio}
          </p>
        )}

        {/* SNS 아이콘 */}
        {snsList.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6 shrink-0">
            {snsList.map((sns) => {
              const IconComponent = sns.icon;
              return (
                <a
                  key={sns.key}
                  href={sns.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-slate-200/80 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
                  title={sns.key}
                >
                  <IconComponent className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        )}

        {/* 디바이더 */}
        {snsList.length > 0 && <div className="w-[180px] h-[1px] bg-slate-100 mb-6 shrink-0" />}

        {/* 링크 버튼 리스트 */}
        <div className="w-full space-y-3">
          {links.length === 0 ? (
            <div className="text-center py-16 opacity-40">
              <span className="text-xs">등록된 공개 링크가 없습니다.</span>
            </div>
          ) : (
            links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group w-full min-h-[50px] px-4 py-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-sm flex items-center justify-between transition-all duration-200 select-none cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* 파비콘 */}
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-slate-50 border border-slate-150 shrink-0">
                    <FaviconImage url={link.url} title={link.title} />
                  </div>
                  
                  {/* 링크 제목 */}
                  <span className="text-xs truncate text-slate-800 font-semibold">
                    {link.title}
                  </span>
                </div>

                {/* 외부 링크 화살표 아이콘 */}
                <div className="shrink-0 text-slate-400 pl-2 group-hover:text-slate-700 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))
          )}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="w-full py-8 text-center text-slate-350 text-[9px] uppercase tracking-wider mt-auto z-10">
        <a href="/" className="hover:text-slate-650 transition-colors">
          Powered by MyLink
        </a>
      </footer>
    </div>
  );
}
