import {
  Camera, // 인스타그램 대체 아이콘
  Video, // 유튜브 대체 아이콘
  BookOpen, // 블로그 아이콘으로 사용
  Code, // GitHub 대체 아이콘
  Briefcase, // 포트폴리오 아이콘으로 사용
  LucideIcon,
} from "lucide-react";

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
}

export const dummyLinks: LinkItem[] = [
  {
    id: "link-1",
    title: "인스타그램",
    url: "https://instagram.com",
    icon: Camera,
  },
  {
    id: "link-2",
    title: "유튜브",
    url: "https://youtube.com",
    icon: Video,
  },
  {
    id: "link-3",
    title: "블로그",
    url: "https://blog.naver.com",
    icon: BookOpen,
  },
  {
    id: "link-4",
    title: "GitHub",
    url: "https://github.com",
    icon: Code,
  },
  {
    id: "link-5",
    title: "포트폴리오",
    url: "https://your-portfolio.com",
    icon: Briefcase,
  },
];
