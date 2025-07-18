import { useEffect, useState } from "react";
import NFTCard from "./NFTCard";
import { Button } from "@/components/ui/button";
import { Loader2, Grid, List } from "lucide-react";

interface NFT {
  id: string;
  name: string;
  image: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  collection?: string;
  chain?: string;
  mintDate?: string;
}

interface NFTGridProps {
  searchQuery?: string;
  filters?: any;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

// Mock data for demonstration
const mockNFTs: NFT[] = [
  {
    id: "1",
    name: "CryptoPunk #1234",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    description: "A rare CryptoPunk with unique traits",
    attributes: [
      { trait_type: "Type", value: "Male" },
      { trait_type: "Accessory", value: "Mohawk" },
      { trait_type: "Eyes", value: "Sunglasses" }
    ],
    collection: "CryptoPunks",
    chain: "Ethereum",
    mintDate: "2021-06-12"
  },
  {
    id: "2",
    name: "Bored Ape #5678",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    description: "A unique Bored Ape with golden fur",
    attributes: [
      { trait_type: "Background", value: "Blue" },
      { trait_type: "Fur", value: "Golden" },
      { trait_type: "Eyes", value: "Laser Eyes" }
    ],
    collection: "Bored Ape Yacht Club",
    chain: "Ethereum",
    mintDate: "2021-04-23"
  },
  {
    id: "3",
    name: "Art Blocks #9012",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    description: "Generative art masterpiece",
    attributes: [
      { trait_type: "Color Palette", value: "Vibrant" },
      { trait_type: "Complexity", value: "High" },
      { trait_type: "Style", value: "Abstract" }
    ],
    collection: "Art Blocks",
    chain: "Ethereum",
    mintDate: "2023-01-15"
  },
  {
    id: "4",
    name: "Azuki #3456",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    description: "Anime-inspired character",
    attributes: [
      { trait_type: "Type", value: "Human" },
      { trait_type: "Hair", value: "Pink" },
      { trait_type: "Clothing", value: "Hoodie" }
    ],
    collection: "Azuki",
    chain: "Ethereum",
    mintDate: "2022-01-12"
  },
  {
    id: "5",
    name: "Doodles #7890",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop",
    description: "Colorful doodle character",
    attributes: [
      { trait_type: "Body", value: "Rainbow" },
      { trait_type: "Head", value: "Bucket" },
      { trait_type: "Face", value: "Happy" }
    ],
    collection: "Doodles",
    chain: "Ethereum",
    mintDate: "2021-10-17"
  },
  {
    id: "6",
    name: "Moonbirds #1111",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop",
    description: "Pixel art bird",
    attributes: [
      { trait_type: "Beak", value: "Small" },
      { trait_type: "Body", value: "Crescent" },
      { trait_type: "Background", value: "Gray" }
    ],
    collection: "Moonbirds",
    chain: "Ethereum",
    mintDate: "2022-04-16"
  }
];

const NFTGrid = ({ 
  searchQuery = "", 
  filters = {}, 
  onLoadMore, 
  hasMore = true, 
  loading = false 
}: NFTGridProps) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setLocalLoading(true);
    setTimeout(() => {
      setNfts(mockNFTs);
      setLocalLoading(false);
    }, 1000);
  }, [searchQuery, filters]);

  const filteredNFTs = nfts.filter(nft => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        nft.name.toLowerCase().includes(query) ||
        nft.collection?.toLowerCase().includes(query) ||
        nft.description.toLowerCase().includes(query) ||
        nft.attributes.some(attr => 
          attr.trait_type.toLowerCase().includes(query) ||
          attr.value.toLowerCase().includes(query)
        )
      );
    }
    return true;
  });

  if (localLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading NFTs...</p>
      </div>
    );
  }

  if (filteredNFTs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">No NFTs found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {filteredNFTs.length} NFT{filteredNFTs.length !== 1 ? 's' : ''} found
          </h2>
          <p className="text-muted-foreground mt-1">
            Sorted by date minted (newest first)
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* NFT Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredNFTs.map((nft, index) => (
          <div 
            key={nft.id}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <NFTCard {...nft} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default NFTGrid;