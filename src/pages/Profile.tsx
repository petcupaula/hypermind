import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCircle, Building2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/layout/Navigation";
import { ProfileSection } from "@/components/account/ProfileSection";
import { CompanySection } from "@/components/account/CompanySection";
import { BillingSection } from "@/components/account/BillingSection";

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
    onSuccess: (data) => {
      queryClient.setQueryData(["profile"], data);
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
      name: formData.get("name") as string || profile?.name,
      company: formData.get("company") as string || profile?.company,
      role: formData.get("role") as string || profile?.role,
      product_name: formData.get("product_name") as string || profile?.product_name,
      industry: form.querySelector('#industry')?.getAttribute('data-value') || profile?.industry,
      target_market: form.querySelector('#target_market')?.getAttribute('data-value') || profile?.target_market,
      product_description: formData.get("product_description") as string || profile?.product_description,
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

        <form onSubmit={handleSubmit}>
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
              <ProfileSection 
                profile={profile}
                isEditing={isEditing}
                onAvatarChange={handleAvatarChange}
                avatarFile={avatarFile}
              />
            </TabsContent>

            <TabsContent value="company">
              <CompanySection 
                profile={profile}
                isEditing={isEditing}
              />
            </TabsContent>

            <TabsContent value="billing">
              <BillingSection />
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
                <Button type="submit" disabled={updateProfile.isPending}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
