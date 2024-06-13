import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "../components/Layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Ecommercery",
  description: "An ecommerce platform to make shooping easy for you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          <main className="flex min-h-screen flex-col mt-[80px]">
            {children}
          </main>
        </Layout>
      </body>
    </html>
  );
}
