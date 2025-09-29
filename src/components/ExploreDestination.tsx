import { Search, AlertTriangle, Cloud, Users, MapPin, Star, Building, Trees, Image, Home, Car, CheckCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function ExploreDestination() {
  return (
    <div className="bg-gray-900 text-white min-h-screen p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Explore Your Destination</h1>
        
        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <Input 
            placeholder="Search for a destination, e.g., 'Paris, France'"
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
          />
        </div>

        {/* Destination Insights */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Destination Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="w-full h-24 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                  <AlertTriangle className="w-12 h-12 text-gray-600" />
                </div>
                <h3 className="font-semibold mb-2 text-white">Safety Advisories</h3>
                <p className="text-sm text-gray-300">
                  Stay informed about potential risks and safety measures in your chosen destination.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="w-full h-24 bg-teal-700 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0">
                    <ImageWithFallback 
                      src="https://images.unsplash.com/photo-1719836647668-97896c5f32c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWF0aGVyJTIwc3VubnklMjBjbG91ZHN8ZW58MXx8fHwxNzU3MDgwNjU2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt="Weather"
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  <Cloud className="w-8 h-8 text-yellow-400 relative z-10" />
                  <div className="w-8 h-8 bg-yellow-400 rounded-full relative z-10 ml-2"></div>
                </div>
                <h3 className="font-semibold mb-2 text-white">Weather Forecast</h3>
                <p className="text-sm text-gray-300">
                  Get real-time weather updates and forecasts for your travel dates.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="w-full h-24 bg-pink-100 rounded-lg mb-4 flex items-center justify-center">
                  <div className="flex space-x-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-white" />
                    </div>
                    <div className="w-6 h-6 bg-teal-400 rounded-full"></div>
                  </div>
                </div>
                <h3 className="font-semibold mb-2 text-white">Cultural Tips</h3>
                <p className="text-sm text-gray-300">
                  Learn about local customs, etiquette, and cultural norms to enhance your experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Nearby Attractions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6">Nearby Attractions</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="h-32 bg-gray-600 relative">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1659733418362-f65227d49bb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx8ZW58MXx8fHwxNzU3MDMxMDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Historical Museum"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-white">Historical Museum</h3>
                <p className="text-sm text-gray-300">
                  Explore ancient artifacts and historical exhibits.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="h-32 bg-gray-600 relative">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1683227368115-943882d53711?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwcGFyayUyMGdyZWVuJTIwdHJlZXN8ZW58MXx8fHwxNzU3MDgwNjQ3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="City Park"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-white">City Park</h3>
                <p className="text-sm text-gray-300">
                  Relax in the lush greenery and enjoy outdoor activities.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700 overflow-hidden">
              <div className="h-32 bg-gray-600 relative">
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1574367157590-3454fe866961?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU3MDgwNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Art Gallery"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2 text-white">Art Gallery</h3>
                <p className="text-sm text-gray-300">
                  Discover contemporary and classic art collections.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Ratings & Reviews */}
        <div>
          <h2 className="text-xl font-semibold mb-6">Ratings & Reviews</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-white">Places</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Read reviews and ratings for various locations and attractions.
                  </p>
                </div>
                <div className="w-20 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                  <ImageWithFallback 
                    src="https://images.unsplash.com/photo-1653124813258-47c797eca08a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFkaXRpb25hbCUyMGhvdXNlJTIwdHJhdmVsfGVufDF8fHx8MTc1NzA4MDY2MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Places"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2 text-white">Hotels</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    Check out ratings and reviews for hotels and accommodations.
                  </p>
                </div>
                <div className="w-20 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
                  <Building className="w-8 h-8 text-teal-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className="flex-1">
                <h3 className="font-semibold mb-2 text-white">Services</h3>
                <p className="text-sm text-gray-300">
                  Find reviews and ratings for local services like transportation and tours.
                </p>
              </div>
              <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}