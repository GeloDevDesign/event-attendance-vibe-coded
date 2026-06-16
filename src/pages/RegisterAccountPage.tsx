import type { JSX } from "react";

import { RegisterAccountForm } from "../features/authentication/components/RegisterAccountForm";
import { useAuthentication } from "../features/authentication/hooks/useAuthentication";
import { PixelButton } from "../components/PixelButton";

export function RegisterAccountPage(): JSX.Element {
  const { error, isSubmitting, register } = useAuthentication();

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
        className="w-full max-w-[800px] border-4 border-black bg-[#ebd2a9] p-8 pb-10 shadow-[10px_10px_0_0_rgba(0,0,0,1)] relative z-10"
        aria-labelledby="register-title"
      >
        <div className="flex flex-col items-center">
          <h1 id="register-title" className="text-3xl text-center leading-snug text-black mb-8">
            REGISTER
          </h1>

          <div className="w-full">
            <RegisterAccountForm
              isSubmitting={isSubmitting}
              error={error}
              onSubmit={register}
            />
            <div className="max-w-[320px] ml-auto">
              <PixelButton
                variant="secondary"
                to="/login"
                className="w-full mt-6"
              >
                SIGN IN INSTEAD
              </PixelButton>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
