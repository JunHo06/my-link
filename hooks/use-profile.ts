import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { ProfileInfo } from "@/components/dashboard/dashboard-shell";

export function useProfile(userId: string | undefined) {
  return useQuery<ProfileInfo | null>({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) return null;
      const profileRef = doc(db, `users/${userId}/profile/info`);
      const docSnap = await getDoc(profileRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          nickname: data.nickname || "",
          bio: data.bio || "",
          theme: data.theme || "notion-white",
          username: data.username || "",
          snsLinks: data.snsLinks || {},
        };
      }
      return null;
    },
    enabled: !!userId,
  });
}

interface UpdateProfileParams {
  userId: string;
  newProfile: ProfileInfo;
  oldUsername?: string;
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, newProfile, oldUsername }: UpdateProfileParams) => {
      const batch = writeBatch(db);
      const username = newProfile.username?.trim() || "";
      const dbUsername = oldUsername || "";

      // 1. username 변경 시 매핑 관계 수정
      if (username !== dbUsername) {
        if (dbUsername) {
          const oldUsernameRef = doc(db, `usernames/${dbUsername}`);
          batch.delete(oldUsernameRef);
        }
        
        if (username) {
          const newUsernameRef = doc(db, `usernames/${username}`);
          batch.set(newUsernameRef, { uid: userId });
        }
      }

      // 2. 프로필 문서 업데이트
      const profileRef = doc(db, `users/${userId}/profile/info`);
      batch.set(profileRef, newProfile);

      await batch.commit();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["profile", variables.userId] });
    },
  });
}
