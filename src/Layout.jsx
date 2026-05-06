import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">

      <Navbar />

      {/* Page content */}
      <main
        id="main-content"
        className="max-w-screen-xl mx-auto px-4 sm:px-6 py-8"
        role="main"
      >
        {/* Subtle decorative accent */}
        <div
          aria-hidden="true"
          className="fixed top-0 right-0 w-96 h-96 bg-cyan-100 opacity-30 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/2 -translate-y-1/2"
        />
        <div
          aria-hidden="true"
          className="fixed bottom-0 left-0 w-72 h-72 bg-teal-100 opacity-20 rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/2 translate-y-1/2"
        />

        {children}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} SmartClinic. Todos os direitos reservados.</span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            Feito com cuidado para a sua saúde
          </span>
        </div>
      </footer>
    </div>
  );
}