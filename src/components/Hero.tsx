import { bandInfo } from "@/data/bandInfo";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import heroBackground from "@/assets/poster-24.jpg";

export function Hero() {
  const { language } = useLanguage();
  const info = bandInfo[language];
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  // Calculate blur based on scroll (max 20px blur at 400px scroll)
  const blurAmount = Math.min(scrollY / 20, 20);

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
      aria-label="Hero section"
    >
      {/* Fullscreen Background Image with Blur Effect */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-100"
        style={{ 
          filter: `blur(${blurAmount}px)`,
          transform: 'scale(1.05)' // Prevent blur edges from showing
        }}
        aria-hidden="true"
      >
        <img 
          src={heroBackground} 
          alt="" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/60" />
      </div>

      {/* Grid Background */}
      <div 
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-10 z-[1]"
        aria-hidden="true"
      />
      
      {/* Gradient Overlays */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-[2]"
        aria-hidden="true"
      />
      <div 
        className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 to-transparent z-[2]"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-accent/10 to-transparent z-[2]"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Band Name */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-foreground mb-6 animate-fade-in">
          <span className="block">ZOŽER MESIAC</span>
          <span className="block text-primary text-glow">V LUFTE</span>
        </h1>

        {/* Tagline */}
        <p 
          className="font-mono text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-12 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {info.tagline}
        </p>

        {/* Decorative Lines */}
        <div 
          className="flex items-center justify-center gap-4 mb-12 animate-fade-in"
          style={{ animationDelay: "0.4s" }}
          aria-hidden="true"
        >
          <span className="w-16 md:w-24 h-0.5 bg-primary" />
          <span className="w-3 h-3 border-2 border-accent rotate-45" />
          <span className="w-16 md:w-24 h-0.5 bg-primary" />
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-pulse z-10"
        aria-label="Scroll to content"
      >
        <ChevronDown size={32} />
      </button>

      {/* Side Decorations */}
      <div 
        className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-10"
        aria-hidden="true"
      >
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div 
        className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-10"
        aria-hidden="true"
      >
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-accent to-transparent" />
      </div>
    </section>
  );
}
