import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  writeBatch,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { DashboardLinkItem } from "@/components/dashboard/dashboard-shell";

export function useLinks(userId: string | undefined) {
  return useQuery<DashboardLinkItem[]>({
    queryKey: ["links", userId],
    queryFn: async () => {
      if (!userId) return [];
      const linksRef = collection(db, `users/${userId}/links`);
      const q = query(linksRef, orderBy("order", "asc"));
      const querySnapshot = await getDocs(q);
      const linkData: DashboardLinkItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        linkData.push({
          id: doc.id,
          title: data.title || "",
          url: data.url || "",
          active: data.active !== undefined ? data.active : true,
          order: data.order !== undefined ? data.order : 0,
        });
      });
      return linkData;
    },
    enabled: !!userId,
  });
}

// 1. 링크 추가 Mutation
export function useAddLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, title, url, nextOrder }: { userId: string; title: string; url: string; nextOrder: number }) => {
      await addDoc(collection(db, `users/${userId}/links`), {
        title,
        url,
        active: true,
        order: nextOrder,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["links", variables.userId] });
    },
  });
}

// 2. 링크 수정 Mutation
export function useUpdateLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, linkId, title, url }: { userId: string; linkId: string; title: string; url: string }) => {
      await updateDoc(doc(db, `users/${userId}/links`, linkId), {
        title,
        url,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["links", variables.userId] });
    },
  });
}

// 3. 링크 토글 Mutation
export function useToggleLinkActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, linkId, active }: { userId: string; linkId: string; active: boolean }) => {
      await updateDoc(doc(db, `users/${userId}/links`, linkId), {
        active,
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["links", variables.userId] });
    },
  });
}

// 4. 링크 삭제 Mutation
export function useDeleteLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, linkId }: { userId: string; linkId: string }) => {
      await deleteDoc(doc(db, `users/${userId}/links`, linkId));
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["links", variables.userId] });
    },
  });
}

// 5. 링크 복구 Mutation
export function useRestoreLink() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      userId,
      linkId,
      link,
    }: {
      userId: string;
      linkId: string;
      link: Omit<DashboardLinkItem, "id">;
    }) => {
      await setDoc(doc(db, `users/${userId}/links`, linkId), {
        ...link,
        createdAt: new Date(),
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["links", variables.userId] });
    },
  });
}

// 6. 링크 순서 드래그 앤 드롭 일괄 저장 Mutation
export function useUpdateLinksOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, localLinks }: { userId: string; localLinks: DashboardLinkItem[] }) => {
      const batch = writeBatch(db);
      localLinks.forEach((link, index) => {
        const linkRef = doc(db, `users/${userId}/links`, link.id);
        batch.update(linkRef, { order: index });
      });
      await batch.commit();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["links", variables.userId] });
    },
  });
}
