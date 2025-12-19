import { bandInfo } from "@/data/bandInfo";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const scrollToAbout = () => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden"
      aria-label="Hero section"
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 bg-grid-pattern bg-grid opacity-20"
        aria-hidden="true"
      />
      
      {/* Gradient Overlays */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"
        aria-hidden="true"
      />
      <div 
        className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/10 to-transparent"
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-accent/10 to-transparent"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Band Name */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-tight text-foreground mb-6 animate-fade-in">
          <span className="block">THE OLD</span>
          <span className="block text-primary text-glow">DAYS</span>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-muted-foreground mt-2">
            BAND
          </span>
        </h1>

        {/* Tagline */}
        <p 
          className="font-mono text-sm md:text-base text-muted-foreground max-w-xl mx-auto mb-12 animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          {bandInfo.tagline}
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

        {/* Genre Tags */}
        <div 
          className="flex flex-wrap items-center justify-center gap-3 animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          {bandInfo.genre.split(" / ").map((genre) => (
            <span
              key={genre}
              className="font-mono text-xs uppercase tracking-widest px-4 py-2 border border-border bg-secondary/50 text-muted-foreground"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToAbout}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground hover:text-primary transition-colors animate-pulse"
        aria-label="Scroll to content"
      >
        <ChevronDown size={32} />
      </button>

      {/* Side Decorations */}
      <div 
        className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-primary to-transparent" />
      </div>
      <div 
        className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2"
        aria-hidden="true"
      >
        <div className="w-px h-32 bg-gradient-to-b from-transparent via-accent to-transparent" />
      </div>
    </section>
  );
}
