import { Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
          </div>
          <span className="text-xl font-semibold text-gray-900">TravelSafe</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-gray-900 hover:text-blue-600">Home</a>
          <a href="#" className="text-gray-900 hover:text-blue-600">Destinations</a>
          <a href="#" className="text-gray-900 hover:text-blue-600">Safety Tips</a>
          <a href="#" className="text-gray-900 hover:text-blue-600">Community</a>
          <a href="#" className="text-gray-900 hover:text-blue-600">Dashboard</a>
          <a href="#" className="text-gray-900 hover:text-blue-600">Safety Alerts</a>
          <a href="#" className="text-gray-900 hover:text-blue-600">My Trips</a>
          <a href="#" className="text-gray-900 hover:text-blue-600">Support</a>
        </nav>

        <div className="flex items-center space-x-4">
          <Bell className="w-5 h-5 text-gray-600" />
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c7e7e9de?w=150" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}