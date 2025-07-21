import { useEffect, useState, useCallback } from "react";

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

// Extended mock data for better testing
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
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=400&fit=crop",
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
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop",
    description: "Pixel art bird",
    attributes: [
      { trait_type: "Beak", value: "Small" },
      { trait_type: "Body", value: "Crescent" },
      { trait_type: "Background", value: "Gray" }
    ],
    collection: "Moonbirds",
    chain: "Ethereum",
    mintDate: "2022-04-16"
  },
  // Add more mock data for pagination testing
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `${i + 7}`,
    name: `Sample NFT #${i + 7}`,
    image: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=400&fit=crop`,
    description: `Description for sample NFT ${i + 7}`,
    attributes: [
      { trait_type: "Rarity", value: i % 3 === 0 ? "Rare" : "Common" },
      { trait_type: "Generation", value: `Gen ${Math.floor(i / 5) + 1}` }
    ],
    collection: `Collection ${Math.floor(i / 3) + 1}`,
    chain: i % 2 === 0 ? "Ethereum" : "Polygon",
    mintDate: new Date(2023, i % 12, (i % 28) + 1).toISOString().split('T')[0]
  }))
];

export const useNFTData = (searchQuery: string) => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = 12;

  const parseSearchQuery = useCallback((query: string) => {
    const terms: string[] = [];
    const filters: any = {};
    
    // Split query by spaces but keep quoted strings together
    const parts = query.match(/(".*?"|\S+)/g) || [];
    
    parts.forEach(part => {
      const cleanPart = part.replace(/^"(.*)"$/, '$1'); // Remove quotes
      
      // Check for specific search patterns
      if (cleanPart.startsWith('blockchain:')) {
        filters.blockchain = cleanPart.substring(10).toLowerCase();
      } else if (cleanPart.startsWith('chain:')) {
        filters.blockchain = cleanPart.substring(6).toLowerCase();
      } else if (cleanPart.startsWith('type:')) {
        filters.fileType = cleanPart.substring(5).toLowerCase();
      } else if (cleanPart.startsWith('#')) {
        // Token ID search
        filters.tokenId = cleanPart.substring(1);
      } else if (/^\d+$/.test(cleanPart)) {
        // Pure number - also treat as potential token ID
        filters.tokenId = cleanPart;
      } else {
        // Regular search term
        terms.push(cleanPart.toLowerCase());
      }
    });
    
    return { terms, filters };
  }, []);

  const filterNFTs = useCallback((nfts: NFT[], query: string) => {
    if (!query.trim()) return nfts;
    
    const { terms, filters } = parseSearchQuery(query);
    
    return nfts.filter(nft => {
      // Blockchain filter
      if (filters.blockchain && nft.chain?.toLowerCase() !== filters.blockchain) {
        return false;
      }
      
      // File type filter (mock - would check actual file extension in real app)
      if (filters.fileType) {
        const imageTypes = ['image', 'img', 'jpeg', 'jpg', 'png', 'gif', 'webp'];
        const videoTypes = ['video', 'mp4', 'avi', 'mov', 'webm'];
        
        if (filters.fileType === 'image' && !imageTypes.some(type => 
          nft.image?.toLowerCase().includes(type) || nft.name.toLowerCase().includes(type)
        )) {
          return false;
        }
        
        if (filters.fileType === 'video' && !videoTypes.some(type => 
          nft.image?.toLowerCase().includes(type) || nft.name.toLowerCase().includes(type)
        )) {
          return false;
        }
      }
      
      // Token ID filter
      if (filters.tokenId && !nft.id.includes(filters.tokenId) && 
          !nft.name.toLowerCase().includes(`#${filters.tokenId}`)) {
        return false;
      }
      
      // General search terms
      if (terms.length > 0) {
        const searchableText = [
          nft.name,
          nft.collection || '',
          nft.description,
          nft.chain || '',
          ...nft.attributes.map(attr => `${attr.trait_type} ${attr.value}`)
        ].join(' ').toLowerCase();
        
        const matchesAllTerms = terms.every(term => searchableText.includes(term));
        if (!matchesAllTerms) return false;
      }
      
      return true;
    });
  }, [parseSearchQuery]);

  const loadNFTs = useCallback(async (reset: boolean = false) => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const filtered = filterNFTs(mockNFTs, searchQuery);
    const startIndex = reset ? 0 : (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const newNFTs = filtered.slice(startIndex, endIndex);
    
    if (reset) {
      setNfts(newNFTs);
      setPage(2);
    } else {
      setNfts(prev => [...prev, ...newNFTs]);
      setPage(prev => prev + 1);
    }
    
    setHasMore(endIndex < filtered.length);
    setLoading(false);
  }, [searchQuery, page, filterNFTs]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadNFTs(false);
    }
  }, [loading, hasMore, loadNFTs]);

  useEffect(() => {
    setPage(1);
    loadNFTs(true);
  }, [searchQuery]);

  return {
    nfts,
    loading,
    hasMore,
    loadMore,
    totalCount: filterNFTs(mockNFTs, searchQuery).length
  };
};