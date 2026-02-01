"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import useSWR from "swr";
import {
  Loader2,
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Lock,
  Save,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { profileApi } from "@/lib/api";

interface ProfileSettings {
  user: {
    id: number;
    email: string;
    phone_number: string;
    player_profile: {
      id: number;
      first_name: string;
      last_name: string;
      nickname: string | null;
      photo_url: string | null;
      date_of_birth: string;
      gender: string;
      location_id: number;
      location: {
        id: number;
        name: string;
        full_path: string;
      };
    };
  };
  locations: Array<{
    id: number;
    name: string;
    full_path: string;
  }>;
}

const fetcher = async (): Promise<ProfileSettings> => {
  const response = await profileApi.getSettings();
  return response as unknown as ProfileSettings;
};

export default function SettingsPage() {
  const { data, error, isLoading, mutate } = useSWR("profile-settings", fetcher, {
    revalidateOnFocus: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: "success" | "error"; text: string } | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    nickname: "",
    date_of_birth: "",
    gender: "",
    location_id: "",
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Initialize form when data loads
  if (data && !formData.first_name && data.user.player_profile) {
    const profile = data.user.player_profile;
    setFormData({
      first_name: profile.first_name,
      last_name: profile.last_name,
      nickname: profile.nickname || "",
      date_of_birth: profile.date_of_birth,
      gender: profile.gender,
      location_id: String(profile.location_id),
    });
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSaveMessage({ type: "error", text: "Please select an image file" });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage({ type: "error", text: "Image must be less than 5MB" });
      return;
    }

    setIsUploadingPhoto(true);
    setSaveMessage(null);

    try {
      await profileApi.uploadPhoto(file);
      await mutate();
      setSaveMessage({ type: "success", text: "Photo updated successfully" });
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to upload photo",
      });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      await profileApi.update({
        ...formData,
        location_id: Number(formData.location_id),
      });
      await mutate();
      setSaveMessage({ type: "success", text: "Profile updated successfully" });

      // Also update localStorage user data
      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        user.player_profile = {
          ...user.player_profile,
          first_name: formData.first_name,
          last_name: formData.last_name,
          nickname: formData.nickname,
        };
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to update profile",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.new_password !== passwordData.new_password_confirmation) {
      setSaveMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (passwordData.new_password.length < 8) {
      setSaveMessage({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    setIsChangingPassword(true);
    setSaveMessage(null);

    try {
      await profileApi.changePassword(passwordData);
      setPasswordData({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
      setSaveMessage({ type: "success", text: "Password changed successfully" });
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to change password",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">Failed to load settings</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const profile = data.user.player_profile;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground text-sm">
          Update your profile information and preferences
        </p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div
          className={`flex items-center gap-2 p-4 rounded-lg ${
            saveMessage.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {saveMessage.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          {saveMessage.text}
        </div>
      )}

      {/* Photo Upload */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Profile Photo</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted overflow-hidden">
              {profile.photo_url ? (
                <Image
                  src={profile.photo_url}
                  alt={profile.first_name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                  {profile.first_name[0]}
                  {profile.last_name[0]}
                </div>
              )}
            </div>
            <button
              onClick={handlePhotoClick}
              disabled={isUploadingPhoto}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isUploadingPhoto ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              Click the camera icon to upload a new photo
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, PNG or GIF. Max 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-card rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold mb-4">Personal Information</h3>

        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <User className="h-4 w-4" />
              First Name
            </label>
            <Input
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Last Name</label>
            <Input
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Nickname */}
        <div>
          <label className="text-sm font-medium mb-2 block">
            Nickname (optional)
          </label>
          <Input
            name="nickname"
            value={formData.nickname}
            onChange={handleInputChange}
            placeholder="Your gaming alias"
          />
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Date of Birth
          </label>
          <Input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-medium mb-2 block">Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            required
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </label>
          <select
            name="location_id"
            value={formData.location_id}
            onChange={handleInputChange}
            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
            required
          >
            <option value="">Select location</option>
            {data.locations.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.full_path}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={isSaving} className="w-full">
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
      </form>

      {/* Contact Info (Read-only) */}
      <div className="bg-card rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              Email Address
            </label>
            <Input value={data.user.email} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">
              Contact support to change your email
            </p>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              Phone Number
            </label>
            <Input value={data.user.phone_number} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">
              Contact support to change your phone number
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <form onSubmit={handleChangePassword} className="bg-card rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Change Password
        </h3>

        <div>
          <label className="text-sm font-medium mb-2 block">Current Password</label>
          <Input
            type="password"
            name="current_password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">New Password</label>
          <Input
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Minimum 8 characters
          </p>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Confirm New Password</label>
          <Input
            type="password"
            name="new_password_confirmation"
            value={passwordData.new_password_confirmation}
            onChange={handlePasswordChange}
            required
          />
        </div>

        <Button type="submit" variant="outline" disabled={isChangingPassword} className="w-full">
          {isChangingPassword ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Changing Password...
            </>
          ) : (
            "Change Password"
          )}
        </Button>
      </form>
    </div>
  );
}
