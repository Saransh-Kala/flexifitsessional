import { useEffect, useState } from "react";
import { GymCard } from "@/components/gym/GymCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Gym {
  id: string;
  name: string;
  address: string;
  city: string;
  price_per_session: number;
  rating: number;
  total_reviews: number;
  facilities: string[];
  images: string[];
}

export function FeaturedGyms() {
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedGyms = async () => {
      try {
        const { data, error } = await supabase
          .from("gyms")
          .select("*")
          .eq("is_approved", true)
          .eq("is_active", true)
          .order("rating", { ascending: false })
          .limit(6);

        if (error) throw error;
        setGyms(data || []);
      } catch (error) {
        console.error("Error fetching gyms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedGyms();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Gyms</h2>
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Gyms</h2>
        <p className="text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
          Discover top-rated fitness centers in your area. From state-of-the-art equipment 
          to experienced trainers, find the perfect gym for your workout needs.
        </p>
        
        {gyms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gyms.map((gym) => (
              <GymCard key={gym.id} gym={gym} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No gyms available at the moment.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back soon for new listings!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}