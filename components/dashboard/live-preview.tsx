"use client";

import { User } from "firebase/auth";
import { DashboardLinkItem, ProfileInfo } from "./dashboard-shell";
import { getThemeById } from "@/lib/theme-presets";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Instagram, 
  Youtube, 
  Github, 
  Twitter, 
  Linkedin, 
  EyeOff,
  ExternalLink 
} from "lucide-react";
import FaviconImage from "./favicon-image";

interface LivePreviewProps {
  user: User;
  links: DashboardLinkItem[];
  profileInfo: ProfileInfo;
}

export default function LivePreview({ user, links, profileInfo }: LivePreviewProps) {
  const theme = getThemeById(profileInfo.theme);
  
  // SNS 링크 목록 중 값이 있는 것만 필터링
  const snsList = [
    { key: "instagram", icon: Instagram, url: profileInfo.snsLinks.instagram },
    { key: "youtube", icon: Youtube, url: profileInfo.snsLinks.youtube },
    { key: "github", icon: Github, url: profileInfo.snsLinks.github },
    { key: "twitter", icon: Twitter, url: profileInfo.snsLinks.twitter },
    { key: "linkedin", icon: Linkedin, url: profileInfo.snsLinks.linkedin },
  ].filter((sns) => sns.url && sns.url.trim() !== "");

  return (
    <div className="relative select-none">
      {/* 노션 스타일의 미니멀 모바일 웹 브라우저 프리뷰 창 */}
      <div className="relative mx-auto w-[320px] h-[580px] rounded-3xl border border-slate-200/90 bg-white shadow-sm flex flex-col overflow-hidden">
        
        {/* 상단 브라우저 주소창 느낌의 데코 바 (Notion 미니멀 룩) */}
        <div className="h-9 border-b border-slate-100 bg-[#fafafa] flex items-center px-4 justify-between shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">
            mylink.com/{user.uid.slice(0, 8)}
          </div>
          <div className="w-4 h-4" /> {/* 스페이서 */}
        </div>

        {/* 폰 화면 내부 (노션 테마 배경 적용) */}
        <div className={`w-full h-full overflow-y-auto px-5 pt-8 pb-8 flex flex-col items-center scrollbar-none transition-all duration-300 ${theme.backgroundClass}`}>
          
          {/* 프로필 이미지 (Avatar) */}
          <Avatar className="w-16 h-16 rounded-full border border-slate-200 shadow-sm mb-4 shrink-0">
            {user.photoURL ? (
              <AvatarImage src={user.photoURL} alt={profileInfo.nickname} className="object-cover" />
            ) : (
              <AvatarFallback className="bg-slate-100 font-extrabold text-slate-600 text-lg">
                {profileInfo.nickname[0] || "U"}
              </AvatarFallback>
            )}
          </Avatar>

          {/* 프로필 닉네임 */}
          <h4 className="font-bold text-lg tracking-tight text-center truncate max-w-full mb-1 text-slate-800">
            {profileInfo.nickname}
          </h4>

          {/* 프로필 Bio (소개글) */}
          {profileInfo.bio && (
            <p className="text-xs text-center text-slate-500 max-w-[240px] leading-relaxed mb-5 font-normal shrink-0">
              {profileInfo.bio}
            </p>
          )}

          {/* SNS 아이콘 가로 배열 (Notion 미니멀 회색조) */}
          {snsList.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mb-5 shrink-0 max-w-full">
              {snsList.map((sns) => {
                const IconComponent = sns.icon;
                return (
                  <a
                    key={sns.key}
                    href={sns.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg border border-slate-200/60 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors shadow-2xs"
                    title={sns.key}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* 디바이더 선 */}
          {snsList.length > 0 && <div className="w-[180px] h-[1px] bg-slate-100 mb-5 shrink-0" />}

          {/* 링크 버튼 리스트 */}
          <div className="w-full flex-1 space-y-3">
            {links.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-slate-400">
                <span className="text-xs">표시할 링크가 없습니다</span>
              </div>
            ) : (
              links.map((link) => {
                const isActive = link.active !== false;
                
                return (
                  <a
                    key={link.id}
                    href={isActive ? link.url : undefined}
                    target={isActive ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className={`relative w-full min-h-[46px] px-3.5 py-3.5 rounded-xl border flex items-center justify-between transition-all duration-200
                      ${theme.cardClass}
                      ${!isActive ? "opacity-40 cursor-not-allowed border-dashed bg-slate-50/50" : "cursor-pointer hover:translate-x-0.5"}`}
                    onClick={(e) => {
                      if (!isActive) e.preventDefault();
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* 파비콘 */}
                      <div className="flex items-center justify-center w-5.5 h-5.5 rounded bg-slate-50 border border-slate-150 shrink-0">
                        <FaviconImage url={link.url} title={link.title} />
                      </div>
                      
                      {/* 링크 제목 */}
                      <span className={`text-xs truncate ${theme.linkTextClass}`}>
                        {link.title}
                      </span>
                    </div>

                    {/* 상태 아이콘 */}
                    <div className="shrink-0 text-slate-400 pl-2">
                      {isActive ? (
                        <ExternalLink className="w-3 h-3 hover:text-slate-600 transition-colors" />
                      ) : (
                        <div className="flex items-center gap-1">
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span className="text-[8px] font-bold text-slate-400 uppercase hidden sm:inline">비공개</span>
                        </div>
                      )}
                    </div>
                  </a>
                );
              })
            )}
          </div>
        </div>
      </div>
      
      {/* 라이브 프리뷰 플로팅 라벨 (Notion 톤의 그레이) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow border border-slate-700 z-50">
        Preview
      </div>
    </div>
  );
}
