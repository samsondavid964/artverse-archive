import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterToggle: () => void;
  placeholder?: string;
}

const SearchBar = ({ 
  onSearch, 
  onFilterToggle, 
  placeholder = "Search by Artist Wallet, Collection Name, Token ID, Trait..." 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <div className="absolute left-4 z-10">
            <Search className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <Input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-20 py-6 text-lg border-2 border-border focus:border-primary transition-colors duration-200 bg-card shadow-card"
          />
          
          <div className="absolute right-2 flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onFilterToggle}
              className="h-8 w-8 p-0"
            >
              <Filter className="h-4 w-4" />
            </Button>
            
            <Button
              type="submit"
              size="sm"
              className="h-8 px-4 bg-primary hover:bg-primary/90"
            >
              Search
            </Button>
          </div>
        </div>
      </form>
      
      {/* Quick search suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="text-sm text-muted-foreground">Popular searches:</span>
        {["CryptoPunks", "Bored Ape", "Art Blocks", "Azuki", "Doodles"].map((suggestion) => (
          <Button
            key={suggestion}
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => {
              setSearchQuery(suggestion);
              onSearch(suggestion);
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;