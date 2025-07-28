const GradientOverlay = () => {
  return (
    <div className="max-w-screen pointer-events-none absolute inset-0 mx-auto w-full overflow-hidden">
      <div className="animate-in zoom-in-50 slide-in-from-top-40 pointer-events-none absolute -left-1/4 top-0 z-0 h-full w-1/4 -translate-y-[75%] -rotate-45 touch-none rounded-full bg-gradient-to-tr from-blue-300 to-blue-100 opacity-50 blur-3xl duration-700"></div>
      <div className="animate-in zoom-in-50 slide-in-from-top-20 pointer-events-none absolute left-1/2 top-0 z-0 h-1/4 w-1/4 -translate-y-1/2 touch-none rounded-full bg-gradient-to-tr from-fuchsia-50 to-fuchsia-500 opacity-50 blur-3xl duration-700"></div>
      <div className="animate-in zoom-in-50 slide-in-from-top-80 pointer-events-none absolute -left-1/4 top-0 z-0 h-full w-full -translate-y-[90%] touch-none rounded-full bg-gradient-to-tr from-purple-200 to-purple-500 opacity-50 blur-[56px] duration-500"></div>
      <div className="animate-in zoom-in-50 fade-in slide-in-from-top-56 pointer-events-none absolute left-1/4 top-0 z-0 h-full w-1/6 -translate-y-[65%] -rotate-45 touch-none rounded-full bg-gradient-to-tr from-orange-50 to-orange-300 blur-3xl duration-700"></div>
      <div className="animate-in zoom-in-50 slide-in-from-top-32 pointer-events-none absolute left-3/4 top-0 z-0 h-1/3 w-1/6 -translate-y-[75%] -rotate-45 touch-none rounded-full bg-gradient-to-tr from-amber-50 to-amber-300 blur-3xl duration-500"></div>
      <div className="animate-in zoom-in-50 slide-in-from-top-16 pointer-events-none absolute right-0 top-0 z-0 h-1/3 w-1/3 -translate-y-[75%] touch-none rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-50 opacity-25 blur-3xl duration-700"></div>
    </div>
  );
};

export { GradientOverlay };
