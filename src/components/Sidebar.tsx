import { Link, useLocation } from "react-router-dom";
import { useAuthentication } from "../features/authentication/hooks/useAuthentication";
import { PixelButton } from "./PixelButton";
import { useState } from "react";

export function Sidebar() {
  const { user, logout, isAuthenticated } = useAuthentication();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === "admin";

  const navLinks = isAdmin 
    ? [
        { to: "/", label: "HOME", icon: "🏠" },
        { to: "/admin/events", label: "MANAGE EVENTS", icon: "🗺️" },
        { to: "/admin/events/create", label: "CREATE EVENT", icon: "➕" },
        { to: "/admin/characters", label: "CHARACTERS", icon: "👤" },
        { to: "/admin/registrations", label: "REGISTRATIONS", icon: "📜" },
      ]
    : [
        { to: "/", label: "HOME", icon: "🏠" },
        { to: "/events", label: "AVAILABLE QUESTS", icon: "🗺️" },
        { to: "/joined-events", label: "MY QUESTS", icon: "🛡️" },
      ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-[#f4a261] border-4 border-[#4a2c11] p-2 shadow-[4px_4px_0_0_#000]"
      >
        <span className="text-xl">🍔</span>
      </button>

      {/* Sidebar Container with Bamboo Frame and Woven Rattan Pattern */}
      <aside className={`
        fixed top-0 left-0 h-full w-[240px] z-40 
        flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        bg-[#d8b48f] bg-[radial-gradient(#b58a63_1px,transparent_1px)] bg-[size:8px_8px]
        border-y-[16px] border-x-[20px] border-solid
        [border-image:linear-gradient(to_right,#5c3d24_0%,#8b5e3c_25%,#a67c52_50%,#8b5e3c_75%,#5c3d24_100%)_16_20_repeat]
        shadow-[8px_0_24px_rgba(0,0,0,0.6),inset_0_0_20px_rgba(0,0,0,0.4)]
      `}>
        
        {/* Decorative Top Ivy/Leaves */}
        <div className="absolute top-[-10px] left-[-10px] right-[-10px] h-6 flex justify-between pointer-events-none z-50">
          <span className="text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">🌿</span>
          <span className="text-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">🌿</span>
        </div>

        {/* Header Title Board Plate ("POP UP KATIPUNAN - QC") */}
        <div className="p-3 mt-2 mx-2">
          <div className="bg-[#fcf8f2] border-4 border-[#3d2314] rounded-sm p-2 text-center shadow-[4px_4px_0_0_rgba(0,0,0,0.3)] relative">
            <div className="absolute top-[-4px] bottom-[-4px] left-[6px] right-[6px] border-x-2 border-dashed border-[#bfa285] pointer-events-none" />
            <p className="text-[10px] text-[#c2410c] font-black tracking-widest border-b-2 border-dashed border-[#3d2314] pb-0.5">
              - POP UP -
            </p>
            <p className="text-base text-[#3d2314] font-black tracking-tight leading-none pt-1 [font-family:monospace,sans-serif]">
              KATIPUNAN
            </p>
            <p className="text-[9px] text-[#c2410c] font-black tracking-widest leading-none pt-0.5">
              - QC -
            </p>
          </div>
        </div>

        {/* Festive Hanging Party Flags / Pennants */}
        <div className="flex justify-center gap-1.5 px-6 my-1 opacity-90 drop-shadow-[0_3px_2px_rgba(0,0,0,0.3)]">
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-red-500" />
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-yellow-400" />
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-blue-500" />
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-green-500" />
          <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-orange-500" />
        </div>

        {/* Main Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3.5 z-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to || (link.to !== "/" && location.pathname.startsWith(link.to));
            return (
              <Link 
                key={link.to}
                to={link.to} 
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 border-[3px] border-[#2d190b] rounded-sm transition-all relative group
                  ${isActive 
                    ? 'bg-gradient-to-b from-[#fb923c] to-[#ea580c] text-white translate-y-[2px] shadow-[2px_2px_0_0_#1a0f07]' 
                    : 'bg-gradient-to-b from-[#ffedd5] to-[#fed7aa] hover:from-[#ffe3c2] hover:to-[#ffcc94] text-[#3d2314] shadow-[4px_4px_0_0_#2d190b] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_0_#2d190b]'
                  }
                `}
              >
                {/* Embedded inner structural border lines */}
                <div className={`absolute inset-0.5 border border-dashed pointer-events-none opacity-40 ${isActive ? 'border-white' : 'border-[#6c3d1e]'}`} />
                
                <span className="text-lg drop-shadow-[1px_1px_0_rgba(0,0,0,0.2)]">{link.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-wider">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Identity Banner Card Container */}
        <div className="px-4 py-1.5 mx-2 mb-2 bg-[#4a2e1b]/20 border border-[#4a2e1b]/30 rounded-md flex items-center justify-center gap-2">
          {user?.selectedCharacterImageUrl ? (
            <img 
              src={user.selectedCharacterImageUrl} 
              alt="Avatar" 
              className="w-7 h-7 [image-rendering:pixelated] object-contain"
            />
          ) : (
            <span className="text-sm">{isAdmin ? '👑' : '👤'}</span>
          )}
          <span className="text-[10px] text-[#2d190b] font-black tracking-wide uppercase truncate max-w-[120px]">
            {user?.name ?? "Hero"}
          </span>
        </div>

        {/* Bottom Actions Footer Frame with Red Styled Logout Button */}
        <div className="p-4 border-t-2 border-dashed border-[#5c3d24]/40 mt-auto relative z-10">
          <PixelButton 
            variant="secondary" 
            onClick={() => void logout()} 
            className="w-full !py-2.5 text-[11px] font-black tracking-widest border-[3px] border-[#1f0707] !bg-gradient-to-b !from-[#ef4444] !to-[#b91c1c] hover:!from-[#f87171] hover:!to-[#dc2626] !text-white shadow-[4px_4px_0_0_#1f0707] active:translate-y-[2px] active:shadow-[2px_2px_0_0_#1f0707] transition-all"
          >
            LOGOUT
          </PixelButton>
        </div>

        {/* Plant Sprigs Placement at the base of the bar */}
        <div className="absolute bottom-[-6px] left-[-4px] pointer-events-none z-50 drop-shadow-[0_-2px_2px_rgba(0,0,0,0.5)]">
          <span className="text-xl">🌿</span>
        </div>
        <div className="absolute bottom-[-6px] right-[-4px] pointer-events-none z-50 drop-shadow-[0_-2px_2px_rgba(0,0,0,0.5)]">
          <span className="text-xl">🌿</span>
        </div>

      </aside>

      {/* Mobile Backdrop Overlay Blur */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}