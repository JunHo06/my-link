export interface ThemePreset {
  id: string;
  name: string;
  backgroundClass: string;
  cardClass: string;
  textClass: string;
  linkTextClass: string;
  previewBg: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "notion-white",
    name: "노션 화이트 (기본)",
    backgroundClass: "bg-white text-slate-800",
    cardClass: "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-800 shadow-sm",
    textClass: "text-slate-800",
    linkTextClass: "text-slate-800 font-semibold",
    previewBg: "bg-white",
  },
  {
    id: "notion-gray",
    name: "노션 그레이",
    backgroundClass: "bg-[#f4f4f5] text-slate-800",
    cardClass: "bg-white border-slate-200 hover:bg-[#fafafa] hover:border-slate-300 text-slate-800 shadow-sm",
    textClass: "text-slate-800",
    linkTextClass: "text-slate-800 font-semibold",
    previewBg: "bg-[#f4f4f5]",
  },
  {
    id: "warm-sand",
    name: "웜 샌드",
    backgroundClass: "bg-[#fdfcfb] text-amber-950",
    cardClass: "bg-white border-[#f1ebe5] hover:bg-[#faf9f6] hover:border-[#e7ddd3] text-amber-950 shadow-sm",
    textClass: "text-amber-900",
    linkTextClass: "text-amber-950 font-semibold",
    previewBg: "bg-[#fdfcfb]",
  },
  {
    id: "soft-mint",
    name: "소프트 민트",
    backgroundClass: "bg-[#f5fbf7] text-emerald-950",
    cardClass: "bg-white border-[#e6f4eb] hover:bg-[#fafdfb] hover:border-[#cbead6] text-emerald-950 shadow-sm",
    textClass: "text-emerald-900",
    linkTextClass: "text-emerald-950 font-semibold",
    previewBg: "bg-[#f5fbf7]",
  },
  {
    id: "lavender-mist",
    name: "라벤더 미스트",
    backgroundClass: "bg-[#f9f8fc] text-indigo-950",
    cardClass: "bg-white border-[#eeeaf7] hover:bg-[#fbfafd] hover:border-[#dbd2f0] text-indigo-950 shadow-sm",
    textClass: "text-indigo-900",
    linkTextClass: "text-indigo-950 font-semibold",
    previewBg: "bg-[#f9f8fc]",
  },
];

export const getThemeById = (id?: string): ThemePreset => {
  return THEME_PRESETS.find((t) => t.id === id) || THEME_PRESETS[0];
};
