import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Vishnu Vardhan',
  description: 'Full-Stack Developer & Digital Marketer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#0A0F1E] text-[#E8EAF0]">
        <Navbar />
        <main className="animate-fadeIn">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
