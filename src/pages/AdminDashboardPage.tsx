import type { JSX } from "react";
import { Link } from "react-router-dom";
import { PixelLayout } from "../components/PixelLayout";

export function AdminDashboardPage(): JSX.Element {
  return (
    <PixelLayout maxWidth="max-w-[800px]">
      <header className="mb-8 border-b-4 border-black pb-6">
        <h1 className="text-3xl text-black mb-2 uppercase drop-shadow-[1px_1px_0_#fff]">Admin Hub</h1>
        <p className="text-[10px] text-stone-700 leading-relaxed">Manage your game world, events, and player attendance.</p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link 
          to="/admin/characters"
          className="group block border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#000]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#3db5e6] border-4 border-black flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
              <span className="text-white text-xl" style={{ textShadow: "2px 2px 0 #000" }}>👤</span>
            </div>
            <h2 className="text-[14px] text-black uppercase drop-shadow-[1px_1px_0_#fff]">Characters</h2>
          </div>
          <p className="text-[10px] text-stone-600 leading-relaxed">Create and manage the hero roster available for players to choose from.</p>
        </Link>

        <Link 
          to="/admin/events"
          className="group block border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#000]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#ff7324] border-4 border-black flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
              <span className="text-white text-xl" style={{ textShadow: "2px 2px 0 #000" }}>🗺️</span>
            </div>
            <h2 className="text-[14px] text-black uppercase drop-shadow-[1px_1px_0_#fff]">Manage Events</h2>
          </div>
          <p className="text-[10px] text-stone-600 leading-relaxed">View all active and past events, check statuses, and manage settings.</p>
        </Link>

        <Link 
          to="/admin/events/create"
          className="group block border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#000]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#5cd0fc] border-4 border-black flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
              <span className="text-white text-xl" style={{ textShadow: "2px 2px 0 #000" }}>➕</span>
            </div>
            <h2 className="text-[14px] text-black uppercase drop-shadow-[1px_1px_0_#fff]">Create Event</h2>
          </div>
          <p className="text-[10px] text-stone-600 leading-relaxed">Draft and publish new location-based quests for players to join.</p>
        </Link>

        <Link 
          to="/admin/registrations"
          className="group block border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#000]"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#ff8c4a] border-4 border-black flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
              <span className="text-white text-xl" style={{ textShadow: "2px 2px 0 #000" }}>📜</span>
            </div>
            <h2 className="text-[14px] text-black uppercase drop-shadow-[1px_1px_0_#fff]">Registrations</h2>
          </div>
          <p className="text-[10px] text-stone-600 leading-relaxed">View all player sign-ups and manage event capacity.</p>
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t-4 border-black flex justify-center">
        <Link 
          to="/"
          className="h-12 flex items-center border-4 border-black bg-[#111] px-6 text-[10px] text-white tracking-widest transition hover:bg-[#333] active:translate-y-[2px] active:translate-x-[2px] shadow-[4px_4px_0_0_#000] active:shadow-none"
        >
          ◀ RETURN HOME
        </Link>
      </div>
    </PixelLayout>
  );
}
