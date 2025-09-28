import { Button } from "@/components/ui/button";
import { Search, MapPin, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-hero min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Perfect
          <span className="block text-primary">Gym Session</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          Book individual gym sessions near you. No long-term commitments, 
          just flexible fitness on your terms.
        </p>

        <div className="max-w-md mx-auto">
          <Button 
            size="lg" 
            className="h-16 text-xl px-12 font-semibold shadow-accent hover:shadow-primary transition-all duration-300 transform hover:scale-105" 
            onClick={() => navigate('/search')}
          >
            <Search className="h-6 w-6 mr-3" />
            Find Your Gym
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Nearby</h3>
            <p className="text-white/80">
              Discover gyms in your area with our smart location search
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
            <p className="text-white/80">
              Reserve your session with just a few clicks
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Work Out</h3>
            <p className="text-white/80">
              Enjoy your fitness session with flexible timing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}