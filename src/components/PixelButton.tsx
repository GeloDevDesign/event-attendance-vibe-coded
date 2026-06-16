import type { JSX, ReactNode } from "react";
import { Link } from "react-router-dom";

export interface PixelButtonProps {
  variant?: "primary" | "secondary" | "accent";
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  to?: string;
}

export function PixelButton({
  variant = "primary",
  children,
  onClick,
  className = "",
  type = "button",
  disabled = false,
  to,
}: PixelButtonProps): JSX.Element {
  const baseClasses = `
    group relative inline-flex items-center justify-center 
    border-4 border-black px-6 min-h-[48px]
    text-[10px] sm:text-[12px] tracking-widest uppercase font-['Press_Start_2P']
    transition-all active:translate-y-[4px] active:translate-x-[4px] 
    shadow-[4px_4px_0_0_#000] active:shadow-none
    disabled:opacity-50 disabled:cursor-not-allowed disabled:active:translate-y-0 disabled:active:translate-x-0 disabled:active:shadow-[4px_4px_0_0_#000]
  `;

  const variantClasses = {
    primary: "bg-[#ff7324] text-white hover:bg-[#ff8c4a]",
    secondary: "bg-white text-black hover:bg-[#fff9c4]",
    accent: "bg-[#3db5e6] text-white hover:bg-[#5cd0fc]",
  };

  const textShadow = variant === "secondary" ? {} : { textShadow: "2px 2px 0 #000" };
  const cursorColor = variant === "secondary" ? "text-black" : "text-white";

  const content = (
    <>
      <span className={`mr-3 animate-pixel-blink opacity-0 group-hover:opacity-100 hidden sm:inline-block ${cursorColor}`} style={{ textShadow: "none" }}>▶</span>
      {children}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
        style={textShadow}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={textShadow}
    >
      {content}
    </button>
  );
}
