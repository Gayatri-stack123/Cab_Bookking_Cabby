import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Loader } from 'lucide-react';

const LocationInput = ({ placeholder, value, onChange, onSelect, icon: Icon, iconClassName }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const debounceRef = useRef(null);
    const containerRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowDropdown(false);
                setActiveIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchSuggestions = async (query) => {
        if (!query.trim() || query.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        setIsLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
                { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            setSuggestions(data);
            setShowDropdown(data.length > 0);
            setActiveIndex(-1);
        } catch {
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        onChange(e.target.value, null); // clear coords when user types manually
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(e.target.value), 350);
    };

    const handleSelect = (suggestion) => {
        const coords = { lat: parseFloat(suggestion.lat), lng: parseFloat(suggestion.lon) };
        onChange(suggestion.display_name, coords);
        setSuggestions([]);
        setShowDropdown(false);
        setActiveIndex(-1);
        if (onSelect) onSelect(suggestion.display_name, coords);
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        if (!showDropdown || suggestions.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && activeIndex >= 0) {
            e.preventDefault();
            handleSelect(suggestions[activeIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
            setActiveIndex(-1);
        }
    };

    const formatSuggestion = (s) => {
        const parts = s.display_name.split(', ');
        const name = parts[0];
        const sub = parts.slice(1, 3).join(', ');
        return { name, sub };
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Left icon */}
            <Icon
                className={`absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none ${iconClassName}`}
                size={20}
            />
            {/* Loading spinner */}
            {isLoading && (
                <Loader
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin z-10 pointer-events-none"
                    size={16}
                />
            )}
            <input
                type="text"
                className="w-full bg-gray-50 p-4 pl-12 pr-10 rounded-xl border border-gray-200 text-black font-semibold outline-none focus:ring-2 focus:ring-accent transition-all"
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
                autoComplete="off"
                spellCheck="false"
            />

            {/* Suggestions dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <ul
                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl overflow-hidden z-50"
                    style={{
                        boxShadow: '0 8px 30px rgba(0,0,0,0.14)',
                        border: '1px solid #f0f0f0',
                    }}
                >
                    {suggestions.map((s, i) => {
                        const { name, sub } = formatSuggestion(s);
                        const isActive = i === activeIndex;
                        return (
                            <li
                                key={s.place_id ?? i}
                                onMouseDown={() => handleSelect(s)}
                                onMouseEnter={() => setActiveIndex(i)}
                                className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors border-b border-gray-50 last:border-b-0 ${
                                    isActive ? 'bg-gray-100' : 'hover:bg-gray-50'
                                }`}
                            >
                                <MapPin
                                    size={18}
                                    className="text-accent mt-0.5 shrink-0"
                                />
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 text-sm truncate">{name}</p>
                                    {sub && (
                                        <p className="text-gray-400 text-xs truncate mt-0.5">{sub}</p>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default LocationInput;
