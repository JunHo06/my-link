"use client";

import { Card } from "@/components/ui/card";
import { 
  Smartphone, 
  ShieldCheck, 
  BarChart3, 
  CheckCircle2, 
  Sparkles 
} from "lucide-react";

export default function LandingFeatures() {
  const features = [
    {
      title: "실시간 레이아웃 프리뷰",
      description: "입력창에서 값을 바꾸거나 링크의 공개 여부를 토글할 때마다 오른쪽 모바일 프리뷰에 즉시 반영됩니다.",
      icon: Smartphone,
      gradient: "from-blue-500 to-indigo-500",
      accent: "text-blue-600"
    },
    {
      title: "자동 파비콘 추출",
      description: "입력하신 웹 링크의 고유 대표 아이콘(Favicon)을 시스템이 자동으로 분석하여 버튼 좌측에 예쁘게 달아줍니다.",
      icon: Sparkles,
      gradient: "from-purple-500 to-pink-500",
      accent: "text-purple-600"
    },
    {
      title: "스마트한 소셜 연동",
      description: "인스타그램, 유튜브, 깃허브 등의 링크를 입력하면 시스템이 자동으로 최적화된 소셜 전용 아이콘으로 변환합니다.",
      icon: ShieldCheck,
      gradient: "from-emerald-500 to-teal-500",
      accent: "text-emerald-600"
    },
    {
      title: "정교한 방문 & 클릭 통계",
      description: "내 프로필 방문 횟수와 각각의 링크가 언제 얼마나 클릭되었는지 차트와 데이터를 통해 실시간으로 파악합니다.",
      icon: BarChart3,
      gradient: "from-amber-500 to-orange-500",
      accent: "text-amber-600"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-20 border-t border-slate-100">
      
      {/* 상단 타이틀 */}
      <div className="flex flex-col items-center text-center space-y-3.5 mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-amber-500" />
          풍부한 핵심 기능
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          더욱 강력해진 링크 브랜딩 도구
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
          심플한 텍스트 링크 나열을 넘어, 방문자의 인터랙션을 유도하고 성과를 투명하게 보여주는 프로페셔널 기능을 경험하세요.
        </p>
      </div>

      {/* 4개 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <Card 
              key={idx}
              className="p-6 md:p-8 bg-white/70 backdrop-blur-xs border border-slate-200/80 hover:border-slate-300 hover:shadow-md hover:-translate-y-1 transition-all duration-350 rounded-2xl flex gap-5 group"
            >
              {/* 아이콘 박스 (그라데이션 배경) */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feat.gradient} flex items-center justify-center text-white shrink-0 shadow-sm transition-transform duration-350 group-hover:scale-105`}>
                <Icon className="w-5.5 h-5.5" />
              </div>

              {/* 텍스트 내용 */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                  {feat.title}
                  <CheckCircle2 className={`w-4 h-4 ${feat.accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {feat.description}
                </p>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
