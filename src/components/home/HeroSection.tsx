import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Calendar, Filter } from "lucide-react";

export function HeroSection() {
  const [searchLocation, setSearchLocation] = useState("");

  return (
    <section className="relative bg-gradient-hero min-h-[600px] flex items-center">
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="container relative z-10 text-center text-white">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Find Your Perfect
          <span className="block text-secondary">Gym Session</span>
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto">
          Book individual gym sessions near you. No long-term commitments, 
          just flexible fitness on your terms.
        </p>

        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Enter location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10 h-12 text-foreground"
              />
            </div>
            
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="date"
                className="pl-10 h-12 text-foreground"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="relative">
              <Filter className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <select className="w-full h-12 pl-10 pr-4 border border-input bg-background rounded-md text-foreground">
                <option value="">Any Price</option>
                <option value="0-300">Under ₹300</option>
                <option value="300-500">₹300 - ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000+">Above ₹1000</option>
              </select>
            </div>
            
            <Button size="lg" className="h-12">
              <Search className="h-5 w-5 mr-2" />
              Find Gyms
            </Button>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Find Nearby</h3>
            <p className="text-white/80">
              Discover gyms in your area with our smart location search
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Book Instantly</h3>
            <p className="text-white/80">
              Reserve your session with just a few clicks
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-secondary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-secondary" />
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