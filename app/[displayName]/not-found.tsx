"use client";

import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProfileNotFound() {
  const router = useRouter();

  return (
    <div className="min-h-svh bg-[#fbfbfa] text-slate-800 flex flex-col items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-2xl text-center space-y-6 shadow-sm">
        <div className="w-12 h-12 rounded-full bg-red-50 border border-red-200 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-base font-bold text-slate-800">페이지를 찾을 수 없습니다</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            요청하신 프로필이 존재하지 않거나 비공개 상태입니다. 주소를 다시 확인해 주세요.
          </p>
        </div>
        <Button
          onClick={() => router.push("/")}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg h-11 cursor-pointer text-xs"
        >
          MyLink 시작하기
        </Button>
      </Card>
    </div>
  );
}
