import { useState } from "react";
import { X } from "lucide-react";

// Import gallery images
import gallery01 from "@/assets/gallery-01.jpg";
import gallery02 from "@/assets/gallery-02.jpg";
import gallery03 from "@/assets/gallery-03.jpg";
import gallery04 from "@/assets/gallery-04.jpg";
import gallery05 from "@/assets/gallery-05.jpg";
import gallery06 from "@/assets/gallery-06.jpg";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  caption?: string;
}

const galleryItems: GalleryItem[] = [
  {
    id: "1",
    src: gallery01,
    alt: "Live performance at underground venue",
    caption: "Berlin, 2023",
  },
  {
    id: "2",
    src: gallery02,
    alt: "Close-up of guitarist during set",
    caption: "Hamburg, 2023",
  },
  {
    id: "3",
    src: gallery03,
    alt: "Drummer in action with dramatic lighting",
    caption: "Prague, 2022",
  },
  {
    id: "4",
    src: gallery04,
    alt: "Backstage at industrial venue",
    caption: "Vienna, 2022",
  },
  {
    id: "5",
    src: gallery05,
    alt: "Lead singer performing with smoke effects",
    caption: "Amsterdam, 2023",
  },
  {
    id: "6",
    src: gallery06,
    alt: "Stage setup with neon lighting",
    caption: "Munich, 2023",
  },
];

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  return (
    <section 
      id="gallery" 
      className="py-24 md:py-32 bg-secondary/30"
      aria-labelledby="gallery-heading"
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16">
          <h2 
            id="gallery-heading"
            className="font-display text-5xl md:text-6xl text-foreground mb-4"
          >
            GALLERY
          </h2>
          <div className="w-24 h-1 bg-primary" aria-hidden="true" />
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {galleryItems.map((item) => (
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
              className="w-full aspect-video object-cover mb-4"
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
