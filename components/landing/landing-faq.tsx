"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

export default function LandingFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: "마이링크는 정말 무료로 이용할 수 있나요?",
      a: "네, 그렇습니다! 마이링크는 무제한 링크 등록, 소셜 미디어 아이콘 연결, 실시간 클릭 카운트 분석 대시보드까지 모든 핵심 기능을 비용 없이 무제한으로 사용하실 수 있습니다."
    },
    {
      q: "인스타그램 프로필에는 어떻게 링크를 등록하나요?",
      a: "로그인 후 '프로필 설정' 메뉴에서 고유 아이디(Username)를 설정 및 중복 확인을 완료해 주세요. 설정이 완료되면 상단의 '내 공유 링크 복사' 기능을 활용해 복사한 뒤, 인스타그램 프로필 편집 창의 '링크 추가' 영역에 삽입하시면 즉시 작동합니다."
    },
    {
      q: "링크 정보를 추가하거나 수정하면 즉시 적용되나요?",
      a: "네, 실시간으로 반영됩니다! 관리 대시보드에서 링크를 추가, 편집, 순서 정렬 또는 공개 여부를 토글하는 즉시 데이터베이스에 업데이트되어 내 프로필 페이지에 즉각 반영됩니다."
    },
    {
      q: "방문자들의 클릭 통계는 어떻게 분석하나요?",
      a: "대시보드 우측 상단의 '통계 보기' 탭을 선택하시면, 내 프로필의 누적 클릭 수 및 각 링크별 구체적인 방문/클릭 현황을 정교한 차트와 수치로 한눈에 모니터링할 수 있는 전용 분석 대시보드를 제공합니다."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-6 py-16 md:py-24 border-t border-slate-100">
      
      {/* 헤더 */}
      <div className="flex flex-col items-center text-center space-y-3.5 mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
          <HelpCircle className="w-3 h-3 text-slate-500" />
          자주 묻는 질문
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          궁금한 점이 있으신가요?
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm font-medium leading-relaxed">
          마이링크 서비스를 이용하며 자주 접하는 문의 사항을 신속하게 안내해 드립니다.
        </p>
      </div>

      {/* 아코디언 리스트 */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div 
              key={idx}
              className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-300 hover:border-slate-350 shadow-2xs"
            >
              {/* 질문 제목 버튼 */}
              <button
                onClick={() => handleToggle(idx)}
                className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer focus:outline-none group select-none"
              >
                <span className="font-bold text-slate-800 text-xs sm:text-sm md:text-base leading-snug group-hover:text-slate-950 transition-colors">
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-350 ml-4 group-hover:text-slate-700
                    ${isOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* 답변 영역 (CSS Grid를 사용한 부드러운 Max Height 애니메이션) */}
              <div 
                className={`grid transition-all duration-350 ease-in-out border-slate-100
                  ${isOpen ? "grid-rows-[1fr] border-t px-6 py-5" : "grid-rows-[0fr] px-6 py-0"}`}
              >
                <div className="overflow-hidden">
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
