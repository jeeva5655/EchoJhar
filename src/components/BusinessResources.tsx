import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { BookOpen, GraduationCap, Lightbulb, BadgeInfo } from "lucide-react";

export default function BusinessResources() {
  return (
    <div className="space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Training & Resources</h1>
        <p className="text-gray-600">Tutorials, best practices, and case studies</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><GraduationCap className="w-5 h-5" /> Tutorials</CardTitle><CardDescription>Using the app effectively</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <div>• Upload products and manage stock</div>
            <div>• Tag your DigiPin for better discovery</div>
            <div>• Link offers with local check-ins</div>
            <Button variant="outline" className="mt-2">View Guides</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lightbulb className="w-5 h-5" /> Best Practices</CardTitle><CardDescription>Grow your visibility</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <div>• High-quality photos increase conversion</div>
            <div>• Eco-friendly packaging attracts tourists</div>
            <div>• Offer bundles during peak hours</div>
            <Button variant="outline" className="mt-2">Read Tips</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><BookOpen className="w-5 h-5" /> Case Studies</CardTitle><CardDescription>Success in Jharkhand</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <div>• How Dokra artisans doubled sales</div>
            <div>• Sohrai painters and festival season</div>
            <div>• Tour operators using DigiPin bundles</div>
            <Button variant="outline" className="mt-2">Explore Stories</Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><BadgeInfo className="w-5 h-5" /> Government Schemes & Alerts</CardTitle><CardDescription>Updates for small businesses</CardDescription></CardHeader>
        <CardContent className="text-sm text-gray-700 space-y-2">
          <div>• Handicraft subsidy program open till Nov 30</div>
          <div>• Tourism drive in Ranchi – expect 30% more footfall</div>
          <div>• Weather advisory: light rains this weekend</div>
          <Button variant="outline" className="mt-2">See All</Button>
        </CardContent>
      </Card>
    </div>
  );
}
