import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Badge } from "./ui/badge";
import { Phone, AlertTriangle, Heart, MapPin, Clock, User, FileText, Wifi, Battery } from "lucide-react";

export function EmergencyServices() {
  const [emergencyActive, setEmergencyActive] = useState(false);

  const emergencyContacts = [
    { name: "Emergency Services", number: "112", type: "primary", description: "Police, Fire, Medical" },
    { name: "Tourist Helpline", number: "1363", type: "tourist", description: "24/7 Tourist Support" },
    { name: "Medical Emergency", number: "108", type: "medical", description: "Ambulance Services" },
    { name: "Police Control Room", number: "100", type: "police", description: "Local Police" },
    { name: "Fire Department", number: "101", type: "fire", description: "Fire Emergency" },
    { name: "Women Helpline", number: "1091", type: "support", description: "Women Safety" }
  ];

  const personalContacts = [
    { name: "Ethan Miller (Father)", number: "+1-555-123-4567", relation: "Emergency Contact 1" },
    { name: "Olivia Carter (Mother)", number: "+1-555-987-6543", relation: "Emergency Contact 2" },
    { name: "Hotel Reception", number: "+91-141-555-0123", relation: "Accommodation" },
    { name: "Tour Guide - Raj", number: "+91-98765-43210", relation: "Local Guide" }
  ];

  const medicalInfo = {
    bloodType: "O+",
    allergies: "None known",
    medications: "None",
    conditions: "None",
    emergencyNotes: "No special medical requirements"
  };

  const backupSolutions = [
    { type: "IoT Smart Band", status: "Connected", battery: "78%", signal: "Strong" },
    { type: "Emergency Card (NFC)", status: "Active", info: "QR code ready", location: "Wallet" },
    { type: "Backup Phone", status: "Standby", battery: "45%", signal: "Available" }
  ];

  const handleEmergencyActivation = () => {
    setEmergencyActive(true);
    // Simulate emergency protocols
    alert("🚨 EMERGENCY ACTIVATED\n\n✓ Location broadcast started\n✓ Emergency contacts notified\n✓ Medical info displayed\n✓ Backup systems activated");
  };

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Emergency Services</h1>
        <p className="text-gray-600">Quick access to emergency contacts and backup communication systems.</p>
      </div>

      {emergencyActive && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            🚨 EMERGENCY MODE ACTIVE - All backup systems are broadcasting your location and medical information.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4 text-red-600 border-red-600"
              onClick={() => setEmergencyActive(false)}
            >
              Deactivate Emergency
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-red-600" />
              <span>Emergency Hotlines</span>
            </CardTitle>
            <CardDescription>
              Local emergency services and support numbers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{contact.name}</h4>
                    <Badge variant={contact.type === 'primary' ? 'default' : 'secondary'} className="text-xs">
                      {contact.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="ml-4 text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Phone className="w-4 h-4 mr-1" />
                  {contact.number}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Personal Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Contacts</span>
            </CardTitle>
            <CardDescription>
              Your emergency contacts and local support
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {personalContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <h4 className="font-semibold">{contact.name}</h4>
                  <p className="text-sm text-gray-600">{contact.relation}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-4">
                  <Phone className="w-4 h-4 mr-1" />
                  Call
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Medical Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <span>Medical Information</span>
            </CardTitle>
            <CardDescription>
              Critical medical info for emergency responders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Blood Type</span>
                <p className="font-semibold text-red-600">{medicalInfo.bloodType}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Allergies</span>
                <p className="font-semibold">{medicalInfo.allergies}</p>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Emergency Medical Notes</h4>
              <p className="text-sm text-blue-700">{medicalInfo.emergencyNotes}</p>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-1">Current Medications</h4>
              <p className="text-sm text-green-700">{medicalInfo.medications}</p>
            </div>

            <Button variant="outline" className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Update Medical Info
            </Button>
          </CardContent>
        </Card>

        {/* Backup Communication */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="w-5 h-5 text-green-600" />
              <span>Backup Communication</span>
            </CardTitle>
            <CardDescription>
              Alternative communication methods when phone is lost/offline
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {backupSolutions.map((backup, index) => (
              <div key={index} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{backup.type}</h4>
                  <Badge variant={backup.status === 'Connected' ? 'default' : 'secondary'}>
                    {backup.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-600">Info: {backup.battery || backup.info}</span>
                  <span className="text-gray-600">Signal: {backup.signal || backup.location}</span>
                </div>
              </div>
            ))}

            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">Offline Emergency Features</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• QR code with medical info (scannable by bystanders)</li>
                <li>• NFC emergency card (tap to phone for details)</li>
                <li>• IoT device broadcasts location via mesh network</li>
                <li>• Automatic emergency contact notification</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Activation */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="w-5 h-5" />
            <span>Emergency Activation</span>
          </CardTitle>
          <CardDescription className="text-red-700">
            Activate all emergency protocols and backup communication systems
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4"
            onClick={handleEmergencyActivation}
          >
            <AlertTriangle className="w-5 h-5 mr-2" />
            ACTIVATE EMERGENCY PROTOCOLS
          </Button>
          <p className="text-sm text-red-600 mt-4">
            This will activate all backup systems, notify emergency contacts, and broadcast your location and medical information.
          </p>
        </CardContent>
      </Card>

      {/* Current Location & Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            <span>Current Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Location</span>
              </div>
              <p className="text-sm">Heritage Museum, Jaipur</p>
              <p className="text-xs text-gray-600">Coordinates: 26.9124, 75.7873</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-semibold">Last Update</span>
              </div>
              <p className="text-sm">2 minutes ago</p>
              <p className="text-xs text-gray-600">Auto-tracking active</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Battery className="w-4 h-4 text-orange-600" />
                <span className="font-semibold">Device Status</span>
              </div>
              <p className="text-sm">Phone: 78% | Watch: 45%</p>
              <p className="text-xs text-gray-600">All systems operational</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}