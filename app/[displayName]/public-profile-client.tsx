"use client";

import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Instagram,
  Youtube,
  Github,
  Twitter,
  Linkedin,
  Share2,
  ExternalLink,
} from "lucide-react";
import FaviconImage from "@/components/dashboard/favicon-image";
import { toast } from "sonner";
import { useIncrementClick } from "@/hooks/use-links";

interface ProfileData {
  nickname: string;
  username: string;
  bio?: string;
  snsLinks?: {
    instagram?: string;
    youtube?: string;
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface LinkData {
  id: string;
  url: string;
  title: string;
  active?: boolean;
}

interface PublicProfileClientProps {
  targetUid: string;
  profile: ProfileData;
  links: LinkData[];
}

export default function PublicProfileClient({
  targetUid,
  profile,
  links,
}: PublicProfileClientProps) {
  const incrementClick = useIncrementClick();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("링크가 복사되었습니다!");
    }
  };

  // SNS 링크 안전한 구조화 및 필터링
  const snsLinks = profile.snsLinks || {};
  const snsList = [
    { key: "instagram", icon: Instagram, url: snsLinks.instagram },
    { key: "youtube", icon: Youtube, url: snsLinks.youtube },
    { key: "github", icon: Github, url: snsLinks.github },
    { key: "twitter", icon: Twitter, url: snsLinks.twitter },
    { key: "linkedin", icon: Linkedin, url: snsLinks.linkedin },
  ].filter((sns) => sns.url && sns.url.trim() !== "");

  return (
    <div className="min-h-svh flex flex-col items-center relative overflow-hidden transition-all duration-350 bg-white text-slate-850 w-full">
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
            {profile.nickname ? profile.nickname[0] : "U"}
          </AvatarFallback>
        </Avatar>

        {/* 닉네임 */}
        <h1 className="font-extrabold text-xl tracking-tight text-center mb-1 text-slate-950">
          {profile.nickname}
        </h1>

        {/* 고유 주소 아이디 (username) */}
        {profile.username && (
          <p className="text-xs text-slate-400 font-semibold font-mono text-center mb-4">
            @{profile.username}
          </p>
        )}

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
                onClick={() => {
                  incrementClick.mutate({ userId: targetUid, linkId: link.id });
                }}
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
      <footer className="w-full py-8 text-center text-slate-350 text-[9px] uppercase tracking-wider mt-auto z-10 font-bold">
        <Link href="/" className="hover:text-slate-650 transition-colors">
          Powered by MyLink
        </Link>
      </footer>
    </div>
  );
}
