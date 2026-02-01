"use client";

import { useState, useEffect } from "react";
import { locationApi, GeographicUnit } from "@/lib/api";
import ReactCountryFlag from "react-country-flag";
import { Globe, MapPin } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function AvailabilityPage() {
  const [countries, setCountries] = useState<GeographicUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await locationApi.countries();
        setCountries(response.countries);
      } catch (err) {
        setError("Failed to load countries");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCountries();
  }, []);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30">
      {/* Hero Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Globe className="h-16 w-16 mx-auto mb-6 text-gold" />
            <h1 className="text-4xl font-bold mb-4">Platform Availability</h1>
            <p className="text-lg opacity-80">
              CueSports Africa is expanding across the continent. Here are the
              countries where our platform is currently available for players
              and organizers.
            </p>
          </div>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
              <p className="mt-4 text-muted-foreground">Loading countries...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
            </div>
          ) : countries.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                No countries available yet. Check back soon!
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <p className="text-muted-foreground">
                  Currently available in{" "}
                  <span className="font-semibold text-foreground">
                    {countries.length}
                  </span>{" "}
                  African {countries.length === 1 ? "country" : "countries"}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {countries.map((country) => (
                  <div
                    key={country.id}
                    className="flex items-center gap-3"
                  >
                    {country.code ? (
                      <ReactCountryFlag
                        countryCode={country.code}
                        svg
                        style={{ width: "2.5em", height: "1.75em" }}
                        className="rounded shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-7 bg-muted rounded flex items-center justify-center">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                      </div>
                    )}
                    <span className="font-medium">{country.name}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Coming Soon Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Expanding Soon</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We&apos;re actively working to bring CueSports Africa to more
              countries across the continent. If your country isn&apos;t listed
              yet, stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </>
  );
}
