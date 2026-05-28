"use client";

import { useState } from "react";
import { User } from "firebase/auth";
import { DashboardLinkItem } from "./dashboard-shell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Loader2, Link as LinkIcon, MousePointerClick } from "lucide-react";
import LinkCard from "./link-card";
import { toast } from "sonner";
import {
  useAddLink,
  useUpdateLink,
  useToggleLinkActive,
  useDeleteLink,
  useRestoreLink,
  useUpdateLinksOrder,
} from "@/hooks/use-links";

interface LinkManagerProps {
  user: User;
  links: DashboardLinkItem[];
  isLoading: boolean;
}

export default function LinkManager({ user, links, isLoading }: LinkManagerProps) {
  const [localLinks, setLocalLinks] = useState<DashboardLinkItem[]>(links);
  const [prevLinks, setPrevLinks] = useState<DashboardLinkItem[]>(links);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // 다이얼로그 추가용 상태
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addTitle, setAddTitle] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [addErrorMessage, setAddErrorMessage] = useState("");

  // Mutations
  const addLinkMutation = useAddLink();
  const updateLinkMutation = useUpdateLink();
  const toggleLinkActiveMutation = useToggleLinkActive();
  const deleteLinkMutation = useDeleteLink();
  const restoreLinkMutation = useRestoreLink();
  const updateLinksOrderMutation = useUpdateLinksOrder();
  
  // Firestore 데이터가 업데이트되면 로컬 리스트도 업데이트 (단, 드래그 중이 아닐 때만)
  if (links !== prevLinks) {
    setPrevLinks(links);
    if (draggedIndex === null) {
      setLocalLinks(links);
    }
  }

  // 링크 추가 제출 처리
  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddErrorMessage("");

    const trimmedTitle = addTitle.trim();
    const trimmedUrl = addUrl.trim();

    if (!trimmedTitle) {
      setAddErrorMessage("제목을 입력해주세요");
      return;
    }
    if (!trimmedUrl) {
      setAddErrorMessage("주소를 입력해주세요");
      return;
    }

    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i;
    if (!urlPattern.test(trimmedUrl)) {
      setAddErrorMessage("올바른 주소를 입력해주세요");
      return;
    }

    const finalUrl =
      trimmedUrl.startsWith("http://") || trimmedUrl.startsWith("https://")
        ? trimmedUrl
        : `https://${trimmedUrl}`;

    // 추가할 때 order는 맨 마지막으로 지정
    const nextOrder = links.reduce((max, link) => Math.max(max, link.order || 0), -1) + 1;

    addLinkMutation.mutate(
      {
        userId: user.uid,
        title: trimmedTitle,
        url: finalUrl,
        nextOrder,
      },
      {
        onSuccess: () => {
          setAddTitle("");
          setAddUrl("");
          setIsAddOpen(false);
          toast.success("링크가 추가되었습니다.");
        },
        onError: (err) => {
          console.error("Firestore 링크 추가 에러:", err);
          setAddErrorMessage("링크를 추가하지 못했습니다. 다시 시도해주세요.");
        },
      }
    );
  };

  // 링크 수정 처리
  const handleUpdateLink = async (id: string, title: string, url: string): Promise<boolean> => {
    const finalUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    try {
      await updateLinkMutation.mutateAsync({
        userId: user.uid,
        linkId: id,
        title,
        url: finalUrl,
      });
      toast.success("링크가 수정되었습니다.");
      return true;
    } catch (err) {
      console.error("Firestore 링크 수정 에러:", err);
      return false;
    }
  };

  // 링크 공개/비공개 토글 처리
  const handleToggleActive = async (id: string, active: boolean) => {
    toggleLinkActiveMutation.mutate(
      {
        userId: user.uid,
        linkId: id,
        active,
      },
      {
        onSuccess: () => {
          toast.success(
            active ? "링크를 공개 상태로 전환했습니다." : "링크를 비공개 상태로 전환했습니다."
          );
        },
        onError: (err) => {
          console.error("Firestore 링크 토글 에러:", err);
          toast.error("설정을 변경하지 못했습니다.");
        },
      }
    );
  };

  // 링크 삭제 처리 (실행 취소 - Undo 지원)
  const handleDeleteLink = async (link: DashboardLinkItem) => {
    deleteLinkMutation.mutate(
      {
        userId: user.uid,
        linkId: link.id,
      },
      {
        onSuccess: () => {
          toast.success(`"${link.title}" 링크가 삭제되었습니다.`, {
            action: {
              label: "실행 취소",
              onClick: () => {
                restoreLinkMutation.mutate(
                  {
                    userId: user.uid,
                    linkId: link.id,
                    link: {
                      title: link.title,
                      url: link.url,
                      active: link.active !== undefined ? link.active : true,
                      order: link.order !== undefined ? link.order : 0,
                    },
                  },
                  {
                    onSuccess: () => {
                      toast.success("링크가 복구되었습니다.");
                    },
                    onError: (err) => {
                      console.error("링크 복구 에러:", err);
                      toast.error("링크를 복구하지 못했습니다.");
                    },
                  }
                );
              },
            },
            duration: 5000,
          });
        },
        onError: (err) => {
          console.error("Firestore 링크 삭제 에러:", err);
          toast.error("링크를 삭제하지 못했습니다.");
        },
      }
    );
  };

  // HTML5 Drag & Drop: 드래그 시작
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  // HTML5 Drag & Drop: 드래그 중 다른 항목 위를 지나갈 때
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const updatedLinks = [...localLinks];
    const draggedItem = updatedLinks[draggedIndex];
    
    updatedLinks.splice(draggedIndex, 1);
    updatedLinks.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setLocalLinks(updatedLinks);
  };

  // HTML5 Drag & Drop: 드래그 종료 및 Firestore 순서 일괄 갱신
  const handleDragEnd = async () => {
    if (draggedIndex === null) return;
    setDraggedIndex(null);

    updateLinksOrderMutation.mutate(
      {
        userId: user.uid,
        localLinks,
      },
      {
        onSuccess: () => {
          toast.success("순서가 저장되었습니다.");
        },
        onError: (err) => {
          console.error("순서 일괄 업데이트 에러:", err);
          toast.error("순서를 저장하지 못했습니다.");
          setLocalLinks(links);
        },
      }
    );
  };

  const isAdding = addLinkMutation.isPending;
  const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);

  return (
    <div className="space-y-5 text-slate-800">
      {/* 상단 컨트롤 바 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-800 tracking-tight">링크 목록</h2>
            {links.length > 0 && (
              <span className="inline-flex items-center gap-1 font-semibold text-[10px] text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded" title="총 클릭 수">
                <MousePointerClick className="w-3 h-3 text-slate-400" />
                {totalClicks}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            목록에서 행을 잡고 끌어서 위아래 순서를 정렬할 수 있습니다.
          </p>
        </div>

        {/* 새 링크 추가 다이얼로그 */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-sm rounded-lg h-9.5 px-4 flex items-center gap-1.5 cursor-pointer text-xs transition-transform hover:-translate-y-0.5 active:translate-y-0">
              <Plus className="w-4 h-4" />
              새 링크 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200 text-slate-800 max-w-md rounded-xl shadow-lg p-6">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-800">
                새 링크 추가
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs">
                사용자 프로필 페이지에 표시할 링크의 제목과 주소를 입력해주세요.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleAddLink} className="space-y-4 mt-3">
              <div className="space-y-1.5">
                <Label htmlFor="add-title" className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">
                  링크 제목
                </Label>
                <Input
                  id="add-title"
                  value={addTitle}
                  onChange={(e) => setAddTitle(e.target.value)}
                  placeholder="예: 내 포트폴리오 사이트"
                  className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-350 focus-visible:ring-slate-400 rounded-lg h-10 text-xs"
                  disabled={isAdding}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="add-url" className="text-slate-500 font-semibold text-[10px] uppercase tracking-wide">
                  연결 주소 (URL)
                </Label>
                <Input
                  id="add-url"
                  value={addUrl}
                  onChange={(e) => setAddUrl(e.target.value)}
                  placeholder="example.com 또는 https://..."
                  className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-350 focus-visible:ring-slate-400 rounded-lg h-10 text-xs"
                  disabled={isAdding}
                />
              </div>

              {addErrorMessage && (
                <p className="text-red-500 text-xs font-medium animate-pulse">{addErrorMessage}</p>
              )}

              <div className="flex gap-2.5 justify-end pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddOpen(false)}
                  className="rounded-lg border border-slate-250 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs h-9 cursor-pointer"
                  disabled={isAdding}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold px-4 text-xs h-9 cursor-pointer"
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      추가 중...
                    </>
                  ) : (
                    "링크 추가"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 링크 목록 */}
      <div className="space-y-3">
        {isLoading ? (
          // 스켈레톤 로더
          Array.from({ length: 2 }).map((_, i) => (
            <Card
              key={i}
              className="relative flex flex-row items-center p-4 min-h-[58px] border border-slate-100 bg-white rounded-xl animate-pulse"
            >
              <div className="w-3 h-3 bg-slate-100 rounded mr-2" />
              <div className="w-7 h-7 rounded bg-slate-100" />
              <div className="flex-1 pl-4 flex flex-col gap-2">
                <div className="h-3 bg-slate-100 rounded w-1/4" />
                <div className="h-2.5 bg-slate-100 rounded w-1/3" />
              </div>
            </Card>
          ))
        ) : localLinks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl bg-slate-50/40">
            <LinkIcon className="w-7 h-7 text-slate-350 mx-auto mb-2" />
            <p className="text-xs text-slate-400">등록된 링크가 없습니다.</p>
            <p className="text-[10px] text-slate-400/80 mt-0.5">우측 상단 버튼을 통해 새로운 링크를 추가해보세요.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {localLinks.map((link, index) => (
              <LinkCard
                key={link.id}
                link={link}
                index={index}
                onDelete={handleDeleteLink}
                onUpdate={handleUpdateLink}
                onToggleActive={handleToggleActive}
                draggedIndex={draggedIndex}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
