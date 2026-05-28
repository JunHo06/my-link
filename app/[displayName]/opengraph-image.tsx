import { ImageResponse } from "next/og";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, query, orderBy } from "firebase/firestore";

export const runtime = "nodejs";

export const alt = "MyLink Profile";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Firestore에서 프로필 및 링크 데이터를 조회하는 헬퍼 함수
async function getProfileData(displayName: string) {
  try {
    const usernameRef = doc(db, `usernames/${displayName}`);
    const usernameSnap = await getDoc(usernameRef);
    if (!usernameSnap.exists()) return null;
    
    const uid = usernameSnap.data().uid;
    if (!uid) return null;
    
    const profileRef = doc(db, `users/${uid}/profile/info`);
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) return null;
    
    const profile = profileSnap.data();
    
    // 링크 정보 조회 (최대 2개만 노출)
    const linksRef = collection(db, `users/${uid}/links`);
    const q = query(linksRef, orderBy("order", "asc"));
    const linksSnap = await getDocs(q);
    const links: any[] = [];
    linksSnap.forEach((doc) => {
      const data = doc.data();
      if (data.active !== false) {
        links.push({
          title: data.title || "",
          url: data.url || "",
        });
      }
    });
    
    return {
      nickname: profile.nickname || "",
      bio: profile.bio || "",
      username: profile.username || displayName,
      links: links.slice(0, 2),
    };
  } catch (e) {
    console.error("Error fetching user profile for OG Image:", e);
    return null;
  }
}

export default async function Image({ params }: { params: { displayName: string } }) {
  const { displayName } = params;
  
  // Pretendard 폰트 로드
  const fontSemiBold = await fetch(
    new URL(
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard-std/dist/web/static/woff/PretendardStd-SemiBold.woff",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  const fontBold = await fetch(
    new URL(
      "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/packages/pretendard-std/dist/web/static/woff/PretendardStd-Bold.woff",
      import.meta.url
    )
  ).then((res) => res.arrayBuffer());

  // Firestore 조회
  const data = await getProfileData(displayName);

  // 사용자가 존재하지 않거나 데이터가 없을 때 렌더링할 에러/디폴트 뷰
  if (!data) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(239, 68, 68, 0.05), transparent 60%)",
            fontFamily: "Pretendard",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px",
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.04)",
              border: "1px solid #e2e8f0",
              width: "500px",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "#fef2f2",
                border: "1px solid #fee2e2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "20px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#1e293b",
                margin: "0 0 8px 0",
              }}
            >
              존재하지 않는 프로필
            </h2>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 500,
                color: "#64748b",
                margin: "0 0 24px 0",
                textAlign: "center",
              }}
            >
              요청하신 프로필을 찾을 수 없거나 주소가 유효하지 않습니다.
            </p>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: "#cbd5e1",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Powered by MyLink
            </span>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          {
            name: "Pretendard",
            data: fontSemiBold,
            style: "normal",
            weight: 600,
          },
          {
            name: "Pretendard",
            data: fontBold,
            style: "normal",
            weight: 700,
          },
        ],
      }
    );
  }

  // 이니셜 추출
  const initial = (data.nickname || data.username || "U")[0].toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          backgroundImage: "radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.12), transparent 45%), radial-gradient(circle at 90% 80%, rgba(168, 85, 247, 0.1), transparent 45%), radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.06), transparent 50%)",
          padding: "60px 80px",
          fontFamily: "Pretendard",
        }}
      >
        {/* Left Side: Profile info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "50%",
            height: "100%",
          }}
        >
          {/* Avatar & Username */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                width: "76px",
                height: "76px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
                color: "#475569",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
              }}
            >
              {initial}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h1
                style={{
                  fontSize: "34px",
                  fontWeight: 800,
                  color: "#0f172a",
                  margin: "0 0 2px 0",
                  letterSpacing: "-0.5px",
                }}
              >
                {data.nickname}
              </h1>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "#94a3b8",
                  fontFamily: "monospace",
                }}
              >
                @{data.username}
              </span>
            </div>
          </div>

          {/* Bio */}
          {data.bio ? (
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#475569",
                lineHeight: "1.55",
                margin: "0 0 32px 0",
                wordBreak: "keep-all",
                maxHeight: "100px",
                overflow: "hidden",
                maxWidth: "460px",
              }}
            >
              {data.bio}
            </p>
          ) : (
            <p
              style={{
                fontSize: "20px",
                fontWeight: 500,
                color: "#cbd5e1",
                lineHeight: "1.5",
                margin: "0 0 32px 0",
                fontStyle: "italic",
              }}
            >
              소개글이 작성되지 않았습니다.
            </p>
          )}

          {/* Brand mark at bottom-left */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "auto",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                backgroundColor: "#0f172a",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a",
                letterSpacing: "-0.2px",
              }}
            >
              MyLink
            </span>
          </div>
        </div>

        {/* Right Side: Mock links list (white and clean card) */}
        <div
          style={{
            width: "45%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              background: "white",
              padding: "32px 24px",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.06), 0 0 0 1px rgba(15, 23, 42, 0.04)",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "1.5px",
                marginBottom: "8px",
              }}
            >
              Links
            </span>

            {data.links.length === 0 ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100px",
                  border: "1px dashed #cbd5e1",
                  borderRadius: "12px",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "#94a3b8",
                }}
              >
                등록된 링크가 없습니다.
              </div>
            ) : (
              data.links.map((link, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "16px 20px",
                    background: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "16px",
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "#334155",
                      maxWidth: "85%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {link.title}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Pretendard",
          data: fontSemiBold,
          style: "normal",
          weight: 600,
        },
        {
          name: "Pretendard",
          data: fontBold,
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
