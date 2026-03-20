import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";


export const metadata: Metadata = {
  // 1. Metadata Base (Fixes the warning)
  metadataBase: new URL("https://sandeshkharel.com.np"),

  // 2. Titles
  title: {
    default: "Janak - Headquarter | Soon",
    template: "%s | Syandie"
  },

  // 3. Description & Keywords
  description: "Portfolio - Syandie",
  keywords: ["", "", "", "Syandie", ""],

  // 4. Open Graph
  openGraph: {
    title: "Syandie - Headquarter | Soon",
    description: "Portfolio - Syandie",
    url: "https://sandeshkharel.com.np",
    siteName: "Portfolio - Syandie",
    // images: [
    //   {
    //     url: "/og-image.webp", 
    //     width: 1200,
    //     height: 630,
    //     alt: "Portfolio - Syandie",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },

  // 5. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Syandie - Headquarter | Soon",
    description: "Portfolio - Syandie",
    images: ["/og-image.png"],
    creator: "@Khar3lSand3sh",
  },

  // 6. Favicons & Icons
  icons: {
    icon: { url: "/construct.png", type: "image/png" },
    // shortcut: "/bawkka.webp",
    // apple: "/bawkka.png", // .webp might not support capital letter naming for the assests.
  },

  // 7. Verification
  // verification: {
  //   google: "",
  // },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${poppins.className} flex flex-col min-h-screen m-0 p-0 overflow-x-hidden`}>
          <main className="flex-grow">
            {children}
          </main>
      </body>
    </html>
  );
}
