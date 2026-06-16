import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { useMutation } from "convex/react";
import { useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";

import { api } from "../convex/_generated/api";
import { PixelLayout } from "./components/PixelLayout";
import { PixelButton } from "./components/PixelButton";
import { useAuthentication } from "./features/authentication/hooks/useAuthentication";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminCharactersPage } from "./pages/AdminCharactersPage";
import { AdminCreateEventPage } from "./pages/AdminCreateEventPage";
import { AdminEventDetailsPage } from "./pages/AdminEventDetailsPage";
import { AdminEventsPage } from "./pages/AdminEventsPage";
import { AttendancePage } from "./pages/AttendancePage";
import { AvailableEventsPage } from "./pages/AvailableEventsPage";
import { EventDetailsPage } from "./pages/EventDetailsPage";
import { EventRegistrationPage } from "./pages/EventRegistrationPage";
import { JoinedEventsPage } from "./pages/JoinedEventsPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterAccountPage } from "./pages/RegisterAccountPage";

function SignedInHome() {
  const { user, logout } = useAuthentication();
  const bootstrapAdmin = useMutation(api.seed.bootstrapCurrentUserAsAdmin);
  const [bootstrapMessage, setBootstrapMessage] = useState<string | null>(null);
  const [bootstrapError, setBootstrapError] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(false);

  async function handleBootstrapAdmin() {
    setIsBootstrapping(true);
    setBootstrapMessage(null);
    setBootstrapError(null);

    try {
      const adminUser = await bootstrapAdmin({});
      setBootstrapMessage(`${adminUser.name} is now an admin.`);
    } catch (caughtError) {
      setBootstrapError(
        caughtError instanceof Error
          ? caughtError.message
          : "Admin bootstrap failed.",
      );
    } finally {
      setIsBootstrapping(false);
    }
  }

  const isAdmin = user?.role === "admin";

  return (
    <PixelLayout maxWidth="max-w-[800px]">
      <header className="mb-8 border-b-4 border-black pb-6 flex flex-col sm:flex-row gap-6 justify-between sm:items-end">
        <div>
          <h1 className="text-3xl text-black mb-3 uppercase drop-shadow-[1px_1px_0_#fff]">
            {isAdmin ? "Admin Hub" : "Player Dashboard"}
          </h1>
          <p className="text-[10px] text-stone-700 leading-relaxed">
            Welcome back, {user?.name ?? "Hero"}.
          </p>
        </div>
        <PixelButton variant="secondary" onClick={() => void logout()}>
          SIGN OUT
        </PixelButton>
      </header>
      
      {(bootstrapMessage || bootstrapError) && (
        <div className="grid gap-2 text-left mb-6">
          {bootstrapMessage ? (
            <p className="border-4 border-black bg-emerald-400 px-3 py-3 text-[10px] leading-relaxed text-black shadow-[4px_4px_0_0_#000]">{bootstrapMessage}</p>
          ) : null}
          {bootstrapError ? (
            <p className="border-4 border-black bg-red-500 px-3 py-3 text-[10px] leading-relaxed text-white shadow-[4px_4px_0_0_#000]">{bootstrapError}</p>
          ) : null}
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {isAdmin ? (
          <>
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
          </>
        ) : (
          <>
            <Link 
              to="/events"
              className="group block border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#000]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#ff7324] border-4 border-black flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                  <span className="text-white text-xl" style={{ textShadow: "2px 2px 0 #000" }}>🗺️</span>
                </div>
                <h2 className="text-[14px] text-black uppercase drop-shadow-[1px_1px_0_#fff]">Available Events</h2>
              </div>
              <p className="text-[10px] text-stone-600 leading-relaxed">Browse the map and find new quests and workshops to join.</p>
            </Link>

            <Link 
              to="/joined-events"
              className="group block border-4 border-black bg-white p-6 shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#000]"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-[#3db5e6] border-4 border-black flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                  <span className="text-white text-xl" style={{ textShadow: "2px 2px 0 #000" }}>🛡️</span>
                </div>
                <h2 className="text-[14px] text-black uppercase drop-shadow-[1px_1px_0_#fff]">My Quests</h2>
              </div>
              <p className="text-[10px] text-stone-600 leading-relaxed">View your active registrations and manage your current adventures.</p>
            </Link>

            <button 
              type="button"
              disabled={isBootstrapping}
              onClick={() => void handleBootstrapAdmin()}
              className="text-left group block border-4 border-black bg-amber-400 p-6 shadow-[6px_6px_0_0_#000] transition hover:-translate-y-1 hover:shadow-[8px_8px_0_0_#000] active:translate-y-[2px] active:translate-x-[2px] active:shadow-[2px_2px_0_0_#000] disabled:opacity-50"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-amber-500 border-4 border-black flex items-center justify-center shadow-[inset_0_0_8px_rgba(0,0,0,0.5)]">
                  <span className="text-white text-xl" style={{ textShadow: "2px 2px 0 #000" }}>⭐</span>
                </div>
                <h2 className="text-[14px] text-black uppercase drop-shadow-[1px_1px_0_#fff]">
                  {isBootstrapping ? "LOADING..." : "Become Admin"}
                </h2>
              </div>
              <p className="text-[10px] text-stone-800 leading-relaxed">Testing feature: Instantly grant yourself admin powers.</p>
            </button>
          </>
        )}
      </div>
    </PixelLayout>
  );
}

function LoadingSession() {
  return (
    <main className="grid min-h-svh place-items-center bg-stone-900 px-5 font-['Press_Start_2P']">
      <section className="flex flex-col items-center gap-8 w-full max-w-md border-4 border-black bg-[#ebd2a9] p-10 shadow-[10px_10px_0_0_rgba(0,0,0,1)]">
        <div className="text-center">
          <h1 className="text-2xl text-black mb-6 leading-snug">
            LOADING
          </h1>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-orange-500 border-2 border-black animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-cyan-400 border-2 border-black animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-pink-400 border-2 border-black animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <>
      <AuthLoading>
        <LoadingSession />
      </AuthLoading>

      <Unauthenticated>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterAccountPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Unauthenticated>

      <Authenticated>
        <Routes>
          <Route path="/" element={<SignedInHome />} />
          <Route path="/events" element={<AvailableEventsPage />} />
          <Route path="/events/:eventId" element={<EventDetailsPage />} />
          <Route path="/admin/characters" element={<AdminCharactersPage />} />
          <Route path="/admin/events" element={<AdminEventsPage />} />
          <Route path="/admin/events/:eventId" element={<AdminEventDetailsPage />} />
          <Route path="/admin/events/create" element={<AdminCreateEventPage />} />
          <Route path="/events/:eventId/register" element={<EventRegistrationPage />} />
          <Route path="/events/:eventId/attendance" element={<AttendancePage />} />
          <Route path="/joined-events" element={<JoinedEventsPage />} />
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="*" element={<SignedInHome />} />
        </Routes>
      </Authenticated>
    </>
  );
}

export default App;
