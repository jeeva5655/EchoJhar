// Simple utility functions to avoid complex template literals

export const getStatusCardClass = (isSelected: boolean) => {
  return isSelected 
    ? "p-3 border border-blue-300 bg-blue-50 rounded-lg cursor-pointer transition-colors"
    : "p-3 border border-gray-200 rounded-lg cursor-pointer transition-colors hover:bg-gray-50";
};

export const getBatteryClass = (battery: number) => {
  return battery < 30 
    ? "text-center p-2 rounded bg-red-50"
    : "text-center p-2 rounded bg-gray-50";
};

export const getBatteryTextClass = (battery: number) => {
  return battery < 30 
    ? "font-medium flex items-center justify-center text-red-600"
    : "font-medium flex items-center justify-center";
};

export const getMemberCardClass = (status: string) => {
  return status === 'offline' 
    ? "p-4 border rounded-lg border-red-200 bg-red-50"
    : "p-4 border rounded-lg border-gray-200";
};

export const getStatusIndicatorClass = (status: string) => {
  return status === 'online' 
    ? "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-green-500"
    : "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-red-500";
};