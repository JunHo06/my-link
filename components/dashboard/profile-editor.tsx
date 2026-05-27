"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
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
import { useUpdateProfile } from "@/hooks/use-profile";

interface ProfileEditorProps {
  user: User;
  profileInfo: ProfileInfo;
  isLoading: boolean;
}

export default function ProfileEditor({ user, profileInfo, isLoading }: ProfileEditorProps) {
  const [nickname, setNickname] = useState(profileInfo.nickname);
  const [bio, setBio] = useState(profileInfo.bio);
  const [username, setUsername] = useState(profileInfo.username || "");
  
  // 중복 확인 관련 상태
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [usernameError, setUsernameError] = useState("");
  const [isUsernameChecked, setIsUsernameChecked] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
  
  // SNS 링크 개별 상태
  const [instagram, setInstagram] = useState(profileInfo.snsLinks.instagram || "");
  const [youtube, setYoutube] = useState(profileInfo.snsLinks.youtube || "");
  const [github, setGithub] = useState(profileInfo.snsLinks.github || "");
  const [twitter, setTwitter] = useState(profileInfo.snsLinks.twitter || "");
  const [linkedin, setLinkedin] = useState(profileInfo.snsLinks.linkedin || "");

  const updateProfileMutation = useUpdateProfile();

  // Firestore 실시간 데이터가 로드되면 로컬 폼 상태 동기화
  useEffect(() => {
    setNickname(profileInfo.nickname);
    setBio(profileInfo.bio);
    
    const dbUsername = profileInfo.username || "";
    setUsername(dbUsername);
    if (dbUsername) {
      setIsUsernameChecked(true);
      setIsUsernameAvailable(true);
    } else {
      setIsUsernameChecked(false);
      setIsUsernameAvailable(false);
    }
    setUsernameError("");
    
    setInstagram(profileInfo.snsLinks.instagram || "");
    setYoutube(profileInfo.snsLinks.youtube || "");
    setGithub(profileInfo.snsLinks.github || "");
    setTwitter(profileInfo.snsLinks.twitter || "");
    setLinkedin(profileInfo.snsLinks.linkedin || "");
  }, [profileInfo]);

  // Username 입력값 변경 핸들러
  const handleUsernameChange = (val: string) => {
    // 공백 제거 및 소문자화, 일부 특수문자 등 정제
    const cleanVal = val.toLowerCase().replace(/\s/g, "");
    setUsername(cleanVal);
    
    const dbUsername = profileInfo.username || "";
    if (cleanVal === dbUsername) {
      setIsUsernameChecked(true);
      setIsUsernameAvailable(true);
      setUsernameError("");
    } else {
      setIsUsernameChecked(false);
      setIsUsernameAvailable(false);
      setUsernameError("");
    }
  };

  // Username 중복 확인
  const handleCheckUsername = async () => {
    if (!username.trim()) {
      setUsernameError("아이디를 입력해 주세요.");
      return;
    }
    
    // 유효성 검사 (영문 소문자, 숫자, 하이픈, 언더바, 3~20자)
    const regex = /^[a-z0-9-_]{3,20}$/;
    if (!regex.test(username)) {
      setUsernameError("3~20자의 영문 소문자, 숫자, 하이픈(-), 언더바(_)만 가능합니다.");
      return;
    }

    setIsCheckingUsername(true);
    setUsernameError("");

    try {
      const usernameRef = doc(db, `usernames/${username}`);
      const usernameSnap = await getDoc(usernameRef);

      if (usernameSnap.exists()) {
        const data = usernameSnap.data();
        if (data.uid === user.uid) {
          setIsUsernameChecked(true);
          setIsUsernameAvailable(true);
          toast.info("현재 사용 중인 고유 아이디입니다.");
        } else {
          setIsUsernameChecked(true);
          setIsUsernameAvailable(false);
          setUsernameError("이미 다른 사용자가 사용 중인 아이디입니다.");
        }
      } else {
        setIsUsernameChecked(true);
        setIsUsernameAvailable(true);
        toast.success("사용 가능한 고유 아이디입니다!");
      }
    } catch (err) {
      console.error("아이디 중복 확인 에러:", err);
      toast.error("중복 확인 중 에러가 발생했습니다.");
    } finally {
      setIsCheckingUsername(false);
    }
  };

  // 프로필 정보 Firestore 저장
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const dbUsername = profileInfo.username || "";
    if (username !== dbUsername) {
      if (!isUsernameChecked || !isUsernameAvailable) {
        toast.error("고유 주소 아이디 중복 확인을 완료해 주세요.");
        return;
      }
    }

    updateProfileMutation.mutate(
      {
        userId: user.uid,
        newProfile: {
          nickname: nickname.trim() || user.displayName || "사용자",
          bio: bio.trim(),
          theme: profileInfo.theme || "notion-white",
          username: username.trim(),
          snsLinks: {
            instagram: instagram.trim(),
            youtube: youtube.trim(),
            github: github.trim(),
            twitter: twitter.trim(),
            linkedin: linkedin.trim(),
          },
        },
        oldUsername: dbUsername,
      },
      {
        onSuccess: () => {
          toast.success("프로필 설정이 저장되었습니다.");
        },
        onError: (err) => {
          console.error("프로필 저장 에러:", err);
          toast.error("프로필 설정을 저장하지 못했습니다.");
        },
      }
    );
  };

  const isSaving = updateProfileMutation.isPending;

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
            {/* 고유 주소 아이디 (Username) */}
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-slate-500 font-semibold text-[11px] uppercase tracking-wide">
                고유 주소 아이디 (Username)
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="사용할 아이디 입력"
                    className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-330 focus-visible:ring-slate-400 rounded-lg h-9.5 text-sm font-mono"
                    disabled={isSaving || isCheckingUsername}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleCheckUsername}
                  disabled={isSaving || isCheckingUsername || (username === (profileInfo.username || "") && username !== "")}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-semibold rounded-lg h-9.5 px-4 text-xs shrink-0 cursor-pointer transition-colors"
                >
                  {isCheckingUsername ? "확인 중..." : "중복 확인"}
                </Button>
              </div>
              
              {usernameError && (
                <p className="text-[10.5px] text-red-500 font-semibold leading-relaxed pl-1">
                  {usernameError}
                </p>
              )}
              {isUsernameChecked && isUsernameAvailable && username !== (profileInfo.username || "") && (
                <p className="text-[10.5px] text-emerald-600 font-semibold leading-relaxed pl-1">
                  사용 가능한 고유 아이디입니다.
                </p>
              )}
            </div>

            {/* 닉네임 */}
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
