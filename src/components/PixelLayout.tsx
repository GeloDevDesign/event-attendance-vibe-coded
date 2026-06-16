import type { JSX, ReactNode } from "react";

export interface PixelLayoutProps {
  children: ReactNode;
  maxWidth?: string;
}

export function PixelLayout({ children, maxWidth = "max-w-[800px]" }: PixelLayoutProps): JSX.Element {
  return (
    <main className="grid min-h-svh place-items-start sm:place-items-center bg-cover bg-center px-5 py-8 relative">
      <div 
        className="fixed inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/main-bg.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          filter: "brightness(0.6)"
        }}
      />
      <section className={`w-full ${maxWidth} border-4 border-black bg-[#ebd2a9] p-6 sm:p-8 shadow-[10px_10px_0_0_rgba(0,0,0,1)] relative z-10`}>
        {children}
      </section>
    </main>
  );
}