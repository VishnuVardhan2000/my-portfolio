import { Space_Grotesk, Syne } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-space-grotesk'
});

const syne = Syne({ 
  subsets: ['latin'],
  variable: '--font-syne'
});

export const metadata = {
  title: 'Vardhan Doharey',
  description: 'Full-Stack Developer & Digital Marketer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${syne.variable} antialiased bg-[#0A0F1E] text-[#E8EAF0]`}
        style={{ fontFamily: 'var(--font-space-grotesk)' }}>
        <Navbar />
        <main className="animate-fadeIn">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
