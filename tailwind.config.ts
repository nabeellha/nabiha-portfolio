import type { Config } from "tailwindcss";
export default { content:["./app/**/*.{ts,tsx}","./components/**/*.{ts,tsx}"], theme:{extend:{colors:{ink:"#0B1120",panel:"#111827",violet:"#8B5CF6",cyan:"#06B6D4",pink:"#EC4899"},fontFamily:{sans:["var(--font-inter)","sans-serif"]}}}, plugins:[] } satisfies Config;
