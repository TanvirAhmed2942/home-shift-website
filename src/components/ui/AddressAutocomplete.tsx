import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';
import { fetchSystemConfig } from '../../utils/configService';
import { MAPBOX_PUBLIC_TOKEN } from '../../utils/mapboxConfig';

interface AddressResult {
  place_name: string;
  center: [number, number]; // [lng, lat]
  context?: any[];
}

interface AddressAutocompleteProps {
  onSelect: (address: string, lat: number, lng: number) => void;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
}

export function AddressAutocomplete({ onSelect, placeholder = "Enter address...", defaultValue = "", className = "" }: AddressAutocompleteProps) {
  const [query, setQuery] = useState(defaultValue);
  const [results, setResults] = useState<AddressResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Fetch Mapbox token on mount
  useEffect(() => {
    const loadToken = async () => {
      setIsLoadingToken(true);
      const token = await getMapboxToken();
      setMapboxToken(token);
      setIsLoadingToken(false);
    };
    loadToken();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query && query.length > 2 && isOpen && mapboxToken) {
        searchAddress(query);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, isOpen, mapboxToken]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getMapboxToken = async (): Promise<string | null> => {
    // 1. Check environment variable
    const envToken = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_MAPBOX_TOKEN) || 
                     (typeof import.meta !== 'undefined' && (import.meta as any).env?.NEXT_PUBLIC_MAPBOX_TOKEN);
    if (envToken) {
      return envToken;
    }
    
    // 2. Check localStorage
    const localToken = typeof window !== 'undefined' ? localStorage.getItem('mapbox_token') : null;
    if (localToken) {
      return localToken;
    }

    // 3. Fetch from backend
    const config = await fetchSystemConfig();
    if (config?.mapboxToken) {
        localStorage.setItem('mapbox_token', config.mapboxToken);
        return config.mapboxToken;
    }

    // 4. Use hardcoded token as final fallback
    if (MAPBOX_PUBLIC_TOKEN) {
        return MAPBOX_PUBLIC_TOKEN;
    }

    console.error('❌ Mapbox token not found in any source. Please configure NEXT_PUBLIC_MAPBOX_TOKEN environment variable.');
    return null;
  };

  const searchAddress = async (searchText: string) => {
    if (!mapboxToken) {
      console.error("Mapbox Token missing");
      return;
    }

    setIsLoading(true);
    try {
      // Add country=GB to restrict to UK if needed, or remove for global
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchText)}.json?access_token=${mapboxToken}&autocomplete=true&country=gb`
      );
      const data = await response.json();
      if (data.features) {
        setResults(data.features);
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (item: AddressResult) => {
    setQuery(item.place_name);
    setIsOpen(false);
    // Mapbox returns [lng, lat], we pass [lat, lng] to callback for consistency with Leaflet/Google
    onSelect(item.place_name, item.center[1], item.center[0]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsOpen(true);
  };

  const hasToken = !!mapboxToken;

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          placeholder={isLoadingToken ? "Loading..." : (hasToken ? placeholder : "Mapbox Token Missing - Add in Environment Variables")}
          disabled={!hasToken || isLoadingToken}
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
        />
        {(isLoading || isLoadingToken) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.id || Math.random()} // fallback key
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-blue-50 flex items-start gap-2 border-b border-gray-50 last:border-0 transition-colors"
            >
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900 truncate">{item.place_name.split(',')[0]}</p>
                <p className="text-xs text-gray-500 truncate">{item.place_name.split(',').slice(1).join(',')}</p>
              </div>
            </button>
          ))}
          <div className="px-2 py-1 bg-gray-50 text-[10px] text-right text-gray-400">
            Powered by Mapbox
          </div>
        </div>
      )}
    </div>
  );
}
