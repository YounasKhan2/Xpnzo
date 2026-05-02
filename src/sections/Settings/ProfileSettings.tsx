import React, { useRef, useState } from "react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { LocalUserSettings } from "../../../types/Settings-types";
import { db } from "../../db/db";
import { storage, BUCKET_IDS, Permission, Role } from "../../lib/appwrite";
import { syncEngine } from "../../db/syncEngine";
import { ID } from "appwrite";
import { authService } from "../../services/auth";

interface ProfileSettingsProps {
  settings: LocalUserSettings | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ settings }) => {
  const [form, setForm] = useState({
    name: settings?.name ?? "",
    email: settings?.email ?? "",
    phone: settings?.phone ?? "",
    dateOfBirth: settings?.dateOfBirth ?? "",
    avatar: settings?.avatar ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarPreviewUrl = React.useMemo(() => {
    if (!form.avatar) return "";
    if (form.avatar.startsWith("data:")) return form.avatar;
    try {
      return storage.getFilePreview(BUCKET_IDS.avatars, form.avatar);
    } catch {
      return "";
    }
  }, [form.avatar]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const patch = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        avatar: form.avatar,
        updatedAt: Date.now(),
      };
      if (settings?.localId) {
        await db.userSettings.update(settings.localId, patch);
        await db.syncQueue.add({
          action: "update",
          collection: "userSettings",
          payload: { ...settings, ...patch, localId: settings.localId },
          retryCount: 0,
          timestamp: Date.now(),
        });
      } else {
        const fullNewSettings = {
          ...patch,
          currency: "USD",
          twoFactorAuth: false,
          biometricLogin: false,
          loginAlerts: true,
          emailDigest: true,
          budgetAlerts: true,
          marketingEmails: false,
        };
        const id = await db.userSettings.add(fullNewSettings);
        await db.syncQueue.add({
          action: "create",
          collection: "userSettings",
          payload: { ...fullNewSettings, localId: id },
          retryCount: 0,
          timestamp: Date.now(),
        });
      }
      syncEngine.startSync();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // We can allow up to 2MB for Appwrite bucket
    if (file.size > 2 * 1024 * 1024) {
      alert("File is too large. Max size is 2MB.");
      return;
    }

    // Set local preview instantly
    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, avatar: reader.result as string });
    };
    reader.readAsDataURL(file);

    try {
      // Get current user for permission scoping
      const user = await authService.getCurrentUser();
      const permissions = user
        ? [Permission.read(Role.user(user.$id)), Permission.update(Role.user(user.$id)), Permission.delete(Role.user(user.$id))]
        : [];

      // Upload to Appwrite Storage with user-scoped permissions
      const response = await storage.createFile(BUCKET_IDS.avatars, ID.unique(), file, permissions);
      
      // Update form with the new fileId
      setForm((prev) => ({ ...prev, avatar: response.$id }));
    } catch (error) {
      console.error("Failed to upload avatar:", error);
      alert("Failed to upload avatar. Please try again.");
    }
  };

  const handleRemoveAvatar = () => {
    setForm({ ...form, avatar: "" });
  };

  const initials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <Card padding="lg" className="h-full">
      <h3 className="text-lg font-bold text-text-primary m-0 mb-6">Profile Information</h3>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold font-heading shadow-md overflow-hidden flex-shrink-0">
          {avatarPreviewUrl ? (
            <img src={avatarPreviewUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <div className="flex gap-3">
            <input
              type="file"
              accept="image/png, image/jpeg, image/gif"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <Button type="button" variant="primary" size="sm" onClick={() => fileInputRef.current?.click()}>
              Change Avatar
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleRemoveAvatar} disabled={!form.avatar}>
              Remove
            </Button>
          </div>
          <p className="text-xs text-text-muted mt-2">JPG, GIF or PNG. Max size of 2MB</p>
        </div>
      </div>

      <form className="flex flex-col gap-5" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">Phone Number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">Date of Birth</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-bg text-text-primary text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
            />
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-border flex items-center justify-end gap-3">
          {saved && <span className="text-sm text-success font-medium">Saved!</span>}
          <Button type="submit" variant="primary" loading={isSaving}>Save Changes</Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileSettings;
