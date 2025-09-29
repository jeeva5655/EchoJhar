import { Alert, AlertDescription } from "./ui/alert";
import { Info, MapPin } from "lucide-react";

interface DemoModeAlertProps {
  show: boolean;
  message?: string;
}

export function DemoModeAlert({ show, message }: DemoModeAlertProps) {
  if (!show) return null;

  return (
    <Alert className="border-blue-200 bg-blue-50 mb-4">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            <strong>Demo Mode Active</strong>
            <p className="text-sm mt-1">
              {message || "Using simulated location data for demonstration purposes. All features remain fully functional."}
            </p>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}