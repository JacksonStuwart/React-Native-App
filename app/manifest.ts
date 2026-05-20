import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atlas — Personal Dashboard",
    short_name: "Atlas",
    description:
      "Track expenses, manage tasks, watch crypto, and keep passwords safe.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0f0f17",
    theme_color: "#5c5c8a",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    categories: ["finance", "productivity", "personalization"],
  };
}
