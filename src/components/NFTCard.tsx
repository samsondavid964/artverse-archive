import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink } from "lucide-react";
import { useState } from "react";

interface NFTAttribute {
  trait_type: string;
  value: string;
}

interface NFTCardProps {
  id: string;
  name: string;
  image: string;
  description: string;
  attributes: NFTAttribute[];
  collection?: string;
  chain?: string;
  mintDate?: string;
}

const NFTCard = ({ 
  id, 
  name, 
  image, 
  description, 
  attributes, 
  collection = "Unknown Collection",
  chain = "Ethereum",
  mintDate = "2024-01-01"
}: NFTCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card className="group overflow-hidden bg-card border-border hover:shadow-hover transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img 
          src={image} 
          alt={name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
          >
            <Heart 
              size={16} 
              className={isLiked ? "text-accent fill-accent" : "text-foreground"} 
            />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle external link
            }}
            className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
          >
            <ExternalLink size={16} className="text-foreground" />
          </button>
        </div>
        
        {/* Chain badge */}
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="text-xs font-medium">
            {chain}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors duration-200">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {collection}
              </p>
            </div>
            <p className="text-xs text-muted-foreground ml-2">
              #{id}
            </p>
          </div>
          
          {/* Attributes */}
          {attributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {attributes.slice(0, 3).map((attr, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="text-xs py-0.5 px-2"
                >
                  {attr.trait_type}: {attr.value}
                </Badge>
              ))}
              {attributes.length > 3 && (
                <Badge variant="outline" className="text-xs py-0.5 px-2">
                  +{attributes.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-muted-foreground">
              Minted: {new Date(mintDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NFTCard;