import React, { useState } from "react";
import { 
  ArrowUpRight, 
  AlertTriangle, 
  FileText, 
  Mail, 
  Clock, 
  CheckCircle, 
  HelpCircle,
  Zap,
  Shield,
  Users,
  ExternalLink,
  Trash2,
  X
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "../../components/ui/select";
import { Separator } from "../../components/ui/separator";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Progress } from "../../components/ui/progress";

export default function ReportAProblem() {
  const [form, setForm] = useState({
    subject: "",
    details: "",
    email: "",
    priority: "medium",
    category: "technical",
    component: "",
    attachments: [],
    expectedBehavior: "",
    actualBehavior: "",
    businessImpact: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTickets, setSubmittedTickets] = useState([
    { id: "TKT-001", subject: "Dashboard metrics not updating", status: "in-progress", priority: "high", date: "2024-01-15" },
    { id: "TKT-002", subject: "API rate limiting issue", status: "resolved", priority: "medium", date: "2024-01-10" },
    { id: "TKT-003", subject: "Export feature timeout", status: "open", priority: "low", date: "2024-01-18" },
  ]);

  const priorityOptions = [
    { value: "critical", label: "Critical", color: "bg-red-100 text-red-800 border-red-200", icon: AlertTriangle },
    { value: "high", label: "High", color: "bg-orange-100 text-orange-800 border-orange-200", icon: Zap },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-800 border-gray-200", icon: FileText },
  ];

  const categoryOptions = [
    { value: "technical", label: "Technical Issue", description: "Bugs, errors, or technical problems" },
    { value: "feature", label: "Feature Request", description: "New functionality or enhancements" },
    { value: "data", label: "Data Issue", description: "Incorrect or missing data" },
    { value: "security", label: "Security Concern", description: "Security vulnerabilities or concerns" },
    { value: "billing", label: "Billing/Account", description: "Billing, subscription, or account issues" },
    { value: "performance", label: "Performance", description: "Slow performance or timeouts" },
  ];

  const componentOptions = [
    "Dashboard",
    "API",
    "Data Export",
    "User Management",
    "Reporting",
    "Integrations",
    "Authentication",
    "Notifications",
    "Compliance Tools",
    "Other"
  ];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 3) {
      toast.error("Maximum 3 files allowed");
      return;
    }

    const newAttachments = files.map(file => ({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type,
    }));

    setForm(prev => ({ 
      ...prev, 
      attachments: [...prev.attachments, ...newAttachments].slice(0, 3)
    }));
    toast.success(`${files.length} file(s) added`);
  };

  const removeAttachment = (index) => {
    setForm(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const onSubmit = async () => {
    if (!form.subject || !form.details || !form.category) {
      toast.error("Subject, details, and category are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create new ticket
      const newTicket = {
        id: `TKT-00${submittedTickets.length + 1}`,
        subject: form.subject,
        status: "open",
        priority: form.priority,
        date: new Date().toISOString().split('T')[0],
      };

      setSubmittedTickets(prev => [newTicket, ...prev]);
      
      toast.success(
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">Incident Report Submitted</p>
            <p className="text-sm opacity-90">Ticket #{newTicket.id} created. We'll contact you within 4 hours.</p>
          </div>
        </div>,
        { duration: 5000 }
      );

      // Reset form
      setForm({
        subject: "",
        details: "",
        email: "",
        priority: "medium",
        category: "technical",
        component: "",
        attachments: [],
        expectedBehavior: "",
        actualBehavior: "",
        businessImpact: "",
      });
    } catch (error) {
      console.error("Failed to submit report:", error);
      toast.error(`Failed to submit report: ${error.message || "Please try again."}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'resolved': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress': 
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open': 
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    const option = priorityOptions.find(p => p.value === priority);
    const Icon = option?.icon || AlertTriangle;
    return <Icon className="w-4 h-4" />;
  };

  const clearAllTickets = () => {
    if (submittedTickets.length === 0) {
      toast.info("No tickets to clear");
      return;
    }

    if (window.confirm(`Are you sure you want to clear all ${submittedTickets.length} tickets? This action cannot be undone.`)) {
      setSubmittedTickets([]);
      toast.success("All tickets cleared");
    }
  };

  const deleteSingleTicket = (ticketId) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      setSubmittedTickets(prev => prev.filter(ticket => ticket.id !== ticketId));
      toast.success("Ticket deleted");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Incident Management</h1>
            <p className="text-gray-600 max-w-2xl">
              Report technical issues, request features, or submit security concerns. 
              Our enterprise support team ensures prompt resolution following SLA guidelines.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              <Shield className="w-3 h-3 mr-1" />
              SLA: 4-hour response
            </Badge>
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Users className="w-3 h-3 mr-1" />
              24/7 Support
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="report" className="space-y-6">
          <TabsList className="bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="report" className="data-[state=active]:bg-white">
              <FileText className="w-4 h-4 mr-2" />
              Report Incident
            </TabsTrigger>
            <TabsTrigger value="tickets" className="data-[state=active]:bg-white">
              <Clock className="w-4 h-4 mr-2" />
              My Tickets ({submittedTickets.length})
            </TabsTrigger>
            <TabsTrigger value="resources" className="data-[state=active]:bg-white">
              <HelpCircle className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="report" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      Incident Details
                    </CardTitle>
                    <CardDescription>
                      Provide detailed information to help us resolve your issue efficiently
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6 pt-6">
                    {/* Priority & Category */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-1">
                          <Zap className="w-4 h-4" />
                          Priority
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select 
                          value={form.priority} 
                          onValueChange={(value) => setForm(prev => ({ ...prev, priority: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {priorityOptions.map((option) => {
                              const Icon = option.icon;
                              return (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4" />
                                    {option.label}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Category
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <Select 
                          value={form.category} 
                          onValueChange={(value) => setForm(prev => ({ ...prev, category: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {categoryOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                <div>
                                  <div className="font-medium">{option.label}</div>
                                  <div className="text-xs text-gray-500">{option.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Subject & Component */}
                    <div className="space-y-2">
                      <Label>
                        Subject
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        value={form.subject}
                        onChange={(e) => setForm(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Brief summary of the issue"
                        className="h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Affected Component (Optional)</Label>
                      <Select 
                        value={form.component} 
                        onValueChange={(value) => setForm(prev => ({ ...prev, component: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select component" />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                          {componentOptions.map((component) => (
                            <SelectItem key={component} value={component.toLowerCase()}>
                              {component}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Technical Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Expected Behavior</Label>
                        <textarea
                          className="w-full min-h-[100px] rounded-lg border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={form.expectedBehavior}
                          onChange={(e) => setForm(prev => ({ ...prev, expectedBehavior: e.target.value }))}
                          placeholder="What should have happened?"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Actual Behavior</Label>
                        <textarea
                          className="w-full min-h-[100px] rounded-lg border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={form.actualBehavior}
                          onChange={(e) => setForm(prev => ({ ...prev, actualBehavior: e.target.value }))}
                          placeholder="What actually happened?"
                        />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-2">
                      <Label>
                        Detailed Description
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <textarea
                        className="w-full min-h-[140px] rounded-lg border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.details}
                        onChange={(e) => setForm(prev => ({ ...prev, details: e.target.value }))}
                        placeholder="Include error messages, steps to reproduce, and any relevant context..."
                      />
                    </div>

                    {/* Business Impact */}
                    <div className="space-y-2">
                      <Label>Business Impact (Optional)</Label>
                      <textarea
                        className="w-full min-h-[80px] rounded-lg border border-gray-300 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={form.businessImpact}
                        onChange={(e) => setForm(prev => ({ ...prev, businessImpact: e.target.value }))}
                        placeholder="How does this issue affect your business operations?"
                      />
                    </div>

                    {/* Attachments */}
                    <div className="space-y-3">
                      <Label>Attachments (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <input
                          type="file"
                          multiple
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                          accept=".jpg,.jpeg,.png,.pdf,.txt,.log,.csv"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="flex flex-col items-center gap-2">
                            <FileText className="w-8 h-8 text-gray-400" />
                            <div>
                              <p className="font-medium">Drop files here or click to upload</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Supports JPG, PNG, PDF, TXT, LOG, CSV (Max 10MB each)
                              </p>
                            </div>
                          </div>
                        </label>
                      </div>

                      {form.attachments.length > 0 && (
                        <div className="space-y-2">
                          {form.attachments.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <div>
                                  <p className="font-medium text-sm">{file.name}</p>
                                  <p className="text-xs text-gray-500">{file.size}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeAttachment(index)}
                                className="h-8 w-8 p-0"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        Contact Email (Optional)
                      </Label>
                      <Input
                        value={form.email}
                        onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="team@yourcompany.com"
                        type="email"
                        className="h-12"
                      />
                      <p className="text-xs text-gray-500">
                        If not provided, we'll use your account email for updates
                      </p>
                    </div>
                  </CardContent>

                  <CardFooter className="bg-gray-50 border-t p-6">
                    <div className="flex items-center justify-between w-full">
                      <div className="text-sm text-gray-600">
                        By submitting, you agree to our{" "}
                        <a href="#" className="text-blue-600 hover:underline">
                          Support Terms
                        </a>
                      </div>
                      <Button
                        onClick={onSubmit}
                        disabled={isSubmitting || !form.subject || !form.details || !form.category}
                        className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Incident Report
                            <ArrowUpRight className="ml-2 w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>

              {/* Sidebar - Guidelines & Support */}
              <div className="space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Submission Guidelines</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-blue-100 rounded">
                          <AlertTriangle className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Critical Issues</p>
                          <p className="text-xs text-gray-600">
                            For system outages or security breaches, call our 24/7 hotline
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-green-100 rounded">
                          <FileText className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Include Details</p>
                          <p className="text-xs text-gray-600">
                            Error messages, timestamps, and reproduction steps help us resolve faster
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1 bg-purple-100 rounded">
                          <Shield className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">SLA Commitment</p>
                          <p className="text-xs text-gray-600">
                            Critical: 1 hour, High: 4 hours, Medium: 1 business day
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <p className="font-medium text-sm">Escalation Contacts</p>
                      <div className="space-y-2">
                        <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm">Emergency Hotline</span>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            24/7
                          </Badge>
                        </a>
                        <a href="#" className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                          <span className="text-sm">Account Manager</span>
                          <ExternalLink className="w-4 h-4 text-gray-400" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Support Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">System Uptime</span>
                        <span className="font-semibold">99.95%</span>
                      </div>
                      <Progress value={99.95} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-xs text-green-800 mb-1">Open Tickets</p>
                        <p className="text-2xl font-bold text-green-900">12</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800 mb-1">Avg. Resolution</p>
                        <p className="text-2xl font-bold text-blue-900">6.2h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tickets" className="space-y-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Support Tickets</CardTitle>
                    <CardDescription>Track the status of your submitted incidents</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {submittedTickets.length > 0 && (
                      <Button 
                        variant="outline" 
                        onClick={clearAllTickets}
                        className="gap-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                      </Button>
                    )}
                    <Button variant="outline" className="gap-2">
                      <FileText className="w-4 h-4" />
                      Export History
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {submittedTickets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-4 text-sm font-medium text-gray-700">Ticket ID</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-700">Subject</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-700">Priority</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                          <th className="text-left p-4 text-sm font-medium text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submittedTickets.map((ticket) => (
                          <tr key={ticket.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">
                              <code className="font-mono text-sm font-semibold">{ticket.id}</code>
                            </td>
                            <td className="p-4 font-medium">{ticket.subject}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                {getPriorityIcon(ticket.priority)}
                                <span className="capitalize">{ticket.priority}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getStatusBadge(ticket.status)} capitalize`}>
                                {ticket.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-gray-600">{ticket.date}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="gap-1 hover:text-red-600"
                                  onClick={() => deleteSingleTicket(ticket.id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                                <Button variant="ghost" size="sm" className="gap-1">
                                  View
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <FileText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tickets Found</h3>
                    <p className="text-gray-600 mb-4">You haven't submitted any incident reports yet.</p>
                    <Button 
                      onClick={() => {
                        // Switch to report tab
                        const reportTab = document.querySelector('[value="report"]');
                        if (reportTab) reportTab.click();
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Report an Incident
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    Community
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Join discussions with other enterprise users
                  </p>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() =>
                    window.open(
                      "https://www.facebook.com/groups/755013229548095/",
                      "_blank"
                    )
                  }
                >
                  Visit Forum
                  <ExternalLink className="w-4 h-4" />
                </Button>
                </CardContent>
              </Card>

              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    Knowledge Base
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Browse solutions to common issues
                  </p>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open("/education/articles/index.html", "_blank")}
                >
                  Search Articles
                  <ExternalLink className="w-4 h-4" />
                </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}