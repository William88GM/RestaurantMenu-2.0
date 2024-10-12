import { Inter } from "next/font/google";
import "../Styles/globals.css";
import { ContextProvider } from "@/Context/Context";
import localFont from 'next/font/local'
import { SessionContextProvider } from "@/Context/SessionContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "La Vene San Juan",
  description: "Menu del restaurant La Vene San Juan, Argentina",
};

const Courgette = localFont({
  src: './fonts/font.ttf',
  display: 'swap',
})

export const viewport = {
  themeColor: "#ffa2a2"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={Courgette.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <meta name="color-scheme" content="light dark" />

        <meta property="og:title" content="La Vene San Juan" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_URL} />
        <meta property="og:image" content={`${process.env.NEXT_PUBLIC_URL}/images/opengraph.webp`} />
        <meta property="og:description" content="Menu del restaurant La Vene San Juan, Argentina" />
        <meta property="og:site_name" content="La Vene San Juan" />
        <meta property="og:locale" content="es" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="La Vene San Juan" />
        <meta name="twitter:description" content="Menu del restaurant La Vene San Juan, Argentina" />
        <meta name="twitter:image" content={`${process.env.NEXT_PUBLIC_URL}/images/opengraph.webp`} />
        <meta name="robots" content="index, follow" />

        <link rel="canonical" href="https://martinezcode.top/Sucursal-Estadio" />

      </head>
      <body className={inter.className}>
        <SessionContextProvider>
          <ContextProvider>{children}</ContextProvider>
        </SessionContextProvider>

      </body>
    </html>
  );
}
