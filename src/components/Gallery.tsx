import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { X, Camera, FileImage, Folder, Shuffle, Image } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Import other concert photos
import podMostom from "@/assets/pod-mostom.jpg";
import klacno1991 from "@/assets/klacno-1991.jpg";
import povazskaBystrica from "@/assets/povazska-bystrica.jpg";

// Import Prerov concert photos
import prerov01 from "@/assets/prerov-01.jpg";
import prerov02 from "@/assets/prerov-02.jpg";
import prerov03 from "@/assets/prerov-03.jpg";
import prerov04 from "@/assets/prerov-04.jpg";
import prerov05 from "@/assets/prerov-05.jpg";
import prerov06 from "@/assets/prerov-06.jpg";
import prerov07 from "@/assets/prerov-07.jpg";

// Import Myjava concert photos
import myjava01 from "@/assets/myjava-01.jpg";
import myjava02 from "@/assets/myjava-02.jpg";
import myjava03 from "@/assets/myjava-03.jpg";
import myjava04 from "@/assets/myjava-04.jpg";
import myjava05 from "@/assets/myjava-05.jpg";
import myjava06 from "@/assets/myjava-06.jpg";
import myjava07 from "@/assets/myjava-07.jpg";
import myjava08 from "@/assets/myjava-08.jpg";
import myjava09 from "@/assets/myjava-09.jpg";
import myjava10 from "@/assets/myjava-10.jpg";
import myjava11 from "@/assets/myjava-11.jpg";
import myjava12 from "@/assets/myjava-12.jpg";
import myjava13 from "@/assets/myjava-13.jpg";
import myjava14 from "@/assets/myjava-14.jpg";
import myjava15 from "@/assets/myjava-15.jpg";
import myjava16 from "@/assets/myjava-16.jpg";
import myjava17 from "@/assets/myjava-17.jpg";
import article01 from "@/assets/article-01.jpg";
import article02 from "@/assets/article-02.jpg";

// Import poster images
import poster01 from "@/assets/poster-01.jpg";
import poster02 from "@/assets/poster-02.jpg";
import poster03 from "@/assets/poster-03.jpg";
import poster04 from "@/assets/poster-04.jpg";
import poster05 from "@/assets/poster-05.jpg";
import poster06 from "@/assets/poster-06.jpg";
import poster07 from "@/assets/poster-07.jpg";
import poster08 from "@/assets/poster-08.jpg";
import poster09 from "@/assets/poster-09.jpg";
import poster10 from "@/assets/poster-10.jpg";
import poster11 from "@/assets/poster-11.jpg";
import poster12 from "@/assets/poster-12.jpg";
import poster13 from "@/assets/poster-13.jpg";
import poster14 from "@/assets/poster-14.jpg";
import poster15 from "@/assets/poster-15.jpg";
import poster16 from "@/assets/poster-16.jpg";
import poster17 from "@/assets/poster-17.jpg";
import poster18 from "@/assets/poster-18.jpg";
import poster19 from "@/assets/poster-19.jpg";
import poster20 from "@/assets/poster-20.jpg";
import poster21 from "@/assets/poster-21.jpg";
import poster22 from "@/assets/poster-22.jpg";
import poster23 from "@/assets/poster-23.jpg";
import poster24 from "@/assets/poster-24.jpg";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

type GalleryCategory = "photos" | "posters" | "other";

const galleryData: Record<GalleryCategory, GalleryItem[]> = {
  photos: [
    { id: "pod-mostom", src: podMostom, alt: "Pod mostom", caption: "Pod mostom" },
    { id: "klacno-1991", src: klacno1991, alt: "Klačno sept 1991", caption: "Klačno 1991" },
    { id: "povazska-bystrica", src: povazskaBystrica, alt: "Považská Bystrica", caption: "Považská Bystrica" },
    { id: "prerov-1", src: prerov01, alt: "Prerov koncert 1", caption: "Prerov" },
    { id: "prerov-2", src: prerov02, alt: "Prerov koncert 2", caption: "Prerov" },
    { id: "prerov-3", src: prerov03, alt: "Prerov koncert 3", caption: "Prerov" },
    { id: "prerov-4", src: prerov04, alt: "Prerov koncert 4", caption: "Prerov" },
    { id: "prerov-5", src: prerov05, alt: "Prerov koncert 5", caption: "Prerov" },
    { id: "prerov-6", src: prerov06, alt: "Prerov koncert 6", caption: "Prerov" },
    { id: "prerov-7", src: prerov07, alt: "Prerov koncert 7", caption: "Prerov" },
    { id: "photo-1", src: myjava01, alt: "Myjava koncert 1", caption: "Myjava" },
    { id: "photo-2", src: myjava02, alt: "Myjava koncert 2", caption: "Myjava" },
    { id: "photo-3", src: myjava03, alt: "Myjava koncert 3", caption: "Myjava" },
    { id: "photo-4", src: myjava04, alt: "Myjava koncert 4", caption: "Myjava" },
    { id: "photo-5", src: myjava05, alt: "Myjava koncert 5", caption: "Myjava" },
    { id: "photo-6", src: myjava06, alt: "Myjava koncert 6", caption: "Myjava" },
    { id: "photo-7", src: myjava07, alt: "Myjava koncert 7", caption: "Myjava" },
    { id: "photo-8", src: myjava08, alt: "Myjava koncert 8", caption: "Myjava" },
    { id: "photo-9", src: myjava09, alt: "Myjava koncert 9", caption: "Myjava" },
    { id: "photo-10", src: myjava10, alt: "Myjava koncert 10", caption: "Myjava" },
    { id: "photo-11", src: myjava11, alt: "Myjava koncert 11", caption: "Myjava" },
    { id: "photo-12", src: myjava12, alt: "Myjava koncert 12", caption: "Myjava" },
    { id: "photo-13", src: myjava13, alt: "Myjava koncert 13", caption: "Myjava" },
    { id: "photo-14", src: myjava14, alt: "Myjava koncert 14", caption: "Myjava" },
    { id: "photo-15", src: myjava15, alt: "Myjava koncert 15", caption: "Myjava" },
    { id: "photo-16", src: myjava16, alt: "Myjava koncert 16", caption: "Myjava" },
    { id: "photo-17", src: myjava17, alt: "Myjava koncert 17", caption: "Myjava" },
  ],
  posters: [
    { id: "poster-1", src: poster01, alt: "Club dB Maximal Prievidza", caption: "9.6.1993 - Prievidza" },
    { id: "poster-2", src: poster02, alt: "Archbishop Kebab, Leukémia, Trottel + ZMVL", caption: "16.10.1993 - Přerov-Kozlovice" },
    { id: "poster-3", src: poster03, alt: "Slovenské Alternatívne Leto", caption: "21-23.7.1995 - Bzovík" },
    { id: "poster-4", src: poster04, alt: "Rock Fabrik - ZMVL Industrial Rock", caption: "25.4.1992 - Bratislava" },
    { id: "poster-5", src: poster05, alt: "Rock Fabrik August Program", caption: "August 1992 - Bratislava" },
    { id: "poster-6", src: poster06, alt: "Koncert Trenčianske Teplice", caption: "3.6.1994 - Trenčianske Teplice" },
    { id: "poster-7", src: poster07, alt: "Havlíček & Magnusek + ZMVL", caption: "13.5.1994 - Prievidza Kazačok" },
    { id: "poster-8", src: poster08, alt: "Zelený týždeň v Plynárni", caption: "27.4.1996 - Dubnica nad Váhom" },
    { id: "poster-9", src: poster09, alt: "Rock Fabrik Bratislava", caption: "25.4.1992 - Bratislava" },
    { id: "poster-10", src: poster10, alt: "ZMVL tričko Barbakán", caption: "13.9.1992 - Banská Bystrica" },
    { id: "poster-11", src: poster11, alt: "Underplunder T.H.Cultur Festival", caption: "25.8-3.9.1995 - Brno" },
    { id: "poster-12", src: poster12, alt: "Hlodanie '93", caption: "16.7.1993 - Považská Bystrica" },
    { id: "poster-13", src: poster13, alt: "Archbishop Kebab + ZMVL", caption: "16.10.1993 - Přerov-Kozlovice" },
    { id: "poster-14", src: poster14, alt: "OK Klub Duben '94", caption: "22.4.1994 - Přerov" },
    { id: "poster-15", src: poster15, alt: "Havlíček & Magnusek + ZMVL", caption: "13.5.1994 - Prievidza Kazačok" },
    { id: "poster-16", src: poster16, alt: "Koncert Trenčianske Teplice Baračka", caption: "3.6.1994 - Trenčianske Teplice" },
    { id: "poster-17", src: poster17, alt: "Snake Klub Leden 1995", caption: "29.1.1995 - Olomouc" },
    { id: "poster-18", src: poster18, alt: "Slovenské Alternatívne Leto", caption: "21-23.7.1995 - Bzovík" },
    { id: "poster-19", src: poster19, alt: "Slovenské Alternatívne Leto", caption: "21-23.7.1995 - Bzovík" },
    { id: "poster-20", src: poster20, alt: "Underplunder T.H.Cultur Festival", caption: "25.8-3.9.1995 - Brno" },
    { id: "poster-21", src: poster21, alt: "Zelený týždeň v Plynárni", caption: "27.4.1996 - Dubnica nad Váhom" },
    { id: "poster-22", src: poster22, alt: "Frog Jam 98 - CO Kryt", caption: "19.9.1998 - Trenčín" },
    { id: "poster-23", src: poster23, alt: "Pesničky - Paľby - Meditácie", caption: "ZMVL koncertný plagát" },
    { id: "poster-24", src: poster24, alt: "Zožer Mesiac v Lufte - kresba Mišo", caption: "ZMVL kresba" },
  ],
  other: [
    { id: "article-1", src: article01, alt: "Článok 1 / Article 1", caption: "Článok 1" },
    { id: "article-2", src: article02, alt: "Článok 2 / Article 2", caption: "Článok 2" },
  ],
};

const categoryIcons = {
  photos: Camera,
  posters: FileImage,
  other: Folder,
};

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("photos");
  const [shuffledItems, setShuffledItems] = useState<GalleryItem[]>(() => 
    shuffleArray(galleryData["photos"])
  );
  const [isShuffling, setIsShuffling] = useState(false);
  const { t } = useLanguage();

  const categories: GalleryCategory[] = ["photos", "posters", "other"];

  // Handle category change
  const handleCategoryChange = useCallback((category: GalleryCategory) => {
    setActiveCategory(category);
    setShuffledItems(shuffleArray(galleryData[category]));
  }, []);

  const handleShuffle = useCallback(() => {
    if (isShuffling) return;
    setIsShuffling(true);
    
    // Trigger the shuffle with a slight delay for visual effect
    setTimeout(() => {
      setShuffledItems(shuffleArray(galleryData[activeCategory]));
      setTimeout(() => setIsShuffling(false), 600);
    }, 50);
  }, [activeCategory, isShuffling]);

  return (
    <section 
      id="gallery" 
      className="py-24 md:py-32 bg-secondary/30"
      aria-labelledby="gallery-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-8">
          <h2 
            id="gallery-heading"
            className="font-display text-5xl md:text-6xl text-foreground mb-4"
          >
            {t("gallery").toUpperCase()}
          </h2>
          <div className="w-24 h-1 bg-primary" aria-hidden="true" />
        </div>

        {/* Category Tabs + Shuffle */}
        <div className="flex gap-2 mb-10 flex-wrap items-center">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            const isActive = activeCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`
                  flex items-center gap-2 px-5 py-3 border-2 font-mono text-sm uppercase tracking-wider
                  transition-all duration-200
                  ${isActive 
                    ? "border-primary bg-primary text-primary-foreground" 
                    : "border-border bg-card text-muted-foreground hover:border-primary hover:text-foreground"
                  }
                `}
                aria-pressed={isActive}
              >
                <Icon size={18} />
                {t(category)}
              </button>
            );
          })}
          
          {/* Shuffle Button */}
          <button
            onClick={handleShuffle}
            className={`
              flex items-center gap-2 px-5 py-3 border-2 border-accent bg-accent 
              text-white hover:bg-accent/80
              font-mono text-sm uppercase tracking-wider transition-all duration-200
              ${isShuffling ? 'animate-pulse' : ''}
            `}
            aria-label="Shuffle gallery"
          >
            <Shuffle size={18} className={isShuffling ? 'animate-spin' : ''} />
            <Image size={18} />
            Shuffle
          </button>
        </div>

        {/* Gallery Grid */}
        <LayoutGroup>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {shuffledItems.map((item) => (
                <motion.button
                  key={item.id}
                  layoutId={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative aspect-square overflow-hidden border-2 border-border bg-card hover:border-primary focus:border-primary focus:outline-none"
                  aria-label={`View ${item.alt}`}
                  layout
                  initial={false}
                  animate={{ 
                    scale: isShuffling ? 0.5 : 1,
                    opacity: 1,
                    rotate: isShuffling ? Math.random() * 10 - 5 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 350,
                    damping: 25,
                    mass: 0.8,
                    scale: {
                      type: "spring",
                      stiffness: 400,
                      damping: 20,
                      mass: 0.5,
                    },
                    layout: {
                      type: "spring",
                      stiffness: 300,
                      damping: 30,
                      mass: 1,
                    }
                  }}
                  whileHover={{ scale: isShuffling ? 0.5 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Image */}
                  <img 
                    src={item.src} 
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="text-left">
                      <p className="font-mono text-xs text-primary uppercase tracking-wider">
                        {item.caption}
                      </p>
                      <p className="font-mono text-xs text-muted-foreground mt-1">
                        {item.alt}
                      </p>
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div 
                    className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                  <div 
                    className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-hidden="true"
                  />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Image lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <motion.div 
            className="max-w-4xl w-full border-2 border-border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            <img 
              src={selectedImage.src} 
              alt={selectedImage.alt}
              className="w-full max-h-[70vh] object-contain mb-4"
            />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-heading text-foreground">{selectedImage.alt}</p>
                {selectedImage.caption && (
                  <p className="font-mono text-xs text-primary uppercase tracking-wider mt-1">
                    {selectedImage.caption}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </section>
  );
}
