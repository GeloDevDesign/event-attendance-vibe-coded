import type { JSX } from "react";

import { LoginForm } from "../features/authentication/components/LoginForm";
import { useAuthentication } from "../features/authentication/hooks/useAuthentication";
import { PixelButton } from "../components/PixelButton";

export function LoginPage(): JSX.Element {
  const { error, isSubmitting, login } = useAuthentication();

  return (
    <main 
      className="grid min-h-svh place-items-center bg-cover bg-center px-5 py-8 font-['Press_Start_2P'] relative"
    >
      <div 
        className="absolute inset-0 z-0" 
        style={{ 
          backgroundImage: "url('/main-bg.jpg')", 
          backgroundSize: "cover", 
          backgroundPosition: "center",
          filter: "brightness(0.6)"
        }}
      ></div>
      
      <section
        className="w-full max-w-[480px] border-[6px] border-black bg-[#ebd2a9] p-10 shadow-[12px_12px_0_0_rgba(0,0,0,1)] relative z-10"
        aria-labelledby="login-title"
      >
        <div className="flex flex-col items-center">
          <h1 id="login-title" className="text-3xl text-center leading-snug text-black mb-10 tracking-widest">
            LOGIN
          </h1>

          <div className="w-full">
            <LoginForm isSubmitting={isSubmitting} error={error} onSubmit={login} />
            <PixelButton
              variant="secondary"
              to="/register"
              className="w-full mt-6"
            >
              CREATE HERO
            </PixelButton>
          </div>
        </div>
      </section>
    </main>
  );
}