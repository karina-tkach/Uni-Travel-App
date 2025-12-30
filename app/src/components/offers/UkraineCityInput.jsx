import { useState, useEffect, useRef } from "react";

export default function UkraineCityInput({ value, onChange, placeholder = "Введіть місто..." }) {
    const [query, setQuery] = useState(value || "");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const fetchCities = async (q) => {
        if (!q) return setSuggestions([]);
        setLoading(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?country=Ukraine&city=${q}&format=json&limit=10&accept-language=uk&countrycodes=ua`
            );
            const data = await res.json();
            setSuggestions(data.map(item => item.display_name));
        } catch (err) {
            console.error(err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => fetchCities(query), 300);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (city) => {
        setQuery(city);
        setShowDropdown(false);
        onChange?.(city);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setShowDropdown(true);
                    onChange?.(e.target.value);
                }}
                placeholder={placeholder}
                className="w-full border-2 border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
            />
            {showDropdown && suggestions.length > 0 && (
                <ul className="absolute z-50 w-full bg-white border border-gray-300 rounded mt-1 max-h-60 overflow-auto shadow-lg">
                    {loading && <li className="p-2 text-gray-500">Завантаження...</li>}
                    {!loading && suggestions.map((city, i) => (
                        <li
                            key={i}
                            onClick={() => handleSelect([city.split(",")[0].trim(), city.split(",").find(p => p.includes("область"))].join(", "))}
                            className="p-2 hover:bg-blue-100 cursor-pointer"
                        >
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
