import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LeadFlow",
    short_name: "LeadFlow",
    description: "Simple CRM for modern sales teams.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f1115",
    theme_color: "#ea580c",
    icons: [
      {
        src: "/branding/leadflow-logo.svg",
        sizes: "120x120",
        type: "image/svg+xml",
      },
    ],
  };
}
