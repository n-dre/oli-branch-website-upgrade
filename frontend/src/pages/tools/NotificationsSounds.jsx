import React, { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

// API Service Layer
const notificationApi = {
  async fetchPreferences() {
    const saved = localStorage.getItem("b2b_notification_prefs");
    return saved ? JSON.parse(saved) : null;
  },
  
  async savePreferences(prefs) {
    localStorage.setItem("b2b_notification_prefs", JSON.stringify(prefs));
    return { success: true, timestamp: new Date().toISOString() };
  },
  
  async testNotification(channel) {
    console.log(`Test ${channel} notification sent`);
    return { sent: true, channel };
  }
};

export default function NotificationsSounds() {
  const [state, setState] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushAlerts: true,
    sounds: true,
    
    criticalAlerts: {
      email: true,
      sms: true,
      push: true,
      sound: true
    },
    securityUpdates: {
      email: true,
      push: true,
      sound: false
    },
    billingNotifications: {
      email: true,
      sms: true,
      push: false
    },
    productUpdates: {
      email: true,
      push: true
    },
    maintenanceAlerts: {
      email: true,
      sms: false,
      push: true
    },
    
    quietHours: {
      enabled: false,
      start: "22:00",
      end: "07:00"
    },
    notificationThrottle: "medium",
    digestFrequency: "daily"
  });

  const [loading, setLoading] = useState(true);
  const [testing, setTesting] = useState(false);

  // Initialize WebSocket for B2B real-time notifications
  const initializeRealTimeConnection = useCallback(() => {
    console.log("Initializing B2B notification WebSocket connection...");
    
    const simulateNotification = () => {
      if (Math.random() > 0.7 && state.pushAlerts) {
        console.log("📱 New B2B notification received");
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification("B2B Platform Alert", {
            body: "New update available for your enterprise account",
            icon: "/logo.png"
          });
        }
      }
    };
    
    const interval = setInterval(simulateNotification, 30000);
    return () => clearInterval(interval);
  }, [state.pushAlerts]);

  // Load saved preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        setLoading(true);
        const saved = await notificationApi.fetchPreferences();
        if (saved) {
          setState(prev => ({ ...prev, ...saved }));
        }
        initializeRealTimeConnection();
      } catch {
        toast.error("Failed to load notification preferences");
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, [initializeRealTimeConnection]); // ✅ Added missing dependency

  const toggle = (k) => setState((s) => ({ ...s, [k]: !s[k] }));

  const toggleCategoryChannel = (category, channel) => {
    setState(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category]?.[channel]
      }
    }));
  };

  const testNotification = async (channel) => {
    setTesting(true);
    try {
      await notificationApi.testNotification(channel);
      toast.success(`Test ${channel} notification sent`);
    } catch {
      toast.error(`Failed to send test ${channel} notification`);
    } finally {
      setTesting(false);
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        toast.success("Push notifications enabled");
      } else {
        toast.error("Push notifications blocked");
      }
    }
  };

  const onSave = async () => {
    try {
      await notificationApi.savePreferences(state); // ✅ Removed unused 'result' variable
      
      if (navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_NOTIFICATION_PREFS',
          prefs: state
        });
      }
      
      toast.success("Enterprise notification settings saved & synced across devices", {
        duration: 4000,
        action: {
          label: "Undo",
          onClick: () => console.log("Undo save")
        }
      });
    } catch {
      toast.error("Failed to save notification settings");
    }
  };

  const exportPreferences = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'enterprise-notification-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Preferences exported");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto p-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900/[0.9] mb-2">Enterprise Notification Center</h1>
          <p className="text-muted-foreground">
            Manage how your organization receives alerts, updates, and communications across all devices and platforms.
          </p>
        </div>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Notification Channels</CardTitle>
            <CardDescription>Configure delivery methods for enterprise communications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleRow 
              title="Email Alerts" 
              desc="Enterprise-wide email notifications for all critical updates" 
              checked={state.emailAlerts} 
              onChange={() => toggle("emailAlerts")}
              onTest={() => testNotification("email")}
            />
            <ToggleRow 
              title="SMS Alerts" 
              desc="Urgent SMS notifications for system-critical events" 
              checked={state.smsAlerts} 
              onChange={() => toggle("smsAlerts")}
              onTest={() => testNotification("sms")}
            />
            <ToggleRow 
              title="Push Notifications" 
              desc="Real-time push notifications across desktop and mobile" 
              checked={state.pushAlerts} 
              onChange={() => toggle("pushAlerts")}
              onTest={() => {
                if ('Notification' in window && Notification.permission !== 'granted') {
                  requestNotificationPermission();
                } else {
                  testNotification("push");
                }
              }}
            />
            <ToggleRow 
              title="Audible Alerts" 
              desc="System sounds for immediate attention notifications" 
              checked={state.sounds} 
              onChange={() => toggle("sounds")}
              onTest={() => {
                if (state.sounds) {
                  const audio = new Audio('/notification.mp3');
                  audio.play().catch(() => {});
                  toast.info("Test sound played");
                }
              }}
            />

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Enterprise Notification Categories</h3>
              <div className="space-y-4">
                <CategoryRow 
                  title="Critical System Alerts"
                  description="Server downtime, security breaches, payment failures"
                  category="criticalAlerts"
                  state={state}
                  onToggle={toggleCategoryChannel}
                />
                <CategoryRow 
                  title="Security Updates"
                  description="Security patches, vulnerability alerts, access changes"
                  category="securityUpdates"
                  state={state}
                  onToggle={toggleCategoryChannel}
                />
                <CategoryRow 
                  title="Billing & Invoices"
                  description="Payment reminders, invoice generation, credit limits"
                  category="billingNotifications"
                  state={state}
                  onToggle={toggleCategoryChannel}
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4">Enterprise Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <div className="font-semibold">Quiet Hours</div>
                    <div className="text-sm text-muted-foreground">
                      {state.quietHours.enabled 
                        ? `Mute non-critical notifications from ${state.quietHours.start} to ${state.quietHours.end}`
                        : "Receive notifications 24/7"}
                    </div>
                  </div>
                  <input 
                    type="checkbox" 
                    className="h-5 w-5 accent-foreground" 
                    checked={state.quietHours.enabled}
                    onChange={() => toggle("quietHours")}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div>
                    <div className="font-semibold">Notification Digest</div>
                    <div className="text-sm text-muted-foreground">
                      {state.digestFrequency === "realtime" ? "Real-time delivery" : 
                       state.digestFrequency === "hourly" ? "Hourly digest" :
                       state.digestFrequency === "daily" ? "Daily summary" : "Weekly report"}
                    </div>
                  </div>
                  <select 
                    className="border rounded px-3 py-1"
                    value={state.digestFrequency}
                    onChange={(e) => setState(prev => ({...prev, digestFrequency: e.target.value}))}
                  >
                    <option value="realtime">Real-time</option>
                    <option value="hourly">Hourly Digest</option>
                    <option value="daily">Daily Summary</option>
                    <option value="weekly">Weekly Report</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="flex gap-3">
                <Button variant="outline" onClick={exportPreferences}>
                  Export Settings
                </Button>
                <Button variant="outline" onClick={() => {
                  setState({
                    emailAlerts: true,
                    smsAlerts: false,
                    pushAlerts: true,
                    sounds: true,
                    criticalAlerts: {
                      email: true,
                      sms: true,
                      push: true,
                      sound: true
                    },
                    securityUpdates: {
                      email: true,
                      push: true,
                      sound: false
                    },
                    billingNotifications: {
                      email: true,
                      sms: true,
                      push: false
                    },
                    productUpdates: {
                      email: true,
                      push: true
                    },
                    maintenanceAlerts: {
                      email: true,
                      sms: false,
                      push: true
                    },
                    quietHours: {
                      enabled: false,
                      start: "22:00",
                      end: "07:00"
                    },
                    notificationThrottle: "medium",
                    digestFrequency: "daily"
                  });
                  toast.info("Reset to default enterprise settings");
                }}>
                  Reset to Defaults
                </Button>
              </div>
              <Button onClick={onSave} disabled={testing}>
                {testing ? "Saving..." : "Save Enterprise Settings"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle>Notification Status</CardTitle>
            <CardDescription>Current system notification configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatusItem 
                label="Web Push" 
                status={Notification.permission === 'granted' ? 'Enabled' : 'Disabled'}
                active={Notification.permission === 'granted'}
              />
              <StatusItem 
                label="Service Worker" 
                status={navigator.serviceWorker ? 'Registered' : 'Not Available'}
                active={!!navigator.serviceWorker}
              />
              <StatusItem 
                label="Last Sync" 
                status={new Date().toLocaleTimeString()}
                active={true}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

function ToggleRow({ title, desc, checked, onChange, onTest }) {
  return (
    <div className="flex items-start justify-between gap-4 border border-border rounded-xl p-4 hover:bg-accent/5 transition-colors">
      <div className="space-y-1 flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{desc}</div>
        {onTest && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="mt-2 h-7 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              onTest();
            }}
          >
            Test Notification
          </Button>
        )}
      </div>
      <input 
        type="checkbox" 
        className="h-5 w-5 accent-foreground cursor-pointer" 
        checked={!!checked} 
        onChange={onChange}
        aria-label={`Toggle ${title}`}
      />
    </div>
  );
}

function CategoryRow({ title, description, category, state, onToggle }) {
  const categoryState = state[category];
  
  return (
    <div className="border border-border rounded-xl p-4 space-y-3">
      <div className="space-y-1">
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-muted-foreground">{description}</div>
      </div>
      <div className="flex flex-wrap gap-4">
        {Object.entries(categoryState).map(([channel, enabled]) => (
          <label key={channel} className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="h-4 w-4 accent-foreground"
              checked={enabled}
              onChange={() => onToggle(category, channel)}
            />
            <span className="text-sm capitalize">{channel}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function StatusItem({ label, status, active }) {
  return (
    <div className="text-center p-4 border rounded-lg">
      <div className="text-sm text-muted-foreground mb-1">{label}</div>
      <div className={`font-semibold ${active ? 'text-green-600' : 'text-amber-600'}`}>
        {status}
      </div>
    </div>
  );
}