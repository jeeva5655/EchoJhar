import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { Plus, Trash2, Tag, Percent } from "lucide-react";

type Item = {
  id: string;
  name: string;
  price: number;
  stock?: number;
  description?: string;
  offerPct?: number;
};

export default function BusinessProducts() {
  const [products, setProducts] = useState<Item[]>(() => {
    const saved = localStorage.getItem('business_products');
    return saved ? JSON.parse(saved) : [
      { id: "PR-1001", name: "Dokra Brass Figurine", price: 1499, stock: 12, description: "Handcrafted tribal art", offerPct: 10 },
      { id: "PR-1002", name: "Sohrai Wall Art", price: 2199, stock: 5, description: "Traditional painting", offerPct: 0 },
    ];
  });
  const [services, setServices] = useState<Item[]>(() => {
    const saved = localStorage.getItem('business_services');
    return saved ? JSON.parse(saved) : [
      { id: "SV-2001", name: "Taxi Ride (City)", price: 499, description: "Per trip within city" },
      { id: "SV-2002", name: "Guided Tour (Half-day)", price: 1299, description: "Local attractions tour" },
    ];
  });

  useEffect(() => {
    localStorage.setItem('business_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('business_services', JSON.stringify(services));
  }, [services]);

  function addItem(kind: "product" | "service") {
    const list = kind === "product" ? products : services;
    const idPrefix = kind === "product" ? "PR" : "SV";
    const next = { id: `${idPrefix}-${Math.floor(Math.random()*9000+1000)}`, name: "", price: 0, stock: kind === "product" ? 0 : undefined } as Item;
    if (kind === "product") setProducts([next, ...list]); else setServices([next, ...list]);
  }

  function updateItem(kind: "product" | "service", idx: number, patch: Partial<Item>) {
    if (kind === "product") setProducts(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
    else setServices(prev => prev.map((p, i) => i === idx ? { ...p, ...patch } : p));
  }

  function removeItem(kind: "product" | "service", idx: number) {
    if (kind === "product") setProducts(prev => prev.filter((_, i) => i !== idx));
    else setServices(prev => prev.filter((_, i) => i !== idx));
  }

  const totalSkus = useMemo(() => products.length + services.length, [products, services]);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products & Services</h1>
          <p className="text-gray-600">Upload and manage items, inventory, and offers</p>
        </div>
        <Badge variant="secondary">Total SKUs: {totalSkus}</Badge>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="products">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Handicrafts & Goods</CardTitle>
                <CardDescription>Dokra, Sohrai, Bamboo crafts, etc.</CardDescription>
              </div>
              <Button onClick={() => addItem("product")}><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {products.map((p, idx) => (
                <div key={p.id} className="grid md:grid-cols-12 gap-3 p-3 border rounded-lg">
                  <div className="md:col-span-3">
                    <Label>Name</Label>
                    <Input value={p.name} onChange={e => updateItem("product", idx, { name: e.target.value })} placeholder="e.g. Dokra figurine" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" value={p.price} onChange={e => updateItem("product", idx, { price: Number(e.target.value) })} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Stock</Label>
                    <Input type="number" value={p.stock ?? 0} onChange={e => updateItem("product", idx, { stock: Number(e.target.value) })} />
                  </div>
                  <div className="md:col-span-3">
                    <Label>Description</Label>
                    <Input value={p.description ?? ''} onChange={e => updateItem("product", idx, { description: e.target.value })} placeholder="short details" />
                  </div>
                  <div className="md:col-span-1">
                    <Label className="flex items-center gap-1"><Percent className="w-3 h-3" /> Offer</Label>
                    <Input type="number" value={p.offerPct ?? 0} onChange={e => updateItem("product", idx, { offerPct: Number(e.target.value) })} />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button variant="outline" className="w-full" onClick={() => removeItem("product", idx)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Services</CardTitle>
                <CardDescription>Rooms, taxi, tour packages</CardDescription>
              </div>
              <Button onClick={() => addItem("service")}><Plus className="w-4 h-4 mr-2" /> Add Service</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((s, idx) => (
                <div key={s.id} className="grid md:grid-cols-12 gap-3 p-3 border rounded-lg">
                  <div className="md:col-span-4">
                    <Label>Name</Label>
                    <Input value={s.name} onChange={e => updateItem("service", idx, { name: e.target.value })} placeholder="e.g. Taxi ride" />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Price (₹)</Label>
                    <Input type="number" value={s.price} onChange={e => updateItem("service", idx, { price: Number(e.target.value) })} />
                  </div>
                  <div className="md:col-span-5">
                    <Label>Description</Label>
                    <Input value={s.description ?? ''} onChange={e => updateItem("service", idx, { description: e.target.value })} placeholder="short details" />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button variant="outline" className="w-full" onClick={() => removeItem("service", idx)}><Trash2 className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Tag className="w-4 h-4" /> Offers & Rewards</CardTitle>
          <CardDescription>Link discounts with tourist rewards and DigiPin check-ins</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-3 border rounded">
              <Label className="block mb-1">Bundle Offer</Label>
              <div className="text-sm text-gray-600">Buy a Dokra + Check-in at Maluti Temples = 2x rewards</div>
              <div className="mt-2 flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Active</div>
            </div>
            <div className="p-3 border rounded">
              <Label className="block mb-1">Happy Hours</Label>
              <div className="text-sm text-gray-600">5-7 PM extra 10% off for tourists</div>
              <div className="mt-2 flex items-center gap-2 text-sm"><Checkbox /> Active</div>
            </div>
            <div className="p-3 border rounded">
              <Label className="block mb-1">Festival Boost</Label>
              <div className="text-sm text-gray-600">Durga Puja week ~ 30% more visitors expected</div>
              <div className="mt-2 flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Active</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
