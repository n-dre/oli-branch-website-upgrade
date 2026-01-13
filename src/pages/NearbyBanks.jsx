import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Star,
  ExternalLink,
  Loader2,
  RefreshCw,
  Building2,
  AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useData } from '../context/DataContext';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

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

  .service-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(82, 121, 111, 0.1);
  }

  .service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  }

  .product-card {
    transition: all 0.3s ease;
    border: 1px solid rgba(82, 121, 111, 0.1);
  }

  .product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
  }

  .fade-in-up {
    opacity: 0;
    transform: translateY(24px);
  }

  .stagger-children > * {
    opacity: 0;
    transform: translateY(24px);
  }

  .tab-button {
    padding: 12px 24px;
    border: 2px solid transparent;
    border-radius: 8px;
    background: transparent;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .tab-button.active {
    border-color: #52796F;
    background: #52796F;
    color: white;
  }

  .tab-button:hover:not(.active) {
    border-color: #52796F;
    color: #52796F;
  }

  /* Bank card specific styles */
  .bank-card {
    border-left: 4px solid #1B4332 !important;
    transition: all 0.3s ease;
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
  }
`}</style>

// Mock bank data - In production, this would come from Google Maps API or similar
const MOCK_BANKS = [
  {
    id: 1,
    name: 'Chase Bank',
    address: '123 Main Street, Suite 100',
    distance: 0.3,
    rating: 4.2,
    reviews: 156,
    phone: '(555) 123-4567',
    hours: 'Open • Closes 5:00 PM',
    isOpen: true,
    services: ['Business Banking', 'ATM', 'Safe Deposit'],
    type: 'National Bank'
  },
  {
    id: 2,
    name: 'Bank of America',
    address: '456 Commerce Ave',
    distance: 0.8,
    rating: 4.0,
    reviews: 203,
    phone: '(555) 234-5678',
    hours: 'Open • Closes 6:00 PM',
    isOpen: true,
    services: ['Business Banking', 'ATM', 'Notary'],
    type: 'National Bank'
  },
  {
    id: 3,
    name: 'Wells Fargo',
    address: '789 Financial Blvd',
    distance: 1.2,
    rating: 3.8,
    reviews: 89,
    phone: '(555) 345-6789',
    hours: 'Open • Closes 5:30 PM',
    isOpen: true,
    services: ['Business Banking', 'Merchant Services', 'ATM'],
    type: 'National Bank'
  },
  {
    id: 4,
    name: 'First Community Credit Union',
    address: '321 Oak Street',
    distance: 1.5,
    rating: 4.6,
    reviews: 312,
    phone: '(555) 456-7890',
    hours: 'Open • Closes 4:00 PM',
    isOpen: true,
    services: ['Business Accounts', 'Low Fees', 'ATM'],
    type: 'Credit Union'
  },
  {
    id: 5,
    name: 'Capital One Café',
    address: '555 Innovation Drive',
    distance: 2.1,
    rating: 4.4,
    reviews: 178,
    phone: '(555) 567-8901',
    hours: 'Open • Closes 7:00 PM',
    isOpen: true,
    services: ['Business Banking', 'Workspace', 'ATM'],
    type: 'Bank Café'
  },
  {
    id: 6,
    name: 'PNC Bank',
    address: '888 Market Street',
    distance: 2.8,
    rating: 4.1,
    reviews: 134,
    phone: '(555) 678-9012',
    hours: 'Closed • Opens 9:00 AM',
    isOpen: false,
    services: ['Business Banking', 'Treasury Management', 'ATM'],
    type: 'National Bank'
  },
  {
    id: 7,
    name: 'Local Business Bank',
    address: '999 Enterprise Way',
    distance: 3.5,
    rating: 4.8,
    reviews: 67,
    phone: '(555) 789-0123',
    hours: 'Open • Closes 5:00 PM',
    isOpen: true,
    services: ['Small Business Focus', 'SBA Loans', 'Cash Deposits'],
    type: 'Community Bank'
  },
  {
    id: 8,
    name: 'TD Bank',
    address: '111 Banking Center Rd',
    distance: 4.2,
    rating: 3.9,
    reviews: 98,
    phone: '(555) 890-1234',
    hours: 'Open • Closes 8:00 PM',
    isOpen: true,
    services: ['Extended Hours', 'Business Banking', 'ATM'],
    type: 'National Bank'
  }
];

export default function NearbyBanks() {
  const { settings } = useData();
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [banks, setBanks] = useState([]);
  const [locationError, setLocationError] = useState(null);

  const radiusMiles = settings.gpsRadius || 3;

  const requestLocation = () => {
    setLoading(true);
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      // Still show mock data
      loadMockBanks();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        loadMockBanks();
        toast.success('Location updated!');
      },
      (error) => {
        let message = 'Unable to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Showing banks.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location unavailable. Showing banks.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Showing banks.';
            break;
          default:
            message = 'Unknown error. Showing banks.';
        }
        setLocationError(message);
        loadMockBanks();
        toast.error(message);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const loadMockBanks = () => {
    // Filter banks within radius
    const filteredBanks = MOCK_BANKS.filter(bank => bank.distance <= radiusMiles);
    setBanks(filteredBanks);
    setLoading(false);
  };

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [radiusMiles]);

  const getDirections = (bank) => {
    const query = encodeURIComponent(bank.name + ' ' + bank.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <DashboardLayout title="Nearby Banks" subtitle={`Finding banks within ${radiusMiles} miles of your location`}>
      <div className="space-y-6">
        {/* Location Status */}
        <Card className="location-card">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center location-icon",
                  location ? "location-icon" : "location-icon"
                )}>
                  {loading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  ) : location ? (
                    <Navigation className="h-6 w-6 text-white" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    {loading ? 'Getting location...' : 
                     location ? 'Location found' : 'mode'}
                  </h3>
                  <p className="text-sm text-white/80">
                    {locationError || (
                      location 
                        ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
                        : 'Using sample bank data for demonstration'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm bg-white/20 text-white border-white/30">
                  {radiusMiles} mile radius
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={requestLocation}
                  disabled={loading}
                  className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note about */}
        <div className="warning-note p-4 rounded-lg border">
          <p className="text-sm flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <strong>Mode:</strong> Displaying sample bank data. In production, this would use Google Maps API with your actual location.
          </p>
        </div>

        {/* Banks Grid */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banks.map((bank, index) => (
              <motion.div
                key={bank.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full bank-card hover:shadow-elevated transition-shadow duration-300">
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
                        {bank.distance} mi
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="bank-rating font-medium">{bank.rating}</span>
                        <span className="text-sm text-muted-foreground">({bank.reviews})</span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm font-semibold",
                        bank.isOpen ? "bank-open" : "bank-closed"
                      )}>
                        <Clock className="h-3.5 w-3.5" />
                        {bank.hours}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-xs bank-badge">{bank.type}</Badge>
                      {bank.services.slice(0, 2).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs bank-service-badge">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1 btn-primary"
                        onClick={() => getDirections(bank)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Directions
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="btn-secondary"
                        onClick={() => window.open(`tel:${bank.phone}`, '_self')}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">No Banks Found</h3>
              <p className="text-muted-foreground mb-4">
                No banks found within {radiusMiles} miles. Try increasing the radius in Settings.
              </p>
              <Button variant="outline" asChild className="btn-secondary">
                <a href="/settings">Go to Settings</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Map Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Map View</CardTitle>
            <CardDescription>Interactive map coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="map-placeholder h-64 rounded-lg flex items-center justify-center border-2 border-dashed">
              <div className="text-center">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
                <p className="text-muted-foreground">
                  Interactive map would display here with Google Maps API integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}