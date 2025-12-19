import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Listen } from "@/components/Listen";
import { Gallery } from "@/components/Gallery";
import { Footer } from "@/components/Footer";
import { MusicProvider } from "@/contexts/MusicContext";
import { VisualizerProvider } from "@/contexts/VisualizerContext";
import { Helmet } from "react-helmet-async";
import { bandInfo } from "@/data/bandInfo";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>{bandInfo.name} | Official Website</title>
        <meta name="description" content={bandInfo.tagline} />
        <meta name="keywords" content="punk, industrial, band, music, underground, Berlin" />
        <meta property="og:title" content={`${bandInfo.name} | Official Website`} />
        <meta property="og:description" content={bandInfo.tagline} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://theolddaysband.com" />
      </Helmet>

      <MusicProvider>
        <VisualizerProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main>
              <Hero />
              <About />
              <Listen />
              <Gallery />
            </main>
            <Footer />
          </div>
        </VisualizerProvider>
      </MusicProvider>
    </>
  );
};

export default Index;
