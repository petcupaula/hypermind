
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const industries = [
  "Software & Technology",
  "Healthcare & Medical",
  "Financial Services",
  "Manufacturing",
  "Retail & E-commerce",
  "Education",
  "Professional Services",
  "Real Estate",
  "Construction",
  "Transportation & Logistics",
  "Energy & Utilities",
  "Media & Entertainment",
  "Agriculture",
  "Hospitality & Tourism",
  "Other"
];

const targetMarkets = [
  "Small Businesses",
  "Medium-sized Enterprises",
  "Large Corporations",
  "Startups",
  "Government & Public Sector",
  "Educational Institutions",
  "Healthcare Providers",
  "Consumers (B2C)",
  "Other Businesses (B2B)",
  "Non-profit Organizations"
];

interface CompanySectionProps {
  profile: any;
  isEditing: boolean;
}

export function CompanySection({ profile, isEditing }: CompanySectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="company">Company Name</Label>
            <Input
              id="company"
              name="company"
              defaultValue={profile?.company || ""}
              disabled={!isEditing}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="product_name">Product Name</Label>
            <Input
              id="product_name"
              name="product_name"
              defaultValue={profile?.product_name || ""}
              disabled={!isEditing}
              placeholder="E.g., SalesAI Pro"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="industry">Industry</Label>
            <Select 
              disabled={!isEditing}
              value={profile?.industry}
              onValueChange={(value) => {
                const element = document.getElementById('industry');
                if (element) {
                  element.setAttribute('data-value', value);
                }
              }}
            >
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="target_market">Target Market</Label>
            <Select
              disabled={!isEditing}
              value={profile?.target_market}
              onValueChange={(value) => {
                const element = document.getElementById('target_market');
                if (element) {
                  element.setAttribute('data-value', value);
                }
              }}
            >
              <SelectTrigger id="target_market">
                <SelectValue placeholder="Select your target market" />
              </SelectTrigger>
              <SelectContent>
                {targetMarkets.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Product/Service Description
            </Label>
            <p className="text-sm text-muted-foreground">
              Describe the products or services that you or your company offers to customers
            </p>
            <Textarea
              id="description"
              name="description"
              defaultValue={profile?.description || ""}
              disabled={!isEditing}
              className="min-h-[100px]"
              placeholder="E.g., We provide enterprise-grade cybersecurity solutions that protect companies from advanced cyber threats..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
