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
import { useLanguage } from "@/contexts/LanguageContext";

const Index = () => {
  const { language } = useLanguage();
  const info = bandInfo[language];

  return (
    <>
      <Helmet>
        <title>{info.name} | Official Website</title>
        <meta name="description" content={info.tagline} />
        <meta name="keywords" content="industrial, noise, band, music, underground, Slovakia, Prievidza" />
        <meta property="og:title" content={`${info.name} | Official Website`} />
        <meta property="og:description" content={info.tagline} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://zmvl.sk" />
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
