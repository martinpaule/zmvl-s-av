import React, { createContext, useContext, useState, useCallback } from "react";

type Language = "sk" | "en";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  sk: {
    // Navigation
    about: "O kapele",
    listen: "Počúvaj",
    gallery: "Galéria",
    
    // About section
    origin: "Pôvod",
    active: "Aktívni",
    genre: "Žáner",
    members: "Členovia",
    
    // Listen section
    recordings: "Nahrávky",
    jams: "Jams",
    playlist: "Playlist",
    selectTrack: "Vyberte skladbu na prehratie",
    noTrackSelected: "Vyberte skladbu",
    spotifyDescription: "Väčšina našich nahrávok je teraz dostupná na Spotify.",
    linear: "Lineárne",
    shuffle: "Náhodne",
    
    // Gallery section
    photos: "Fotografie",
    posters: "Plagáty",
    other: "Iné",
    shuffleGallery: "Zamiešať",
    
    // Hero section
    memoriesOf: "Spomienky na",
    
    // Footer / misc
    allRightsReserved: "Všetky práva vyhradené",
    
    // Tracks
    track: "Stopa",
    tracks: "stôp",
  },
  en: {
    // Navigation
    about: "About",
    listen: "Listen",
    gallery: "Gallery",
    
    // About section
    origin: "Origin",
    active: "Active",
    genre: "Genre",
    members: "Members",
    
    // Listen section
    recordings: "Recordings",
    jams: "Jams",
    playlist: "Playlist",
    selectTrack: "Select a track to play",
    noTrackSelected: "Select a track",
    spotifyDescription: "Most of our recordings are now available on Spotify.",
    linear: "Linear",
    shuffle: "Shuffle",
    
    // Gallery section
    photos: "Photos",
    posters: "Posters",
    other: "Other",
    shuffleGallery: "Shuffle",
    
    // Hero section
    memoriesOf: "Memories of",
    
    // Footer / misc
    allRightsReserved: "All rights reserved",
    
    // Tracks
    track: "Track",
    tracks: "tracks",
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
