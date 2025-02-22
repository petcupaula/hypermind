
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface ProfileSectionProps {
  profile: any;
  isEditing: boolean;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  avatarFile: File | null;
}

export function ProfileSection({ profile, isEditing, onAvatarChange, avatarFile }: ProfileSectionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <form id="profile-form" className="space-y-6">
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
                onChange={onAvatarChange}
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
  );
}
