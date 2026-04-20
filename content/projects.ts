export interface Project {
  title: string;
  description: string;
  href: string;
  github: string;
}

export const projects: Project[] = [
  {
    title: "auto-shorts",
    description: "자동으로 쇼츠 내려주는 크롬 익스텐션",
    href: "https://chromewebstore.google.com/detail/ghlhjhnkoblmdmhlocedondppfeididi",
    github: "https://github.com/jsh3418/auto-shorts",
  },
  {
    title: "거지엔빵",
    description: "카카오페이 N빵 지원금을 최대로 받는 계산기",
    href: "https://jsh3418.github.io/geoji-nbbang/",
    github: "https://github.com/jsh3418/geoji-nbbang",
  },
];
