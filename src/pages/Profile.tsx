import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, Building2, CreditCard } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/layout/Navigation";

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

const Profile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateProfile = useMutation({
    mutationFn: async (formData: typeof profile) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("No session found");

      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `${session.user.id}/avatar.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile, { upsert: true });
          
        if (!uploadError) {
          formData.avatar_url = filePath;
        }
      }

      const { error } = await supabase
        .from("profiles")
        .update(formData)
        .eq("id", session.user.id);

      if (error) throw error;
      return formData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "Profile updated",
        description: "Your account has been successfully updated.",
      });
      setIsEditing(false);
      setAvatarFile(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile: " + error.message,
        variant: "destructive",
      });
    },
  });

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAvatarFile(event.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const updatedProfile = {
      ...profile,
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      role: formData.get("role") as string,
      industry: form.querySelector('#industry')?.getAttribute('data-value') || profile?.industry,
      target_market: form.querySelector('#target_market')?.getAttribute('data-value') || profile?.target_market,
      description: formData.get("description") as string,
    };
    updateProfile.mutate(updatedProfile);
  };

  if (isLoading) {
    return (
      <div>
        <Navigation />
        <div className="container max-w-4xl mx-auto pt-20">
          <p className="text-center py-8">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      <div className="container max-w-4xl mx-auto pt-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account settings and preferences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="company" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Company Info
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Billing
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="w-20 h-20">
                      <AvatarImage 
                        src={avatarFile ? URL.createObjectURL(avatarFile) : profile?.avatar_url} 
                        alt={profile?.name} 
                      />
                      <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Label htmlFor="avatar" className="text-sm font-medium">
                        Profile Picture
                      </Label>
                      <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={!isEditing}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      defaultValue={profile?.name || ""}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      name="role"
                      defaultValue={profile?.role || ""}
                      disabled={!isEditing}
                    />
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="company">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Billing features coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          {!isEditing ? (
            <Button type="button" onClick={() => setIsEditing(true)}>
              Edit Account
            </Button>
          ) : (
            <>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" form="profile-form" disabled={updateProfile.isPending}>
                Save Changes
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
