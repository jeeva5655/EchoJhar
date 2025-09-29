import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { CheckCircle2, ChevronRight } from "lucide-react";

export default function BusinessOnboarding({ onNavigate }: { onNavigate: (section: string) => void }) {
  const steps = [
    { id: "business-profile", title: "Complete Business Profile", desc: "Verify, set payments, and add branding" },
    { id: "business-products", title: "Upload Products/Services", desc: "Add your catalog and offers" },
    { id: "business-payments", title: "Review Payments", desc: "Check methods and receipts" },
    { id: "digipin", title: "Start DigiPin Check-ins", desc: "Verify and award tourist rewards" },
    { id: "business-analytics", title: "View Analytics", desc: "Track footfall and sales" },
  ];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Get Started</h1>
        <p className="text-gray-600">Follow these steps to set up your business</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {steps.map(s => (
          <Card key={s.id} className="cursor-pointer hover:shadow" onClick={() => onNavigate(s.id)}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{s.title}</CardTitle>
              <CardDescription>{s.desc}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-gray-500">Click to continue</div>
              <ChevronRight className="w-4 h-4" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-right">
        <Button onClick={() => onNavigate("business")}>Finish <CheckCircle2 className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
}
