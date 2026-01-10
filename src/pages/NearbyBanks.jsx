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
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  location ? "bg-success/10" : "bg-warning/10"
                )}>
                  {loading ? (
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  ) : location ? (
                    <Navigation className="h-6 w-6 text-success" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-warning" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {loading ? 'Getting location...' : 
                     location ? 'Location found' : 'mode'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {locationError || (
                      location 
                        ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`
                        : 'Using sample bank data for demonstration'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-sm">
                  {radiusMiles} mile radius
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={requestLocation}
                  disabled={loading}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Note about */}
        <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-sm text-accent-foreground flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            <strong> Mode:</strong> Displaying sample bank data. In production, this would use Google Maps API with your actual location.
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
                <Card className="h-full hover:shadow-elevated transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground">{bank.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {bank.address}
                        </p>
                      </div>
                      <Badge 
                        variant={bank.distance <= 1 ? 'default' : 'secondary'}
                        className="shrink-0"
                      >
                        {bank.distance} mi
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-accent text-accent" />
                        <span className="font-medium">{bank.rating}</span>
                        <span className="text-sm text-muted-foreground">({bank.reviews})</span>
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 text-sm",
                        bank.isOpen ? "text-success" : "text-muted-foreground"
                      )}>
                        <Clock className="h-3.5 w-3.5" />
                        {bank.hours}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline" className="text-xs">{bank.type}</Badge>
                      {bank.services.slice(0, 2).map((service) => (
                        <Badge key={service} variant="secondary" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-border">
                      <Button 
                        variant="default" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => getDirections(bank)}
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Directions
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
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
              <Button variant="outline" asChild>
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
            <div className="h-64 rounded-lg bg-muted/50 flex items-center justify-center border-2 border-dashed border-border">
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
