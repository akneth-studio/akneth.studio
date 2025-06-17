import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "AKNETH Studio Katarzyna Pawłowska-Malesa",
        short_name: "AKNETH Studio",
        id: "/",
        description: "Portfolio i strona wizytówkowa AKNETH Studio",
        start_url: "/",
        display: "standalone",
        theme_color: '#0b7285',
        background_color: "#f1f3f5",
        orientation: "portrait",
        lang: "pl",
        icons: [
            {
                src: "/favicon.ico",
                type: "image/x-icon",
            },
            {
                src: '/apple-touch-icon.png',
                sizes: '180x180',
                type: 'image/png',
            },
            {
                src: "/android-chrome-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "/android-chrome-512x512.png",
                sizes: "512x512",
                type: "image/png",
            },
        ],
    };
}
