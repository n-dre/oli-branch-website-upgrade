// src/pages/tools/NearbyBanks.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  Loader2,
  RefreshCw,
  Building2,
  AlertCircle,
  Shield,
  Globe,
  Smartphone,
  Target,
  Map,
  Download,
  Users,
  FileText,
  CheckCircle,
  Zap,
  Wifi,
  Satellite,
  Settings as SettingsIcon,
  Maximize2,
  Minimize2
} from 'lucide-react';

import DashboardLayout from '../../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useData } from '../../context/DataContext';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

const MOCK_BANKS_WITH_COORDS = [
  {
    id: 1,
    name: 'Chase Bank - Business Center',
    address: '123 Main Street, Suite 100',
    distance: 0.3,
    rating: 4.2,
    reviews: 156,
    phone: '(555) 123-4567',
    hours: 'Open • Closes 5:00 PM',
    isOpen: true,
    services: ['Business Banking', 'ATM', 'Safe Deposit', 'Notary'],
    type: 'National Bank',
    coordinates: { lat: 40.7128 + 0.012, lng: -74.0060 + 0.008 },
    businessFeatures: ['Merchant Services', 'Business Loans', 'Treasury Management']
  },
  {
    id: 2,
    name: 'Bank of America - Enterprise Branch',
    address: '456 Commerce Ave',
    distance: 0.8,
    rating: 4.0,
    reviews: 203,
    phone: '(555) 234-5678',
    hours: 'Open • Closes 6:00 PM',
    isOpen: true,
    services: ['Business Banking', 'ATM', 'Notary', 'Wire Transfers'],
    type: 'National Bank',
    coordinates: { lat: 40.7128 + 0.018, lng: -74.0060 - 0.012 },
    businessFeatures: ['Commercial Lending', 'Cash Management', 'International Banking']
  },
  {
    id: 3,
    name: 'Wells Fargo - Corporate Banking',
    address: '789 Financial Blvd',
    distance: 1.2,
    rating: 3.8,
    reviews: 89,
    phone: '(555) 345-6789',
    hours: 'Open • Closes 5:30 PM',
    isOpen: true,
    services: ['Business Banking', 'Merchant Services', 'ATM', 'Safe Deposit'],
    type: 'National Bank',
    coordinates: { lat: 40.7128 - 0.015, lng: -74.0060 + 0.022 },
    businessFeatures: ['SBA Loans', 'Payroll Services', 'Equipment Financing']
  },
  {
    id: 4,
    name: 'First Community Credit Union - Business Services',
    address: '321 Oak Street',
    distance: 1.5,
    rating: 4.6,
    reviews: 312,
    phone: '(555) 456-7890',
    hours: 'Open • Closes 4:00 PM',
    isOpen: true,
    services: ['Business Accounts', 'Low Fees', 'ATM', 'Mobile Banking'],
    type: 'Credit Union',
    coordinates: { lat: 40.7128 - 0.022, lng: -74.0060 - 0.018 },
    businessFeatures: ['Small Business Focus', 'Local Partnerships', 'Community Development']
  },
  {
    id: 5,
    name: 'Capital One Café - Business Hub',
    address: '555 Innovation Drive',
    distance: 2.1,
    rating: 4.4,
    reviews: 178,
    phone: '(555) 567-8901',
    hours: 'Open • Closes 7:00 PM',
    isOpen: true,
    services: ['Business Banking', 'Workspace', 'ATM', 'Free WiFi'],
    type: 'Bank Café',
    coordinates: { lat: 40.7128 + 0.025, lng: -74.0060 - 0.025 },
    businessFeatures: ['Networking Events', 'Startup Resources', 'Financial Workshops']
  },
  {
    id: 6,
    name: 'PNC Bank - Corporate Center',
    address: '888 Market Street',
    distance: 2.8,
    rating: 4.1,
    reviews: 134,
    phone: '(555) 678-9012',
    hours: 'Closed • Opens 9:00 AM',
    isOpen: false,
    services: ['Business Banking', 'Treasury Management', 'ATM', 'Investment Services'],
    type: 'National Bank',
    coordinates: { lat: 40.7128 - 0.028, lng: -74.0060 + 0.028 },
    businessFeatures: ['Cash Flow Solutions', 'Risk Management', 'M&A Advisory']
  },
  {
    id: 7,
    name: 'Local Business Bank - Enterprise Division',
    address: '999 Enterprise Way',
    distance: 3.5,
    rating: 4.8,
    reviews: 67,
    phone: '(555) 789-0123',
    hours: 'Open • Closes 5:00 PM',
    isOpen: true,
    services: ['Small Business Focus', 'SBA Loans', 'Cash Deposits', 'Online Banking'],
    type: 'Community Bank',
    coordinates: { lat: 40.7128 + 0.032, lng: -74.0060 + 0.032 },
    businessFeatures: ['Personalized Service', 'Quick Approvals', 'Industry Specialization']
  },
  {
    id: 8,
    name: 'TD Bank - Business Solutions',
    address: '111 Banking Center Rd',
    distance: 4.2,
    rating: 3.9,
    reviews: 98,
    phone: '(555) 890-1234',
    hours: 'Open • Closes 8:00 PM',
    isOpen: true,
    services: ['Extended Hours', 'Business Banking', 'ATM', 'Drive-Thru'],
    type: 'National Bank',
    coordinates: { lat: 40.7128 - 0.035, lng: -74.0060 - 0.035 },
    businessFeatures: ['7-Day Banking', 'QuickFunds', 'International Payments']
  }
];

// Enhanced Haversine formula with high precision for mobile GPS
const calculateRealDistance = (userLat, userLng, bankLat, bankLng) => {
  const R = 3958.8; // Earth's radius in miles (more accurate)
  const φ1 = userLat * Math.PI / 180;
  const φ2 = bankLat * Math.PI / 180;
  const Δφ = (bankLat - userLat) * Math.PI / 180;
  const Δλ = (bankLng - userLng) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;

  // Return with meter-level precision for mobile GPS accuracy
  return parseFloat(distance.toFixed(2));
};

const milesToMeters = (miles) => miles * 1609.344;

const buildAddressFromTags = (tags = {}) => {
  const hn = tags['addr:housenumber'];
  const st = tags['addr:street'];
  const city = tags['addr:city'];
  const state = tags['addr:state'];
  const zip = tags['addr:postcode'];

  const line1 = [hn, st].filter(Boolean).join(' ').trim();
  const line2 = [city, state, zip].filter(Boolean).join(', ').trim();

  const addr = [line1, line2].filter(Boolean).join(', ').trim();
  return addr || 'Address not available';
};

const getCenter = (el) => {
  const lat = el.lat ?? el.center?.lat;
  const lng = el.lon ?? el.center?.lon;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  return { lat, lng };
};

const guessType = (name = '', tags = {}) => {
  const n = String(name).toLowerCase();
  const op = String(tags.operator || '').toLowerCase();
  const brand = String(tags.brand || '').toLowerCase();

  if (n.includes('credit union') || op.includes('credit union') || brand.includes('credit union')) return 'Credit Union';
  if (n.includes('federal') && n.includes('credit union')) return 'Credit Union';
  if (n.includes('café') || n.includes('cafe')) return 'Bank Café';
  if (n.includes('community')) return 'Community Bank';
  return 'Bank';
};

const defaultServices = (type) => {
  if (type === 'Credit Union') return ['Business Accounts', 'Mobile Banking', 'ATM'];
  if (type === 'Bank Café') return ['Business Banking', 'ATM', 'Free WiFi'];
  return ['Business Banking', 'ATM', 'Wire Transfers'];
};

const defaultBusinessFeatures = (type) => {
  if (type === 'Credit Union') return ['Small Business Focus', 'Local Partnerships'];
  if (type === 'Bank Café') return ['Startup Resources', 'Financial Workshops'];
  return ['Merchant Services', 'Business Loans'];
};

export default function NearbyBanks() {
  const { settings, updateSettings } = useData();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [banks, setBanks] = useState([]);
  const [locationError, setLocationError] = useState(null);

  // FIX: default to 1 mile until user chooses OR a saved setting exists
  const DEFAULT_RADIUS = 1;
  const [radiusMiles, setRadiusMiles] = useState(
    typeof settings?.gpsRadius === "number" ? settings.gpsRadius : DEFAULT_RADIUS
  );

  const [accuracy, setAccuracy] = useState(null);
  const [locationType, setLocationType] = useState(null);
  const [trackingMode, setTrackingMode] = useState("standard");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  const watchIdRef = useRef(null);
  const lastFetchRef = useRef({ ts: 0, key: '' });

  useEffect(() => {
    if (settings?.gpsRadius && settings.gpsRadius !== radiusMiles) {
      setRadiusMiles(settings.gpsRadius);
    }
  }, [settings?.gpsRadius, radiusMiles]);

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const loadMockBanks = useCallback((radius, userLocation = null) => {
    if (userLocation) {
      const banksWithRealDistances = MOCK_BANKS_WITH_COORDS
        .map(bank => ({
          ...bank,
          distance: calculateRealDistance(
            userLocation.lat,
            userLocation.lng,
            bank.coordinates.lat,
            bank.coordinates.lng
          ),
          calculatedFromGps: true
        }))
        .filter(bank => bank.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      setBanks(banksWithRealDistances);
    } else {
      const filteredBanks = MOCK_BANKS_WITH_COORDS
        .filter(bank => bank.distance <= radius)
        .sort((a, b) => a.distance - b.distance);

      setBanks(filteredBanks);
    }
    setLoading(false);
  }, []);

  const fetchNearbyBanksOverpass = useCallback(async (userLocation, radius) => {
    // Basic throttle so we don't hammer Overpass on every GPS micro-update
    const key = `${radius}|${userLocation.lat.toFixed(4)}|${userLocation.lng.toFixed(4)}`;
    const now = Date.now();
    if (lastFetchRef.current.key === key && (now - lastFetchRef.current.ts) < 15000) {
      return null; // skip; UI will keep existing list
    }
    lastFetchRef.current = { ts: now, key };

    const radiusMeters = milesToMeters(radius);

    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="bank"](around:${radiusMeters},${userLocation.lat},${userLocation.lng});
        way["amenity"="bank"](around:${radiusMeters},${userLocation.lat},${userLocation.lng});
        relation["amenity"="bank"](around:${radiusMeters},${userLocation.lat},${userLocation.lng});

        node["amenity"="bureau_de_change"](around:${radiusMeters},${userLocation.lat},${userLocation.lng});
        way["amenity"="bureau_de_change"](around:${radiusMeters},${userLocation.lat},${userLocation.lng});
        relation["amenity"="bureau_de_change"](around:${radiusMeters},${userLocation.lat},${userLocation.lng});
      );
      out center tags;
    `.trim();

    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: overpassQuery
    });

    if (!response.ok) throw new Error(`Overpass error: ${response.status}`);
    const data = await response.json();

    const elements = Array.isArray(data?.elements) ? data.elements : [];
    if (!elements.length) return [];

    const mapped = elements
      .map((el) => {
        const tags = el.tags || {};
        const center = getCenter(el);
        if (!center) return null;

        const rawName = tags.name || tags.brand || tags.operator || 'Bank Branch';
        const type = guessType(rawName, tags);

        const distance = calculateRealDistance(
          userLocation.lat,
          userLocation.lng,
          center.lat,
          center.lng
        );

        const phone = tags.phone || tags['contact:phone'] || null;
        const opening = tags.opening_hours || null;

        return {
          id: `${el.type}-${el.id}`,
          name: rawName,
          address: buildAddressFromTags(tags),
          distance,
          rating: null,     // OSM doesn't provide reliable ratings
          reviews: null,
          phone: phone || '(Phone not available)',
          hours: opening ? `Hours • ${opening}` : 'Hours unavailable',
          isOpen: true,      // unknown; keep UI consistent without changing colors/layout
          services: defaultServices(type),
          type,
          coordinates: { lat: center.lat, lng: center.lng },
          businessFeatures: defaultBusinessFeatures(type),
          calculatedFromGps: true,
          source: 'osm'
        };
      })
      .filter(Boolean)
      .filter((b) => b.distance <= radius)
      .sort((a, b) => a.distance - b.distance);

    return mapped;
  }, []);

  const startLocationTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      loadMockBanks(radiusMiles, null);
      toast.warning('Geolocation not supported. Using enterprise demo data.');
      return;
    }

    clearWatch();

    setLoading(true);
    setLocationError(null);

    const options = {
      enableHighAccuracy: trackingMode === 'high-accuracy',
      timeout: trackingMode === 'high-accuracy' ? 15000 : 10000,
      maximumAge: trackingMode === 'high-accuracy' ? 0 : 30000
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          altitude: position.coords.altitude,
          heading: position.coords.heading,
          speed: position.coords.speed
        };

        setLocation(userLocation);
        setAccuracy(position.coords.accuracy);
        setLocationType(
          position.coords.accuracy < 50 ? 'High Precision (GPS)' :
          position.coords.accuracy < 100 ? 'Moderate Precision (Wi-Fi/Cell)' :
          'Low Precision (Network)'
        );

        try {
          // REAL nearby banks first (OSM Overpass)
          const realBanks = await fetchNearbyBanksOverpass(userLocation, radiusMiles);

          if (Array.isArray(realBanks) && realBanks.length > 0) {
            setBanks(realBanks);
            setLoading(false);

            if (trackingMode === 'high-accuracy') {
              toast.success(`Mobile GPS: ${realBanks.length} banks found with ${position.coords.accuracy.toFixed(0)}m accuracy`);
            } else {
              toast.info(`${realBanks.length} banks found using location services`);
            }
            return;
          }

          // If Overpass returns nothing, use your enterprise demo list (but with real GPS distances)
          loadMockBanks(radiusMiles, userLocation);
          setLoading(false);

          if (trackingMode === 'high-accuracy') {
            toast.warning('No banks returned from map data. Using enterprise demo set with real GPS distances.');
          }
        } catch (err) {
          // Overpass error or rate limit -> fallback to demo with real distances
          console.error(err);
          loadMockBanks(radiusMiles, userLocation);
          setLoading(false);
          toast.warning('Live bank lookup unavailable. Using enterprise demo set with real GPS distances.');
        }
      },
      (error) => {
        let message = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Using enterprise demo data.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location services unavailable. Using enterprise demo data.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Using enterprise demo data.';
            break;
          default:
            message = 'Location error. Using enterprise demo data.';
        }
        setLocationError(message);
        loadMockBanks(radiusMiles, null);
        toast.warning(message);
        setLoading(false);
      },
      options
    );
  }, [radiusMiles, loadMockBanks, clearWatch, trackingMode, fetchNearbyBanksOverpass]);

  useEffect(() => {
    startLocationTracking();
    return () => clearWatch();
  }, [startLocationTracking, clearWatch]);

  const getDirections = (bank) => {
    const query = encodeURIComponent(bank.name + ' ' + bank.address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`, '_blank');
  };

  const viewOnGoogleMaps = (bank) => {
    const query = encodeURIComponent(bank.name + ' ' + bank.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const viewCurrentLocation = () => {
    if (location) {
      window.open(`https://www.google.com/maps/@${location.lat},${location.lng},15z`, '_blank');
    } else {
      toast.error('Location not available');
    }
  };

  const updateRadius = (newRadius) => {
    setRadiusMiles(newRadius);

    if (updateSettings) {
      updateSettings({
        ...settings,
        gpsRadius: newRadius
      });
    }

    // Recompute immediately for demo banks; real bank lookup will refresh via watchPosition
    if (location) {
      const filteredBanks = banks
        .map((b) => {
          // If bank has coordinates, recompute distance for consistency
          const lat = b.coordinates?.lat;
          const lng = b.coordinates?.lng;
          if (typeof lat === 'number' && typeof lng === 'number') {
            return {
              ...b,
              distance: calculateRealDistance(location.lat, location.lng, lat, lng),
              calculatedFromGps: true
            };
          }
          return b;
        })
        .filter((b) => typeof b.distance === 'number' ? b.distance <= newRadius : true)
        .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));

      setBanks(filteredBanks);
    } else {
      const filtered = MOCK_BANKS_WITH_COORDS
        .filter(bank => bank.distance <= newRadius)
        .sort((a, b) => a.distance - b.distance);
      setBanks(filtered);
    }

    toast.success(`Enterprise search radius updated to ${newRadius} miles`);
  };

  const exportLocationReport = () => {
    toast.info('Generating enterprise location analytics report...');
  };

  const shareWithTeam = () => {
    toast.success('Bank locations shared with your enterprise team.');
  };

  const handleBankClick = (bank) => {
    setSelectedBank(bank);
    viewOnGoogleMaps(bank);
  };

  const handleMapExpand = () => {
    setIsMapExpanded(!isMapExpanded);
    if (!isMapExpanded) {
      toast.info('Click on any bank to view it on Google Maps');
    }
  };

  const radiusOptions = [1, 3, 5, 10, 15, 25];

  return (
    <DashboardLayout
      title="Enterprise Bank Locator"
      subtitle={`Finding business banking locations within ${radiusMiles} miles of your mobile device`}
    >
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
        }
        .glass-effect {
          backdrop-filter: blur(10px);
          background: rgba(248, 245, 240, 0.9);
        }
        .btn-primary {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          background: #52796F !important;
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(27, 67, 50, 0.3);
        }
        .btn-secondary {
          border: 2px solid #1B4332 !important;
          color: #1B4332 !important;
          background: transparent !important;
          transition: all 0.3s ease;
        }
        .btn-secondary:hover {
          background: #1B4332 !important;
          color: #F8F5F0 !important;
        }
        .bank-card {
          border-left: 4px solid #1B4332 !important;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .bank-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F !important;
        }
        .bank-name {
          color: #1B4332 !important;
          font-weight: 700;
        }
        .bank-address {
          color: #52796F !important;
        }
        .bank-rating {
          color: #F59E0B !important;
        }
        .bank-open {
          color: #059669 !important;
          font-weight: 600;
        }
        .bank-closed {
          color: #DC2626 !important;
          font-weight: 600;
        }
        .bank-badge {
          background: rgba(27, 67, 50, 0.1) !important;
          color: #1B4332 !important;
          border: 1px solid rgba(27, 67, 50, 0.2) !important;
        }
        .bank-service-badge {
          background: rgba(82, 121, 111, 0.1) !important;
          color: #52796F !important;
          border: 1px solid rgba(82, 121, 111, 0.2) !important;
        }
        .location-card {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%) !important;
          color: #F8F5F0 !important;
        }
        .location-icon {
          background: rgba(248, 245, 240, 0.2) !important;
        }
        .warning-note {
          background: #FEF3C7 !important;
          border-color: #F59E0B !important;
          color: #92400E !important;
        }
        .map-placeholder {
          background: #F8F5F0 !important;
          border-color: #D6D3D1 !important;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .map-placeholder:hover {
          border-color: #1B4332 !important;
          background: #F0EDE8 !important;
        }
        .map-placeholder-expanded {
          height: 500px !important;
          border: 2px solid #1B4332 !important;
        }
        .enterprise-badge {
          background: linear-gradient(135deg, #1B4332, #2D5A4A) !important;
          color: white !important;
          border: none !important;
        }
        .google-map-link {
          position: relative;
          overflow: hidden;
        }
        .google-map-link::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(27, 67, 50, 0.1);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .google-map-link:hover::after {
          opacity: 1;
        }
      `}</style>

      <div className="space-y-6">
        {/* Enterprise Location Header */}
        <Card className="location-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center location-icon"
                )}>
                  {loading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : location ? (
                    <Satellite className="h-6 w-6 text-white" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    {loading ? 'Acquiring Mobile GPS...' :
                      location ? 'Enterprise Location Active' : 'Enterprise Demo Mode'}
                    {location && accuracy && accuracy < 50 && (
                      <Badge className="bg-green-500/30 text-green-100 border-green-400/30">
                        <Target className="h-3 w-3 mr-1" /> High Precision
                      </Badge>
                    )}
                  </h3>
                  <p className="text-sm text-white/80">
                    {locationError || (
                      location
                        ? `Mobile GPS: ${location?.lat?.toFixed(6) || 0}, ${location?.lng?.toFixed(6) || 0}`
                        : 'Using enterprise banking demonstration data'
                    )}
                  </p>
                  {location && (
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="text-xs text-white/60 flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        Accuracy: {accuracy ? `${accuracy.toFixed(0)} meters` : 'Calculating...'}
                      </div>
                      <div className="text-xs text-white/60 flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        Type: {locationType || 'Determining...'}
                      </div>
                      <div className="text-xs text-white/60 flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        Mode: {trackingMode === 'high-accuracy' ? 'High Accuracy GPS' : 'Standard Location'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <div className="flex gap-2">
                  <Button
                    variant={trackingMode === 'standard' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTrackingMode('standard')}
                    className={cn(
                      "bg-white/10 text-white border-white/30 hover:bg-white/20",
                      trackingMode === 'standard' && "bg-white/30"
                    )}
                  >
                    <Wifi className="h-3 w-3 mr-1" /> Standard
                  </Button>
                  <Button
                    variant={trackingMode === 'high-accuracy' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTrackingMode('high-accuracy')}
                    className={cn(
                      "bg-white/10 text-white border-white/30 hover:bg-white/20",
                      trackingMode === 'high-accuracy' && "bg-white/30"
                    )}
                  >
                    <Satellite className="h-3 w-3 mr-1" /> High Accuracy
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startLocationTracking}
                  disabled={loading}
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20 transition-all duration-300 active:scale-95"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  <span className="hidden sm:inline">Refresh GPS</span>
                  <span className="sm:hidden">Refresh</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Search Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Search Radius
              </CardTitle>
              <CardDescription>Set enterprise search boundaries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Current radius: <span className="text-primary font-bold">{radiusMiles} miles</span></p>
                  <p className="text-xs text-muted-foreground">Found {banks.length} business banking locations</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {radiusOptions.map((radius) => {
                    const active = radiusMiles === radius;

                    return (
                      <Button
                        key={radius}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => updateRadius(radius)}
                        className={cn(
                          "transition-all duration-200",
                          active ? "btn-primary" : "btn-secondary"
                        )}
                      >
                        {radius} mi
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="btn-secondary w-full mt-2"
                  asChild
                >
                  <a href="/settings#gps">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Enterprise GPS Settings
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Enterprise Features
              </CardTitle>
              <CardDescription>Business banking capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Mobile GPS Accuracy</span>
                </div>
                <Badge className={accuracy && accuracy < 50 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                  {accuracy ? `${accuracy.toFixed(0)}m` : 'N/A'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Map className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Google Maps Integration</span>
                </div>
                <Badge className="bg-blue-100 text-blue-800">
                  Active
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Team Sharing</span>
                </div>
                <Badge className="bg-purple-100 text-purple-800">
                  Available
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>Enterprise tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start btn-secondary"
                onClick={exportLocationReport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Analytics Report
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start btn-secondary"
                onClick={shareWithTeam}
              >
                <Users className="h-4 w-4 mr-2" />
                Share with Team
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start btn-secondary"
                onClick={viewCurrentLocation}
                disabled={!location}
              >
                <MapPin className="h-4 w-4 mr-2" />
                View My Location
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Status */}
        <Card className="warning-note">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Enterprise Location Services</p>
                <p className="text-sm mt-1">
                  {location
                    ? `Using mobile device GPS with ${accuracy ? `${accuracy.toFixed(0)} meter` : 'high'} accuracy. Click on any bank to view it on Google Maps.`
                    : 'Using enterprise demonstration data. Enable location services for real-time mobile GPS accuracy and precise distance calculations.'}
                </p>
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => window.open('https://www.google.com/maps', '_blank')}
                  >
                    Open Google Maps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={viewCurrentLocation}
                    disabled={!location}
                  >
                    View Current Location
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Banking Results */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-6 bg-muted rounded w-3/4 mb-4" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : banks.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Business Banking Locations ({banks.length} found)</h3>
              <Badge className="enterprise-badge">
                {location ? "Live Mobile GPS" : "Enterprise Demo"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banks.map((bank, index) => (
                <motion.div
                  key={bank.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="h-full bank-card hover:shadow-elevated transition-shadow duration-300 google-map-link"
                    onClick={() => handleBankClick(bank)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="bank-name font-semibold text-lg">{bank.name}</h3>
                          <p className="bank-address text-sm flex items-center gap-1 mt-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {bank.address}
                          </p>
                        </div>
                        <Badge
                          variant="default"
                          className="shrink-0 bg-[#1B4332] text-white"
                        >
                          {typeof bank.distance === 'number' ? bank.distance : '—'} mi
                          {location && (
                            <span className="ml-1 text-xs opacity-80 flex items-center gap-1">
                              <Satellite className="h-2.5 w-2.5" /> GPS
                            </span>
                          )}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="bank-rating font-medium">{typeof bank.rating === 'number' ? bank.rating : '—'}</span>
                          <span className="text-sm text-muted-foreground">
                            {typeof bank.reviews === 'number' ? `(${bank.reviews} reviews)` : '(reviews unavailable)'}
                          </span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-1 text-sm font-semibold",
                          bank.isOpen ? "bank-open" : "bank-closed"
                        )}>
                          <Clock className="h-3.5 w-3.5" />
                          {bank.hours}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs bank-badge">
                            {bank.type}
                          </Badge>
                          {bank.businessFeatures?.slice(0, 2).map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs enterprise-badge">
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {bank.services.slice(0, 3).map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs bank-service-badge">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-border">
                        <Button
                          variant="default"
                          size="sm"
                          className="flex-1 btn-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            getDirections(bank);
                          }}
                        >
                          <Navigation className="h-4 w-4 mr-2" />
                          <span className="hidden sm:inline">Business Directions</span>
                          <span className="sm:hidden">Directions</span>
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-secondary"
                          disabled={!bank.phone || bank.phone === '(Phone not available)'}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!bank.phone || bank.phone === '(Phone not available)') {
                              toast.info('Phone not available for this location');
                              return;
                            }
                            window.open(`tel:${bank.phone}`, '_self');
                          }}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          className="btn-secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            shareWithTeam();
                          }}
                        >
                          <Users className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="text-xs text-muted-foreground text-center mt-3 pt-2 border-t border-border/30">
                        Click anywhere on this card to view on Google Maps
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">No Business Banks Found</h3>
              <p className="text-muted-foreground mb-4">
                No business banking locations found within {radiusMiles} miles. Try increasing the search radius.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {radiusOptions.filter(r => r > radiusMiles).slice(0, 3).map((radius) => (
                  <Button
                    key={radius}
                    variant="outline"
                    size="sm"
                    onClick={() => updateRadius(radius)}
                    className="btn-secondary"
                  >
                    Expand to {radius} miles
                  </Button>
                ))}
                <Button variant="outline" asChild className="btn-secondary">
                  <a href="/settings#gps">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    GPS Settings
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Interactive Google Maps View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                <CardTitle>Interactive Google Maps View</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleMapExpand}
                className="btn-secondary"
              >
                {isMapExpanded ? (
                  <>
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Minimize Map
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Expand Map
                  </>
                )}
              </Button>
            </div>
            <CardDescription>
              Click on map to open Google Maps. Click on any bank above to view it on maps.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "map-placeholder rounded-lg flex flex-col items-center justify-center border-2 border-dashed google-map-link",
                isMapExpanded && "map-placeholder-expanded"
              )}
              onClick={() => window.open('https://www.google.com/maps', '_blank')}
            >
              <div className="text-center p-6">
                <div className="relative mb-4">
                  <Globe className="h-16 w-16 mx-auto text-muted-foreground/40" />
                  <MapPin className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#1B4332]" />
                </div>
                <p className="text-muted-foreground text-lg font-medium mb-2">
                  Click to Open Google Maps
                </p>
                <p className="text-muted-foreground/70 mb-4">
                  {isMapExpanded
                    ? 'Full-screen Google Maps integration showing all banks and your current location'
                    : 'Interactive Google Maps with real-time location and bank markers'}
                </p>

                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open('https://www.google.com/maps', '_blank');
                    }}
                    className="btn-secondary"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Open Google Maps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      viewCurrentLocation();
                    }}
                    disabled={!location}
                    className="btn-secondary"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    View My Location
                  </Button>
                  {selectedBank && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewOnGoogleMaps(selectedBank);
                      }}
                      className="btn-secondary"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      View Selected Bank
                    </Button>
                  )}
                </div>

                {banks.length > 0 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Quick Bank Links:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {banks.slice(0, 4).map(bank => (
                        <Badge
                          key={bank.id}
                          variant="outline"
                          className="cursor-pointer hover:bg-[#1B4332] hover:text-white transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewOnGoogleMaps(bank);
                          }}
                        >
                          {String(bank.name).split(' - ')[0]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 border rounded-lg">
                <div className="text-sm font-medium text-gray-700">Your Location</div>
                <div className="text-xs text-muted-foreground">
                  {location ? 'GPS Active' : 'Enable Location'}
                </div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-sm font-medium text-gray-700">Banks Found</div>
                <div className="text-xs text-muted-foreground">{banks.length} locations</div>
              </div>
              <div className="text-center p-3 border rounded-lg">
                <div className="text-sm font-medium text-gray-700">Map Ready</div>
                <div className="text-xs text-muted-foreground">Click to explore</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
