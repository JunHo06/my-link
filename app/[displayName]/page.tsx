import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import PublicProfileClient from "./public-profile-client";

// Request Lifecycle 동안 데이터 조회를 캐싱하여 중복 조회를 방지합니다.
const getProfileData = cache(async (displayName: string) => {
  if (!displayName || displayName === "stats") return null;

  try {
    // 1. usernames/{displayName} 조회
    const usernameRef = doc(db, `usernames/${displayName}`);
    const usernameSnap = await getDoc(usernameRef);
    if (!usernameSnap.exists()) return null;

    const uid = usernameSnap.data().uid;
    if (!uid) return null;

    // 2. users/{uid}/profile/info 조회
    const profileRef = doc(db, `users/${uid}/profile/info`);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) return null;

    const profileData = profileSnap.data();

    // 3. users/{uid}/links 조회 및 정렬
    const linksRef = collection(db, `users/${uid}/links`);
    const q = query(linksRef, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);

    const links: any[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      links.push({
        id: doc.id,
        title: data.title || "",
        url: data.url || "",
        active: data.active !== undefined ? data.active : true,
        order: data.order !== undefined ? data.order : 0,
        clicks: data.clicks !== undefined ? data.clicks : 0,
      });
    });

    return {
      uid,
      profile: {
        nickname: profileData.nickname || "",
        username: profileData.username || "",
        bio: profileData.bio || "",
        snsLinks: profileData.snsLinks || {},
      },
      links: links.filter((link) => link.active !== false),
    };
  } catch (error) {
    console.error("Firestore data fetch error in SSR:", error);
    return null;
  }
});

interface Props {
  params: Promise<{ displayName: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const { displayName } = resolvedParams;

  const data = await getProfileData(displayName);
  if (!data) {
    return {
      title: "사용자를 찾을 수 없습니다 - MyLink",
    };
  }

  const { profile } = data;
  const title = `${profile.nickname} (@${profile.username}) - MyLink`;
  const description = profile.bio || `${profile.nickname}님의 링크트리 및 SNS 프로필을 확인해 보세요.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      username: profile.username,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const resolvedParams = await params;
  const { displayName } = resolvedParams;

  if (displayName === "stats") {
    notFound();
  }

  const data = await getProfileData(displayName);
  if (!data) {
    notFound();
  }

  return (
    <PublicProfileClient
      targetUid={data.uid}
      profile={data.profile}
      links={data.links}
    />
  );
}
