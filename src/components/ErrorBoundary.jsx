import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In production, you could send this to an error reporting service
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error("Error caught by boundary:", error, errorInfo);
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#E6F0FF] flex items-center justify-center p-4">
          {/* Background decoration */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FF3B30]/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-3xl" />
          </div>

          <div className="relative text-center max-w-md mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0066FF]/20">
                <GymGraphLogo className="w-9 h-9" />
              </div>
            </div>

            {/* Error Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E5E7EB]/50 p-8">
              {/* Error Icon */}
              <div className="w-16 h-16 bg-[#FFEBEB] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-[#FF3B30]" />
              </div>

              {/* Error Message */}
              <h1 className="text-2xl font-bold text-[#111111] mb-2">
                Something went wrong
              </h1>
              <p className="text-[#555555] mb-6">
                We encountered an unexpected error. Please try refreshing the page or return to the home screen.
              </p>

              {/* Error Details (dev only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 p-4 bg-[#F8F9FA] rounded-xl text-left overflow-auto max-h-32">
                  <p className="text-xs font-mono text-[#FF3B30] break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRefresh}
                  className="flex-1 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl h-12 font-semibold shadow-lg shadow-[#0066FF]/20"
                >
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Refresh Page
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1 border-[#E5E7EB] text-[#555555] hover:text-[#0066FF] hover:border-[#0066FF] hover:bg-[#E6F0FF] rounded-xl h-12 font-semibold"
                >
                  <Home className="w-5 h-5 mr-2" />
                  Go Home
                </Button>
              </div>
            </div>

            {/* Footer */}
            <p className="text-[#888888] text-sm mt-6">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
