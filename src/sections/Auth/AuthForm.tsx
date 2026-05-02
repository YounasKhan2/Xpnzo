import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "../../lib/useAuth";

interface AuthFormProps {
  type: "login" | "signup";
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // ── Client-side validation ─────────────────────────────────────────────────
  const validate = (): string | null => {
    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    if (!trimmedEmail) return "Email address is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail))
      return "Please enter a valid email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (type === "signup") {
      if (!trimmedName) return "Full name is required.";
      if (trimmedName.length < 2) return "Name must be at least 2 characters.";
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      if (type === "signup") {
        await register(email.trim(), password, name.trim());
      } else {
        await login(email.trim(), password);
      }
      // AuthContext has updated user state — navigate to dashboard
      navigate("/", { replace: true });
    } catch (err: unknown) {
      // Produce a human-readable error message
      let message = "Authentication failed. Please try again.";
      if (err instanceof Error) {
        // Map common Appwrite error messages to user-friendly ones
        if (err.message.includes("Invalid credentials")) {
          message = "Incorrect email or password. Please try again.";
        } else if (
          err.message.includes("user_already_exists") ||
          err.message.includes("already exists")
        ) {
          message =
            "An account with this email already exists. Try logging in.";
        } else if (err.message.includes("rate limit")) {
          message = "Too many attempts. Please wait a moment and try again.";
        } else {
          message = err.message;
        }
      }
      setError(message);
      console.error("Auth error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 w-full"
      noValidate
    >
      {error && (
        <div
          role="alert"
          className="p-3 text-sm bg-danger-light text-danger rounded-md font-medium"
        >
          {error}
        </div>
      )}

      {type === "signup" && (
        <Input
          label="Full Name"
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          icon={<User size={18} />}
          required
          autoComplete="name"
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
        autoComplete="email"
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
          autoComplete={type === "signup" ? "new-password" : "current-password"}
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

      <Button
        type="submit"
        variant="primary"
        fullWidth
        className="mt-2"
        loading={isLoading}
      >
        {type === "login" ? "Sign In" : "Create Account"}
      </Button>
    </form>
  );
};

export default AuthForm;
