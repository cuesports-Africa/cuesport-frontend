"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { locationApi } from "@/lib/api";

interface CountryCode {
    name: string;
    code: string;
    dial: string;
    flag: string;
}

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
    const [countries, setCountries] = useState<CountryCode[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
    const [localNumber, setLocalNumber] = useState("");
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const initializedRef = useRef(false);

    // Fetch active countries from backend
    useEffect(() => {
        locationApi.countries()
            .then((res) => {
                const mapped: CountryCode[] = res.countries
                    .filter((c) => c.phone_code && c.flag)
                    .map((c) => ({
                        name: c.name,
                        code: c.code || "",
                        dial: c.phone_code!,
                        flag: c.flag!,
                    }));
                setCountries(mapped);

                // Set default selected country
                const defaultMatch = mapped.find((c) => c.code === defaultCountry) || mapped[0];
                if (defaultMatch && !initializedRef.current) {
                    initializedRef.current = true;
                    setSelectedCountry(defaultMatch);

                    // Parse initial value
                    if (value) {
                        let stripped = value;
                        for (const c of mapped) {
                            if (value.startsWith(c.dial)) {
                                stripped = value.slice(c.dial.length);
                                break;
                            }
                        }
                        setLocalNumber(stripped.replace(/^\+\d+/, ""));
                    }

                    // Emit initial full number if no value yet
                    if (!value) {
                        onChange(defaultMatch.dial);
                    }
                }
            })
            .catch(() => {})
            .finally(() => setLoadingCountries(false));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
            setTimeout(() => searchRef.current?.focus(), 50);
        }
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    function handleLocalChange(val: string) {
        const digits = val.replace(/\D/g, "");
        setLocalNumber(digits);
        if (selectedCountry) {
            onChange(selectedCountry.dial + digits);
        }
    }

    function handleSelectCountry(country: CountryCode) {
        setSelectedCountry(country);
        setOpen(false);
        setSearch("");
        onChange(country.dial + localNumber);
    }

    const filtered = search.trim()
        ? countries.filter(
              (c) =>
                  c.name.toLowerCase().includes(search.toLowerCase()) ||
                  c.dial.includes(search) ||
                  c.code.toLowerCase().includes(search.toLowerCase())
          )
        : countries;

    return (
        <div className={cn("relative", className)}>
            <div className="flex">
                {/* Country selector button */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => !loadingCountries && setOpen(!open)}
                        disabled={loadingCountries}
                        className="search-input-dark h-12 rounded-l-xl rounded-r-none border-border/20 border-r-0 px-3 flex items-center gap-1.5 hover:bg-muted/30 transition-colors shrink-0"
                    >
                        {loadingCountries ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        ) : (
                            <>
                                <span className="text-base leading-none">{selectedCountry?.flag}</span>
                                <span className="text-sm font-medium text-muted-foreground">{selectedCountry?.dial}</span>
                            </>
                        )}
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
                                                selectedCountry?.code === country.code && "bg-electric/5"
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

export { type CountryCode };
