import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  FileText,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Building2,
  ExternalLink,
  TrendingUp,
  Award,
  DollarSign,
  Sparkles,
  ArrowLeft,
  Search
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useData } from '../context/DataContext';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

const RISK_COLORS = {
  'High': 'hsl(0, 72%, 58%)',
  'Medium': 'hsl(38, 92%, 50%)',
  'Low': 'hsl(145, 60%, 40%)'
};

export default function Report() {
  const { email: routeEmail } = useParams();
  const { responses, getScoring, getChartData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState(routeEmail ? decodeURIComponent(routeEmail) : null);

  const chartData = getChartData();

  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      const scoring = getScoring(r);
      const matchesSearch = r.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRisk = filterRisk === 'all' || scoring.riskLabel === filterRisk;
      return matchesSearch && matchesRisk;
    });
  }, [responses, searchTerm, filterRisk, getScoring]);

  const selectedResponse = selectedEmail 
    ? responses.find(r => r.email === selectedEmail)
    : null;

  const selectedScoring = selectedResponse ? getScoring(selectedResponse) : null;

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast.success('Report link copied to clipboard!');
  };

  const handleDownload = () => {
    if (!selectedResponse || !selectedScoring) return;
    
    const reportText = `
Oli-Branch Financial Mismatch Report
=====================================

Business: ${selectedResponse.businessName}
Email: ${selectedResponse.email}
Date: ${new Date(selectedResponse.timestamp).toLocaleDateString()}

MISMATCH SCORE: ${selectedScoring.mismatchScore}/100
RISK LEVEL: ${selectedScoring.riskLabel}
FEE WASTE: ${selectedScoring.feeWastePercent.toFixed(1)}% of revenue

KEY ISSUES:
${selectedScoring.keyReasons.map(r => `• ${r}`).join('\n')}

BANK RECOMMENDATIONS:
1. ${selectedScoring.bankMatch1}
   Why: ${selectedScoring.why1}

2. ${selectedScoring.bankMatch2}
   Why: ${selectedScoring.why2}

GRANT OPPORTUNITIES:
${selectedScoring.grantsSuggested.map((g, i) => `${i + 1}. ${g.grant}\n   ${g.why}`).join('\n\n')}

RESOURCE LINKS:
SBA: ${selectedScoring.sbaLink}
SSBCI: ${selectedScoring.ssbciLink}
    `;
    
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oli-branch-report-${selectedResponse.businessName.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  return (
    <DashboardLayout title="Financial Reports" subtitle="Detailed mismatch analysis and recommendations">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Response List */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Submissions</CardTitle>
              <CardDescription>Select a business to view report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search & Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search businesses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRisk} onValueChange={setFilterRisk}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Risks</SelectItem>
                    <SelectItem value="High">High Risk</SelectItem>
                    <SelectItem value="Medium">Medium Risk</SelectItem>
                    <SelectItem value="Low">Low Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Response List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
                {filteredResponses.length > 0 ? (
                  filteredResponses.map((response) => {
                    const scoring = getScoring(response);
                    return (
                      <button
                        key={response.id}
                        onClick={() => setSelectedEmail(response.email)}
                        className={cn(
                          "w-full p-3 rounded-lg text-left transition-all duration-200",
                          selectedEmail === response.email
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{response.businessName}</p>
                            <p className="text-xs text-muted-foreground truncate">{response.email}</p>
                          </div>
                          <Badge
                            variant={scoring.riskLabel === 'High' ? 'destructive' : 
                                    scoring.riskLabel === 'Medium' ? 'warning' : 'success'}
                            className="ml-2 shrink-0"
                          >
                            {scoring.mismatchScore}
                          </Badge>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No submissions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Report View */}
        <div className="lg:col-span-2">
          {selectedResponse && selectedScoring ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Report Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-2xl">
                        <Building2 className="h-6 w-6 text-primary" />
                        {selectedResponse.businessName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {selectedResponse.email} • {selectedResponse.entityType} • {selectedScoring.state}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Score Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mismatch Score Circle */}
                <Card className="md:col-span-1">
                  <CardContent className="pt-6 flex flex-col items-center">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(var(--muted))"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={RISK_COLORS[selectedScoring.riskLabel]}
                          strokeWidth="8"
                          strokeDasharray={`${selectedScoring.mismatchScore * 2.83} 283`}
                          strokeLinecap="round"
                          className="animate-score-fill"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold">{selectedScoring.mismatchScore}</span>
                        <span className="text-xs text-muted-foreground">Mismatch</span>
                      </div>
                    </div>
                    <Badge
                      variant={selectedScoring.riskLabel === 'High' ? 'destructive' : 
                              selectedScoring.riskLabel === 'Medium' ? 'warning' : 'success'}
                      className="mt-4 text-sm px-4 py-1"
                    >
                      {selectedScoring.riskLabel} Risk
                    </Badge>
                  </CardContent>
                </Card>

                {/* Key Metrics */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-accent" />
                      Key Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                        <p className="text-xl font-bold text-foreground">
                          ${selectedResponse.monthlyRevenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-xs text-muted-foreground">Monthly Fees</p>
                        <p className="text-xl font-bold text-foreground">
                          ${selectedResponse.monthlyFees}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Fee Waste</span>
                        <span className="font-medium">{selectedScoring.feeWastePercent.toFixed(2)}% of revenue</span>
                      </div>
                      <Progress 
                        value={Math.min(selectedScoring.feeWastePercent * 10, 100)} 
                        className="h-2"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{selectedResponse.accountType} account</Badge>
                      {selectedResponse.cashDeposits && <Badge variant="outline">Cash deposits</Badge>}
                      {selectedResponse.veteranOwned && <Badge variant="secondary">Veteran</Badge>}
                      {selectedResponse.immigrantFounder && <Badge variant="secondary">Immigrant Founder</Badge>}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs for Details */}
              <Tabs defaultValue="issues" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="issues">Key Issues</TabsTrigger>
                  <TabsTrigger value="banks">Bank Matches</TabsTrigger>
                  <TabsTrigger value="grants">Grants</TabsTrigger>
                </TabsList>
                
                <TabsContent value="issues" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-warning" />
                        Mismatch Reasons
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedScoring.keyReasons.length > 0 ? (
                        <ul className="space-y-3">
                          {selectedScoring.keyReasons.map((reason, index) => (
                            <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                              <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
                              <span className="text-sm">{reason}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-success/10">
                          <CheckCircle className="h-6 w-6 text-success" />
                          <span className="text-success font-medium">No significant mismatches detected!</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="banks" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Recommended Banks
                      </CardTitle>
                      <CardDescription>Banks that better match your business needs</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedScoring.bankMatch1 && (
                        <div className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{selectedScoring.bankMatch1}</h4>
                              <Badge variant="outline" className="text-xs">Top Match</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground pl-13">{selectedScoring.why1}</p>
                        </div>
                      )}
                      {selectedScoring.bankMatch2 && (
                        <div className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-secondary/30 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-secondary-foreground" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{selectedScoring.bankMatch2}</h4>
                              <Badge variant="outline" className="text-xs">Alternative</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground pl-13">{selectedScoring.why2}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="grants" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-accent" />
                        Grant Opportunities
                      </CardTitle>
                      <CardDescription>Funding programs you may qualify for</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedScoring.grantsSuggested.length > 0 ? (
                        selectedScoring.grantsSuggested.map((grant, index) => (
                          <div key={index} className="p-4 rounded-lg border border-border bg-card">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-accent" />
                              </div>
                              <h4 className="font-semibold">{grant.grant}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{grant.why}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground text-center py-4">
                          No specific grants identified. Check general resources below.
                        </p>
                      )}
                      
                      {/* Resource Links */}
                      <div className="pt-4 border-t border-border">
                        <h4 className="font-medium mb-3">Resource Links</h4>
                        <div className="flex flex-wrap gap-3">
                          <a
                            href={selectedScoring.sbaLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
                          >
                            SBA Resources <ExternalLink className="h-4 w-4" />
                          </a>
                          <a
                            href={selectedScoring.ssbciLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors text-sm font-medium"
                          >
                            SSBCI Program <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            /* Empty State */
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground/30" />
                <h3 className="text-xl font-semibold mb-2">Select a Business</h3>
                <p className="text-muted-foreground mb-6">
                  Choose a submission from the list to view its detailed report
                </p>
                {responses.length === 0 && (
                  <Link to="/intake">
                    <Button>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Add First Business
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Overall Risk Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Overall Risk Distribution
            </CardTitle>
            <CardDescription>Summary of all business submissions by risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={RISK_COLORS[entry.name.replace(' Risk', '')]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 grid grid-cols-3 gap-4">
                {chartData.map((entry) => (
                  <div key={entry.name} className="text-center p-4 rounded-lg bg-muted/50">
                    <div 
                      className="w-4 h-4 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: RISK_COLORS[entry.name.replace(' Risk', '')] }}
                    />
                    <p className="text-2xl font-bold">{entry.value}</p>
                    <p className="text-sm text-muted-foreground">{entry.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
