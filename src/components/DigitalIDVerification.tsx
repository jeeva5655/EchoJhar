import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { CheckCircle2, Upload, Shield, User, Store } from "lucide-react";

export default function DigitalIDVerification() {
  const [status, setStatus] = useState<"unverified" | "pending" | "verified">("unverified");
  const [role, setRole] = useState<"tourist" | "business" | "admin">("tourist");

  const startVerification = () => setStatus("pending");
  const mockApprove = () => setStatus("verified");

  const StatusBadge = () => (
    <Badge className={
      status === "verified"
        ? "bg-green-100 text-green-800"
        : status === "pending"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-gray-100 text-gray-800"
    }>
      {status === "verified" ? "✅ Verified" : status === "pending" ? "⏳ Pending" : "Not Verified"}
    </Badge>
  );

  const UploadBlock = (title: string) => (
    <div className="space-y-2">
      <p className="text-sm text-gray-700">{title}</p>
      <div className="flex gap-2">
        <Input type="file" accept="image/*,application/pdf" />
        <Button variant="outline"><Upload className="w-4 h-4 mr-1"/>Upload</Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">🔐 Digital ID Verification</h1>
          <p className="text-gray-600">Verify identity for seamless, secure experiences across EchoJhar.</p>
        </div>
        <StatusBadge />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield className="w-5 h-5"/> Select Role</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={role} onValueChange={(v:any)=>setRole(v)}>
            <TabsList>
              <TabsTrigger value="tourist" className="flex items-center gap-1"><User className="w-4 h-4"/> Tourist</TabsTrigger>
              <TabsTrigger value="business" className="flex items-center gap-1"><Store className="w-4 h-4"/> Business</TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-1"><Shield className="w-4 h-4"/> Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="tourist">
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {UploadBlock("Passport / Government ID")}
                {UploadBlock("Selfie (for liveness)")}
                {UploadBlock("Travel Itinerary (optional)")}
                {UploadBlock("Emergency Contact Consent")}
              </div>
            </TabsContent>

            <TabsContent value="business">
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {UploadBlock("Business Registration / GST")}
                {UploadBlock("Owner ID Proof")}
                {UploadBlock("Shop License / Certificates")}
                {UploadBlock("Bank Verification (masked)")}
              </div>
            </TabsContent>

            <TabsContent value="admin">
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                {UploadBlock("Government ID / Badge")}
                {UploadBlock("Department Authorization")}
                {UploadBlock("Background Check Acknowledgement")}
                {UploadBlock("NDA / Compliance")}
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-6 flex gap-3">
            {status === "unverified" && <Button onClick={startVerification}>Start Verification</Button>}
            {status === "pending" && <Button variant="secondary" onClick={mockApprove}><CheckCircle2 className="w-4 h-4 mr-1"/>Mark as Verified (Demo)</Button>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
