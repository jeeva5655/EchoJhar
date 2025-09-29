import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Search,
  Filter,
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Award,
  User,
  Phone,
  MessageCircle,
  Share2,
  Bookmark,
  ChevronRight,
  Package,
  Truck,
  Shield,
  Zap,
  Camera,
  Gift,
  Store,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface LocalMarketplaceProps {
  userData?: any;
}

export function LocalMarketplace({ userData }: LocalMarketplaceProps) {
  const [activeTab, setActiveTab] = useState("marketplace");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Mock marketplace data
  const products = [
    {
      id: 1,
      name: "Hand-woven Silk Saree",
      artisan: "Maya Devi",
      price: "₹3,500",
      originalPrice: "₹4,200",
      category: "textiles",
      rating: 4.8,
      reviews: 24,
      image: "https://images.unsplash.com/photo-1717913491408-d316a523efc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBoYW5kaWNyYWZ0cyUyMG1hcmtldHBsYWNlJTIwYXJ0aXNhbnxlbnwxfHx8fDE3NTkwNDkzNTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Beautiful traditional silk saree with intricate handwork",
      location: "Varanasi, UP",
      inStock: true,
      sustainabilityCertified: true,
      rewardPoints: 350,
      artisanStory: "Maya has been weaving silk sarees for over 20 years...",
      shippingTime: "3-5 days",
      features: ["Handwoven", "Pure Silk", "Traditional Design"]
    },
    {
      id: 2,
      name: "Wooden Carved Elephant",
      artisan: "Ramesh Kumar",
      price: "₹850",
      originalPrice: "₹1,200",
      category: "wood",
      rating: 4.6,
      reviews: 18,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b29kZW4lMjBlbGVwaGFudCUyMGhhbmRpY3JhZnR8ZW58MXx8fHwxNzU5MDQ5MzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Intricately carved wooden elephant - symbol of good luck",
      location: "Jaipur, Rajasthan",
      inStock: true,
      sustainabilityCertified: true,
      rewardPoints: 85,
      artisanStory: "Ramesh comes from a family of woodcarvers...",
      shippingTime: "2-4 days",
      features: ["Hand Carved", "Sheesham Wood", "Traditional Craft"]
    },
    {
      id: 3,
      name: "Kashmiri Pashmina Shawl",
      artisan: "Anjali Sharma",
      price: "₹2,800",
      originalPrice: "₹3,500",
      category: "textiles",
      rating: 4.9,
      reviews: 32,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrYXNobWlyaSUyMHBhc2htaW5hJTIwc2hhd2x8ZW58MXx8fHwxNzU5MDQ5MzY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Soft luxurious pashmina shawl with traditional patterns",
      location: "Srinagar, Kashmir",
      inStock: true,
      sustainabilityCertified: false,
      rewardPoints: 280,
      artisanStory: "Anjali specializes in traditional Kashmiri weaving...",
      shippingTime: "4-6 days",
      features: ["Pure Pashmina", "Traditional Weave", "Lightweight"]
    },
    {
      id: 4,
      name: "Blue Pottery Vase",
      artisan: "Suresh Jangid",
      price: "₹650",
      originalPrice: "₹900",
      category: "pottery",
      rating: 4.7,
      reviews: 15,
      image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68153?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwcG90dGVyeSUyMGluZGlhbnxlbnwxfHx8fDE3NTkwNDkzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      description: "Traditional blue pottery vase with floral motifs",
      location: "Jaipur, Rajasthan",
      inStock: false,
      sustainabilityCertified: true,
      rewardPoints: 65,
      artisanStory: "Suresh is a master of the blue pottery tradition...",
      shippingTime: "7-10 days",
      features: ["Hand Painted", "Blue Glaze", "Traditional Design"]
    }
  ];

  const categories = [
    { id: "all", name: "All Items", icon: "🛍️" },
    { id: "textiles", name: "Textiles", icon: "🧵" },
    { id: "wood", name: "Wood Craft", icon: "🪵" },
    { id: "pottery", name: "Pottery", icon: "🏺" },
    { id: "jewelry", name: "Jewelry", icon: "💎" },
    { id: "paintings", name: "Paintings", icon: "🎨" },
    { id: "metalwork", name: "Metal Work", icon: "⚒️" }
  ];

  const artisans = [
    {
      id: 1,
      name: "Maya Devi",
      specialty: "Silk Weaving",
      location: "Varanasi, UP",
      rating: 4.8,
      products: 12,
      yearsExperience: 20,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMGFydGlzYW58ZW58MXx8fHwxNzU5MDQ5MzcyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      story: "Maya learned the art of silk weaving from her grandmother and has been preserving traditional techniques for over two decades.",
      certifications: ["Traditional Craft Master", "Sustainability Certified"]
    },
    {
      id: 2,
      name: "Ramesh Kumar",
      specialty: "Wood Carving",
      location: "Jaipur, Rajasthan",
      rating: 4.6,
      products: 8,
      yearsExperience: 15,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBhcnRpc2FufGVufDF8fHx8MTc1OTA0OTM3NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      story: "Coming from a family of woodcarvers, Ramesh creates beautiful sculptures that tell stories of Indian culture.",
      certifications: ["Heritage Craft Award", "Eco-friendly Materials"]
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.artisan.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🛍️ Local Artisan Marketplace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover authentic handicrafts directly from local artisans and support traditional crafts
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                placeholder="Search products, artisans, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-fit">
            <TabsTrigger value="marketplace" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">Marketplace</span>
            </TabsTrigger>
            <TabsTrigger value="artisans" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Artisans</span>
            </TabsTrigger>
            <TabsTrigger value="cart" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Cart ({cartItems.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="marketplace" className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-700">100%</p>
                <p className="text-sm text-green-600">Authentic</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-sky-50 border-blue-200">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-700">150+</p>
                <p className="text-sm text-blue-600">Local Artisans</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
                <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-700">500+</p>
                <p className="text-sm text-purple-600">Products</p>
              </Card>
              <Card className="p-4 text-center bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
                <Award className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-700">4.8</p>
                <p className="text-sm text-orange-600">Avg Rating</p>
              </Card>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      {product.sustainabilityCertified && (
                        <Badge className="bg-green-600 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Eco-Certified
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-3 right-3 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                        onClick={() => toggleFavorite(product.id.toString())}
                      >
                        <Heart 
                          className={`w-4 h-4 ${
                            favorites.includes(product.id.toString()) 
                              ? 'text-red-500 fill-current' 
                              : 'text-gray-600'
                          }`} 
                        />
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                      >
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="destructive">Out of Stock</Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-600">by {product.artisan}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {product.location}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-600">{product.price}</span>
                        <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{product.rating}</span>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {product.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Zap className="w-4 h-4 text-blue-500" />
                        <span>+{product.rewardPoints} pts</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-4 h-4" />
                        <span>{product.shippingTime}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full" 
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                    >
                      {product.inStock ? (
                        <>
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </>
                      ) : (
                        "Notify When Available"
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="artisans" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {artisans.map((artisan) => (
                <Card key={artisan.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <ImageWithFallback
                      src={artisan.image}
                      alt={artisan.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{artisan.name}</h3>
                        <p className="text-gray-600">{artisan.specialty}</p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {artisan.location}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span>{artisan.rating}</span>
                        </div>
                        <span>{artisan.products} products</span>
                        <span>{artisan.yearsExperience} years exp.</span>
                      </div>

                      <p className="text-gray-600 text-sm">{artisan.story}</p>

                      <div className="flex flex-wrap gap-1">
                        {artisan.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            <Award className="w-3 h-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm">
                          <Store className="w-4 h-4 mr-2" />
                          View Shop
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="cart" className="space-y-6">
            {cartItems.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <Card className="p-6">
                    <h2 className="text-xl font-bold mb-4">Shopping Cart</h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">by {item.artisan}</p>
                            <p className="text-green-600 font-bold">{item.price}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">-</Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button size="sm" variant="outline">+</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                <div className="space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{cartItems.reduce((sum, item) => sum + parseInt(item.price.replace('₹', '').replace(',', '')) * item.quantity, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reward Points</span>
                        <span className="text-green-600">-₹50</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{(cartItems.reduce((sum, item) => sum + parseInt(item.price.replace('₹', '').replace(',', '')) * item.quantity, 0) + 100 - 50).toLocaleString()}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Proceed to Checkout
                    </Button>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="p-12 text-center">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-6">
                  Discover amazing handicrafts from local artisans
                </p>
                <Button onClick={() => setActiveTab("marketplace")}>
                  <Store className="w-4 h-4 mr-2" />
                  Browse Marketplace
                </Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}