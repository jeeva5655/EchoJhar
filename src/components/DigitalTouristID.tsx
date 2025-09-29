import { Shield, User, Phone, MapPin, Calendar, Building, Ticket } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function DigitalTouristID() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Digital Tourist ID</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Your secure, blockchain-based identity for a seamless travel experience.
        </p>
      </div>

      {/* Main ID Card */}
      <Card className="mb-12 max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-orange-300 rounded-full flex items-center justify-center mx-auto">
              <Avatar className="w-20 h-20">
                <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c7e7e9de?w=150" />
                <AvatarFallback>SC</AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <Shield className="w-3 h-3 mr-1" />
              Verified
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-8">Sophia Clark</h2>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* KYC Details */}
        <Card>
          <CardHeader>
            <CardTitle>KYC Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Full Name</span>
              <p className="font-medium">Sophia Clark</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Nationality</span>
              <p className="font-medium">American</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Passport Number</span>
              <p className="font-medium">AB1234567</p>
            </div>
          </CardContent>
        </Card>

        {/* Itinerary */}
        <Card>
          <CardHeader>
            <CardTitle>Itinerary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Hotel</span>
              <p className="font-medium">The Grand Hotel</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Tour</span>
              <p className="font-medium">City Exploration Tour</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Events</span>
              <p className="font-medium">Music Festival</p>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="text-sm text-gray-600">Contact 1</span>
              <p className="font-medium">Ethan Carter (Father)</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">Contact 2</span>
              <p className="font-medium">Olivia Carter (Mother)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contactless Check-In Button */}
      <div className="text-center">
        <Button 
          size="lg" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
        >
          <Shield className="w-5 h-5 mr-2" />
          Contactless Check-In / Access
        </Button>
      </div>
    </div>
  );
}