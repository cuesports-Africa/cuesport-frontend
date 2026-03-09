"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CountryCode {
    name: string;
    code: string;
    dial: string;
    flag: string;
}

const COUNTRY_CODES: CountryCode[] = [
    { name: "Kenya", code: "KE", dial: "+254", flag: "🇰🇪" },
    { name: "Nigeria", code: "NG", dial: "+234", flag: "🇳🇬" },
    { name: "South Africa", code: "ZA", dial: "+27", flag: "🇿🇦" },
    { name: "Tanzania", code: "TZ", dial: "+255", flag: "🇹🇿" },
    { name: "Uganda", code: "UG", dial: "+256", flag: "🇺🇬" },
    { name: "Ghana", code: "GH", dial: "+233", flag: "🇬🇭" },
    { name: "Ethiopia", code: "ET", dial: "+251", flag: "🇪🇹" },
    { name: "Rwanda", code: "RW", dial: "+250", flag: "🇷🇼" },
    { name: "Cameroon", code: "CM", dial: "+237", flag: "🇨🇲" },
    { name: "Senegal", code: "SN", dial: "+221", flag: "🇸🇳" },
    { name: "Côte d'Ivoire", code: "CI", dial: "+225", flag: "🇨🇮" },
    { name: "Mozambique", code: "MZ", dial: "+258", flag: "🇲🇿" },
    { name: "Zimbabwe", code: "ZW", dial: "+263", flag: "🇿🇼" },
    { name: "Zambia", code: "ZM", dial: "+260", flag: "🇿🇲" },
    { name: "Botswana", code: "BW", dial: "+267", flag: "🇧🇼" },
    { name: "Namibia", code: "NA", dial: "+264", flag: "🇳🇦" },
    { name: "Malawi", code: "MW", dial: "+265", flag: "🇲🇼" },
    { name: "DR Congo", code: "CD", dial: "+243", flag: "🇨🇩" },
    { name: "Angola", code: "AO", dial: "+244", flag: "🇦🇴" },
    { name: "Egypt", code: "EG", dial: "+20", flag: "🇪🇬" },
    { name: "Morocco", code: "MA", dial: "+212", flag: "🇲🇦" },
    { name: "Tunisia", code: "TN", dial: "+216", flag: "🇹🇳" },
    { name: "Algeria", code: "DZ", dial: "+213", flag: "🇩🇿" },
    { name: "Sudan", code: "SD", dial: "+249", flag: "🇸🇩" },
    { name: "Somalia", code: "SO", dial: "+252", flag: "🇸🇴" },
    { name: "Madagascar", code: "MG", dial: "+261", flag: "🇲🇬" },
    { name: "Mauritius", code: "MU", dial: "+230", flag: "🇲🇺" },
    { name: "Burkina Faso", code: "BF", dial: "+226", flag: "🇧🇫" },
    { name: "Mali", code: "ML", dial: "+223", flag: "🇲🇱" },
    { name: "Togo", code: "TG", dial: "+228", flag: "🇹🇬" },
    { name: "Benin", code: "BJ", dial: "+229", flag: "🇧🇯" },
    { name: "Sierra Leone", code: "SL", dial: "+232", flag: "🇸🇱" },
    { name: "Liberia", code: "LR", dial: "+231", flag: "🇱🇷" },
    { name: "Gambia", code: "GM", dial: "+220", flag: "🇬🇲" },
    { name: "Guinea", code: "GN", dial: "+224", flag: "🇬🇳" },
    { name: "Eswatini", code: "SZ", dial: "+268", flag: "🇸🇿" },
    { name: "Lesotho", code: "LS", dial: "+266", flag: "🇱🇸" },
    { name: "Burundi", code: "BI", dial: "+257", flag: "🇧🇮" },
    { name: "South Sudan", code: "SS", dial: "+211", flag: "🇸🇸" },
    { name: "Eritrea", code: "ER", dial: "+291", flag: "🇪🇷" },
    { name: "Djibouti", code: "DJ", dial: "+253", flag: "🇩🇯" },
    { name: "Comoros", code: "KM", dial: "+269", flag: "🇰🇲" },
    { name: "Cape Verde", code: "CV", dial: "+238", flag: "🇨🇻" },
    { name: "São Tomé and Príncipe", code: "ST", dial: "+239", flag: "🇸🇹" },
    { name: "Seychelles", code: "SC", dial: "+248", flag: "🇸🇨" },
    { name: "Equatorial Guinea", code: "GQ", dial: "+240", flag: "🇬🇶" },
    { name: "Gabon", code: "GA", dial: "+241", flag: "🇬🇦" },
    { name: "Congo", code: "CG", dial: "+242", flag: "🇨🇬" },
    { name: "Central African Republic", code: "CF", dial: "+236", flag: "🇨🇫" },
    { name: "Chad", code: "TD", dial: "+235", flag: "🇹🇩" },
    { name: "Niger", code: "NE", dial: "+227", flag: "🇳🇪" },
    { name: "Mauritania", code: "MR", dial: "+222", flag: "🇲🇷" },
    { name: "Libya", code: "LY", dial: "+218", flag: "🇱🇾" },
    { name: "Guinea-Bissau", code: "GW", dial: "+245", flag: "🇬🇼" },
];

interface PhoneInputProps {
    value: string;
    onChange: (fullNumber: string) => void;
    id?: string;
    required?: boolean;
    className?: string;
    defaultCountry?: string;
}

export function PhoneInput({
    value,
    onChange,
    id = "phone_number",
    required = false,
    className,
    defaultCountry = "KE",
}: PhoneInputProps) {
    const [selectedCountry, setSelectedCountry] = useState<CountryCode>(
        () => COUNTRY_CODES.find((c) => c.code === defaultCountry) || COUNTRY_CODES[0]
    );
    const [localNumber, setLocalNumber] = useState(() => {
        // Strip dial code from initial value if present
        for (const c of COUNTRY_CODES) {
            if (value.startsWith(c.dial)) {
                return value.slice(c.dial.length);
            }
        }
        return value.replace(/^\+\d+/, "");
    });
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    // Close dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
                setSearch("");
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClick);
            // Focus search when opening
            setTimeout(() => searchRef.current?.focus(), 50);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    function handleLocalChange(val: string) {
        // Allow only digits
        const digits = val.replace(/\D/g, "");
        setLocalNumber(digits);
        onChange(selectedCountry.dial + digits);
    }

    function handleSelectCountry(country: CountryCode) {
        setSelectedCountry(country);
        setOpen(false);
        setSearch("");
        onChange(country.dial + localNumber);
    }

    const filtered = search.trim()
        ? COUNTRY_CODES.filter(
              (c) =>
                  c.name.toLowerCase().includes(search.toLowerCase()) ||
                  c.dial.includes(search) ||
                  c.code.toLowerCase().includes(search.toLowerCase())
          )
        : COUNTRY_CODES;

    return (
        <div className={cn("relative", className)}>
            <div className="flex">
                {/* Country selector button */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className="search-input-dark h-12 rounded-l-xl rounded-r-none border-border/20 border-r-0 px-3 flex items-center gap-1.5 hover:bg-muted/30 transition-colors shrink-0"
                    >
                        <span className="text-base leading-none">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium text-muted-foreground">{selectedCountry.dial}</span>
                        <ChevronDown className={cn(
                            "h-3.5 w-3.5 text-muted-foreground transition-transform",
                            open && "rotate-180"
                        )} />
                    </button>

                    {/* Dropdown */}
                    {open && (
                        <div className="absolute top-full left-0 mt-1 w-72 max-h-64 bg-background border border-border/30 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
                            {/* Search */}
                            <div className="p-2 border-b border-border/20">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        ref={searchRef}
                                        type="text"
                                        placeholder="Search country..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full h-9 pl-8 pr-3 rounded-lg bg-muted/30 border border-border/20 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-electric/40 transition-colors"
                                    />
                                </div>
                            </div>
                            {/* Country list */}
                            <div className="overflow-y-auto max-h-48">
                                {filtered.length === 0 ? (
                                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                                        No countries found
                                    </div>
                                ) : (
                                    filtered.map((country) => (
                                        <button
                                            key={country.code}
                                            type="button"
                                            onClick={() => handleSelectCountry(country)}
                                            className={cn(
                                                "w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-muted/40 transition-colors",
                                                selectedCountry.code === country.code && "bg-electric/5"
                                            )}
                                        >
                                            <span className="text-base leading-none">{country.flag}</span>
                                            <span className="text-sm text-foreground flex-1 truncate">{country.name}</span>
                                            <span className="text-xs text-muted-foreground font-mono">{country.dial}</span>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Phone number input */}
                <Input
                    id={id}
                    type="tel"
                    inputMode="numeric"
                    placeholder="712345678"
                    required={required}
                    value={localNumber}
                    onChange={(e) => handleLocalChange(e.target.value)}
                    className="search-input-dark h-12 rounded-l-none rounded-r-xl border-border/20 flex-1"
                />
            </div>
        </div>
    );
}

export { COUNTRY_CODES, type CountryCode };
