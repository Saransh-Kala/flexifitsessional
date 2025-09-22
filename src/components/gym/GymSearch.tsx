import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, MapPin, Filter, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GymCard } from "./GymCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  price_per_session: number;
  rating: number;
  total_reviews: number;
  facilities: string[];
  images: string[];
}

interface SearchFilters {
  location: string;
  priceRange: number[];
  facilities: string[];
  minRating: number;
}

export function GymSearch() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [filters, setFilters] = useState<SearchFilters>({
    location: "",
    priceRange: [0, 2000],
    facilities: [],
    minRating: 0,
  });

  const availableFacilities = [
    "Cardio Equipment", "Weight Training", "Personal Trainer", 
    "Group Classes", "Swimming Pool", "Sauna", "Steam Room",
    "Locker Room", "Parking", "24/7 Access", "Air Conditioning",
    "Yoga Studio", "CrossFit", "Pilates"
  ];

  const searchGyms = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("gyms")
        .select("*")
        .eq("is_approved", true)
        .eq("is_active", true);

      // Location search
      if (filters.location) {
        query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%,address.ilike.%${filters.location}%`);
      }

      // Name search
      if (searchQuery) {
        query = query.ilike("name", `%${searchQuery}%`);
      }

      // Price range filter
      query = query
        .gte("price_per_session", filters.priceRange[0])
        .lte("price_per_session", filters.priceRange[1]);

      // Rating filter
      if (filters.minRating > 0) {
        query = query.gte("rating", filters.minRating);
      }

      const { data, error } = await query.order("rating", { ascending: false });

      if (error) throw error;

      let filteredData = data || [];

      // Facilities filter (client-side since PostgreSQL array operations are complex)
      if (filters.facilities.length > 0) {
        filteredData = filteredData.filter(gym => 
          filters.facilities.some(facility => 
            gym.facilities?.includes(facility)
          )
        );
      }

      setGyms(filteredData);
    } catch (error) {
      console.error("Error searching gyms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchGyms();
  }, [filters, searchQuery]);

  const handleFacilityToggle = (facility: string) => {
    setFilters(prev => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter(f => f !== facility)
        : [...prev.facilities, facility]
    }));
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      priceRange: [0, 2000],
      facilities: [],
      minRating: 0,
    });
    setSearchQuery("");
  };

  return (
    <div className="container py-8">
      {/* Search Bar */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label htmlFor="search">Search Gyms</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Search by gym name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button onClick={searchGyms} disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="max-w-4xl mx-auto mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Filters</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Location Filter */}
            <div>
              <Label>Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="City, state, or address..."
                  value={filters.location}
                  onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <Label>Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]} per session</Label>
              <div className="mt-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value }))}
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <Label>Minimum Rating: {filters.minRating} stars</Label>
              <div className="mt-2">
                <Slider
                  value={[filters.minRating]}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value[0] }))}
                  max={5}
                  min={0}
                  step={0.5}
                  className="w-full"
                />
              </div>
            </div>

            {/* Facilities Filter */}
            <div>
              <Label className="mb-3 block">Facilities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableFacilities.map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={facility}
                      checked={filters.facilities.includes(facility)}
                      onCheckedChange={() => handleFacilityToggle(facility)}
                    />
                    <Label htmlFor={facility} className="text-sm font-normal">
                      {facility}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {(filters.facilities.length > 0 || filters.location || searchQuery || filters.minRating > 0) && (
        <div className="max-w-4xl mx-auto mb-6">
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <Badge variant="secondary" className="gap-1">
                Search: {searchQuery}
                <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="secondary" className="gap-1">
                Location: {filters.location}
                <X className="h-3 w-3 cursor-pointer" 
                   onClick={() => setFilters(prev => ({ ...prev, location: "" }))} />
              </Badge>
            )}
            {filters.minRating > 0 && (
              <Badge variant="secondary" className="gap-1">
                Min Rating: {filters.minRating}★
                <X className="h-3 w-3 cursor-pointer" 
                   onClick={() => setFilters(prev => ({ ...prev, minRating: 0 }))} />
              </Badge>
            )}
            {filters.facilities.map((facility) => (
              <Badge key={facility} variant="secondary" className="gap-1">
                {facility}
                <X className="h-3 w-3 cursor-pointer" onClick={() => handleFacilityToggle(facility)} />
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      <div className="max-w-6xl mx-auto">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-48 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">
                {gyms.length} gym{gyms.length !== 1 ? 's' : ''} found
              </h2>
            </div>
            
            {gyms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gyms.map((gym) => (
                  <GymCard key={gym.id} gym={gym} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No gyms found matching your criteria.</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear filters and try again
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}