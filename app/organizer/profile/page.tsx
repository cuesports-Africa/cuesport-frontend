"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Building2,
  Camera,
  Save,
  Loader2,
  Mail,
  Phone,
  FileText,
  Wallet,
  Plus,
  Trash2,
  Check,
  Smartphone,
  Landmark,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { organizerApi, walletApi, type PayoutMethod } from "@/lib/api";

const PAYOUT_METHOD_TYPES = [
  { value: "mpesa", label: "M-Pesa", icon: Smartphone },
  { value: "airtel", label: "Airtel Money", icon: Smartphone },
  { value: "mtn", label: "MTN Mobile Money", icon: Smartphone },
  { value: "bank", label: "Bank Transfer", icon: Landmark },
] as const;

export default function OrganizerProfilePage() {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Payout methods with SWR - cached data shows instantly on revisit
  const { data: methodsData, mutate: mutateMethods, isLoading: isLoadingMethods } = useSWR(
    "organizer-payout-methods",
    () => walletApi.getPayoutMethods(),
    { revalidateOnFocus: false, dedupingInterval: 30000 }
  );
  const payoutMethods = methodsData?.payout_methods || [];

  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: "mpesa" as "mpesa" | "airtel" | "mtn" | "bank",
    account_name: "",
    account_number: "",
    bank_code: "",
  });
  const [methodError, setMethodError] = useState("");
  const [methodSuccess, setMethodSuccess] = useState("");
  const [savingMethod, setSavingMethod] = useState(false);
  const [deletingMethodId, setDeletingMethodId] = useState<number | null>(null);

  const [profileData, setProfileData] = useState({
    organization_name: user?.organizer_profile?.organization_name || "",
    description: user?.organizer_profile?.description || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await organizerApi.updateProfile(profileData);
      await refreshUser();
      setSuccess("Organization profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("logo", file);
      await organizerApi.uploadLogo(formData);
      await refreshUser();
      setSuccess("Logo updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload logo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPayoutMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMethod(true);
    setMethodError("");
    setMethodSuccess("");

    try {
      const response = await walletApi.addPayoutMethod({
        ...newMethod,
        is_default: payoutMethods.length === 0,
      });
      // Optimistically update cache
      mutateMethods(
        { payout_methods: [...payoutMethods, response.payout_method] },
        false
      );
      setMethodSuccess("Payout method added successfully");
      setIsAddingMethod(false);
      setNewMethod({ type: "mpesa", account_name: "", account_number: "", bank_code: "" });
    } catch (err) {
      setMethodError(err instanceof Error ? err.message : "Failed to add payout method");
    } finally {
      setSavingMethod(false);
    }
  };

  const handleDeleteMethod = async (methodId: number) => {
    setDeletingMethodId(methodId);
    setMethodError("");

    try {
      await walletApi.deletePayoutMethod(methodId);
      // Optimistically update cache
      mutateMethods(
        { payout_methods: payoutMethods.filter((m) => m.id !== methodId) },
        false
      );
      setMethodSuccess("Payout method removed");
    } catch (err) {
      setMethodError(err instanceof Error ? err.message : "Failed to delete payout method");
    } finally {
      setDeletingMethodId(null);
    }
  };

  const handleSetDefault = async (methodId: number) => {
    try {
      await walletApi.setDefaultMethod(methodId);
      // Optimistically update cache
      mutateMethods(
        {
          payout_methods: payoutMethods.map((m) => ({
            ...m,
            is_default: m.id === methodId,
          })),
        },
        false
      );
    } catch (err) {
      setMethodError(err instanceof Error ? err.message : "Failed to set default method");
    }
  };

  const organizerProfile = user?.organizer_profile;
  const selectedMethodType = PAYOUT_METHOD_TYPES.find((t) => t.value === newMethod.type);

  return (
    <div className="min-h-full">
      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold">Organization Profile</h1>
            <p className="text-muted-foreground">
              Manage your organization&apos;s information
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
            {/* Logo Card */}
            <Card>
              <CardHeader>
                <CardTitle>Organization Logo</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-xl bg-gold/10 flex items-center justify-center overflow-hidden relative">
                    {organizerProfile?.logo_url ? (
                      <img
                        src={organizerProfile.logo_url}
                        alt="Organization Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Building2 className="h-16 w-16 text-gold" />
                    )}
                    {isSaving && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                        <Loader2 className="h-8 w-8 animate-spin text-white" />
                      </div>
                    )}
                  </div>
                  <label className={`absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gold text-black flex items-center justify-center transition-colors ${isSaving ? 'cursor-wait opacity-70' : 'cursor-pointer hover:bg-gold/90'}`}>
                    <Camera className="h-5 w-5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoUpload}
                      disabled={isSaving}
                    />
                  </label>
                </div>
                <p className="mt-4 text-center font-medium">
                  {organizerProfile?.organization_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {organizerProfile?.tournaments_hosted || 0} tournaments hosted
                </p>
              </CardContent>
            </Card>

            {/* Organization Details Card */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Organization Details</CardTitle>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization_name">Organization Name *</Label>
                      <Input
                        id="organization_name"
                        value={profileData.organization_name}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            organization_name: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={profileData.description}
                        onChange={(e) =>
                          setProfileData((p) => ({
                            ...p,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Tell players about your organization..."
                        rows={4}
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
                    <div className="flex items-start gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Organization Name
                        </p>
                        <p className="font-medium">
                          {organizerProfile?.organization_name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Description</p>
                        <p className="font-medium">
                          {organizerProfile?.description || "No description set"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Email</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Phone</p>
                        <p className="font-medium">{user?.phone_number}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payout Methods Card - Desktop */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Payout Methods
              </CardTitle>
              {!isAddingMethod && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingMethod(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {methodError && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {methodError}
                </div>
              )}
              {methodSuccess && (
                <div className="mb-4 p-3 rounded-lg bg-green-100 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 text-sm">
                  {methodSuccess}
                </div>
              )}

              {isAddingMethod && (
                <form onSubmit={handleAddPayoutMethod} className="mb-6 p-4 rounded-lg border bg-muted/30">
                  <h4 className="font-medium mb-4">Add Payout Method</h4>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Method Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {PAYOUT_METHOD_TYPES.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => setNewMethod((m) => ({ ...m, type: type.value }))}
                            className={`flex items-center gap-2 p-3 rounded-lg border text-sm font-medium transition-colors ${
                              newMethod.type === type.value
                                ? "border-gold bg-gold/10 text-gold"
                                : "border-border hover:bg-muted"
                            }`}
                          >
                            <type.icon className="h-4 w-4" />
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="account_name">Account Name</Label>
                        <Input
                          id="account_name"
                          value={newMethod.account_name}
                          onChange={(e) => setNewMethod((m) => ({ ...m, account_name: e.target.value }))}
                          placeholder="John Doe"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="account_number">
                          {newMethod.type === "bank" ? "Account Number" : "Phone Number"}
                        </Label>
                        <Input
                          id="account_number"
                          value={newMethod.account_number}
                          onChange={(e) => setNewMethod((m) => ({ ...m, account_number: e.target.value }))}
                          placeholder={newMethod.type === "bank" ? "1234567890" : "0712345678"}
                          required
                        />
                      </div>

                      {newMethod.type === "bank" && (
                        <div className="space-y-2">
                          <Label htmlFor="bank_code">Bank Code</Label>
                          <Input
                            id="bank_code"
                            value={newMethod.bank_code}
                            onChange={(e) => setNewMethod((m) => ({ ...m, bank_code: e.target.value }))}
                            placeholder="e.g. KCB, EQUITY"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button type="submit" disabled={savingMethod}>
                      {savingMethod ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Method"
                      )}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsAddingMethod(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              )}

              {isLoadingMethods ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : payoutMethods.length > 0 ? (
                <div className="space-y-3">
                  {payoutMethods.map((method) => {
                    const methodType = PAYOUT_METHOD_TYPES.find((t) => t.value === method.type);
                    const Icon = methodType?.icon || Wallet;
                    return (
                      <div
                        key={method.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gold" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{methodType?.label || method.type}</span>
                              {method.is_default && (
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {method.account_name} • {method.masked_account_number}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.is_default && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(method.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteMethod(method.id)}
                            disabled={deletingMethodId === method.id}
                          >
                            {deletingMethodId === method.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No payout methods</h3>
                  <p className="text-muted-foreground mb-4">
                    Add a payout method to receive your earnings
                  </p>
                  <Button onClick={() => setIsAddingMethod(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payout Method
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Mobile/PWA Layout */}
      <div className="lg:hidden">
        {/* Logo Section */}
        <div className="flex flex-col items-center py-6 px-4 border-b border-border/30">
          <div className="relative">
            <div className="w-24 h-24 rounded-xl bg-gold/10 flex items-center justify-center overflow-hidden">
              {organizerProfile?.logo_url ? (
                <img
                  src={organizerProfile.logo_url}
                  alt="Organization Logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="h-12 w-12 text-gold" />
              )}
              {isSaving && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-black flex items-center justify-center">
              <Camera className="h-4 w-4" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
                disabled={isSaving}
              />
            </label>
          </div>
          <p className="mt-3 font-semibold">{organizerProfile?.organization_name}</p>
          <p className="text-xs text-muted-foreground">
            {organizerProfile?.tournaments_hosted || 0} tournaments hosted
          </p>
        </div>

        {/* Messages */}
        {(error || success) && (
          <div className="px-4 pt-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-green-100 border border-green-200 text-green-700 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 text-sm">
                {success}
              </div>
            )}
          </div>
        )}

        {/* Organization Details */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Organization Details
            </h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-medium text-gold"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Organization Name</Label>
                <Input
                  value={profileData.organization_name}
                  onChange={(e) => setProfileData((p) => ({ ...p, organization_name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Description</Label>
                <Textarea
                  value={profileData.description}
                  onChange={(e) => setProfileData((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </Button>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 py-2">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase">Name</p>
                  <p className="text-sm font-medium">{organizerProfile?.organization_name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase">Email</p>
                  <p className="text-sm font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-[10px] text-muted-foreground uppercase">Phone</p>
                  <p className="text-sm font-medium">{user?.phone_number}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Payout Methods Section - Mobile */}
        <div className="border-t border-border/30">
          <div className="px-4 py-3 bg-muted/30 flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Payout Methods
            </h2>
            {!isAddingMethod && (
              <button
                onClick={() => setIsAddingMethod(true)}
                className="text-xs font-medium text-gold flex items-center gap-1"
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            )}
          </div>

          {(methodError || methodSuccess) && (
            <div className="px-4 pt-3">
              {methodError && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs">
                  {methodError}
                </div>
              )}
              {methodSuccess && (
                <div className="p-3 rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                  {methodSuccess}
                </div>
              )}
            </div>
          )}

          {isAddingMethod && (
            <div className="px-4 py-4 border-b border-border/30">
              <form onSubmit={handleAddPayoutMethod} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs">Method Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {PAYOUT_METHOD_TYPES.map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setNewMethod((m) => ({ ...m, type: type.value }))}
                        className={`flex items-center gap-2 p-3 rounded-lg border text-xs font-medium transition-colors ${
                          newMethod.type === type.value
                            ? "border-gold bg-gold/10 text-gold"
                            : "border-border"
                        }`}
                      >
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">Account Name</Label>
                  <Input
                    value={newMethod.account_name}
                    onChange={(e) => setNewMethod((m) => ({ ...m, account_name: e.target.value }))}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs">
                    {newMethod.type === "bank" ? "Account Number" : "Phone Number"}
                  </Label>
                  <Input
                    value={newMethod.account_number}
                    onChange={(e) => setNewMethod((m) => ({ ...m, account_number: e.target.value }))}
                    placeholder={newMethod.type === "bank" ? "1234567890" : "0712345678"}
                    required
                  />
                </div>

                {newMethod.type === "bank" && (
                  <div className="space-y-2">
                    <Label className="text-xs">Bank Code</Label>
                    <Input
                      value={newMethod.bank_code}
                      onChange={(e) => setNewMethod((m) => ({ ...m, bank_code: e.target.value }))}
                      placeholder="e.g. KCB"
                    />
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" disabled={savingMethod} className="flex-1">
                    {savingMethod ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddingMethod(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}

          {isLoadingMethods ? (
            <div className="px-4 py-4 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : payoutMethods.length > 0 ? (
            <div className="divide-y divide-border/30">
              {payoutMethods.map((method) => {
                const methodType = PAYOUT_METHOD_TYPES.find((t) => t.value === method.type);
                const Icon = methodType?.icon || Wallet;
                return (
                  <div key={method.id} className="flex items-center gap-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{methodType?.label}</span>
                        {method.is_default && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {method.account_name} • {method.masked_account_number}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteMethod(method.id)}
                      disabled={deletingMethodId === method.id}
                      className="w-8 h-8 flex items-center justify-center text-destructive"
                    >
                      {deletingMethodId === method.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-8 py-8">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Wallet className="h-6 w-6 text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium mb-1">No payout methods</p>
              <p className="text-xs text-muted-foreground text-center mb-4">
                Add a method to receive earnings
              </p>
              <button
                onClick={() => setIsAddingMethod(true)}
                className="text-sm font-medium text-gold"
              >
                + Add Payout Method
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
