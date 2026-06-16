import type { JSX, ReactNode } from "react";
import { Sidebar } from "./Sidebar";

export interface PixelLayoutProps {
  children: ReactNode;
  maxWidth?: string;
  hideNav?: boolean;
}

export function PixelLayout({ children, maxWidth = "max-w-[800px]", hideNav = false }: PixelLayoutProps): JSX.Element {
  return (
    <main className="min-h-svh flex relative">
      <div 
        className="fixed inset-0 z-0 pointer-events-none" 
        style={{ 
          backgroundImage: "url('/main-bg.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          filter: "brightness(0.6)"
        }}
      />
      
      {!hideNav && <Sidebar />}

      <div className={`flex-1 flex flex-col items-center justify-start sm:justify-center p-4 pt-16 sm:p-8 z-10 min-h-svh overflow-y-auto ${!hideNav ? 'md:ml-[250px]' : ''}`}>
        <section className={`w-full ${maxWidth} border-4 border-black bg-[#ebd2a9] p-6 sm:p-8 shadow-[10px_10px_0_0_rgba(0,0,0,1)] relative z-10`}>
          {children}
        </section>
      </div>
    </main>
  );
}