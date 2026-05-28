import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "MyLink - 올인원 프로필 링크 서비스";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
        {/* Left Side: Brand info inspired by Landing Hero */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "55%",
            height: "100%",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "6px 14px",
              borderRadius: "9999px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              color: "#475569",
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "28px",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.02)",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
            <span>가장 아름답고 직관적인 링크 관리 도구</span>
          </div>

          {/* Slogan */}
          <h1
            style={{
              fontSize: "46px",
              fontWeight: 800,
              color: "#0f172a",
              lineHeight: "1.25",
              letterSpacing: "-1.5px",
              margin: "0 0 18px 0",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>모든 링크를 하나의</span>
            <span
              style={{
                backgroundImage: "linear-gradient(to right, #4f46e5, #9333ea, #ec4899)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              세련된 단일 페이지
            </span>
            <span>에 담으세요.</span>
          </h1>

          {/* Description */}
          <p
            style={{
              fontSize: "18px",
              fontWeight: 500,
              color: "#64748b",
              lineHeight: "1.55",
              margin: "0 0 16px 0",
              wordBreak: "keep-all",
              maxWidth: "460px",
            }}
          >
            흩어져 있는 개인 링크를 하나의 노션 스타일 프로필로 정리하고 실시간으로 통계를 추적해 보세요.
          </p>

          {/* Mock URL Input Form (Hero Signature) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 6px 6px 16px",
              backgroundColor: "white",
              border: "1px solid #cbd5e1",
              borderRadius: "16px",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.04)",
              width: "440px",
              marginTop: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                paddingRight: "14px",
                borderRight: "1px solid #f1f5f9",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#94a3b8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              <span
                style={{
                  color: "#94a3b8",
                  fontFamily: "monospace",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                mylink.com/
              </span>
            </div>
            <span
              style={{
                color: "#cbd5e1",
                marginLeft: "12px",
                fontFamily: "monospace",
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              yourname
            </span>
            <div
              style={{
                marginLeft: "auto",
                padding: "10px 18px",
                borderRadius: "10px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              시작하기
            </div>
          </div>
        </div>

        {/* Right Side: Modern white-themed mockup card */}
        <div
          style={{
            width: "40%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "360px",
              height: "460px",
              background: "white",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(15, 23, 42, 0.08), 0 0 0 1px rgba(15, 23, 42, 0.04)",
              border: "1px solid #f1f5f9",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "40px 24px 24px 24px",
              position: "relative",
            }}
          >
            {/* User Avatar Initials */}
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)",
                border: "3px solid #ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
                fontWeight: 700,
                color: "#475569",
                marginBottom: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              ML
            </div>

            {/* Mock User Name */}
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                color: "#0f172a",
                marginBottom: "4px",
              }}
            >
              MyLink
            </span>

            {/* Mock User Handle */}
            <span
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "#94a3b8",
                fontFamily: "monospace",
                marginBottom: "16px",
              }}
            >
              @mylink_demo
            </span>

            {/* Mock Bio */}
            <span
              style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "#64748b",
                textAlign: "center",
                lineHeight: "1.45",
                marginBottom: "28px",
                width: "90%",
              }}
            >
              하나의 페이지에 흩어져 있는 포트폴리오와 소셜 미디어 링크들을 모았습니다.
            </span>

            {/* Mock Buttons */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "46px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
                }}
              >
                웹사이트 보러가기
              </div>
              <div
                style={{
                  width: "100%",
                  height: "46px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
                }}
              >
                공식 유튜브 채널
              </div>
            </div>

            {/* Powered by */}
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                fontSize: "10px",
                fontWeight: 700,
                color: "#cbd5e1",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Powered by MyLink
            </div>
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
