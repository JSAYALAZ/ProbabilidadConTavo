import { Inter } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

      <html lang="en" title="ProbabilidadConTavo">
        <body className={inter.className}>
          {children}

        </body>
      </html>
  );
}
