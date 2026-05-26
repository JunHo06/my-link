"use client";

import { useState } from "react";
import { Link as LinkIcon } from "lucide-react";

interface FaviconImageProps {
  url: string;
  title: string;
  fallbackIcon?: React.ComponentType<{ className?: string }>;
}

export default function FaviconImage({
  url,
  title,
  fallbackIcon: FallbackIcon,
}: FaviconImageProps) {
  const [hasError, setHasError] = useState(false);
  const [prevUrl, setPrevUrl] = useState(url);

  // url prop이 변경되면 에러 상태 리셋
  if (url !== prevUrl) {
    setPrevUrl(url);
    setHasError(false);
  }

  let src = "";
  let isInvalidUrl = false;
  try {
    const hostname = new URL(url).hostname;
    // Google Favicon API 사용
    src = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
  } catch {
    isInvalidUrl = true;
  }

  if (hasError || isInvalidUrl || !src) {
    if (FallbackIcon) {
      return <FallbackIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />;
    }
    return <LinkIcon className="w-5 h-5 text-slate-400 group-hover:text-purple-400 transition-colors duration-300" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={title}
      className="w-6 h-6 rounded-full object-contain bg-slate-800 p-0.5 border border-slate-700/50 shadow-sm group-hover:scale-110 transition-transform duration-300"
      onError={() => setHasError(true)}
    />
  );
}
