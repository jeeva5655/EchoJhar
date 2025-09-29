import { Wifi, Smartphone, Shield, Ticket, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export function ManageResources() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Your Travel Resources</h1>
        <p className="text-gray-600">Your one-stop dashboard for connectivity, devices, and tickets.</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Connectivity & Access</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Wifi className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Wi-Fi Connectivity</CardTitle>
                <CardDescription>
                  Connect to secure Wi-Fi hotspots at partner locations.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Connect Now
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center space-y-0 pb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Mobile App & Web</CardTitle>
                <CardDescription>
                  Access TravelSafe via our mobile app or web interface.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="text-blue-600 border-blue-600">
                Open Platform
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Ticketing System</h2>
        <div className="grid gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>IoT Device Rental</CardTitle>
                  <CardDescription>
                    Rent devices for enhanced safety and convenience.
                  </CardDescription>
                </div>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Rent a Device
              </Button>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Digital Tickets</CardTitle>
                  <CardDescription>
                    View digital tickets and link them to your IoT devices.
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" className="text-blue-600 border-blue-600">
                View Tickets
              </Button>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Basic/No-Security Tickets</CardTitle>
                  <CardDescription>
                    Understand the features and limitations of these tickets.
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" className="text-blue-600 border-blue-600">
                Learn More
              </Button>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}