import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "sk" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  sk: {
    about: "O kapele",
    listen: "Počúvaj",
    gallery: "Galéria",
    origin: "Pôvod",
    active: "Aktívni",
    genre: "Žáner",
    members: "Členovia",
    playlist: "Playlist",
    selectTrack: "Vyberte skladbu na prehratie",
    photos: "Fotografie",
    posters: "Plagáty",
    other: "Iné",
    spotifyDescription: "Väčšina našich nahrávok je teraz dostupná na Spotify.",
    recordings: "Nahrávky",
    noTrackSelected: "Vyberte skladbu",
  },
  en: {
    about: "About The Band",
    listen: "Listen",
    gallery: "Gallery",
    origin: "Origin",
    active: "Active",
    genre: "Genre",
    members: "Members",
    playlist: "Playlist",
    selectTrack: "Select a track to play",
    photos: "Photos",
    posters: "Posters",
    other: "Other",
    spotifyDescription: "Most of our recordings are now available on Spotify.",
    recordings: "Recordings",
    noTrackSelected: "Select a track",
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
