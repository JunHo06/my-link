"use client";

import { UserPlus, Sparkles, Share2 } from "lucide-react";

export default function LandingSteps() {
  const steps = [
    {
      num: "01",
      title: "계정 가입 & 주소 선점",
      desc: "Google 계정으로 1초 만에 가입하고, 나만을 표현할 수 있는 고유한 주소 아이디를 선점하세요.",
      icon: UserPlus,
      color: "bg-indigo-50 border-indigo-100 text-indigo-650"
    },
    {
      num: "02",
      title: "링크 채우기 & 소셜 연동",
      desc: "공유하고 싶은 웹 페이지 링크들을 추가하고, 대표 소셜 미디어(SNS) 연동 아이콘을 깔끔하게 배치하세요.",
      icon: Sparkles,
      color: "bg-purple-50 border-purple-100 text-purple-650"
    },
    {
      num: "03",
      title: "프로필 공유 및 통계 추적",
      desc: "인스타그램이나 틱톡 등 SNS 바이오에 단 하나의 마이링크를 게시하고, 방문자들의 클릭 분석 차트를 확인하세요.",
      icon: Share2,
      color: "bg-emerald-50 border-emerald-100 text-emerald-650"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-16 md:py-24 border-t border-slate-100 relative">
      {/* 백그라운드 그리드 데코 (미세한 느낌) */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-30 -z-10" />

      {/* 헤더 */}
      <div className="flex flex-col items-center text-center space-y-3.5 mb-16">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          단 1분이면 끝나는 나만의 링크 트리
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
          어렵고 복잡한 설정 없이, 가장 중요한 정보들만 간결하게 구성하여 바로 사람들과 소통을 시작할 수 있습니다.
        </p>
      </div>

      {/* 3단계 프로세스 레이아웃 */}
      <div className="flex flex-col md:flex-row items-stretch justify-between gap-8 relative">
        {/* 데스크톱 연결선 */}
        <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[1px] bg-slate-200 border-dashed border-t -z-10" />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div 
              key={idx}
              className="flex-1 bg-white border border-slate-200/90 rounded-2xl p-6 md:p-8 flex flex-col items-center text-center space-y-4 shadow-2xs hover:shadow-sm hover:border-slate-350 transition-all duration-300 relative"
            >
              {/* 스텝 숫자 플로팅 뱃지 */}
              <span className="absolute -top-3.5 left-6 bg-slate-900 text-white font-mono text-[10px] font-black tracking-widest px-2.5 py-1.5 rounded-md shadow-sm">
                STEP {step.num}
              </span>

              {/* 아이콘 서클 */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${step.color} mt-2`}>
                <Icon className="w-5.5 h-5.5" />
              </div>

              {/* 텍스트 정보 */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  {step.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
