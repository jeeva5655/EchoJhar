import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CreditCard, IndianRupee, QrCode, Receipt } from "lucide-react";

type Tx = { id: string; time: string; amount: number; method: 'UPI' | 'QR' | 'CARD'; item: string };

export default function BusinessPayments() {
  const txs = useMemo<Tx[]>(() => [
    { id: 'TX-9001', time: new Date().toISOString(), amount: 1499, method: 'UPI', item: 'Dokra Brass Figurine' },
    { id: 'TX-9002', time: new Date().toISOString(), amount: 499, method: 'QR', item: 'City Taxi Ride' },
    { id: 'TX-9003', time: new Date().toISOString(), amount: 2199, method: 'CARD', item: 'Sohrai Wall Art' },
  ], []);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments & Transactions</h1>
          <p className="text-gray-600">Track sales, generate receipts, and view settlements</p>
        </div>
        <Badge variant="secondary">Today: ₹ {txs.reduce((a, b) => a + b.amount, 0)}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Accepted Methods</CardTitle>
          <CardDescription>Configured in Business Profile</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-3 py-2 border rounded"><IndianRupee className="w-4 h-4" /> UPI</div>
          <div className="flex items-center gap-2 px-3 py-2 border rounded"><QrCode className="w-4 h-4" /> QR</div>
          <div className="flex items-center gap-2 px-3 py-2 border rounded"><CreditCard className="w-4 h-4" /> Card</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Receipts and invoices</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {txs.map(tx => (
            <div key={tx.id} className="grid md:grid-cols-6 gap-3 p-3 border rounded">
              <div className="md:col-span-1 text-sm font-medium">{tx.id}</div>
              <div className="md:col-span-2 text-sm text-gray-600">{new Date(tx.time).toLocaleString()}</div>
              <div className="md:col-span-2 text-sm text-gray-700">{tx.item}</div>
              <div className="md:col-span-1 text-right font-semibold">₹ {tx.amount}</div>
              <div className="md:col-span-5 flex items-center gap-2 text-sm text-gray-500">
                <span className="px-2 py-1 bg-gray-50 border rounded">{tx.method}</span>
              </div>
              <div className="md:col-span-1 flex items-center justify-end">
                <Button variant="outline" size="sm"><Receipt className="w-4 h-4 mr-1" /> Receipt</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
