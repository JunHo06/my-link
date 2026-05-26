"use client";

import { useState, useEffect } from "react";
import { LinkItem } from "@/data/links";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from "firebase/firestore";

// 파비콘 이미지를 안전하게 불러오고 에러 시 fallback 처리하는 컴포넌트
function FaviconImage({ 
  url, 
  title, 
  fallbackIcon: FallbackIcon 
}: { 
  url: string; 
  title: string; 
  fallbackIcon?: React.ComponentType<{ className?: string }> 
}) {
  const [hasError, setHasError] = useState(false);
  const [prevUrl, setPrevUrl] = useState(url);

  // url prop이 변경되면 에러 상태 리셋
  if (url !== prevUrl) {
    setPrevUrl(url);
    setHasError(false);
  }

  let src = "";
  let isInvalidUrl = false;
  try {
    const hostname = new URL(url).hostname;
    // Google Favicon API 사용
    src = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    isInvalidUrl = true;
  }

  if (hasError || isInvalidUrl || !src) {
    if (FallbackIcon) {
      return <FallbackIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />;
    }
    return <LinkIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      className="w-6 h-6 rounded-full object-contain bg-slate-800 p-0.5 border border-slate-700/50 shadow-sm group-hover:scale-110 transition-transform duration-300"
      onError={() => setHasError(true)}
    />
  );
}

export default function MyPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Firestore 데이터 조회 함수
  const fetchLinks = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "users/anonymous/links"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const linkData: LinkItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        linkData.push({
          id: doc.id,
          title: data.title || "",
          url: data.url || "",
        });
      });
      setLinks(linkData);
    } catch (error) {
      console.error("Firestore links fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    
    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();

    if (!trimmedTitle) {
      setErrorMessage("제목을 입력해주세요");
      return;
    }
    
    if (!trimmedUrl) {
      setErrorMessage("주소를 입력해주세요");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setErrorMessage("올바른 주소를 입력해주세요");
      return;
    }

    const finalUrl = trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://") 
      ? trimmedUrl 
      : `https://${trimmedUrl}`;

    try {
      setIsLoading(true);
      await addDoc(collection(db, "users/anonymous/links"), {
        title: trimmedTitle,
        url: finalUrl,
        createdAt: serverTimestamp(),
      });
      
      setTitle("");
      setUrl("");
      setIsOpen(false);
      await fetchLinks();
    } catch (err) {
      console.error("Firestore add error:", err);
      setErrorMessage("링크를 저장하지 못했습니다. 다시 시도해주세요.");
      setIsLoading(false);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteDoc(doc(db, "users/anonymous/links", id));
      await fetchLinks();
    } catch (err) {
      console.error("Firestore delete error:", err);
      setIsLoading(false);
    }
  };


  return (
    <main className="dark flex min-h-svh flex-col items-center p-6 bg-slate-950 text-foreground relative overflow-hidden">
      {/* 백그라운드 그라데이션 조명 효과 */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-purple-900/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-indigo-900/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md space-y-8 mt-12 mb-10 relative z-10">
        
        {/* 상단: 헤더 및 추가 버튼 */}
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            마이링크 관리
          </h1>
          <p className="text-sm text-slate-400">나만의 링크 페이지를 관리하고 꾸며보세요.</p>
          
          {/* 다이얼로그 트리거 버튼 */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                className="mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold shadow-lg shadow-purple-950/40 hover:shadow-purple-500/25 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 rounded-xl h-11 px-6 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                새 링크 추가하기
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900/95 border-slate-800 text-slate-100 max-w-md rounded-2xl backdrop-blur-md shadow-2xl p-6">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
                  새 링크 추가
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  표시할 링크 제목과 이동할 주소(URL)를 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleAddLink} className="space-y-5 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-slate-300 font-medium text-xs uppercase tracking-wider">
                    링크 제목
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="예: 내 깃허브 저장소"
                    className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-purple-500 rounded-xl h-11"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-slate-300 font-medium text-xs uppercase tracking-wider">
                    연결 주소 (URL)
                  </Label>
                  <Input
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="example.com 또는 https://..."
                    className="bg-slate-950/80 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-purple-500 rounded-xl h-11"
                    disabled={isLoading}
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-400 text-sm font-medium animate-pulse">{errorMessage}</p>
                )}

                <div className="flex gap-3 justify-end pt-2">
                  <Button 
                    type="button"
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white"
                    disabled={isLoading}
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold px-5 transition-colors flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        추가 중...
                      </>
                    ) : (
                      "링크 추가"
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* 하단: 목록 */}
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center px-1 border-b border-slate-800/80 pb-2">
            <h2 className="text-lg font-bold text-white/95 tracking-tight">등록된 링크 목록</h2>
            <span className="text-xs text-slate-400 font-medium">총 {links.length}개</span>
          </div>

          <div className="flex flex-col gap-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card 
                  key={i} 
                  className="relative flex flex-row items-center p-4 min-h-[64px] 
                            border border-slate-800/40 bg-slate-900/20 backdrop-blur-sm shadow-sm rounded-xl animate-pulse"
                >
                  <div className="absolute left-4 w-8 h-8 rounded-full bg-slate-800" />
                  <div className="flex-1 pl-12 pr-16 flex flex-col justify-center gap-2">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                  </div>
                </Card>
              ))
            ) : links.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                <p className="text-sm text-slate-500">등록된 링크가 없습니다.</p>
                <p className="text-xs text-slate-600 mt-1">위 버튼을 클릭하여 새 링크를 추가해보세요.</p>
              </div>
            ) : (
              links.map((link) => (
                <Card 
                  key={link.id} 
                  className="relative flex flex-row items-center p-4 min-h-[64px] 
                            border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm shadow-sm 
                            transition-all duration-300 hover:bg-slate-900/90 hover:border-purple-500/40 group rounded-xl"
                >
                  {/* 파비콘 자동 추출 영역 */}
                  <div className="absolute left-4 flex items-center justify-center w-8 h-8 rounded-full bg-slate-950/50 border border-slate-800/50">
                    <FaviconImage url={link.url} title={link.title} fallbackIcon={link.icon} />
                  </div>

                  <div className="flex-1 pl-12 pr-16 flex flex-col justify-center">
                    <span className="font-semibold text-slate-200 group-hover:text-white transition-colors text-sm md:text-base">
                      {link.title}
                    </span>
                    <span className="text-xs text-slate-500 truncate max-w-[180px] md:max-w-[220px]">
                      {link.url.replace(/^https?:\/\/(www\.)?/, '')}
                    </span>
                  </div>

                  {/* 관리용 아이콘 툴킷 */}
                  <div className="absolute right-4 flex items-center gap-2">
                    <a 
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-950/40 border border-slate-800/80 text-slate-400 hover:text-purple-400 hover:border-purple-500/20 transition-all"
                      title="새 창으로 열기"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLink(link.id)}
                      className="h-8 w-8 text-slate-400 hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-all"
                      title="링크 삭제"
                      disabled={isLoading}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
