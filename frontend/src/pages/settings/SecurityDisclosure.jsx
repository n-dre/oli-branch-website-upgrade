// src/pages/settings/SecurityDisclosure.jsx
import React, { useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "../../components/ui/card";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail,
  FileText,
  ExternalLink,
  UserCheck,
  Server,
  Eye
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";

export default function SecurityDisclosure() {
  const [isCopied, setIsCopied] = useState(false);

  const securityContacts = [
    { type: "Primary", email: "security@oli-branch.com", response: "1-2 business days" },
    { type: "Urgent", email: "urgent-security@oli-branch.com", response: "4-8 hours" },
    { type: "PGP Key", email: "security-pgp@oli-branch.com", response: "Encrypted communication" },
  ];

  const securityPolicies = [
    { title: "Responsible Disclosure", status: "Active", lastUpdated: "2024-01-15" },
    { title: "Bug Bounty Program", status: "Available", lastUpdated: "2024-02-01" },
    { title: "Security Response SLA", status: "72 hours", lastUpdated: "2024-01-20" },
    { title: "Data Encryption", status: "AES-256", lastUpdated: "2024-01-10" },
  ];

  const vulnerabilityExamples = [
    { type: "Critical", examples: "Remote Code Execution, SQL Injection, Authentication Bypass" },
    { type: "High", examples: "Cross-Site Scripting (XSS), Insecure Direct Object References" },
    { type: "Medium", examples: "CSRF, Information Disclosure, Rate Limiting Issues" },
    { type: "Low", examples: "UI/UX Security Issues, Minor Information Leaks" },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900/[0.9] mb-2">Security Disclosure</h1>
            <p className="text-muted-foreground mt-2">
              How we handle security vulnerabilities, responsible disclosure, and reporting procedures
            </p>
          </div>
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2">
            <Shield className="h-4 w-4" />
            Security Level: Enterprise
          </Badge>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reporting" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Reporting
            </TabsTrigger>
            <TabsTrigger value="policies" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Policies
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contacts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Our Security Commitment</CardTitle>
                      <CardDescription>Protecting user data and privacy</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    At Oli-Branch, we maintain the highest security standards through regular audits,
                    penetration testing, and proactive monitoring. Our security team works around the
                    clock to ensure your data remains protected.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> SOC 2 Compliant
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> GDPR Ready
                    </Badge>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" /> ISO 27001
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-500/10">
                      <UserCheck className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Responsible Disclosure</CardTitle>
                      <CardDescription>Working together for security</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We believe security is a shared responsibility. Our responsible disclosure program
                    encourages security researchers to report vulnerabilities while protecting user data
                    and service availability.
                  </p>
                  <div className="mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Average response time: <strong>24 hours</strong></span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Security Infrastructure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Encryption</h4>
                    <p className="text-sm text-muted-foreground">
                      End-to-end encryption for all sensitive data with AES-256 and TLS 1.3
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      24/7 security monitoring with automated threat detection and alerting
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-semibold mb-2">Access Control</h4>
                    <p className="text-sm text-muted-foreground">
                      Role-based access control with multi-factor authentication and audit logging
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reporting Tab */}
          <TabsContent value="reporting" className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Report a Vulnerability
                </CardTitle>
                <CardDescription>
                  Steps to responsibly report security issues
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Identify the Issue</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Clearly document the security vulnerability with reproduction steps,
                        affected components, and potential impact.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Contact Security Team</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Email details to our security team using the provided contacts.
                        Include screenshots, logs, and any proof-of-concept code.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Allow Time for Response</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Our team will acknowledge receipt within 24 hours and provide
                        regular updates on the investigation and remediation progress.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">4</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">Coordination for Disclosure</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Work with us to coordinate public disclosure after the issue
                        is resolved. We typically disclose within 90 days of resolution.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Separator replacement */}
                <div className="h-px w-full bg-[#52796F]/15 my-4" />

                <div className="space-y-4">
                  <h4 className="font-semibold">What to Include in Your Report</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Detailed description of the vulnerability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Step-by-step reproduction instructions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Potential impact and risk assessment</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Proof-of-concept or screenshots if applicable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>Your contact information for follow-up</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-amber-800">Important Guidelines</h5>
                      <ul className="text-sm text-amber-700 mt-1 space-y-1">
                        <li>Do not access or modify user data without explicit permission</li>
                        <li>Avoid denial of service or disruption of our services</li>
                        <li>Do not publicly disclose vulnerabilities before coordination</li>
                        <li>Respect our bug bounty program terms and conditions</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Vulnerability Severity Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {vulnerabilityExamples.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Badge
                          variant={
                            item.type === "Critical" ? "destructive" :
                            item.type === "High" ? "default" : "secondary"
                          }
                          className="flex-shrink-0"
                        >
                          {item.type}
                        </Badge>
                        <p className="text-sm text-muted-foreground">{item.examples}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Response Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Initial Response</span>
                    <Badge>24 hours</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Investigation Update</span>
                    <Badge>3-5 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Remediation Time</span>
                    <Badge>7-30 days</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Public Disclosure</span>
                    <Badge>90 days</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Policies Tab */}
          <TabsContent value="policies" className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Security Policies</CardTitle>
                <CardDescription>
                  Comprehensive security policies and compliance documentation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {securityPolicies.map((policy, index) => (
                    <div key={index} className="p-4 rounded-lg border hover:border-primary transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{policy.title}</h4>
                        <Badge variant="outline">{policy.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last updated: {policy.lastUpdated}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Download Complete Security Policy PDF
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is there a bug bounty program?</AccordionTrigger>
                    <AccordionContent>
                      Yes, we operate a private bug bounty program for invited security researchers.
                      Rewards range from $100 to $5,000 depending on severity and impact.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What types of testing are allowed?</AccordionTrigger>
                    <AccordionContent>
                      Automated scanning, manual testing, and security research are allowed as long as
                      they don't disrupt services or access/modify user data without permission.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How are reporters credited?</AccordionTrigger>
                    <AccordionContent>
                      With your permission, we'll credit you in our security advisories and may include
                      you in our Hall of Fame. Anonymous reporting is also accepted.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>What about legal protection?</AccordionTrigger>
                    <AccordionContent>
                      We won't pursue legal action against researchers who follow our responsible
                      disclosure guidelines and act in good faith to improve our security.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6">
            <Card className="rounded-2xl">
              <CardHeader>
                <CardTitle>Security Contacts</CardTitle>
                <CardDescription>
                  Reach out to our security team through the appropriate channels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {securityContacts.map((contact, index) => (
                  <div key={index} className="p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{contact.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {contact.email}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(contact.email)}
                          className="h-8"
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Response: {contact.response}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Emergency Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      <div>
                        <h5 className="font-semibold text-red-800">Critical Issues Only</h5>
                        <p className="text-sm text-red-700 mt-1">
                          For active security incidents affecting multiple users or data breaches,
                          use the urgent contact channel above.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Include "URGENT" in the subject line and provide a brief description
                      of the immediate threat in the first paragraph.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Resources</CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" asChild>
                   <a href="/cookie-policy" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Security Advisories
                  </a>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/help" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Compliance Documentation
                  </a>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/privacy" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Privacy Policy
                  </a>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/terms" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Terms of Service
                  </a>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/policies" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Policies
                  </a>
                </Button>

                <Button variant="outline" className="w-full justify-start" asChild>
                  <a href="/settings/privacy-safety" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Security
                  </a>
                </Button>
              </CardContent>

              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Note */}
        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          <p>
            This security disclosure policy is regularly reviewed and updated.
            Last updated: February 15, 2024
          </p>
          <p className="mt-2">
            Thank you for helping keep Oli-Branch and our users secure.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
