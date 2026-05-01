import React, { useState } from "react";
import Card from "../../components/Card";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Shield } from "lucide-react";

const PasswordChange: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation
  };

  return (
    <Card padding="lg" className="h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-primary m-0">
            Change Password
          </h3>
          <p className="text-sm text-text-muted mt-0.5">
            Ensure your account uses a strong, long password
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Current Password"
          type="password"
          placeholder="Enter current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <Input
          label="New Password"
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Input
          label="Confirm New Password"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <div className="pt-2 mt-2">
          <Button type="submit" variant="primary">
            Update Password
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PasswordChange;
