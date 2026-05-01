import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Mail, Lock } from "lucide-react";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, perform auth logic here
    navigate("/");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {type === "signup" && (
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <Input
        label="Email Address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        icon={<Mail size={18} />}
        required
      />

      <div className="flex flex-col gap-2">
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />
        {type === "login" && (
          <div className="flex justify-end">
            <a
              href="#"
              className="text-sm font-semibold text-primary hover:text-primary-hover"
            >
              Forgot password?
            </a>
          </div>
        )}
      </div>

      <Button type="submit" variant="primary" fullWidth className="mt-2">
        {type === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
};

export default AuthForm;
