import { Header } from "@/components/layout/Header";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturedGyms } from "@/components/home/FeaturedGyms";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturedGyms />
      </main>
    </div>
  );
};

export default Index;
