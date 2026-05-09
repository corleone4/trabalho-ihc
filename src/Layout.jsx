import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased flex flex-col">

      <Navbar />

      {/* Decorative ambient blobs — purely visual, hidden from AT */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-32 right-0 w-[480px] h-[480px] rounded-full
                        bg-cyan-100 opacity-40 blur-[96px]" />
        <div className="absolute bottom-0 -left-24 w-[360px] h-[360px] rounded-full
                        bg-teal-100 opacity-30 blur-[80px]" />
        <div className="absolute top-1/2 left-1/3 w-[280px] h-[280px] rounded-full
                        bg-indigo-100 opacity-20 blur-[72px]" />
      </div>

      {/* Page content */}
      <main
        id="main-content"
        className="flex-1 w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-10"
        role="main"
      >
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-medium">
            © {new Date().getFullYear()} SmartClinic. Todos os direitos reservados.
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-rose-400"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191
                       5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447
                       5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
            </svg>
            Feito com cuidado para a sua saúde
          </span>
        </div>
      </footer>
    </div>
  );
}