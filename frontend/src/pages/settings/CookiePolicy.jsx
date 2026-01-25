// src/pages/settings/CookiePolicy.jsx
import React from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { CheckCircle, AlertCircle, Shield, Cookie } from "lucide-react";

export default function CookiePolicy() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Cookie className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900/[0.9] mb-2">Cookie Policy</h1>
        </div>
        
        <p className="text-gray-600 text-lg">
          This Cookie Policy explains how Oli-Branch Financial Platform uses cookies and similar tracking technologies to enhance your experience, improve our services, and protect your security.
        </p>

        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle className="h-5 w-5 text-green-600" />
              What Are Cookies?
            </CardTitle>
            <CardDescription>
              Understanding these small text files and their purpose
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you visit our website. They help our platform recognize your device and remember information about your visit, such as your language preference, login status, and other settings.
            </p>
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-800">Cookies do NOT:</p>
                  <ul className="mt-1 text-blue-700 list-disc list-inside space-y-1">
                    <li>Store sensitive personal information like credit card details</li>
                    <li>Install malware or viruses on your device</li>
                    <li>Access files on your computer or mobile device</li>
                    <li>Track your activity on other websites</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Shield className="h-5 w-5 text-amber-600" />
              Types of Cookies We Use
            </CardTitle>
            <CardDescription>
              Categorized by purpose and duration
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                  Essential Cookies (Strictly Necessary)
                </h3>
                <p className="text-gray-700 mb-2">
                  These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services.
                </p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>User authentication and session management</li>
                  <li>Security features and fraud prevention</li>
                  <li>Load balancing and traffic distribution</li>
                  <li>Remembering your privacy preferences</li>
                  <li>Maintaining shopping cart contents (if applicable)</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                  Performance & Analytics Cookies
                </h3>
                <p className="text-gray-700 mb-2">
                  These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are the most and least popular and see how visitors move around the site.
                </p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>Google Analytics for usage statistics</li>
                  <li>Hotjar for user behavior analysis</li>
                  <li>Error reporting and performance monitoring</li>
                  <li>A/B testing for feature optimization</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                  Functionality Cookies
                </h3>
                <p className="text-gray-700 mb-2">
                  These cookies enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                </p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>Remembering language preferences</li>
                  <li>Storing regional settings (currency, timezone)</li>
                  <li>Theme and display preferences (light/dark mode)</li>
                  <li>Remembering dashboard layout preferences</li>
                  <li>Chat support session persistence</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                  Targeting & Advertising Cookies
                </h3>
                <p className="text-gray-700 mb-2">
                  These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant advertisements on other sites.
                </p>
                <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                  <li>Facebook Pixel for ad retargeting</li>
                  <li>Google Ads conversion tracking</li>
                  <li>LinkedIn Insight Tag for professional targeting</li>
                  <li>Social media sharing functionality</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Cookie Duration</CardTitle>
            <CardDescription>
              How long different cookies remain on your device
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th className="px-4 py-3">Cookie Type</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 font-medium">Session Cookies</td>
                    <td className="px-4 py-3">Until browser closes</td>
                    <td className="px-4 py-3">Temporary cookies that expire when you close your browser</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Persistent Cookies</td>
                    <td className="px-4 py-3">24 hours - 2 years</td>
                    <td className="px-4 py-3">Remain on your device until they expire or are deleted</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-medium">First-Party Cookies</td>
                    <td className="px-4 py-3">Varies by purpose</td>
                    <td className="px-4 py-3">Set by Oli-Branch directly for platform functionality</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 font-medium">Third-Party Cookies</td>
                    <td className="px-4 py-3">Set by provider</td>
                    <td className="px-4 py-3">Set by external services like analytics or advertising partners</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Managing Your Cookie Preferences</CardTitle>
            <CardDescription>
              You have full control over cookie usage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Browser Settings</h3>
              <p className="text-gray-700">
                Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may affect your ability to use certain features of our platform.
              </p>
              <ul className="text-gray-600 list-disc list-inside space-y-1 ml-4">
                <li><strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                <li><strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                <li><strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Platform-Specific Controls</h3>
              <p className="text-gray-700">
                Within Oli-Branch, you can adjust certain cookie preferences through your account settings:
              </p>
              <div className="flex flex-wrap gap-3 mt-2">
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Analytics Preferences
                </Button>
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Marketing Communications
                </Button>
                <Button variant="outline" className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Personalization Settings
                </Button>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-800">Important Note</p>
                  <p className="text-amber-700 mt-1">
                    Disabling essential cookies will prevent you from using certain core features of Oli-Branch, including authentication, security features, and personalized financial tools. We recommend allowing essential cookies for the best experience.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl border border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Third-Party Services</CardTitle>
            <CardDescription>
              External services that may set cookies on our platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-gray-700">
                Oli-Branch integrates with several third-party services to provide enhanced functionality. These services may set their own cookies when you interact with their features:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Google Services</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Analytics, Maps, Authentication, and Advertising services
                  </p>
                  <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                    View Google's Cookie Policy →
                  </a>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Stripe</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Payment processing and fraud prevention
                  </p>
                  <a href="https://stripe.com/cookies-policy/legal" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                    View Stripe's Cookie Policy →
                  </a>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Cloudflare</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    Security, performance, and DDoS protection
                  </p>
                  <a href="https://www.cloudflare.com/cookie-policy/" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                    View Cloudflare's Cookie Policy →
                  </a>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">Hotjar</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    User behavior analytics and feedback
                  </p>
                  <a href="https://help.hotjar.com/hc/en-us/articles/115011789248-Hotjar-Cookie-Information" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline mt-2 inline-block">
                    View Hotjar's Cookie Policy →
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Need Assistance?</h3>
                  <p className="text-gray-600 text-sm">
                    If you have questions about our Cookie Policy or need help managing your preferences, contact our support team.
                  </p>
                  <p className="text-gray-600 text-sm mt-1">
                    Email: <a href="mailto:admin@oli-contact.com" className="text-primary hover:underline font-medium">
                      admin@oli-contact.com
                    </a>
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      const subject = encodeURIComponent('Cookie Policy Inquiry - Oli-Branch');
                      const body = encodeURIComponent(`Hello Oli-Branch Support,\n\nI have a question regarding your Cookie Policy:\n\n[Please describe your inquiry here]\n\nThank you,\n[Your Name]`);
                      window.location.href = `mailto:admin@oli-contact.com?subject=${subject}&body=${body}`;
                    }}
                  >
                    Contact Support
                  </Button>
                  <Button onClick={() => window.location.href = '/settings/privacy-safety'}>
                    Update Preferences
                  </Button>
                </div>
              </div>
              
              <div className="mt-6 text-xs text-gray-500">
                <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                <p className="mt-1">This Cookie Policy may be updated periodically to reflect changes in our practices or for other operational, legal, or regulatory reasons.</p>
              </div>
            </div>
      </div>
    </DashboardLayout>
  );
}