import React, { useEffect, useState } from 'react';

export const LandingSpread: React.FC = () => {
  const [unfoldProgress, setUnfoldProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setUnfoldProgress(1);
      return;
    }

    const handleScroll = () => {
      // Unfold smoothly over the first 280px of window scroll
      const unfoldDistance = Math.min(280, window.innerHeight * 0.35);
      const scrolled = window.scrollY;
      const progress = Math.min(1, Math.max(0, scrolled / unfoldDistance));
      setUnfoldProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col justify-start z-30 px-6 md:px-10 pt-[52vh] md:pt-[57vh] pb-12 md:pb-16">
      <div className="w-full max-w-[850px] flex flex-col">
        {/* Hero Headline Block (Lowered by 10% more for deeper grounded positioning) */}
        <div className="mb-7 md:mb-9 flex flex-col gap-2.5">
          <h1 class="print-reveal-headline font-serif text-[36px] sm:text-[46px] md:text-[56px] font-normal leading-[1.05] text-black tracking-tight">
            infrastructure, film,<br />
            and the space between.
          </h1>

          {/* Coordinates */}
          <div className="font-mono text-[11px] text-black font-medium tracking-[0.12em] uppercase mt-1">
            Lost Somewhere &mdash; 9.9312° N, 76.2673° E
          </div>
        </div>

        {/* Integrated About Section */}
        <div id="about" className="flex flex-col scroll-mt-24">
          {/* Transition About Label */}
          <div className="mb-4 md:mb-5">
            <span class="accent-hover-bracket inline-block font-mono text-[11px] text-black tracking-[0.1em] border border-[var(--rule)] px-2.5 py-1 select-none bg-[var(--surface)]">
              <span class="bracket">[</span> 01 / ABOUT <span class="bracket">]</span>
            </span>
          </div>

          {/* Editorial Narrative Thoughts */}
          <div className="flex flex-col gap-5 md:gap-7 font-serif text-[15px] sm:text-[16px] md:text-[17px] text-[var(--ink-muted)] leading-[1.5] max-w-[480px]">
            {/* Always Visible Thoughts (Thought 1 & Thought 2) */}
            <p className="text-[var(--ink)] italic text-[16px] sm:text-[17px] md:text-[18px]">
              An uneventful life.
            </p>

            <p className="leading-[1.5]">
              Unreadable errors.<br />
              Arguments with machines.
            </p>

            {/* Unfolding Content Container (Expands as user scrolls over first 280px) */}
            <div
              className="overflow-hidden flex flex-col gap-5 md:gap-7 transition-none"
              style={{
                maxHeight: `${unfoldProgress * 360}px`,
                clipPath: `inset(0 0 ${(1 - unfoldProgress) * 100}% 0)`
              }}
            >
              <p className="leading-[1.5]">
                A phone camera.<br />
                A cup of coffee.<br />
                A dash of colour.
              </p>

              <p className="text-[var(--ink)]">
                Welcome to my corner of the internet.
              </p>

              {/* Publication Credits Colophon */}
              <div className="mt-5 flex flex-col gap-1 font-mono text-[10px] sm:text-[11px] text-[var(--ink-faint)] tracking-[0.16em] uppercase">
                <div>Kerala, India</div>
                <div>Junior Engineer @ Saints & Masters</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingSpread;
