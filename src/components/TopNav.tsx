import { Link } from "react-router-dom";
import { useAuthentication } from "../features/authentication/hooks/useAuthentication";
import { PixelButton } from "./PixelButton";

export function TopNav() {
  const { user, logout, isAuthenticated } = useAuthentication();

  if (!isAuthenticated) return null;

  const isAdmin = user?.role === "admin";

  return (
    <nav className="w-full bg-[#ebd2a9] border-b-4 border-black shadow-[0_4px_0_0_#000] relative z-20 mb-8 flex justify-center">
      <div className="w-full max-w-[1200px] p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-x-auto">
          <Link to="/" className="text-black font-black text-[12px] hover:text-orange-600 drop-shadow-[1px_1px_0_#fff]">
            HOME
          </Link>
          <span className="text-black">|</span>
          
          {isAdmin ? (
            <>
              <Link to="/admin/events" className="text-black font-black text-[10px] hover:text-orange-600">
                MANAGE EVENTS
              </Link>
              <span className="text-black">|</span>
              <Link to="/admin/characters" className="text-black font-black text-[10px] hover:text-orange-600">
                CHARACTERS
              </Link>
            </>
          ) : (
            <>
              <Link to="/events" className="text-black font-black text-[10px] hover:text-orange-600">
                AVAILABLE QUESTS
              </Link>
              <span className="text-black">|</span>
              <Link to="/joined-events" className="text-black font-black text-[10px] hover:text-orange-600">
                MY QUESTS
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2">
            {!isAdmin && user?.selectedCharacterImageUrl && (
              <img 
                src={user.selectedCharacterImageUrl} 
                alt="Avatar" 
                className="w-8 h-8 [image-rendering:pixelated] border-2 border-black bg-white"
              />
            )}
            <span className="text-[10px] text-black drop-shadow-[1px_1px_0_#fff] font-bold">
              {user?.name ?? "Hero"}
            </span>
          </div>
          <PixelButton variant="secondary" onClick={() => void logout()} className="!py-2 !px-4 text-[10px]">
            LOGOUT
          </PixelButton>
        </div>
      </div>
    </nav>
  );
}
