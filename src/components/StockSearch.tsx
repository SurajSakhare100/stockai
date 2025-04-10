
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { searchStocks } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface StockSearchProps {
  onSelectStock: (symbol: string) => void;
  currentSymbol?: string;
}

const StockSearch: React.FC<StockSearchProps> = ({ onSelectStock, currentSymbol }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ symbol: string; name: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 1) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const searchResults = await searchStocks(query);
        setResults(searchResults);
      } catch (error) {
        console.error('Error searching stocks:', error);
        toast({
          title: 'Search Error',
          description: 'Failed to search for stocks. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [query, toast]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setQuery('');
    setIsDropdownOpen(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    if (query.length > 0) {
      setIsDropdownOpen(true);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full md:w-64" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search stocks..."
          className="pl-8 pr-8"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length > 0) {
              setIsDropdownOpen(true);
            } else {
              setIsDropdownOpen(false);
            }
          }}
          onFocus={handleFocus}
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2 text-muted-foreground"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
          {isSearching ? (
            <div className="p-2 text-center text-sm text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-1 max-h-60 overflow-auto">
              {results.map((result) => (
                <li key={result.symbol}>
                  <button
                    className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex justify-between items-center ${
                      result.symbol === currentSymbol ? 'bg-muted' : ''
                    }`}
                    onClick={() => handleSelect(result.symbol)}
                  >
                    <span className="font-medium">{result.symbol}</span>
                    <span className="text-muted-foreground truncate ml-2">{result.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : query.length > 0 ? (
            <div className="p-2 text-center text-sm text-muted-foreground">No stocks found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default StockSearch;
