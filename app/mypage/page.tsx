"use client";

import { useState } from "react";
import { dummyLinks, LinkItem } from "@/data/links";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon } from "lucide-react";

export default function MyPage() {
  const [links, setLinks] = useState<LinkItem[]>(dummyLinks);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddLink = (e: React.FormEvent) => {
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

    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: trimmedTitle,
      url: finalUrl,
      icon: LinkIcon, // 기본 아이콘
    };
    
    setLinks([newLink, ...links]);
    setTitle("");
    setUrl("");
  };

  return (
    <main className="flex min-h-svh flex-col items-center p-6 bg-slate-950 text-foreground relative overflow-hidden">
      <div className="w-full max-w-md space-y-8 mt-12 mb-10 relative z-10">
        
        {/* 상단: 제목 */}
        <div className="flex flex-col items-center space-y-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">마이페이지</h1>
          <p className="text-sm text-gray-400">새로운 링크를 추가하세요.</p>
        </div>

        {/* 중간: 폼 */}
        <Card className="p-6 bg-slate-900 border-slate-800 shadow-lg">
          <form onSubmit={handleAddLink} className="flex flex-col gap-5">
            {/* 세로 배치 입력칸 */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title" className="text-slate-300 font-medium">제목</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 내 포트폴리오"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-purple-500"
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <Label htmlFor="url" className="text-slate-300 font-medium">주소 (URL)</Label>
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-purple-500"
              />
            </div>

            {errorMessage && (
              <p className="text-red-400 text-sm font-medium -mt-2">{errorMessage}</p>
            )}

            {/* 보라색 추가 버튼 */}
            <Button 
              type="submit" 
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white w-full rounded-xl h-11 text-base font-semibold transition-colors"
            >
              추가 버튼
            </Button>
          </form>
        </Card>

        {/* 하단: 목록 */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-white/90 px-1 border-b border-slate-800 pb-2">등록된 링크</h2>
          <div className="flex flex-col gap-3">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Card 
                  key={link.id} 
                  className="relative flex flex-row items-center p-4 min-h-[60px] 
                            border border-slate-800 bg-slate-900/50 shadow-sm 
                            transition-all hover:bg-slate-800 group"
                >
                  {Icon && (
                    <div className="absolute left-4">
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>
                  )}
                  <span className="flex-1 text-center font-semibold text-slate-200">
                    {link.title}
                  </span>
                  <div className="absolute right-4 text-xs text-slate-500 truncate max-w-[100px] hover:max-w-none hover:bg-slate-800 hover:z-10 px-1 py-0.5 rounded cursor-default">
                    {link.url.replace(/^https?:\/\//, '')}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
