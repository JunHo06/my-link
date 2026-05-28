import { 
  Instagram, 
  Youtube, 
  Github, 
  ExternalLink,
  Sparkles,
  Palette
} from "lucide-react";
import FaviconImage from "../dashboard/favicon-image";

export default function LandingPreview() {
  // 데모용 SNS 링크
  const demoSns = [
    { key: "instagram", icon: Instagram, url: "https://instagram.com" },
    { key: "youtube", icon: Youtube, url: "https://youtube.com" },
    { key: "github", icon: Github, url: "https://github.com" },
  ];

  // 데모용 링크 데이터
  const demoLinks = [
    { id: "1", title: "🚀 2026 노션 포트폴리오 템플릿 무료 나눔", url: "https://notion.so", active: true },
    { id: "2", title: "💻 개발자 커리어 로드맵 YouTube 영상 보러가기", url: "https://youtube.com", active: true },
    { id: "3", title: "📚 최신 기술 블로그 구독하기", url: "https://medium.com", active: true }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 md:py-24">
      
      {/* 타이틀 및 헤더 */}
      <div className="flex flex-col items-center text-center space-y-3.5 mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
          <Palette className="w-3 h-3 text-indigo-500" />
          미니멀 디자인
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          디자인 고민이 필요 없는 완벽함
        </h2>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
          화려하고 복잡한 꾸미기 단계 없이도, 신뢰감을 주는 노션 특유의 단정한 스타일로 언제나 최상의 프로필 페이지가 유지됩니다.
        </p>
      </div>

      {/* 데스크톱: 2열 레이아웃, 모바일: 1열 레이아웃 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center justify-center">
        
        {/* 왼쪽 영역: 미니멀 디자인 소개 및 가치 전달 */}
        <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pr-6 ordered-1 lg:order-none">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              본질에만 집중하는 레이아웃
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed font-medium">
              여러 테마를 고민하거나 색상 조합을 맞추느라 시간을 낭비할 필요가 없습니다. 마이링크는 가장 직관적이고 가독성이 뛰어난 미니멀 모노 톤을 채택하여 정보의 전달력을 극대화합니다.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-slate-155 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 font-bold text-[10px]">✓</div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">높은 텍스트 가독성</h4>
                <p className="text-[10.5px] text-slate-450 leading-relaxed font-medium">어떤 스마트폰 기기에서도 텍스트와 파비콘이 묻히지 않고 또렷하게 눈에 들어옵니다.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-slate-155 border border-slate-200 flex items-center justify-center shrink-0 text-slate-700 font-bold text-[10px]">✓</div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">심플함이 주는 신뢰감</h4>
                <p className="text-[10.5px] text-slate-450 leading-relaxed font-medium">난잡한 색상 배치를 지양하고 노션 고유의 모노 톤과 둥근 카드 테두리로 정돈된 브랜딩을 보여줍니다.</p>
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 영역: 고정된 노션 기본 모바일 뷰어 목업 (lg:col-span-7) */}
        <div className="lg:col-span-7 flex justify-center items-center relative py-6 select-none ordered-none lg:order-1">
          {/* 장식용 사이드 그라데이션 광원 */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[480px] bg-gradient-to-tr from-purple-100/10 to-indigo-100/10 rounded-3xl blur-2xl -z-10 pointer-events-none" />

          {/* 모바일 하우징 */}
          <div className="relative mx-auto w-[310px] h-[550px] sm:w-[330px] sm:h-[590px] rounded-[36px] border-[8px] border-slate-900/95 bg-white shadow-2xl flex flex-col overflow-hidden">
            
            {/* 상단 노치/아일랜드 데코 */}
            <div className="absolute top-0.5 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-slate-900/95 rounded-b-2xl z-50 flex items-center justify-center">
              {/* 스피커 & 카메라 구멍 데코 */}
              <div className="w-10 h-1 bg-slate-800 rounded-full mr-2" />
              <div className="w-2.5 h-2.5 bg-slate-800 rounded-full" />
            </div>

            {/* 폰 화면 내부 (노션 화이트 기본 테마 고정) */}
            <div className="w-full h-full overflow-y-auto px-5 pt-12 pb-8 flex flex-col items-center scrollbar-none bg-white text-slate-800">
              
              {/* 더미 프로필 이미지 (Avatar) */}
              <div className="w-16 h-16 rounded-full border border-slate-200/80 shadow-xs mb-4 shrink-0 overflow-hidden bg-slate-100 flex items-center justify-center">
                <span className="font-extrabold text-slate-700 text-lg">MS</span>
              </div>

              {/* 더미 닉네임 */}
              <h4 className="font-bold text-base tracking-tight text-center truncate max-w-full mb-1 text-slate-800">
                민수 / 크리에이터
              </h4>

              {/* 더미 Bio */}
              <p className="text-[11px] text-center text-slate-500 max-w-[220px] leading-relaxed mb-5 font-medium shrink-0">
                디지털 생산성 가이드와 나만의 일러스트/디자인 템플릿을 만듭니다.
              </p>

              {/* SNS 아이콘 가로 배열 */}
              <div className="flex justify-center gap-2 mb-5 shrink-0">
                {demoSns.map((sns) => {
                  const Icon = sns.icon;
                  return (
                    <div
                      key={sns.key}
                      className="w-7.5 h-7.5 rounded-lg border border-slate-200/50 bg-white flex items-center justify-center text-slate-500 shadow-2xs hover:text-slate-800 transition-colors cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  );
                })}
              </div>

              {/* 디바이더 선 */}
              <div className="w-[120px] h-[1px] bg-slate-200/60 mb-5 shrink-0" />

              {/* 더미 링크 목록 */}
              <div className="w-full flex-1 space-y-3">
                {demoLinks.map((link) => (
                  <div
                    key={link.id}
                    className="relative w-full min-h-[46px] px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-sm flex items-center justify-between transition-all duration-300 cursor-pointer hover:translate-x-0.5"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* 파비콘 박스 */}
                      <div className="flex items-center justify-center w-5.5 h-5.5 rounded bg-slate-50 border border-slate-150 shrink-0">
                        <FaviconImage url={link.url} title={link.title} />
                      </div>
                      
                      {/* 링크 제목 */}
                      <span className="text-[11px] truncate text-slate-800 font-semibold">
                        {link.title}
                      </span>
                    </div>

                    <div className="shrink-0 text-slate-400 pl-1">
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 소프트웨어 홈 바 데코 */}
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-400/50 rounded-full z-50 pointer-events-none" />
          </div>

          {/* 프리뷰 플로팅 라벨 */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-850 text-white text-[9px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg z-50">
            Interactive Showcase
          </div>
        </div>
      </div>
    </div>
  );
}
