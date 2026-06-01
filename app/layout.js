import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Vardhan Doharey | Full Stack Developer",
  description:
    "Portfolio of Vardhan Doharey — Full Stack Developer building modern web apps with Next.js, React, Node.js, MongoDB, and AI integrations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main id="main-content" className="pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}