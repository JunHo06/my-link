"use client";

import { useState, useEffect } from "react";
import { LinkItem } from "@/data/links";
import { Card } from "@/components/ui/card";
import { Globe, MessageCircle, Camera, Briefcase, Mail, Link as LinkIcon } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

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
      return <FallbackIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />;
    }
    return <LinkIcon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      className="w-5 h-5 rounded-full object-contain bg-slate-800 p-0.5 border border-white/10 shadow-sm group-hover:scale-110 transition-transform duration-300"
      onError={() => setHasError(true)}
    />
  );
}

export default function Page() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        console.error("Firestore fetch links error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinks();
  }, []);

  return (
    <main className="dark flex min-h-svh flex-col items-center p-6 bg-aurora text-foreground relative overflow-hidden">
      {/* Decorative Overlays (for depth) */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 mt-12 mb-10 relative z-10">
        
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-24 h-24 rounded-full bg-slate-800/80 border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)] shrink-0 flex items-center justify-center mb-2 overflow-hidden">
             {/* Profile Image Placeholder */}
             <span className="text-3xl font-bold text-white/50">M</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">@my_profile</h1>
          <p className="text-sm text-gray-300 text-center px-4 leading-relaxed font-medium">
             Front-end Developer | UI/UX Designer <br/>
             함께 성장하는 개발자입니다. 🚀
          </p>
        </div>
        
        {/* Links List (Glassmorphism applied) */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            // Skeleton Loader
            Array.from({ length: 4 }).map((_, i) => (
              <Card 
                key={i} 
                className="relative flex flex-row items-center p-4 min-h-[60px] 
                           border border-white/10 bg-white/5 backdrop-blur-md shadow-xl animate-pulse rounded-xl"
              >
                <div className="absolute left-4 w-5 h-5 rounded-full bg-white/10" />
                <div className="flex-1 flex justify-center">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                </div>
              </Card>
            ))
          ) : links.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-8 min-h-[120px] border border-white/10 bg-white/5 backdrop-blur-md shadow-xl rounded-xl">
              <span className="text-gray-400 text-sm">표시할 링크가 없습니다.</span>
              <span className="text-gray-500 text-xs mt-1">관리자 페이지에서 링크를 추가해주세요.</span>
            </Card>
          ) : (
            links.map((link) => {
              return (
                <a 
                  key={link.id} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group w-full outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
                >
                  <Card className="relative flex flex-row items-center p-4 min-h-[60px] cursor-pointer 
                                   border border-white/10 bg-white/5 backdrop-blur-md shadow-xl 
                                   transition-all duration-300 ease-out
                                   hover:-translate-y-1 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 active:scale-[0.98]">
                    <div className="absolute left-4 flex items-center justify-center w-8 h-8 rounded-full bg-slate-950/20 border border-white/5">
                      <FaviconImage url={link.url} title={link.title} fallbackIcon={link.icon} />
                    </div>
                    <span className="flex-1 text-center font-semibold text-gray-100 group-hover:text-white transition-colors duration-300 pl-4">
                      {link.title}
                    </span>
                  </Card>
                </a>
              );
            })
          )}
        </div>

        {/* Social Links (PRD 3.4) */}
        <div className="flex flex-col items-center pt-8 pb-4">
          <div className="flex justify-center items-center gap-4">
            {[Globe, MessageCircle, Camera, Briefcase, Mail].map((SnsIcon, i) => (
              <a 
                key={i} 
                href="#" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg 
                           text-gray-300 hover:text-white hover:bg-white/10 hover:-translate-y-1 
                           transition-all duration-300 ease-out"
              >
                <SnsIcon className="w-[18px] h-[18px]" />
              </a>
            ))}
          </div>
        </div>
        
      </div>
    </main>
  );
}
