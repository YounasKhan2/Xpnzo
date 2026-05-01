import React, { useState } from "react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { LocalUserSettings } from "../../../types/Settings-types";
import { db } from "../../db/db";

interface ProfileSettingsProps {
  settings: LocalUserSettings | null;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ settings }) => {
  const [form, setForm] = useState({
    name: settings?.name ?? "",
    email: settings?.email ?? "",
    phone: settings?.phone ?? "",
    dateOfBirth: settings?.dateOfBirth ?? "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const patch = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        dateOfBirth: form.dateOfBirth,
        updatedAt: Date.now(),
      };
      if (settings?.localId) {
        await db.userSettings.update(settings.localId, patch);
      } else {
        await db.userSettings.add({
          ...patch,
          currency: "USD",
          twoFactorAuth: false,
          biometricLogin: false,
          loginAlerts: true,
          emailDigest: true,
          budgetAlerts: true,
          marketingEmails: false,
        });
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setIsSaving(false);
    }
  };

  const initials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase()
    : "?";

  return (
    <Card padding="lg" className="h-full">
      <h3 className="text-lg font-bold text-text-primary m-0 mb-6">Profile Information</h3>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold font-heading shadow-md">
          {initials}
        </div>
        <div>
          <div className="flex gap-3">
            <Button variant="primary" size="sm">Change Avatar</Button>
            <Button variant="outline" size="sm">Remove</Button>
          </div>
          <p className="text-xs text-text-muted mt-2">JPG, GIF or PNG. Max size of 800K</p>
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
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">Date of Birth</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
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
