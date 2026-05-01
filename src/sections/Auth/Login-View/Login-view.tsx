import React, { useState } from "react";
import Card from "../../../components/Card";
import AuthForm from "../AuthForm";
import { Wallet } from "lucide-react";

const LoginView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-info/10 blur-[100px]" />

      <div className="w-full max-w-[420px] relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Wallet size={28} color="#fff" />
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-text-primary tracking-tight m-0">
            Xpnzo
          </h1>
          <p className="text-text-muted mt-2 text-center">
            {isLogin
              ? "Welcome back! Please enter your details."
              : "Create an account to start tracking."}
          </p>
        </div>

        <Card padding="lg" className="w-full">
          <AuthForm type={isLogin ? "login" : "signup"} />

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-text-muted m-0">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                className="font-bold text-primary hover:text-primary-hover bg-transparent border-none cursor-pointer transition-colors p-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Log in"}
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginView;
