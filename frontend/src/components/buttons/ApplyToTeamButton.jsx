import React, { useState } from 'react';
import { Users, CheckCircle, AlertCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const ApplyToTeamButton = ({ 
  organizationId, 
  settings, 
  onApplyComplete,
  teamCount = 0 
}) => {
  const [isApplying, setIsApplying] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleApplyToTeam = async () => {
    if (!settings || Object.keys(settings).length === 0) {
      toast.error('No settings to apply');
      return;
    }

    setIsApplying(true);
    
    try {
      // API call to apply settings to all team members
      const response = await fetch(`/api/organization/${organizationId}/apply-settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings,
          applyToAll: true,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to apply settings to team');
      }

      toast.success(`Settings applied to ${data.affectedUsers || teamCount} team members`);
      setShowConfirmation(true);
      
      // Hide confirmation after 3 seconds
      setTimeout(() => {
        setShowConfirmation(false);
      }, 3000);

      if (onApplyComplete) {
        onApplyComplete(data);
      }
    } catch (error) {
      console.error('Error applying settings to team:', error);
      toast.error(error.message || 'Failed to apply settings to team');
    } finally {
      setIsApplying(false);
    }
  };

  const handleConfirmApply = () => {
    setShowConfirmation(false);
    handleApplyToTeam();
  };

  // Show success confirmation state
  if (showConfirmation) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
        <CheckCircle className="w-4 h-4" />
        <span>Settings applied successfully!</span>
      </div>
    );
  }

  // Show confirmation dialog before applying
  if (isApplying) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg opacity-50 cursor-not-allowed"
      >
        <Users className="w-4 h-4 animate-pulse" />
        Applying to {teamCount} team members...
      </button>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => {
          // Show confirmation for teams with members
          if (teamCount > 0) {
            setShowConfirmation(true);
          } else {
            handleApplyToTeam();
          }
        }}
        disabled={!settings || Object.keys(settings).length === 0}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Users className="w-4 h-4" />
        Apply to Team
        {teamCount > 0 && (
          <span className="ml-1 px-1.5 py-0.5 text-xs bg-white/20 rounded">
            {teamCount}
          </span>
        )}
      </button>
      
      {showConfirmation && teamCount > 0 && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-10">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <span className="font-semibold text-gray-900">Confirm Update</span>
            </div>
            <button
              onClick={() => setShowConfirmation(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            This will apply settings to all {teamCount} team members. This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setShowConfirmation(false)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmApply}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
      
      {(!settings || Object.keys(settings).length === 0) && (
        <div className="absolute -bottom-6 left-0 text-xs text-gray-500">
          No settings configured
        </div>
      )}
    </div>
  );
};

export default ApplyToTeamButton;