// src/pages/tools/ResourceFinder.jsx
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Search,
  MapPin,
  ExternalLink,
  Landmark,
  HandCoins,
  AlertCircle
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { toast } from "sonner";

export default function ResourceFinder() {
  const [zip, setZip] = useState("");
  const [radius, setRadius] = useState("25");
  const [keyword, setKeyword] = useState("");

  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState({ government: [], local: [] });
  const [searchedOnce, setSearchedOnce] = useState(false);
  const [activeTab, setActiveTab] = useState("government");

  const apiBase = (import.meta.env?.VITE_API_BASE_URL || "").trim();

  const cleanZip = useMemo(() => zip.replace(/\D/g, "").slice(0, 5), [zip]);
  const validZip = cleanZip.length === 5;

  const normalizeUrl = (url) => {
    if (!url) return "";
    try {
      const withProto = url.startsWith("http") ? url : `https://${url}`;
      new URL(withProto);
      return withProto;
    } catch {
      return "";
    }
  };

  const handleSearch = async (e) => {
    e?.preventDefault?.();
    setSearchedOnce(true);

    if (!validZip) {
      toast.error("Enter a valid 5-digit ZIP code.");
      return;
    }

    if (!apiBase) {
      toast.error("Resources search is not connected yet. Set VITE_API_BASE_URL to enable live results.");
      setResults({ government: [], local: [] });
      return;
    }

    setIsSearching(true);
    try {
      const params = new URLSearchParams();
      params.set("zip", cleanZip);
      params.set("radius", radius || "25");
      if (keyword.trim()) params.set("q", keyword.trim());

      const res = await fetch(`${apiBase}/resources/search?${params.toString()}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }

      const data = await res.json();

      const gov = Array.isArray(data?.government) ? data.government : [];
      const loc = Array.isArray(data?.local) ? data.local : [];

      setResults({ government: gov, local: loc });
      toast.success("Resources loaded.");
    } catch (err) {
      toast.error("Failed to load resources. Check your API connection.");
      setResults({ government: [], local: [] });
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const ResourceCard = ({ item, variant }) => {
    const url = normalizeUrl(item?.url);
    const title = item?.title || "Resource";
    const provider = item?.provider || (variant === "government" ? "Government" : "Local");
    const type = item?.type || (variant === "government" ? "Program" : "Organization");
    const desc = item?.description || "No description available.";
    const distance = typeof item?.distanceMiles === "number" ? item.distanceMiles : null;

    return (
      <div className="border border-[#52796F]/10 rounded-xl p-4 bg-white hover:bg-[#52796F]/5 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-[#1B4332] truncate">{title}</h4>
              <Badge className="tag-badge text-xs">{type}</Badge>
              {distance !== null && (
                <Badge className="category-badge text-xs">{distance.toFixed(1)} mi</Badge>
              )}
            </div>
            <p className="text-sm text-[#52796F] mt-1">{provider}</p>
          </div>

          {url ? (
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="shrink-0 inline-flex items-center gap-2 text-sm font-medium text-[#1B4332] hover:text-[#52796F] transition-colors"
              title="Open resource"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          ) : null}
        </div>

        <p className="text-sm text-[#2D3748] mt-3 leading-relaxed">{desc}</p>

        {url ? (
          <div className="mt-3">
            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#52796F] hover:text-[#1B4332] transition-colors break-all"
            >
              {url}
            </a>
          </div>
        ) : null}
      </div>
    );
  };

  const govCount = results.government.length;
  const localCount = results.local.length;

  return (
    <DashboardLayout
      title="Government & Local Resources"
      subtitle="Find SBA, grants, assistance programs, and local support near your ZIP code"
    >
      <style>{`
        .hero-gradient { background: linear-gradient(135deg, #1B4332 0%, #52796F 100%); }
        .btn-primary { background: #1B4332 !important; color: #F8F5F0 !important; transition: all 0.3s ease; }
        .btn-primary:hover { background: #52796F !important; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3); }
        .btn-secondary { border: 2px solid #1B4332 !important; color: #1B4332 !important; background: transparent !important; transition: all 0.3s ease; }
        .btn-secondary:hover { background: #1B4332 !important; color: #F8F5F0 !important; }
        .tag-badge { background: rgba(27, 67, 50, 0.1) !important; color: #1B4332 !important; border: 1px solid rgba(27, 67, 50, 0.2) !important; }
        .category-badge { background: rgba(82, 121, 111, 0.1) !important; color: #52796F !important; border: 1px solid rgba(82, 121, 111, 0.2) !important; }
        .hover-card { transition: all 0.3s ease; border: 1px solid rgba(82, 121, 111, 0.1); background: white; }
        .hover-card:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(27, 67, 50, 0.12); border-color: #52796F; }
      `}</style>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        {/* Hero Section */}
        <div className="hero-gradient rounded-2xl p-6 text-white border border-[#52796F]/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <Landmark className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900/[0.9] mb-2">Find resources near you</h1>
                <p className="text-white/90 text-sm mt-1">
                  Search by ZIP code to discover government programs and local support.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-white/15 border border-white/20 text-white">
                <Globe className="w-3 h-3 mr-2" />
                Government
              </Badge>
              <Badge className="bg-white/15 border border-white/20 text-white">
                <Building2 className="w-3 h-3 mr-2" />
                Local
              </Badge>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="hover-card border-[#52796F]/10">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-[#1B4332]">
              <MapPin className="w-5 h-5" />
              Search by ZIP code
            </CardTitle>
            <CardDescription className="text-[#52796F]">
              Enter your ZIP code to find SBA programs, grants, and local support in your area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="zip-code">ZIP Code</Label>
                <Input
                  id="zip-code"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="e.g., 01608"
                  inputMode="numeric"
                  maxLength={5}
                />
              </div>

              <div className="md:col-span-3 space-y-2">
                <Label htmlFor="radius">Radius (miles)</Label>
                <Input
                  id="radius"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value.replace(/\D/g, "").slice(0, 3))}
                  placeholder="25"
                  inputMode="numeric"
                />
              </div>

              <div className="md:col-span-4 space-y-2">
                <Label htmlFor="keyword">Keyword (optional)</Label>
                <Input
                  id="keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g., grant, training, women-owned"
                />
              </div>

              <div className="md:col-span-2 flex items-end">
                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isSearching || !validZip}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </form>

            {!validZip && zip.length > 0 && (
              <p className="text-red-500 text-sm mt-2">
                Please enter a valid 5-digit ZIP code.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-white border border-[#52796F]/10">
            <TabsTrigger value="government" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              Government ({govCount})
            </TabsTrigger>
            <TabsTrigger value="local" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              Local ({localCount})
            </TabsTrigger>
          </TabsList>

          {/* Government Results */}
          <TabsContent value="government">
            <Card className="hover-card border-[#52796F]/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                  <Landmark className="w-5 h-5" />
                  Government Programs
                </CardTitle>
                <CardDescription className="text-[#52796F]">
                  SBA and government-backed programs filtered by your ZIP code.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!apiBase ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-50 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1B4332]">API Not Configured</h3>
                    <p className="text-sm text-[#52796F] mt-1 mb-4">
                      To enable live resource search, set the VITE_API_BASE_URL environment variable.
                    </p>
                    <Button 
                      className="btn-secondary"
                      onClick={() => {
                        setResults({
                          government: [
                            {
                              title: "SBA Small Business Loans",
                              provider: "U.S. Small Business Administration",
                              type: "Loan Program",
                              description: "Government-backed loans for small businesses including 7(a), 504, and microloans.",
                              url: "https://www.sba.gov/funding-programs/loans"
                            },
                            {
                              title: "SBA 8(a) Business Development",
                              provider: "U.S. Small Business Administration",
                              type: "Development Program",
                              description: "Nine-year program to help small disadvantaged businesses compete in the marketplace.",
                              url: "https://www.sba.gov/federal-contracting/contracting-assistance-programs/8a-business-development-program"
                            }
                          ],
                          local: []
                        });
                        toast.info("Showing demo data. Set API for live results.");
                      }}
                    >
                      Load Demo Data
                    </Button>
                  </div>
                ) : results.government.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {results.government.map((item, idx) => (
                      <ResourceCard key={`gov-${idx}`} item={item} variant="government" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <HandCoins className="w-14 h-14 mx-auto mb-3 text-gray-300" />
                    <h3 className="text-lg font-semibold text-[#1B4332]">No government results yet</h3>
                    <p className="text-sm text-[#52796F] mt-1">
                      {searchedOnce ? "Try a different ZIP, radius, or keyword." : "Enter your ZIP code and run a search to see results."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Local Results */}
          <TabsContent value="local">
            <Card className="hover-card border-[#52796F]/10">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-[#1B4332]">
                  <Building2 className="w-5 h-5" />
                  Local Resources
                </CardTitle>
                <CardDescription className="text-[#52796F]">
                  Nearby organizations, SBDC/SCORE style support, and local programs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!apiBase ? (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 mx-auto mb-4 bg-yellow-50 rounded-full flex items-center justify-center">
                      <AlertCircle className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1B4332]">API Not Configured</h3>
                    <p className="text-sm text-[#52796F] mt-1 mb-4">
                      To enable live resource search, set the VITE_API_BASE_URL environment variable.
                    </p>
                    <Button 
                      className="btn-secondary"
                      onClick={() => {
                        setResults({
                          government: results.government,
                          local: [
                            {
                              title: "Local Small Business Development Center",
                              provider: "SBDC Network",
                              type: "Business Support",
                              description: "Free business consulting and low-cost training for entrepreneurs.",
                              url: "https://americassbdc.org",
                              distanceMiles: 5.2
                            },
                            {
                              title: "SCORE Business Mentoring",
                              provider: "SCORE Association",
                              type: "Mentorship",
                              description: "Free business mentoring from experienced entrepreneurs and executives.",
                              url: "https://www.score.org",
                              distanceMiles: 8.7
                            }
                          ]
                        });
                        toast.info("Showing demo data. Set API for live results.");
                      }}
                    >
                      Load Demo Data
                    </Button>
                  </div>
                ) : results.local.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {results.local.map((item, idx) => (
                      <ResourceCard key={`loc-${idx}`} item={item} variant="local" />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <Building2 className="w-14 h-14 mx-auto mb-3 text-gray-300" />
                    <h3 className="text-lg font-semibold text-[#1B4332]">No local results yet</h3>
                    <p className="text-sm text-[#52796F] mt-1">
                      {searchedOnce ? "Try a different ZIP, radius, or keyword." : "Enter your ZIP code and run a search to see results."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="border-[#52796F]/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-[#1B4332] flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Government Programs
                </h4>
                <p className="text-sm text-[#52796F]">
                  Includes SBA loans, grant programs, disaster assistance, and federal contracting opportunities.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[#1B4332] flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  Local Resources
                </h4>
                <p className="text-sm text-[#52796F]">
                  Find local SBDC offices, SCORE mentors, chambers of commerce, and community development organizations.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-[#1B4332] flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Search Tips
                </h4>
                <p className="text-sm text-[#52796F]">
                  Use specific keywords like "women-owned", "minority", "startup", or "export" to narrow results.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}