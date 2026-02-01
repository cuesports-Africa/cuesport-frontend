"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Camera,
  Save,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Building2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { profileApi, organizerApi } from "@/lib/api";

export default function PlayerProfilePage() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [profileData, setProfileData] = useState({
    first_name: user?.player_profile?.first_name || "",
    last_name: user?.player_profile?.last_name || "",
    nickname: user?.player_profile?.nickname || "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Become Organizer state
  const [isBecomingOrganizer, setIsBecomingOrganizer] = useState(false);
  const [organizerData, setOrganizerData] = useState({
    organization_name: "",
    description: "",
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await profileApi.update(profileData);
      await refreshUser();
      setSuccess("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setError("Passwords do not match");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await profileApi.changePassword(passwordData);
      setSuccess("Password changed successfully");
      setIsChangingPassword(false);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setError("");

    try {
      await profileApi.uploadPhoto(file);
      await refreshUser();
      setSuccess("Photo updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload photo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleBecomeOrganizer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerData.organization_name.trim()) {
      setError("Organization name is required");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await organizerApi.becomeOrganizer(organizerData);
      await refreshUser();
      setSuccess("You are now an organizer! You can switch to your organizer dashboard.");
      setIsBecomingOrganizer(false);
      setOrganizerData({ organization_name: "", description: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register as organizer");
    } finally {
      setIsSaving(false);
    }
  };

  const playerProfile = user?.player_profile;
  const isOrganizer = user?.roles?.is_organizer && user?.organizer_profile;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account settings
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 rounded-lg bg-green-100 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 text-sm">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo Card */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Photo</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                {playerProfile?.photo_url ? (
                  <img
                    src={playerProfile.photo_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-primary" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoUpload}
                  disabled={isSaving}
                />
              </label>
            </div>
            <p className="mt-4 text-center font-medium">
              {playerProfile?.first_name} {playerProfile?.last_name}
            </p>
            {playerProfile?.nickname && (
              <p className="text-sm text-muted-foreground">
                &quot;{playerProfile.nickname}&quot;
              </p>
            )}
          </CardContent>
        </Card>

        {/* Personal Information Card */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      value={profileData.first_name}
                      onChange={(e) =>
                        setProfileData((p) => ({ ...p, first_name: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      value={profileData.last_name}
                      onChange={(e) =>
                        setProfileData((p) => ({ ...p, last_name: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nickname">Nickname (Optional)</Label>
                  <Input
                    id="nickname"
                    value={profileData.nickname}
                    onChange={(e) =>
                      setProfileData((p) => ({ ...p, nickname: e.target.value }))
                    }
                    placeholder="Your in-game name"
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">
                        {playerProfile?.first_name} {playerProfile?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{user?.phone_number}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Date of Birth</p>
                      <p className="font-medium">
                        {playerProfile?.date_of_birth
                          ? new Date(playerProfile.date_of_birth).toLocaleDateString()
                          : "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Change Password Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Change Password
          </CardTitle>
          {!isChangingPassword && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          )}
        </CardHeader>
        {isChangingPassword && (
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current_password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current_password"
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.current_password}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        current_password: e.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((p) => ({ ...p, current: !p.current }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new_password"
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.new_password}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        new_password: e.target.value,
                      }))
                    }
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((p) => ({ ...p, new: !p.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm_password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm_password"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.new_password_confirmation}
                    onChange={(e) =>
                      setPasswordData((p) => ({
                        ...p,
                        new_password_confirmation: e.target.value,
                      }))
                    }
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords((p) => ({ ...p, confirm: !p.confirm }))
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Changing...
                    </>
                  ) : (
                    "Change Password"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({
                      current_password: "",
                      new_password: "",
                      new_password_confirmation: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Become Organizer Card - Only show if not already an organizer */}
      {!isOrganizer && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Become an Organizer
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Host your own tournaments and manage events
              </p>
            </div>
            {!isBecomingOrganizer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsBecomingOrganizer(true)}
              >
                Get Started
              </Button>
            )}
          </CardHeader>
          {isBecomingOrganizer && (
            <CardContent>
              <form onSubmit={handleBecomeOrganizer} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="organization_name">Organization Name *</Label>
                  <Input
                    id="organization_name"
                    value={organizerData.organization_name}
                    onChange={(e) =>
                      setOrganizerData((p) => ({
                        ...p,
                        organization_name: e.target.value,
                      }))
                    }
                    placeholder="e.g., Nairobi Pool Club"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be displayed on your tournaments
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={organizerData.description}
                    onChange={(e) =>
                      setOrganizerData((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Tell players about your organization..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Become Organizer"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsBecomingOrganizer(false);
                      setOrganizerData({ organization_name: "", description: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}
