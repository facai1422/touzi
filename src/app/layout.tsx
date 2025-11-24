import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// 移除Google字体导入，使用系统字体

export const metadata: Metadata = {
  metadataBase: new URL('https://shiqiaos.netlify.app'),
  title: "北京世桥生物制药有限公司",
  description: "北京世桥生物制药有限公司 - 专业的生物制药投资平台",
  keywords: "生物制药,投资,世桥生物,制药公司",
  authors: [{ name: "北京世桥生物制药有限公司" }],
  openGraph: {
    title: "北京世桥生物制药有限公司",
    description: "北京世桥生物制药有限公司 - 专业的生物制药投资平台",
    url: "https://shiqiaos.netlify.app",
    siteName: "世桥生物制药",
    images: [
      {
        url: "/1afcff22e30deaa28685adfc3e942569.jpeg",
        width: 1200,
        height: 630,
        alt: "北京世桥生物制药有限公司",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "北京世桥生物制药有限公司",
    description: "北京世桥生物制药有限公司 - 专业的生物制药投资平台",
    images: ["/1afcff22e30deaa28685adfc3e942569.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
        <Script
          id="tawk-to"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/6923e03a7a43e3195d75cc19/1jaq27pjq';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}
