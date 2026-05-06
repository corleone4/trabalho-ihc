import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Consultas",
    route: "/consultas",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    label: "Agendar",
    route: "/agendamento",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Pacientes",
    route: "/cadastro-paciente",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    label: "Médicos",
    route: "/cadastro-medico",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Prontuário",
    route: "/prontuario",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Documentos",
    route: "/documentos",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem("user") || "Usuário";
  const [menuOpen, setMenuOpen] = useState(false);

  function sair() {
    localStorage.removeItem("user");
    navigate("/");
  }

  const isActive = (route) => location.pathname === route;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <button
            onClick={() => navigate("/consultas")}
            className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg"
            aria-label="SmartClinic - ir para consultas"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-md group-hover:shadow-cyan-200 transition-shadow duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-800 text-lg tracking-tight">
              Smart<span className="text-cyan-600">Clinic</span>
            </span>
          </button>

          {/* Nav links – desktop */}
          <div className="hidden md:flex items-center gap-1" role="navigation" aria-label="Menu principal">
            {NAV_ITEMS.map(({ label, route, icon }) => (
              <button
                key={route}
                onClick={() => navigate(route)}
                aria-current={isActive(route) ? "page" : undefined}
                className={`
                  flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500
                  ${isActive(route)
                    ? "bg-cyan-50 text-cyan-700 shadow-inner"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }
                `}
              >
                <span className={isActive(route) ? "text-cyan-600" : "text-slate-400"}>{icon}</span>
                {label}
              </button>
            ))}
          </div>

          {/* User + logout – desktop */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold uppercase">{user.charAt(0)}</span>
              </div>
              <span className="text-slate-700 text-sm font-medium max-w-[120px] truncate">{user}</span>
            </div>
            <button
              onClick={sair}
              aria-label="Sair da conta"
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </button>
          </div>

          {/* Hamburger – mobile */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label="Abrir menu"
          >
            {menuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 space-y-1" role="navigation" aria-label="Menu mobile">
            {NAV_ITEMS.map(({ label, route, icon }) => (
              <button
                key={route}
                onClick={() => { navigate(route); setMenuOpen(false); }}
                aria-current={isActive(route) ? "page" : undefined}
                className={`
                  w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${isActive(route)
                    ? "bg-cyan-50 text-cyan-700"
                    : "text-slate-600 hover:bg-slate-100"
                  }
                `}
              >
                <span className={isActive(route) ? "text-cyan-600" : "text-slate-400"}>{icon}</span>
                {label}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
                  <span className="text-white text-xs font-bold uppercase">{user.charAt(0)}</span>
                </div>
                <span className="text-slate-700 text-sm font-medium">{user}</span>
              </div>
              <button
                onClick={sair}
                className="text-sm font-medium text-red-500 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 rounded"
              >
                Sair
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}