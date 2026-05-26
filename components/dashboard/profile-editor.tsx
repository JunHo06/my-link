"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ProfileInfo } from "./dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Instagram, 
  Youtube, 
  Github, 
  Twitter, 
  Linkedin, 
  Loader2, 
  User as UserIcon,
  Share2
} from "lucide-react";
import { toast } from "sonner";

interface ProfileEditorProps {
  user: User;
  profileInfo: ProfileInfo;
  isLoading: boolean;
}

export default function ProfileEditor({ user, profileInfo, isLoading }: ProfileEditorProps) {
  const [nickname, setNickname] = useState(profileInfo.nickname);
  const [bio, setBio] = useState(profileInfo.bio);
  
  // SNS 링크 개별 상태
  const [instagram, setInstagram] = useState(profileInfo.snsLinks.instagram || "");
  const [youtube, setYoutube] = useState(profileInfo.snsLinks.youtube || "");
  const [github, setGithub] = useState(profileInfo.snsLinks.github || "");
  const [twitter, setTwitter] = useState(profileInfo.snsLinks.twitter || "");
  const [linkedin, setLinkedin] = useState(profileInfo.snsLinks.linkedin || "");

  const [isSaving, setIsSaving] = useState(false);

  // Firestore 실시간 데이터가 로드되면 로컬 폼 상태 동기화
  useEffect(() => {
    setNickname(profileInfo.nickname);
    setBio(profileInfo.bio);
    setInstagram(profileInfo.snsLinks.instagram || "");
    setYoutube(profileInfo.snsLinks.youtube || "");
    setGithub(profileInfo.snsLinks.github || "");
    setTwitter(profileInfo.snsLinks.twitter || "");
    setLinkedin(profileInfo.snsLinks.linkedin || "");
  }, [profileInfo]);

  // 프로필 정보 Firestore 저장
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const profileRef = doc(db, `users/${user.uid}/profile/info`);
      await setDoc(profileRef, {
        nickname: nickname.trim() || user.displayName || "사용자",
        bio: bio.trim(),
        theme: "notion-white", // 테마는 기본 노션 화이트로 고정
        snsLinks: {
          instagram: instagram.trim(),
          youtube: youtube.trim(),
          github: github.trim(),
          twitter: twitter.trim(),
          linkedin: linkedin.trim(),
        },
      });
      toast.success("프로필 설정이 저장되었습니다.");
    } catch (err) {
      console.error("프로필 저장 에러:", err);
      toast.error("프로필 설정을 저장하지 못했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSaveProfile} className="space-y-5 text-slate-800">
      
      {/* 1. 기본 프로필 정보 입력 */}
      <Card className="p-5 bg-white border border-slate-200/80 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <UserIcon className="w-4.5 h-4.5 text-slate-500" />
          <h3 className="font-bold text-slate-800 text-sm">프로필 정보</h3>
        </div>

        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-9 bg-slate-100 rounded-lg" />
            <div className="h-14 bg-slate-100 rounded-lg" />
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label htmlFor="nickname" className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
                닉네임
              </Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="표시할 이름을 입력해주세요."
                className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-350 focus-visible:ring-slate-400 rounded-lg h-9.5 text-sm"
                disabled={isSaving}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
                소개글 (Bio)
              </Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="나를 소개하는 한 줄 소개글을 작성해보세요."
                className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-350 focus-visible:ring-slate-400 rounded-lg h-9.5 text-sm"
                disabled={isSaving}
              />
            </div>
          </div>
        )}
      </Card>

      {/* 2. SNS 소셜 미디어 아이콘 연동 */}
      <Card className="p-5 bg-white border border-slate-200/80 rounded-xl space-y-4 shadow-2xs">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Share2 className="w-4.5 h-4.5 text-slate-500" />
          <h3 className="font-bold text-slate-800 text-sm">SNS 채널 연동</h3>
        </div>

        {isLoading ? (
          <div className="space-y-3.5 animate-pulse">
            <div className="h-9 bg-slate-100 rounded-lg" />
            <div className="h-9 bg-slate-100 rounded-lg" />
          </div>
        ) : (
          <div className="space-y-3.5">
            <p className="text-[11px] text-slate-400 leading-normal">
              연결할 소셜 채널의 URL을 입력하면 프로필에 플랫한 아이콘 버튼이 생성됩니다.
            </p>

            {/* 인스타그램 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Instagram className="w-4 h-4" />
              </div>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/아이디"
                className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-330 focus-visible:ring-slate-400 rounded-lg h-9 text-xs"
                disabled={isSaving}
              />
            </div>

            {/* 유튜브 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Youtube className="w-4 h-4" />
              </div>
              <Input
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/@채널명"
                className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-330 focus-visible:ring-slate-400 rounded-lg h-9 text-xs"
                disabled={isSaving}
              />
            </div>

            {/* 깃허브 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Github className="w-4 h-4" />
              </div>
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/아이디"
                className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-330 focus-visible:ring-slate-400 rounded-lg h-9 text-xs"
                disabled={isSaving}
              />
            </div>

            {/* 트위터(X) */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Twitter className="w-4 h-4" />
              </div>
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/아이디"
                className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-330 focus-visible:ring-slate-400 rounded-lg h-9 text-xs"
                disabled={isSaving}
              />
            </div>

            {/* 링크드인 */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                <Linkedin className="w-4 h-4" />
              </div>
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/아이디"
                className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-330 focus-visible:ring-slate-400 rounded-lg h-9 text-xs"
                disabled={isSaving}
              />
            </div>
          </div>
        )}
      </Card>

      {/* 저장 제출 버튼 */}
      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          className="bg-slate-900 hover:bg-slate-850 text-white font-bold rounded-lg h-10 px-8 flex items-center gap-2 cursor-pointer transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm text-xs"
          disabled={isSaving || isLoading}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              설정 저장 중...
            </>
          ) : (
            "설정 저장"
          )}
        </Button>
      </div>
    </form>
  );
}
