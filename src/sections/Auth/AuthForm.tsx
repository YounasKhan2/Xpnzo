import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Mail, Lock } from "lucide-react";
import { authService } from "../../services/auth";
import { syncEngine } from "../../db/syncEngine";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (type === "signup") {
        await authService.register(email, password, name);
        // Automatically login after signup
        await authService.login(email, password);
      } else {
        await authService.login(email, password);
      }
      
      // Pull latest data from Appwrite upon successful login
      await syncEngine.pullSync();
      
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setError(message);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
      {error && (
        <div className="p-3 text-sm bg-danger-light text-danger rounded-md font-medium">
          {error}
        </div>
      )}
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

      <Button type="submit" variant="primary" fullWidth className="mt-2" loading={isLoading}>
        {type === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
};

export default AuthForm;
