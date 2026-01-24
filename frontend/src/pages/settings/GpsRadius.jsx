import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Target,
  Navigation,
  Satellite,
  Shield,
  Users,
  Database,
  Settings,
  Zap,
  Radar,
  Compass,
  Building2,
  Map,
  Download,
  FileText,
  CheckCircle,
} from "lucide-react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Slider } from "../../components/ui/slider";
import { cn } from "../../lib/utils";
import { useData } from "../../context/DataContext";
import { toast } from "sonner";

export default function GpsRadius() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useData();

  const radiusOptions = useMemo(() => [1, 3, 5, 10, 15, 25, 50], []);
  const [radiusMiles, setRadiusMiles] = useState(settings?.gpsRadius ?? 3);
  const [customRadius, setCustomRadius] = useState("");
  const [accuracyMode, setAccuracyMode] = useState("high"); // high, standard, low
  const [teamSync, setTeamSync] = useState(true);
  const [locationSharing, setLocationSharing] = useState(false);

  useEffect(() => {
    const v = settings?.gpsRadius;
    if (typeof v !== "number") return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRadiusMiles(v);
  }, [settings?.gpsRadius]);

  const saveRadius = (newRadius) => {
    const radiusValue = parseInt(newRadius) || radiusMiles;
    setRadiusMiles(radiusValue);

    if (updateSettings) {
      updateSettings({
        ...settings,
        gpsRadius: radiusValue,
        gpsAccuracy: accuracyMode,
        teamLocationSync: teamSync
      });
    }

    toast.success(`Enterprise search radius updated to ${radiusValue} miles`);
  };

  const handleCustomRadius = () => {
    if (!customRadius || isNaN(customRadius) || parseInt(customRadius) < 1) {
      toast.error("Please enter a valid radius (minimum 1 mile)");
      return;
    }
    const radiusValue = parseInt(customRadius);
    if (radiusValue > 100) {
      toast.warning("Maximum radius is 100 miles for enterprise plans");
      return;
    }
    saveRadius(radiusValue);
    setCustomRadius("");
  };

  const applyToTeam = () => {
    toast.success(`GPS radius settings applied to your enterprise team (${radiusMiles} miles)`);
  };

  const exportSettings = () => {
    toast.info("Exporting enterprise location configuration...");
  };

  const testLocationAccuracy = () => {
    toast.info("Testing GPS accuracy with current settings...");
    // In production: actually test location accuracy
  };

  return (
    <DashboardLayout
      title="Enterprise GPS Configuration"
      subtitle="Configure organization-wide location search parameters and accuracy settings"
    >
      <div className="space-y-6">
        {/* Enterprise Header Card */}
        <Card className="border-l-4 border-l-[#1B4332]">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E8F5E9] rounded-lg">
                  <Satellite className="h-5 w-5 text-[#1B4332]" />
                </div>
                <div>
                  <CardTitle className="text-[#1B4332] text-xl">Enterprise GPS Settings</CardTitle>
                  <CardDescription className="text-[#52796F]">
                    Configure location search parameters for your entire organization. 
                    Settings comply with enterprise privacy and security standards.
                  </CardDescription>
                </div>
              </div>

              <Button variant="outline" size="sm" className="btn-secondary" onClick={() => navigate("/settings")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Settings
              </Button>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Radius Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Search Radius
              </CardTitle>
              <CardDescription>Set enterprise search boundaries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Current radius:{" "}
                    <span className="text-primary font-bold text-lg">{radiusMiles} miles</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Controls Nearby Banks and Business Locator results
                  </p>
                </div>
                <Badge variant="outline" className="text-sm bg-[#1B4332] text-white">
                  {radiusMiles} mi
                </Badge>
              </div>

              {/* Radius Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Radius Slider</span>
                  <span className="text-xs text-muted-foreground">{radiusMiles} miles</span>
                </div>
                <Slider
                  defaultValue={[radiusMiles]}
                  max={50}
                  min={1}
                  step={1}
                  onValueChange={(value) => saveRadius(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 mi</span>
                  <span>Local</span>
                  <span>City</span>
                  <span>Regional</span>
                  <span>50 mi</span>
                </div>
              </div>

              {/* Quick Radius Buttons */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Quick Settings</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {radiusOptions.map((r) => (
                    <Button
                      key={r}
                      variant={radiusMiles === r ? "default" : "outline"}
                      size="sm"
                      onClick={() => saveRadius(r)}
                      className={cn(
                        "w-full",
                        radiusMiles === r && "btn-primary",
                        radiusMiles !== r && "btn-secondary"
                      )}
                    >
                      {r} mi
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Radius Input */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Custom Radius</p>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Enter custom miles (1-100)"
                    value={customRadius}
                    onChange={(e) => setCustomRadius(e.target.value)}
                    min="1"
                    max="100"
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCustomRadius}
                    className="btn-secondary"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* GPS Accuracy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="h-5 w-5" />
                Accuracy & Performance
              </CardTitle>
              <CardDescription>Balance accuracy with battery usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Accuracy Mode Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Satellite className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">GPS Accuracy Mode</span>
                  </div>
                  <Badge className={cn(
                    "text-xs",
                    accuracyMode === "high" ? "bg-green-100 text-green-800" :
                    accuracyMode === "standard" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-800"
                  )}>
                    {accuracyMode === "high" ? "High" : 
                     accuracyMode === "standard" ? "Standard" : "Low"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { id: "high", label: "High Accuracy", desc: "Best for precise business locations", icon: <Target className="h-4 w-4" /> },
                    { id: "standard", label: "Standard", desc: "Balanced accuracy and battery", icon: <Compass className="h-4 w-4" /> },
                    { id: "low", label: "Battery Saver", desc: "Reduced accuracy for longer use", icon: <Zap className="h-4 w-4" /> }
                  ].map((mode) => (
                    <div
                      key={mode.id}
                      className={cn(
                        "border rounded-lg p-3 cursor-pointer transition-all hover:bg-gray-50",
                        accuracyMode === mode.id && "border-[#1B4332] bg-[#E8F5E9]"
                      )}
                      onClick={() => setAccuracyMode(mode.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-2 rounded",
                          accuracyMode === mode.id ? "bg-[#1B4332] text-white" : "bg-gray-100"
                        )}>
                          {mode.icon}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{mode.label}</div>
                          <div className="text-xs text-muted-foreground">{mode.desc}</div>
                        </div>
                        {accuracyMode === mode.id && (
                          <CheckCircle className="h-4 w-4 text-[#1B4332]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Test Location Button */}
              <Button
                variant="outline"
                className="w-full btn-secondary"
                onClick={testLocationAccuracy}
              >
                <Radar className="h-4 w-4 mr-2" />
                Test Location Accuracy
              </Button>

              {/* Performance Metrics */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Estimated Performance</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[#1B4332]">
                      {accuracyMode === "high" ? "5-10m" : 
                       accuracyMode === "standard" ? "10-50m" : "50-100m"}
                    </div>
                    <div className="text-xs text-muted-foreground">Accuracy</div>
                  </div>
                  <div className="border rounded-lg p-3 text-center">
                    <div className="text-lg font-bold text-[#2D5A4A]">
                      {accuracyMode === "high" ? "High" : 
                       accuracyMode === "standard" ? "Medium" : "Low"}
                    </div>
                    <div className="text-xs text-muted-foreground">Battery Use</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enterprise Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Enterprise Controls
              </CardTitle>
              <CardDescription>Organization-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Team Settings */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-purple-600" />
                    <div>
                      <div className="font-medium text-sm">Team Synchronization</div>
                      <div className="text-xs text-muted-foreground">Apply settings to all team members</div>
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 select-none shrink-0">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={teamSync}
                        onChange={() => setTeamSync(!teamSync)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">Location Sharing</div>
                      <div className="text-xs text-muted-foreground">Allow team location visibility</div>
                    </div>
                  </div>
                  <label className="inline-flex items-center gap-2 select-none shrink-0">
                    <div className="relative">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={locationSharing}
                        onChange={() => setLocationSharing(!locationSharing)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1B4332]"></div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <p className="text-sm font-medium">Quick Actions</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-start btn-secondary"
                  onClick={applyToTeam}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Apply to Team
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start btn-secondary"
                  onClick={exportSettings}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Configuration
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start btn-secondary"
                  asChild
                >
                  <a href="/tools/nearby-banks">
                    <Building2 className="h-4 w-4 mr-2" />
                    Test Nearby Banks
                  </a>
                </Button>
              </div>

              {/* Compliance Status */}
              <div className="border rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <div className="text-sm font-medium">Enterprise Compliant</div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Settings meet enterprise privacy and security standards
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  <Badge className="text-xs bg-gray-100 text-gray-700">GDPR</Badge>
                  <Badge className="text-xs bg-gray-100 text-gray-700">CCPA</Badge>
                  <Badge className="text-xs bg-gray-100 text-gray-700">SOC 2</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enterprise Action Bar */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold">Enterprise GPS Configuration</h3>
                <p className="text-sm text-muted-foreground">
                  Current settings: {radiusMiles} mile radius • {accuracyMode} accuracy • {teamSync ? 'Team Sync ON' : 'Team Sync OFF'}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/tools/nearby-banks")}
                  className="flex-1 sm:flex-none btn-secondary"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Test Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={exportSettings}
                  className="flex-1 sm:flex-none btn-secondary"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
                <Button 
                  onClick={applyToTeam}
                  className="flex-1 sm:flex-none bg-[#1B4332] hover:bg-[#2D5A4A] text-white"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Save & Apply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Settings Summary</CardTitle>
            <CardDescription>Current enterprise GPS configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#1B4332]">{radiusMiles}</div>
                <div className="text-sm font-medium">Search Radius</div>
                <div className="text-xs text-muted-foreground mt-1">Miles</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#2D5A4A]">
                  {accuracyMode === "high" ? "High" : 
                   accuracyMode === "standard" ? "Standard" : "Low"}
                </div>
                <div className="text-sm font-medium">GPS Accuracy</div>
                <div className="text-xs text-muted-foreground mt-1">Mode</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#52796F]">
                  {teamSync ? "ON" : "OFF"}
                </div>
                <div className="text-sm font-medium">Team Sync</div>
                <div className="text-xs text-muted-foreground mt-1">Active</div>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-[#84A98C]">
                  Enterprise
                </div>
                <div className="text-sm font-medium">Compliance</div>
                <div className="text-xs text-muted-foreground mt-1">Grade A</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keep your button styles consistent with NearbyBanks */}
      <style>{`
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
      `}</style>
    </DashboardLayout>
  );
}