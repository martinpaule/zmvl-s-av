import { useState } from "react";
import { X, Camera, FileImage, Folder } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Import gallery images
import gallery01 from "@/assets/gallery-01.jpg";
import gallery02 from "@/assets/gallery-02.jpg";
import gallery03 from "@/assets/gallery-03.jpg";
import gallery04 from "@/assets/gallery-04.jpg";
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

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

type GalleryCategory = "photos" | "posters" | "other";

const galleryData: Record<GalleryCategory, GalleryItem[]> = {
  photos: [
    {
      id: "photo-1",
      src: gallery01,
      alt: "Industrial performance with metal percussion",
      caption: "Prievidza, 1991",
    },
    {
      id: "photo-2",
      src: gallery02,
      alt: "Live show with dramatic lighting",
      caption: "Bratislava, 1993",
    },
    {
      id: "photo-3",
      src: gallery03,
      alt: "Band members with instruments",
      caption: "Kopřivnice, 1995",
    },
    {
      id: "photo-4",
      src: gallery04,
      alt: "Underground venue performance",
      caption: "Brno, 1994",
    },
  ],
  posters: [
    {
      id: "poster-1",
      src: poster01,
      alt: "Club dB Maximal Prievidza",
      caption: "9.6.1993 - Prievidza",
    },
    {
      id: "poster-2",
      src: poster02,
      alt: "Archbishop Kebab, Leukémia, Trottel + ZMVL",
      caption: "16.10.1993 - Přerov-Kozlovice",
    },
    {
      id: "poster-3",
      src: poster03,
      alt: "Slovenské Alternatívne Leto",
      caption: "21-23.7.1995 - Bzovík",
    },
    {
      id: "poster-4",
      src: poster04,
      alt: "Rock Fabrik - ZMVL Industrial Rock",
      caption: "25.4.1992 - Bratislava",
    },
    {
      id: "poster-5",
      src: poster05,
      alt: "Rock Fabrik August Program",
      caption: "August 1992 - Bratislava",
    },
    {
      id: "poster-6",
      src: poster06,
      alt: "Koncert Trenčianske Teplice",
      caption: "3.6.1994 - Trenčianske Teplice",
    },
    {
      id: "poster-7",
      src: poster07,
      alt: "Havlíček & Magnusek + ZMVL",
      caption: "13.5 - Prievidza Kazačok",
    },
    {
      id: "poster-8",
      src: poster08,
      alt: "Zelený týždeň v Plynárni",
      caption: "27.4.1996 - Dubnica nad Váhom",
    },
    {
      id: "poster-9",
      src: poster09,
      alt: "Rock Fabrik Bratislava",
      caption: "25.4.1992 - Bratislava",
    },
    {
      id: "poster-10",
      src: poster10,
      alt: "ZMVL tričko Barbakán",
      caption: "13.9.1992 - Banská Bystrica",
    },
  ],
  other: [
    {
      id: "article-1",
      src: article01,
      alt: "Článok 1 / Article 1",
      caption: "Článok 1",
    },
    {
      id: "article-2",
      src: article02,
      alt: "Článok 2 / Article 2",
      caption: "Článok 2",
    },
  ],
};

const categoryIcons = {
  photos: Camera,
  posters: FileImage,
  other: Folder,
};

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("photos");
  const { t } = useLanguage();

  const categories: GalleryCategory[] = ["photos", "posters", "other"];

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

        {/* Category Tabs */}
        <div className="flex gap-2 mb-10 flex-wrap">
          {categories.map((category) => {
            const Icon = categoryIcons[category];
            const isActive = activeCategory === category;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
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
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryData[activeCategory].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative aspect-square overflow-hidden border-2 border-border bg-card transition-all duration-300 hover:border-primary focus:border-primary focus:outline-none"
              aria-label={`View ${item.alt}`}
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
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Close lightbox"
          >
            <X size={32} />
          </button>

          <div 
            className="max-w-4xl w-full border-2 border-border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
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
          </div>
        </div>
      )}
    </section>
  );
}
