import React, { useState } from 'react';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';

const ComplianceReportButton = ({ organizationId, onExportComplete }) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportComplianceReport = async () => {
    setIsExporting(true);
    
    try {
      // API call to generate and download compliance report
      const response = await fetch(`/api/organization/${organizationId}/compliance-report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to generate compliance report');
      }

      // Create download link for the report
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `compliance-report-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Compliance report exported successfully');
      
      if (onExportComplete) {
        onExportComplete();
      }
    } catch (error) {
      console.error('Error exporting compliance report:', error);
      toast.error('Failed to export compliance report');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <button
      onClick={handleExportComplianceReport}
      disabled={isExporting}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Download className={`w-4 h-4 ${isExporting ? 'animate-pulse' : ''}`} />
      {isExporting ? 'Exporting...' : 'Export Compliance Report'}
    </button>
  );
};

export default ComplianceReportButton;