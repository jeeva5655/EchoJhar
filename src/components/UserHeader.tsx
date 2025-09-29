import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, Shield, User, Clock } from "lucide-react";
import echoJharLogo from "../assets/0ac3abd4e99f5c9deeebeb2d55a584babb02036d.png";
import { ThemeToggle } from "./theme/ThemeToggle";

interface UserHeaderProps {
  userType: 'tourist' | 'admin' | 'business';
  userData: any;
  onLogout: () => void;
}

export function UserHeader({ userType, userData, onLogout }: UserHeaderProps) {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="bg-card text-card-foreground border-b border-border px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-3">
            <img 
              src={echoJharLogo}
              alt="EchoJhar"
              className="h-8 w-auto"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userType === 'admin' ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150" : "https://images.unsplash.com/photo-1494790108755-2616c7e7e9de?w=150"} />
              <AvatarFallback>
                {userData?.name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="font-semibold text-gray-900">{userData?.name || 'User'}</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="flex items-center space-x-1">
                  {userType === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                  <span>{userType === 'admin' ? `Badge: ${userData?.id}` : userType === 'business' ? `Reg: ${userData?.registrationId || userData?.id}` : `Tourist ID: ${userData?.id}`}</span>
                </span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{currentTime}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Badge variant={userType === 'admin' ? 'destructive' : 'default'}>
            {userType === 'admin' ? '🛡️ Administrator' : userType === 'business' ? '🏪 Business' : '🌟 Tourist'}
          </Badge>
          
          {userType === 'admin' && (
            <div className="text-right text-xs text-gray-600">
              <div>{userData?.department}</div>
              <div>Clearance: {userData?.clearanceLevel}</div>
            </div>
          )}

          {userType === 'tourist' && userData?.digitalIdVerified && (
            <div className="text-right text-xs text-gray-600">
              <div className="text-green-600">✅ ID Verified</div>
              <div>{userData?.nationality}</div>
            </div>
          )}
          {userType === 'business' && (
            <div className="text-right text-xs text-gray-600">
              <div className="text-green-600">✅ Vendor Verified</div>
              <div>{userData?.sector || 'Tourism'}</div>
            </div>
          )}

          <Button 
            variant="outline" 
            size="sm"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}