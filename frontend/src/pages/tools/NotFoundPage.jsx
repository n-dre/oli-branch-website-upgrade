import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5F0] to-[#E8E5E0] flex items-center justify-center p-4">
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
      `}</style>
      
      <div className="max-w-md w-full text-center">
        <div className="hero-gradient rounded-3xl p-8 text-white shadow-2xl mb-8">
          <div className="text-9xl font-bold mb-4 opacity-90">404</div>
          <AlertTriangle className="w-24 h-24 mx-auto mb-6 text-white/80" />
          <h1 className="text-3xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-white/90 text-lg">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <p className="text-gray-600 mb-8">
            Don't worry, let's get you back on track. Here are some options:
          </p>
          
          <div className="space-y-4">
            <Link to="/">
              <Button className="w-full btn-primary py-6 text-lg font-semibold">
                <Home className="w-6 h-6 mr-3" />
                Go Home
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              className="w-full py-6 text-lg font-semibold border-2 border-[#1B4332] text-[#1B4332] hover:bg-[#1B4332] hover:text-white transition-all"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Go Back
            </Button>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">Need help? Try these links:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/dashboard" className="text-[#1B4332] hover:text-[#52796F] font-medium">
                Dashboard
              </Link>
              <Link to="/learning" className="text-[#1B4332] hover:text-[#52796F] font-medium">
                Learning Center
              </Link>
              <Link to="/financial-health" className="text-[#1B4332] hover:text-[#52796F] font-medium">
                Financial Health
              </Link>
              <Link to="/audits" className="text-[#1B4332] hover:text-[#52796F] font-medium">
                Audits
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-sm text-gray-500">
          <p>Still having trouble? <Link to="/contact" className="text-[#1B4332] font-medium hover:underline">Contact support</Link></p>
        </div>
      </div>
    </div>
  );
}
