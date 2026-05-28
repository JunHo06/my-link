"use client";

import { useMemo } from "react";
import { DashboardLinkItem } from "./dashboard-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { MousePointerClick, Link as LinkIcon, Flame, BarChart2, PieChart as PieIcon, ArrowLeft, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface StatsDashboardProps {
  links: DashboardLinkItem[];
  username: string;
}

export default function StatsDashboard({ links, username }: StatsDashboardProps) {
  const router = useRouter();

  // 통계 계산
  const { totalClicks, activeLinksCount, mostPopularLink, chartData, pieData } = useMemo(() => {
    const total = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    const activeCount = links.filter((link) => link.active).length;
    
    const popular = links.length > 0 
      ? links.reduce((max, link) => (link.clicks || 0) > (max.clicks || 0) ? link : max, links[0])
      : null;

    // 차트용 데이터 가공 (클릭수가 있는 것 우선 정렬 또는 순서대로)
    // 최대 10개의 링크만 차트에 표시하여 너무 복잡하지 않게 함
    const sortedForChart = [...links]
      .sort((a, b) => (b.clicks || 0) - (a.clicks || 0))
      .slice(0, 8);

    const barChartData = sortedForChart.map((link) => ({
      title: link.title || "제목 없음",
      clicks: link.clicks || 0,
    }));

    // 파이 차트용 데이터 (클릭이 1회 이상 발생한 링크 대상)
    const pieChartData = sortedForChart
      .filter((link) => (link.clicks || 0) > 0)
      .map((link) => ({
        name: link.title || "제목 없음",
        value: link.clicks || 0,
      }));

    return {
      totalClicks: total,
      activeLinksCount: activeCount,
      mostPopularLink: popular && (popular.clicks || 0) > 0 ? popular : null,
      chartData: barChartData,
      pieData: pieChartData,
    };
  }, [links]);

  // 차트 테마 컬러 정의 (globals.css의 --chart-1 ~ 5 변수 사용)
  const chartConfig = {
    clicks: {
      label: "클릭 수",
      color: "var(--color-primary)",
    },
  } satisfies ChartConfig;

  // 파이 차트용 고유 색상 리스트
  const PIE_COLORS = [
    "oklch(0.627 0.265 303.9)", // 퍼플
    "oklch(0.609 0.126 221.72)", // 블루
    "oklch(0.675 0.187 48.06)", // 오렌지/앰버
    "oklch(0.723 0.219 149.58)", // 그린
    "oklch(0.577 0.245 27.325)", // 레드
    "oklch(0.488 0.243 264.376)", // 인디고
    "oklch(0.85 0.15 85)", // 옐로우
    "oklch(0.556 0 0)", // 그레이
  ];

  // 파이 차트용 동적 설정 생성 (ChartContainer 내부 useChart 컨텍스트 제공용)
  const pieChartConfig = useMemo(() => {
    const config: ChartConfig = {};
    pieData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: PIE_COLORS[index % PIE_COLORS.length],
      };
    });
    return config;
  }, [pieData]);

  const hasData = links.length > 0;
  const hasClicks = totalClicks > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 상단 네비게이션 및 타이틀 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="h-8 w-8 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-slate-800" />
              링크 분석 통계
            </h1>
          </div>
          <p className="text-xs text-slate-450 pl-10">
            {username ? `@${username}` : "사용자"} 님의 프로필 페이지 유입 분석 통계입니다.
          </p>
        </div>
        
        <Button
          onClick={() => router.push("/")}
          className="sm:self-center bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs rounded-lg px-4 py-2 cursor-pointer shadow-xs"
        >
          대시보드로 복귀
        </Button>
      </div>

      {/* 1. 요약 메트릭 카드 섹션 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        
        {/* 총 클릭 수 카드 */}
        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-2xs overflow-hidden transition-all hover:shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-xs font-bold text-slate-450 tracking-wider uppercase">총 클릭 수</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800">
              <MousePointerClick className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{totalClicks.toLocaleString()}</div>
            <p className="text-[10px] text-slate-400 mt-1">프로필 링크 전체의 누적 클릭 횟수</p>
          </CardContent>
        </Card>

        {/* 활성화된 링크 수 카드 */}
        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-2xs overflow-hidden transition-all hover:shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-xs font-bold text-slate-450 tracking-wider uppercase">활성화된 링크</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-800">
              <LinkIcon className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {activeLinksCount} <span className="text-xs font-semibold text-slate-450">/ {links.length}</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">공개 프로필에 표시 중인 링크 개수</p>
          </CardContent>
        </Card>

        {/* 최고 인기 링크 카드 */}
        <Card className="border border-slate-200/80 bg-white rounded-xl shadow-2xs overflow-hidden transition-all hover:shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-5">
            <CardTitle className="text-xs font-bold text-slate-450 tracking-wider uppercase">최고 인기 링크</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-amber-50/60 border border-amber-200/60 flex items-center justify-center text-amber-500">
              <Flame className="w-4 h-4" />
            </div>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            {mostPopularLink ? (
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-800 truncate" title={mostPopularLink.title}>
                  {mostPopularLink.title}
                </div>
                <div className="text-xl font-black text-slate-900 tracking-tight flex items-baseline gap-1">
                  {mostPopularLink.clicks}
                  <span className="text-[10px] font-semibold text-slate-400 uppercase">clicks</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="text-sm font-semibold text-slate-400">데이터 없음</div>
                <div className="text-xl font-bold text-slate-300">-</div>
              </div>
            )}
            <p className="text-[10px] text-slate-400 mt-1">가장 많은 클릭 수를 기록한 링크</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. 차트 섹션 */}
      {!hasData ? (
        <Card className="border border-slate-200 bg-white rounded-2xl p-10 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3 py-6">
            <HelpCircle className="w-12 h-12 text-slate-300 animate-pulse" />
            <h3 className="text-base font-bold text-slate-800">등록된 링크가 없습니다</h3>
            <p className="text-xs text-slate-450 max-w-sm leading-relaxed">
              대시보드에서 링크를 먼저 등록하고 활성화하시면 실시간 통계 차트를 여기서 한눈에 파악하실 수 있습니다.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="mt-2 bg-slate-900 hover:bg-slate-850 text-white font-semibold text-xs rounded-lg px-4 py-2 cursor-pointer"
            >
              링크 등록하러 가기
            </Button>
          </CardContent>
        </Card>
      ) : !hasClicks ? (
        <Card className="border border-slate-200 bg-white rounded-2xl p-10 text-center">
          <CardContent className="flex flex-col items-center justify-center space-y-3 py-6">
            <MousePointerClick className="w-12 h-12 text-slate-350" />
            <h3 className="text-base font-bold text-slate-800">아직 클릭 통계가 부족합니다</h3>
            <p className="text-xs text-slate-450 max-w-sm leading-relaxed">
              등록된 링크에 아직 발생한 클릭이 없습니다. 내 고유 프로필 링크를 복사하여 SNS나 메신저에 공유하고 유입을 늘려보세요!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* 막대 차트 (Bar Chart) - 전체 클릭량 비교 */}
          <Card className="md:col-span-3 border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden">
            <CardHeader className="p-5 border-b border-slate-100 bg-[#fbfbfa]/50">
              <CardTitle className="text-sm font-bold text-slate-850 flex items-center gap-1.5">
                <BarChart2 className="w-4 h-4 text-slate-500" />
                링크별 클릭수 비교 (Top 8)
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-400">
                클릭수가 가장 많은 최대 8개 링크의 분포입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ChartContainer config={chartConfig} className="w-full h-[280px]">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  accessibilityLayer
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="oklch(0.922 0 0)" />
                  <XAxis
                    dataKey="title"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 10, fontWeight: 500 }}
                    tickFormatter={(value) => (value.length > 6 ? `${value.slice(0, 6)}..` : value)}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tick={{ fill: "oklch(0.556 0 0)", fontSize: 10 }}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    cursor={{ fill: "oklch(0.97 0 0)" }}
                    content={<ChartTooltipContent hideIndicator />}
                  />
                  <Bar
                    dataKey="clicks"
                    fill="oklch(0.205 0 0)"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={45}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* 파이 차트 (Pie Chart) - 점유율 시각화 */}
          <Card className="md:col-span-2 border border-slate-200/80 bg-white rounded-2xl shadow-2xs overflow-hidden flex flex-col">
            <CardHeader className="p-5 border-b border-slate-100 bg-[#fbfbfa]/50">
              <CardTitle className="text-sm font-bold text-slate-850 flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-slate-500" />
                클릭 기여 점유율
              </CardTitle>
              <CardDescription className="text-[11px] text-slate-400">
                각 링크가 차지하는 클릭 기여 비율입니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 flex-1 flex flex-col justify-center items-center">
              <div className="relative w-full h-[180px] flex justify-center items-center">
                <ChartContainer config={pieChartConfig} className="mx-auto aspect-square max-h-[170px] w-full">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  </PieChart>
                </ChartContainer>
                {/* 파이 차트 중앙 총 클릭수 텍스트 */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                  <span className="text-lg font-black text-slate-800">{totalClicks}</span>
                </div>
              </div>

              {/* 커스텀 레전드 (범례) 목록 */}
              <div className="mt-4 w-full max-h-[100px] overflow-y-auto pr-1 space-y-1.5 text-[10px] font-semibold text-slate-500 scrollbar-thin">
                {pieData.map((item, index) => {
                  const percentage = ((item.value / totalClicks) * 100).toFixed(1);
                  return (
                    <div key={item.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                        />
                        <span className="truncate max-w-[120px] text-slate-700" title={item.name}>
                          {item.name}
                        </span>
                      </div>
                      <span className="shrink-0 font-mono text-slate-400">
                        {item.value}회 ({percentage}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>
      )}
      
    </div>
  );
}
