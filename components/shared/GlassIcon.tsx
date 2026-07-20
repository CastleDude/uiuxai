const icons: Record<string, { gradient: string; render: () => React.ReactNode }> = {
  inspiration: {
    gradient: "from-indigo-500 via-purple-500 to-violet-500",
    render: () => (
      <>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-2 border-white/80" />
        <div className="absolute top-[42px] left-1/2 -translate-x-1/2 w-0.5 h-8 bg-white/80 rounded-full" />
        <div className="absolute top-[58px] left-1/2 -translate-x-1/2 w-10 h-0.5 bg-white/80 rounded-full" />
      </>
    ),
  },
  "ui-design": {
    gradient: "from-pink-500 via-rose-500 to-orange-500",
    render: () => (
      <>
        <div className="absolute top-5 left-5 w-7 h-7 rounded-full bg-white/60" />
        <div className="absolute top-5 right-5 w-5 h-5 rounded-full bg-white/80" />
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white/40" />
        <div className="absolute top-[52px] left-5 w-0.5 h-6 bg-white/40 rounded-full" />
        <div className="absolute top-[46px] right-5 w-0.5 h-5 bg-white/40 rounded-full" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white/30" />
      </>
    ),
  },
  prototyping: {
    gradient: "from-cyan-500 via-sky-500 to-blue-500",
    render: () => (
      <>
        <div className="absolute top-4 left-4 right-4 bottom-4 rounded-xl border-2 border-white/60" />
        <div className="absolute top-7 left-7 w-8 h-4 rounded bg-white/50" />
        <div className="absolute top-7 right-7 w-8 h-4 rounded bg-white/30" />
        <div className="absolute bottom-7 left-7 w-8 h-2.5 rounded bg-white/30" />
        <div className="absolute bottom-7 right-7 w-8 h-2.5 rounded bg-white/40" />
      </>
    ),
  },
  code: {
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    render: () => (
      <>
        <div className="absolute top-1/2 left-5 -translate-y-1/2 text-white/90 text-3xl font-mono font-bold">&lt;</div>
        <div className="absolute top-1/2 right-5 -translate-y-1/2 text-white/90 text-3xl font-mono font-bold">/&gt;</div>
      </>
    ),
  },
  review: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    render: () => (
      <>
        <div className="absolute top-3 left-3 right-3 bottom-3 rounded-xl border border-white/30" />
        <div className="absolute top-1/2 left-5 w-7 h-0.5 bg-white/90 rounded-full -rotate-45 origin-right translate-y-1.5" />
        <div className="absolute top-1/2 left-[38px] w-12 h-0.5 bg-white/90 rounded-full -rotate-12 origin-left -translate-y-1" />
        <div className="absolute right-5 bottom-5 w-5 h-5 rounded-full border-2 border-white/60" />
      </>
    ),
  },
  "design-system": {
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    render: () => (
      <>
        <div className="absolute top-4 left-4 w-8 h-8 rounded-lg bg-white/40" />
        <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/25" />
        <div className="absolute bottom-4 left-4 w-8 h-8 rounded-lg bg-white/25" />
        <div className="absolute bottom-4 right-4 w-8 h-8 rounded-lg bg-white/35" />
      </>
    ),
  },
};

export default function GlassIcon({ category, size = 80 }: { category: string; size?: number }) {
  const def = icons[category];
  if (!def) return null;

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-br ${def.gradient} shadow-lg flex-shrink-0 overflow-hidden`}
      style={{ width: size, height: size }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-1.5 rounded-xl bg-white/10 backdrop-blur-sm" />
      {/* Highlight */}
      <div className="absolute top-1 left-2 right-2 h-1/3 rounded-t-xl bg-gradient-to-b from-white/25 to-transparent" />
      {/* Icon content */}
      {def.render()}
    </div>
  );
}

export { icons };
