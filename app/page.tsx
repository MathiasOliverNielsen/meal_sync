import HeroSection from "../components/HeroSection";
import InfoCards from "../components/InfoCards";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <main className="flex-1">
        <InfoCards />
      </main>
      <Footer />
    </div>
  );
}
