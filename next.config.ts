import type { NextConfig } from "next";

// Two deploy targets:
// - GitHub Pages: static files only, served from /<repo-name>. The workflow sets GITHUB_PAGES=true.
// - Hostinger / Vercel / any Node host: normal Next.js server build in .next, run with `npm start`.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGithubPages ? process.env.PAGES_BASE_PATH || "" : "";

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const } : {}),
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
