import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Clock, Users } from "lucide-react";

interface GymCardProps {
  gym: {
    id: string;
    name: string;
    address: string;
    city: string;
    price_per_session: number;
    rating: number;
    total_reviews: number;
    facilities: string[];
    images: string[];
  };
}

export function GymCard({ gym }: GymCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={gym.images[0] || "/placeholder.svg"}
          alt={gym.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/90">
            {formatPrice(gym.price_per_session)}/session
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{gym.name}</h3>
        
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="line-clamp-1">{gym.address}, {gym.city}</span>
        </div>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-4">
            <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
            <span className="font-medium">{gym.rating.toFixed(1)}</span>
            <span className="text-muted-foreground ml-1">({gym.total_reviews})</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>Available today</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {gym.facilities.slice(0, 3).map((facility, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {facility}
            </Badge>
          ))}
          {gym.facilities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{gym.facilities.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">
          Book Session
        </Button>
      </CardFooter>
    </Card>
  );
}