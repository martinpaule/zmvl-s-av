import { bandInfo } from "@/data/bandInfo";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Calendar, Music } from "lucide-react";
import bandImage from "@/assets/pod-mostom.jpg";

export function About() {
  const { language, t } = useLanguage();
  const info = bandInfo[language];

  return (
    <section 
      id="about" 
      className="py-24 md:py-32 bg-secondary/30"
      aria-labelledby="about-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 
            id="about-heading"
            className="font-display text-5xl md:text-6xl text-foreground mb-4"
          >
            {t("about").toUpperCase()}
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto" aria-hidden="true" />
        </div>

        {/* Content - Vertical Stack */}
        <div className="space-y-12">
          {/* Quick Stats - Full Width */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 border-l-4 border-primary bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <MapPin size={16} />
                <span className="font-mono text-xs uppercase tracking-wider">{t("origin")}</span>
              </div>
              <p className="font-heading text-xl text-foreground">{info.origin}</p>
            </div>
            
            <div className="p-6 border-l-4 border-accent bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Calendar size={16} />
                <span className="font-mono text-xs uppercase tracking-wider">{t("active")}</span>
              </div>
              <p className="font-heading text-xl text-foreground">{info.yearsActive}</p>
            </div>
            
            <div className="p-6 border-l-4 border-primary bg-card">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Music size={16} />
                <span className="font-mono text-xs uppercase tracking-wider">{t("genre")}</span>
              </div>
              <p className="font-heading text-xl text-foreground">{info.genre}</p>
            </div>
          </div>

          {/* Bio - Full Width */}
          <div className="max-w-4xl">
            {info.bio.split("\n\n").map((paragraph, index) => (
              <p 
                key={index}
                className="font-mono text-sm md:text-base text-muted-foreground leading-relaxed mb-4"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Image - Full Width */}
          <div className="relative max-w-3xl mx-auto">
            <div className="aspect-[16/9] bg-card border-2 border-border overflow-hidden">
              <img 
                src={bandImage} 
                alt="ZOŽER MESIAC V LUFTE performing live"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Decorative Corner */}
            <div 
              className="absolute -bottom-4 -right-4 w-32 h-32 border-2 border-accent -z-10"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
