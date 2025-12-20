import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "sk" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  sk: {
    about: "O nás",
    listen: "Počúvať",
    gallery: "Galéria",
    origin: "Pôvod",
    active: "Aktívni",
    genre: "Žáner",
    members: "Členovia",
    playlist: "Playlist",
    liveVisualizer: "Živý vizualizér",
    visualizerDesc: "Procedurálna vizuálna syntéza reagujúca na hudbu",
    startVisualizer: "Spustiť vizualizér",
    stopVisualizer: "Zastaviť vizualizér",
    selectTrack: "Vyberte skladbu na prehratie",
  },
  en: {
    about: "About",
    listen: "Listen",
    gallery: "Gallery",
    origin: "Origin",
    active: "Active",
    genre: "Genre",
    members: "Members",
    playlist: "Playlist",
    liveVisualizer: "Live Visualizer",
    visualizerDesc: "Procedural visual synthesis responding to music",
    startVisualizer: "Start Visualizer",
    stopVisualizer: "Stop Visualizer",
    selectTrack: "Select a track to play",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("sk");

  const toggleLanguage = useCallback(() => {
    setLanguage((prev) => (prev === "sk" ? "en" : "sk"));
  }, []);

  const t = useCallback(
    (key: string) => {
      return translations[language][key] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
