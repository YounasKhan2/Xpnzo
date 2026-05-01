import React from "react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import type { User } from "../../../types/global-types";

interface ProfileSettingsProps {
  user: User;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  return (
    <Card padding="lg" className="h-full">
      <h3 className="text-lg font-bold text-text-primary m-0 mb-6">
        Profile Information
      </h3>

      <div className="flex items-center gap-6 mb-8">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-bold font-heading shadow-md">
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
        <div>
          <div className="flex gap-3">
            <Button variant="primary" size="sm">
              Change Avatar
            </Button>
            <Button variant="outline" size="sm">
              Remove
            </Button>
          </div>
          <p className="text-xs text-text-muted mt-2">
            JPG, GIF or PNG. Max size of 800K
          </p>
        </div>
      </div>

      <form className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input label="Full Name" defaultValue={user.name} />
          <Input label="Email Address" defaultValue={user.email} type="email" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Phone Number
            </label>
            <input
              type="tel"
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
              placeholder="+1 (555) 000-0000"
              defaultValue="+1 (555) 123-4567"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-primary font-body">
              Date of Birth
            </label>
            <input
              type="date"
              className="w-full py-2.5 px-3.5 border-[1.5px] border-border rounded-md bg-white text-base font-body outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/10"
              defaultValue="1990-01-01"
            />
          </div>
        </div>

        <div className="pt-4 mt-2 border-t border-border flex justify-end">
          <Button type="button" variant="primary">
            Save Changes
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProfileSettings;
