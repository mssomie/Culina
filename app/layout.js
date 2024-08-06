import { Rubik, Inter,Signika } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const signika = Signika({ subsets: ["latin"] });
const rubik = Rubik({ subsets: ["latin"] });

export const metadata = {
  title: "Stockify - Your inventory management solution",
  description: "Created by Nwobodo Somto Lily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      
      <body className={`${inter.className} ${signika.className} ${rubik.className}`}>
        {children}
      </body>
    </html>
  );
}
