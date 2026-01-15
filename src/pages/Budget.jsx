import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  PiggyBank,
  Receipt,
  PieChart,
  BarChart3
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

export default function Budget() {
  const stats = [
    { label: 'Total Budget', value: '$0', icon: '✅', bgColor: 'bg-[#1B4332]/10' },
    { label: 'Total Spent', value: '$0', icon: '🧾', bgColor: 'bg-[#DC2626]/10' },
    { label: 'Budget Utilization', value: '0.0%', icon: '📈', bgColor: 'bg-[#10B981]/10' },
    { label: 'Potential Savings', value: '$0', icon: '💰', bgColor: 'bg-[#52796F]/10', valueColor: 'text-[#10B981]' }
  ];

  // -----------------------------
  // Production wiring (no demo)
  // -----------------------------
  const [periodDays, setPeriodDays] = useState('30');

  const [addBudgetOpen, setAddBudgetOpen] = useState(false);
  const [recordFeeOpen, setRecordFeeOpen] = useState(false);

  const [savingBudget, setSavingBudget] = useState(false);
  const [savingFee, setSavingFee] = useState(false);

  const [budgetForm, setBudgetForm] = useState({
    name: '',
    amount: '',
    startDate: '',
    cadence: 'monthly' // monthly | weekly | yearly (you can keep monthly only if you want)
  });

  const [feeForm, setFeeForm] = useState({
    amount: '',
    date: '',
    category: 'Bank Fees',
    vendor: '',
    note: ''
  });

  const apiBase =
    (typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.VITE_API_BASE_URL) ||
    '';

  const budgetAmountNumber = useMemo(() => {
    const n = Number(String(budgetForm.amount).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }, [budgetForm.amount]);

  const feeAmountNumber = useMemo(() => {
    const n = Number(String(feeForm.amount).replace(/[^0-9.]/g, ''));
    return Number.isFinite(n) ? n : 0;
  }, [feeForm.amount]);

  async function submitBudget(e) {
    e.preventDefault();
    if (savingBudget) return;

    // minimal validation (no UI redesign)
    if (!budgetForm.name.trim()) return;
    if (!budgetAmountNumber || budgetAmountNumber <= 0) return;
    if (!budgetForm.startDate) return;

    try {
      setSavingBudget(true);

      const res = await fetch(`${apiBase}/api/budgets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: budgetForm.name.trim(),
          amount: budgetAmountNumber,
          startDate: budgetForm.startDate,
          cadence: budgetForm.cadence
        })
      });

      if (!res.ok) throw new Error(`Budget create failed (${res.status})`);

      // reset + close (structure unchanged)
      setBudgetForm({ name: '', amount: '', startDate: '', cadence: 'monthly' });
      setAddBudgetOpen(false);

      // OPTIONAL: you can trigger a refresh here if you later wire stats/charts to live data
    } catch (err) {
      // keep design: no new toast system injected here
      console.error(err);
    } finally {
      setSavingBudget(false);
    }
  }

  async function submitFee(e) {
    e.preventDefault();
    if (savingFee) return;

    if (!feeAmountNumber || feeAmountNumber <= 0) return;
    if (!feeForm.date) return;

    try {
      setSavingFee(true);

      const res = await fetch(`${apiBase}/api/fees`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          amount: feeAmountNumber,
          date: feeForm.date,
          category: feeForm.category,
          vendor: feeForm.vendor.trim() || null,
          note: feeForm.note.trim() || null,
          periodDays: Number(periodDays) // if your backend uses it for aggregation; safe to ignore otherwise
        })
      });

      if (!res.ok) throw new Error(`Fee create failed (${res.status})`);

      setFeeForm({ amount: '', date: '', category: 'Bank Fees', vendor: '', note: '' });
      setRecordFeeOpen(false);

      // OPTIONAL: refresh later if you wire stats/charts to live data
    } catch (err) {
      console.error(err);
    } finally {
      setSavingFee(false);
    }
  }

  return (
    <DashboardLayout
      title="Budget Dashboard"
      subtitle="Oli-Branch"
      className="bg-[#F8F5F0]"
    >
      <style>{`
        .hero-gradient {
          background: linear-gradient(135deg, #1B4332 0%, #52796F 100%);
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

        .budget-card {
          transition: all 0.3s ease;
          border: 1px solid rgba(82, 121, 111, 0.1);
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.02) 0%, rgba(82, 121, 111, 0.02) 100%);
        }

        .budget-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(27, 67, 50, 0.15);
          border-color: #52796F;
        }

        .achievement-card {
          border-left: 4px solid #1B4332 !important;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
        }

        .achievement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
          border-color: #52796F !important;
        }

        .stats-card {
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.05) 0%, rgba(82, 121, 111, 0.05) 100%);
          border: 1px solid rgba(82, 121, 111, 0.1);
        }

        .stats-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(27, 67, 50, 0.1);
        }

        .progress-gradient {
          background: linear-gradient(90deg, #1B4332 0%, #52796F 100%);
        }

        .tag-badge {
          background: rgba(27, 67, 50, 0.1) !important;
          color: #1B4332 !important;
          border: 1px solid rgba(27, 67, 50, 0.2) !important;
        }

        .category-badge {
          background: rgba(82, 121, 111, 0.1) !important;
          color: #52796F !important;
          border: 1px solid rgba(82, 121, 111, 0.2) !important;
        }

        .chart-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 12px rgba(27, 67, 50, 0.08);
        }

        .tab-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(82, 121, 111, 0.1);
          transition: all 0.3s ease;
        }

        .tab-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(27, 67, 50, 0.15);
        }

        /* Modal (minimal, no design overhaul) */
        .ob-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          z-index: 50;
        }
        .ob-modal {
          width: 100%;
          max-width: 520px;
          background: #fff;
          border-radius: 14px;
          border: 1px solid rgba(82, 121, 111, 0.15);
          box-shadow: 0 20px 50px rgba(0,0,0,0.18);
          overflow: hidden;
        }
        .ob-modal-header {
          padding: 16px 18px;
          border-bottom: 1px solid rgba(82, 121, 111, 0.12);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(27, 67, 50, 0.04) 0%, rgba(82, 121, 111, 0.04) 100%);
        }
        .ob-modal-body {
          padding: 16px 18px;
        }
        .ob-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
        }
        .ob-label {
          font-size: 12px;
          color: #52796F;
          font-weight: 600;
        }
        .ob-input, .ob-select {
          border: 1px solid rgba(82, 121, 111, 0.25);
          border-radius: 10px;
          padding: 10px 12px;
          outline: none;
          font-size: 14px;
        }
        .ob-input:focus, .ob-select:focus {
          border-color: rgba(27, 67, 50, 0.55);
          box-shadow: 0 0 0 3px rgba(27, 67, 50, 0.12);
        }
        .ob-modal-footer {
          padding: 14px 18px;
          border-top: 1px solid rgba(82, 121, 111, 0.12);
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          background: #fff;
        }

        @media (max-width: 640px) {
          .mobile-stack {
            flex-direction: column !important;
          }

          .mobile-full {
            width: 100% !important;
          }

          .mobile-text-center {
            text-align: center !important;
          }

          .mobile-p-4 {
            padding: 1rem !important;
          }

          .mobile-gap-4 {
            gap: 1rem !important;
          }
        }

        @media (max-width: 768px) {
          .tablet-flex-col {
            flex-direction: column !important;
          }

          .tablet-w-full {
            width: 100% !important;
          }

          .tablet-mb-4 {
            margin-bottom: 1rem !important;
          }
        }
      `}</style>

      <div className="space-y-6">
        {/* Back Button & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/tools" className="text-sm text-[#52796F] hover:text-[#1B4332] flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Tools
          </Link>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full sm:w-auto">
            <Select
              defaultValue="30"
              onValueChange={(v) => setPeriodDays(v)}
            >
              <SelectTrigger className="w-full sm:w-[150px] border-[#52796F]/20">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="60">Last 60 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="btn-primary w-full sm:w-auto"
              onClick={() => setAddBudgetOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Budget
            </Button>

            <Button
              variant="outline"
              className="btn-secondary w-full sm:w-auto"
              onClick={() => setRecordFeeOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" /> Record Fee
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="stats-card">
              <CardContent className="p-4">
                <p className="text-xs text-[#52796F] mb-1">{stat.label}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-2xl font-bold ${stat.valueColor || 'text-[#1B4332]'}`}>
                    {stat.value}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.bgColor}`}>
                    <span className="text-lg">{stat.icon}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-[#F8F5F0] border border-[#52796F]/20">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              Budget Analysis
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              Fee Trends
            </TabsTrigger>
            <TabsTrigger value="categories" className="data-[state=active]:bg-[#1B4332] data-[state=active]:text-white">
              Categories
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Budget vs Spending */}
              <Card className="budget-card">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1B4332]">Budget vs Spending</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#1B4332]/10 flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="h-8 w-8 text-[#1B4332]" />
                    </div>
                    <p className="font-semibold text-[#1B4332]">No Budget Data</p>
                    <p className="text-sm text-[#52796F] mb-4">Create budgets to see spending analysis</p>
                    <Button className="btn-primary" onClick={() => setAddBudgetOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Add Budget
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Distribution */}
              <Card className="budget-card">
                <CardHeader>
                  <CardTitle className="text-lg text-[#1B4332]">Fee Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-[#52796F]/10 flex items-center justify-center mx-auto mb-4">
                      <PieChart className="h-8 w-8 text-[#52796F]" />
                    </div>
                    <p className="font-semibold text-[#1B4332]">No Fee Data</p>
                    <p className="text-sm text-[#52796F] mb-4">Record fees to see distribution analysis</p>
                    <Button variant="outline" className="btn-secondary" onClick={() => setRecordFeeOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Record Fee
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <Card className="achievement-card">
              <CardContent className="py-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-[#52796F]/30" />
                <p className="text-[#52796F]">Add budgets to see detailed analysis</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-6">
            <Card className="achievement-card">
              <CardContent className="py-12 text-center">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-[#52796F]/30" />
                <p className="text-[#52796F]">Record fees to see trend analysis</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <Card className="achievement-card">
              <CardContent className="py-12 text-center">
                <PiggyBank className="h-12 w-12 mx-auto mb-4 text-[#52796F]/30" />
                <p className="text-[#52796F]">Categorize your expenses to see breakdown</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* -----------------------------
          Add Budget Modal (structure preserved)
         ----------------------------- */}
      {addBudgetOpen && (
        <div
          className="ob-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setAddBudgetOpen(false);
          }}
        >
          <div className="ob-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ob-modal-header">
              <div>
                <p className="text-sm font-bold text-[#1B4332]">Add Budget</p>
                <p className="text-xs text-[#52796F]">Create a budget to track spending</p>
              </div>
              <Button
                variant="outline"
                className="btn-secondary"
                onClick={() => setAddBudgetOpen(false)}
                type="button"
              >
                Close
              </Button>
            </div>

            <form onSubmit={submitBudget}>
              <div className="ob-modal-body">
                <div className="ob-field">
                  <label className="ob-label">Budget Name</label>
                  <input
                    className="ob-input"
                    value={budgetForm.name}
                    onChange={(e) => setBudgetForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., Monthly Banking Fees"
                    autoComplete="off"
                  />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Amount</label>
                  <input
                    className="ob-input"
                    value={budgetForm.amount}
                    onChange={(e) => setBudgetForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="e.g., 300"
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Start Date</label>
                  <input
                    className="ob-input"
                    type="date"
                    value={budgetForm.startDate}
                    onChange={(e) => setBudgetForm((p) => ({ ...p, startDate: e.target.value }))}
                  />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Cadence</label>
                  <select
                    className="ob-select"
                    value={budgetForm.cadence}
                    onChange={(e) => setBudgetForm((p) => ({ ...p, cadence: e.target.value }))}
                  >
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="ob-modal-footer">
                <Button
                  variant="outline"
                  className="btn-secondary"
                  type="button"
                  onClick={() => setAddBudgetOpen(false)}
                  disabled={savingBudget}
                >
                  Cancel
                </Button>
                <Button className="btn-primary" type="submit" disabled={savingBudget}>
                  {savingBudget ? 'Saving...' : 'Save Budget'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -----------------------------
          Record Fee Modal (structure preserved)
         ----------------------------- */}
      {recordFeeOpen && (
        <div
          className="ob-modal-backdrop"
          role="dialog"
          aria-modal="true"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setRecordFeeOpen(false);
          }}
        >
          <div className="ob-modal" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ob-modal-header">
              <div>
                <p className="text-sm font-bold text-[#1B4332]">Record Fee</p>
                <p className="text-xs text-[#52796F]">Log a fee so your dashboard can track it</p>
              </div>
              <Button
                variant="outline"
                className="btn-secondary"
                onClick={() => setRecordFeeOpen(false)}
                type="button"
              >
                Close
              </Button>
            </div>

            <form onSubmit={submitFee}>
              <div className="ob-modal-body">
                <div className="ob-field">
                  <label className="ob-label">Amount</label>
                  <input
                    className="ob-input"
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm((p) => ({ ...p, amount: e.target.value }))}
                    placeholder="e.g., 25.00"
                    inputMode="decimal"
                    autoComplete="off"
                  />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Date</label>
                  <input
                    className="ob-input"
                    type="date"
                    value={feeForm.date}
                    onChange={(e) => setFeeForm((p) => ({ ...p, date: e.target.value }))}
                  />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Category</label>
                  <select
                    className="ob-select"
                    value={feeForm.category}
                    onChange={(e) => setFeeForm((p) => ({ ...p, category: e.target.value }))}
                  >
                    <option value="Bank Fees">Bank Fees</option>
                    <option value="Wire/ACH">Wire/ACH</option>
                    <option value="Card Processing">Card Processing</option>
                    <option value="Overdraft">Overdraft</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="ob-field">
                  <label className="ob-label">Vendor / Bank (optional)</label>
                  <input
                    className="ob-input"
                    value={feeForm.vendor}
                    onChange={(e) => setFeeForm((p) => ({ ...p, vendor: e.target.value }))}
                    placeholder="e.g., Chase"
                    autoComplete="off"
                  />
                </div>

                <div className="ob-field">
                  <label className="ob-label">Note (optional)</label>
                  <input
                    className="ob-input"
                    value={feeForm.note}
                    onChange={(e) => setFeeForm((p) => ({ ...p, note: e.target.value }))}
                    placeholder="e.g., monthly account fee"
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="ob-modal-footer">
                <Button
                  variant="outline"
                  className="btn-secondary"
                  type="button"
                  onClick={() => setRecordFeeOpen(false)}
                  disabled={savingFee}
                >
                  Cancel
                </Button>
                <Button className="btn-primary" type="submit" disabled={savingFee}>
                  {savingFee ? 'Saving...' : 'Save Fee'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}