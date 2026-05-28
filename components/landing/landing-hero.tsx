"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, Link2 } from "lucide-react";

interface LandingHeroProps {
  onStart: (username: string) => void;
  isLoading: boolean;
}

export default function LandingHero({ onStart, isLoading }: LandingHeroProps) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanVal = inputValue.toLowerCase().replace(/\s/g, "");
    
    if (!cleanVal) {
      setError("사용할 아이디를 입력해 주세요.");
      return;
    }

    const regex = /^[a-z0-9-_]{3,20}$/;
    if (!regex.test(cleanVal)) {
      setError("3~20자의 영문 소문자, 숫자, 하이픈(-), 언더바(_)만 가능합니다.");
      return;
    }

    setError("");
    onStart(cleanVal);
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-center pt-16 pb-12 md:pt-28 md:pb-20 overflow-hidden px-4">
      {/* 백그라운드 은은한 원형 그라데이션 조명 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[600px] md:h-[600px] bg-gradient-to-tr from-indigo-100/40 via-purple-100/30 to-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* 상단 뱃지 */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        가장 아름답고 직관적인 링크 관리 도구
      </div>

      {/* 메인 카피 */}
      <div className="text-center space-y-5 max-w-3xl animate-in fade-in slide-in-from-bottom-5 duration-600">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] text-slate-900">
          모든 링크를 하나의 <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-650 via-purple-600 to-pink-650">
            세련된 단일 페이지
          </span>
          에 담으세요.
        </h1>
        <p className="text-slate-500 text-sm sm:text-lg max-w-lg mx-auto leading-relaxed font-medium">
          인스타그램, 유튜브, 포트폴리오 등 흩어져 있는 개인 링크를 하나의 노션 스타일 프로필로 정리하고 실시간으로 통계를 추적해 보세요.
        </p>
      </div>

      {/* 가상 주소 입력 폼 */}
      <div className="w-full max-w-md mt-10 animate-in fade-in slide-in-from-bottom-8 duration-750">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex flex-col sm:flex-row items-stretch gap-2.5 p-1.5 bg-white border border-slate-200 shadow-sm rounded-xl sm:rounded-2xl transition-all duration-350 focus-within:border-slate-350 focus-within:shadow-md">
            
            {/* 고정 접두사 */}
            <div className="flex items-center gap-1.5 pl-3.5 pr-2 border-r border-slate-100 py-2 sm:py-0 shrink-0">
              <Link2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-mono text-xs sm:text-sm font-semibold select-none">
                mylink.com/
              </span>
            </div>

            {/* 입력창 */}
            <Input
              type="text"
              placeholder="yourname"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                if (error) setError("");
              }}
              className="bg-transparent border-0 focus-visible:ring-0 text-slate-800 placeholder:text-slate-330 h-10 text-sm font-mono flex-1 pl-1 pr-3"
              disabled={isLoading}
            />

            {/* 제출 버튼 */}
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 px-5 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs active:translate-y-0 hover:-translate-y-0.5 transition-all text-xs"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  무료로 시작하기
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </Button>
          </div>

          {error ? (
            <p className="text-[11px] text-red-500 font-semibold text-center mt-1 animate-pulse">
              {error}
            </p>
          ) : (
            <p className="text-[11px] text-slate-400 text-center mt-1 font-medium">
              원하는 고유 URL 아이디를 입력하고 즉시 선점해 보세요!
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
