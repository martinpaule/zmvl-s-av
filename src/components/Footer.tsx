import { bandInfo } from "@/data/bandInfo";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { language, t } = useLanguage();
  const info = bandInfo[language];
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Band Name */}
          <div className="text-center md:text-left">
            <span className="font-display text-2xl text-foreground">
              {info.name}
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <a 
              href="#about" 
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              {t("about")}
            </a>
            <a 
              href="#listen" 
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              {t("listen")}
            </a>
            <a 
              href="#gallery" 
              className="font-mono text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors"
            >
              {t("gallery")}
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center md:text-right">
            <p className="font-mono text-xs text-muted-foreground">
              © {currentYear} {info.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground mt-1">
              All rights reserved.
            </p>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="mt-8 flex items-center justify-center gap-4" aria-hidden="true">
          <span className="w-8 h-0.5 bg-primary" />
          <span className="w-2 h-2 border border-accent rotate-45" />
          <span className="w-8 h-0.5 bg-primary" />
        </div>
      </div>
    </footer>
  );
}
