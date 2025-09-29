import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function ConnectivityPage() {
  const [selectedNetwork, setSelectedNetwork] = useState("travelsafe-guest");
  const [accessLevel, setAccessLevel] = useState("full-access");
  const [selectedDevice, setSelectedDevice] = useState("smart-bracelet");
  const [selectedTicket, setSelectedTicket] = useState("flight-bz-123");
  const [ticketLink, setTicketLink] = useState("");
  const [ticketType, setTicketType] = useState("basic");

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Connectivity</h1>
        <p className="text-gray-600">Manage your connections and device settings.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Wi-Fi Options */}
        <Card>
          <CardHeader>
            <CardTitle>Wi-Fi Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Select Network
              </label>
              <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="travelsafe-guest">TravelSafe Guest Wi-Fi</SelectItem>
                  <SelectItem value="travelsafe-premium">TravelSafe Premium Wi-Fi</SelectItem>
                  <SelectItem value="airport-free">Airport Free Wi-Fi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Connect
            </Button>
          </CardContent>
        </Card>

        {/* Platform Access */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Access Level
              </label>
              <Select value={accessLevel} onValueChange={setAccessLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select access level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-access">Full Access (Mobile & Web)</SelectItem>
                  <SelectItem value="mobile-only">Mobile Only</SelectItem>
                  <SelectItem value="web-only">Web Only</SelectItem>
                  <SelectItem value="limited">Limited Access</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <p className="text-sm text-gray-600">
              Manage your access permissions across different platforms.
            </p>
          </CardContent>
        </Card>

        {/* IoT Device Rental */}
        <Card>
          <CardHeader>
            <CardTitle>IoT Device Rental</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Rent a Device
              </label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a device" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="smart-bracelet">Smart Bracelet</SelectItem>
                  <SelectItem value="safety-beacon">Safety Beacon</SelectItem>
                  <SelectItem value="travel-tracker">Travel Tracker</SelectItem>
                  <SelectItem value="emergency-device">Emergency Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              Confirm Rental
            </Button>
          </CardContent>
        </Card>

        {/* Ticketing System */}
        <Card>
          <CardHeader>
            <CardTitle>Ticketing System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                My Digital Tickets
              </label>
              <Select value={selectedTicket} onValueChange={setSelectedTicket}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a ticket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flight-bz-123">Flight BZ-123 - Boarding Pass</SelectItem>
                  <SelectItem value="train-456">Train Ticket #456</SelectItem>
                  <SelectItem value="hotel-789">Hotel Booking #789</SelectItem>
                  <SelectItem value="tour-abc">City Tour - ABC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Link Ticket to IoT Device
              </label>
              <Select value={ticketLink} onValueChange={setTicketLink}>
                <SelectTrigger>
                  <SelectValue placeholder="Link Flight BZ-123 to Smart Bracelet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bracelet-link">Link Flight BZ-123 to Smart Bracelet</SelectItem>
                  <SelectItem value="beacon-link">Link to Safety Beacon</SelectItem>
                  <SelectItem value="tracker-link">Link to Travel Tracker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ticket Type
              </label>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (No Security)</SelectItem>
                  <SelectItem value="standard">Standard Security</SelectItem>
                  <SelectItem value="premium">Premium Security</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}