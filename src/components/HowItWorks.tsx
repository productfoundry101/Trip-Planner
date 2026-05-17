import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Sparkles, Utensils, Camera, Share2 } from 'lucide-react';

const steps = [
  {
    icon: MapPin,
    title: 'Create a trip',
    desc: 'Pick your city. We set up a shared map instantly.',
    accent: 'primary',
    snippet: (
      <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-background border border-border text-xs">
        <MapPin className="h-3.5 w-3.5 text-primary" />
        <span className="font-medium">Lisbon, Portugal</span>
        <span className="ml-auto h-2 w-2 rounded-full bg-primary animate-pulse" />
      </div>
    ),
  },
  {
    icon: Users,
    title: 'Invite your friends',
    desc: 'Share a link. No account needed. They drop their one best Eat and one best Visit pick.',
    accent: 'secondary',
    snippet: (
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {['#c4654a', '#e8a87c', '#87a878', '#4a6741'].map((c, i) => (
            <div
              key={i}
              className="h-7 w-7 rounded-full border-2 border-card flex items-center justify-center text-[10px] font-semibold text-white"
              style={{ background: c }}
            >
              {['A', 'M', 'J', 'S'][i]}
            </div>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">+4 friends contributing</span>
      </div>
    ),
  },
  {
    icon: Sparkles,
    title: 'Get your map',
    desc: 'Every pick pinned on a map. Drag to prioritize. Ready before you land.',
    accent: 'accent',
    snippet: (
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--eat-category)/0.12)] text-[hsl(var(--eat-category))] font-medium">
          <Utensils className="h-3 w-3" /> 7 Eat
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-[hsl(var(--visit-category)/0.12)] text-[hsl(var(--visit-category))] font-medium">
          <Camera className="h-3 w-3" /> 9 Visit
        </span>
        <Share2 className="h-3.5 w-3.5 text-muted-foreground ml-auto" />
      </div>
    ),
  },
];

export const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="how" ref={ref} className="relative py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-secondary/20 text-accent text-xs font-medium tracking-wide uppercase mb-4">
            How it works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Three steps. <span className="text-gradient-warm">Zero research.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className={`group relative p-8 rounded-3xl bg-card border border-border shadow-card hover-lift transition-all ${
                  visible ? 'animate-fade-in-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${i * 140}ms` }}
              >
                <div className="absolute top-6 right-6 text-6xl font-bold text-muted/40 leading-none select-none">
                  0{i + 1}
                </div>
                <div
                  className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 ${
                    s.accent === 'primary'
                      ? 'gradient-warm text-primary-foreground'
                      : s.accent === 'secondary'
                        ? 'gradient-sage text-primary-foreground'
                        : 'bg-accent text-accent-foreground'
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{s.desc}</p>
                <div className="pt-4 border-t border-border/60">{s.snippet}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
