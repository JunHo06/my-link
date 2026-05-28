"use client";

import { useState } from "react";
import { DashboardLinkItem } from "./dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { GripVertical, ExternalLink, Pencil, Trash2, Loader2, MousePointerClick } from "lucide-react";
import FaviconImage from "./favicon-image";

interface LinkCardProps {
  link: DashboardLinkItem;
  index: number;
  onDelete: (link: DashboardLinkItem) => void;
  onUpdate: (id: string, title: string, url: string) => Promise<boolean>;
  onToggleActive: (id: string, active: boolean) => Promise<void>;
  draggedIndex: number | null;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDragEnd: () => void;
}

export default function LinkCard({
  link,
  index,
  onDelete,
  onUpdate,
  onToggleActive,
  draggedIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
}: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const startEdit = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setErrorMessage("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedTitle = editTitle.trim();
    const trimmedUrl = editUrl.trim();

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

    setIsLoading(true);
    const success = await onUpdate(link.id, trimmedTitle, trimmedUrl);
    setIsLoading(false);

    if (success) {
      setIsEditing(false);
    } else {
      setErrorMessage("수정에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleToggle = async (checked: boolean) => {
    await onToggleActive(link.id, checked);
  };

  const isCurrentDragged = draggedIndex === index;

  return (
    <Card
      draggable={!isEditing}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDragEnd={onDragEnd}
      className={`relative flex flex-col items-stretch p-3.5 min-h-[58px] 
                  border border-slate-200 bg-white text-slate-800 shadow-2xs 
                  transition-all duration-200 hover:bg-slate-50/70 hover:border-slate-300/80 group rounded-xl
                  ${isEditing ? "border-slate-400 bg-white" : ""}
                  ${isCurrentDragged ? "opacity-30 scale-[0.99] border-slate-300" : ""}
                  ${!link.active && !isEditing ? "opacity-55 bg-slate-50/50 border-dashed" : ""}
                  cursor-grab active:cursor-grabbing`}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3 cursor-default">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`edit-title-${link.id}`} className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">
              링크 제목
            </Label>
            <Input
              id={`edit-title-${link.id}`}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="예: 내 깃허브 저장소"
              className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus-visible:ring-slate-400 rounded-lg h-9 text-xs"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`edit-url-${link.id}`} className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">
              연결 주소 (URL)
            </Label>
            <Input
              id={`edit-url-${link.id}`}
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
              placeholder="example.com 또는 https://..."
              className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-300 focus-visible:ring-slate-400 rounded-lg h-9 text-xs"
              disabled={isLoading}
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-[11px] font-medium animate-pulse">{errorMessage}</p>
          )}

          <div className="flex gap-2 justify-end pt-1">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="rounded-lg border border-slate-250 hover:bg-slate-100 text-slate-600 hover:text-slate-900 h-8 px-2.5 text-xs cursor-pointer"
              disabled={isLoading}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold px-3.5 h-8 text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </div>
        </form>
      ) : (
        <div className="flex flex-row items-center w-full min-h-[30px] gap-2.5">
          {/* 드래그 앤 드롭 그립 핸들 */}
          <div className="flex items-center text-slate-350 group-hover:text-slate-400 transition-colors">
            <GripVertical className="w-4 h-4 cursor-grab" />
          </div>

          {/* 파비콘 */}
          <div className="flex items-center justify-center w-7 h-7 rounded bg-slate-50 border border-slate-150 shrink-0">
            <FaviconImage url={link.url} title={link.title} />
          </div>

          {/* 링크 정보 */}
          <div className="flex-1 min-w-0 pr-2 flex flex-col justify-center">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors text-xs sm:text-sm truncate">
                {link.title}
              </span>
              {!link.active && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200 select-none">
                  비공개
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-450">
              <span className="truncate max-w-[120px] sm:max-w-xs">
                {link.url.replace(/^https?:\/\/(www\.)?/, "")}
              </span>
              <span className="inline-flex items-center gap-1 shrink-0 font-semibold text-[9px] text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200" title="클릭 수">
                <MousePointerClick className="w-2.8 h-2.8 text-slate-400" />
                {link.clicks || 0}
              </span>
            </div>
          </div>

          {/* 스위치 & 액션 툴킷 */}
          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            {/* 공개 여부 토글 스위치 */}
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-slate-400 font-semibold hidden sm:inline select-none">
                {link.active ? "공개" : "비공개"}
              </span>
              <Switch
                checked={link.active !== false}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-slate-700 cursor-pointer scale-85"
              />
            </div>

            <div className="flex items-center gap-1">
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all"
                title="새 창으로 열기"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <Button
                variant="ghost"
                size="icon"
                onClick={startEdit}
                className="h-7 w-7 text-slate-450 hover:text-slate-700 hover:bg-slate-100/80 rounded-lg transition-all cursor-pointer"
                title="링크 수정"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(link)}
                className="h-7 w-7 text-slate-450 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                title="링크 삭제"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
