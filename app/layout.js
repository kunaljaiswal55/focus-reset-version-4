import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topnav from "@/components/Topnav";

export const metadata = {
  title: "Focus Reset - Digital Sanctuary",
  description: "Your digital sanctuary for focus and balance",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface selection:bg-primary/30 min-h-screen font-label">
        <Sidebar />
        <main className="md:pl-64 min-h-screen">
          <Topnav />
          {children}
        </main>
      </body>
    </html>
  );
}
