import { bandInfo } from "@/data/bandInfo";
import { useLanguage } from "@/contexts/LanguageContext";
import { MapPin, Calendar, Music } from "lucide-react";
import bandImage from "@/assets/band-hero.jpg";

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
        <div className="mb-16">
          <h2 
            id="about-heading"
            className="font-display text-5xl md:text-6xl text-foreground mb-4"
          >
            {t("about").toUpperCase()}
          </h2>
          <div className="w-24 h-1 bg-primary" aria-hidden="true" />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Info Column */}
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 border-l-4 border-primary bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin size={16} />
                  <span className="font-mono text-xs uppercase tracking-wider">{t("origin")}</span>
                </div>
                <p className="font-heading text-lg text-foreground">{info.origin}</p>
              </div>
              
              <div className="p-4 border-l-4 border-accent bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Calendar size={16} />
                  <span className="font-mono text-xs uppercase tracking-wider">{t("active")}</span>
                </div>
                <p className="font-heading text-lg text-foreground">{info.yearsActive}</p>
              </div>
              
              <div className="p-4 border-l-4 border-primary bg-card">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Music size={16} />
                  <span className="font-mono text-xs uppercase tracking-wider">{t("genre")}</span>
                </div>
                <p className="font-heading text-lg text-foreground">{info.genre}</p>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              {info.bio.split("\n\n").map((paragraph, index) => (
                <p 
                  key={index}
                  className="font-mono text-sm md:text-base text-muted-foreground leading-relaxed"
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Members */}
            <div className="pt-6 border-t border-border">
              <h3 className="font-heading text-sm uppercase tracking-widest text-primary mb-4">
                {t("members")}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {info.members.map((member) => (
                  <div key={member.name} className="group">
                    <p className="font-heading text-foreground group-hover:text-primary transition-colors">
                      {member.name}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {member.role}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Image Column */}
          <div className="relative">
            <div className="aspect-[4/5] bg-card border-2 border-border overflow-hidden">
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
