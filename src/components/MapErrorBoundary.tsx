import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { MapPin } from "lucide-react";

interface MapErrorBoundaryProps {
  children: React.ReactNode;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

export class MapErrorBoundary extends React.Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  constructor(props: MapErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error: any): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(_error: any, _info: any) {
    // You can log errors to monitoring here
  }

  componentDidMount(): void {
    const handleError = (event: ErrorEvent) => {
      const msg = (event.message || "").toLowerCase();
      if (
        msg.includes("geolocation") ||
        msg.includes("permission") ||
        msg.includes("policy") ||
        msg.includes("removechild") ||
        msg.includes("not a child of this node") ||
        msg.includes("invalidkey")
      ) {
        this.setState({ hasError: true });
        event.preventDefault();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = (event.reason?.message || "").toLowerCase();
      if (
        reason.includes("geolocation") ||
        reason.includes("permission") ||
        reason.includes("policy") ||
        reason.includes("removechild") ||
        reason.includes("invalidkey")
      ) {
        this.setState({ hasError: true });
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Save references to remove in unmount
    (this as any)._handleError = handleError;
    (this as any)._handleUnhandledRejection = handleUnhandledRejection;
  }

  componentWillUnmount(): void {
    if ((this as any)._handleError) {
      window.removeEventListener("error", (this as any)._handleError);
    }
    if ((this as any)._handleUnhandledRejection) {
      window.removeEventListener("unhandledrejection", (this as any)._handleUnhandledRejection);
    }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="p-6 space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <MapPin className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Maps Running in Fallback Mode</strong>
              <p className="text-sm mt-1">
                Location services may be restricted. Maps will use default location data.
              </p>
            </AlertDescription>
          </Alert>
          
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <MapPin className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Service Active</h3>
            <p className="text-gray-600">
              Using default location data for demonstration purposes.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}