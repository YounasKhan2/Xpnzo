import React, { useState, useEffect } from "react";
import { X, Download, Share, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as unknown as Record<string, unknown>).MSStream;

const isInStandaloneMode = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  (navigator as Navigator & { standalone?: boolean }).standalone === true;

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  // isIOS() reads navigator.userAgent — a static value that never changes,
  // so this is a plain computed const, not state.
  const isIOSDevice = isIOS();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (isInStandaloneMode()) return;

    // Don't show if dismissed recently
    const dismissed = localStorage.getItem("pwa-prompt-dismissed");
    if (dismissed && Date.now() - parseInt(dismissed) < 7 * 24 * 60 * 60 * 1000) return;

    if (isIOSDevice) {
      // Show iOS prompt after 2.5s
      const t = setTimeout(() => setShowPrompt(true), 2500);
      return () => clearTimeout(t);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show Android/desktop prompt after 2.5s
      setTimeout(() => setShowPrompt(true), 2500);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDismiss = () => {
    setShowPrompt(false);
    setShowIOSGuide(false);
    localStorage.setItem("pwa-prompt-dismissed", String(Date.now()));
  };

  const handleInstall = async () => {
    if (isIOSDevice) {
      setShowIOSGuide(true);
      return;
    }
    if (!deferredPrompt) return;
    setInstalling(true);
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setInstalling(false);
    if (outcome === "accepted") {
      setShowPrompt(false);
    } else {
      localStorage.setItem("pwa-prompt-dismissed", String(Date.now()));
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* ── Main install banner ─────────────────────────── */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[9999] animate-[slideUp_0.4s_cubic-bezier(0.34,1.56,0.64,1)]">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Gradient accent top bar */}
          <div className="h-1 bg-gradient-to-r from-primary via-primary-hover to-primary-dark" />

          <div className="p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                  <Smartphone size={22} color="#fff" />
                </div>
                <div>
                  <p className="font-heading font-bold text-text-primary text-sm m-0">Install Xpnzo</p>
                  <p className="text-xs text-text-muted mt-0.5 m-0">Add to your home screen</p>
                </div>
              </div>
              <button
                className="w-7 h-7 flex items-center justify-center rounded-md text-text-muted hover:text-text-primary hover:bg-bg transition-colors flex-shrink-0"
                onClick={handleDismiss}
                aria-label="Dismiss"
              >
                <X size={16} />
              </button>
            </div>

            {/* Feature pills */}
            <div className="flex gap-2 flex-wrap mb-4">
              {["Works offline", "Lightning fast", "No browser bar"].map((f) => (
                <span key={f} className="text-[11px] font-semibold bg-primary-light text-primary px-2.5 py-1 rounded-full">
                  {f}
                </span>
              ))}
            </div>

            {/* iOS guide */}
            {showIOSGuide ? (
              <div className="bg-bg rounded-xl p-3 space-y-2 mb-3">
                <p className="text-xs font-semibold text-text-primary m-0 mb-1">To install on iOS:</p>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <p className="text-xs text-text-secondary m-0">Tap the <Share size={11} className="inline" /> <strong>Share</strong> button in Safari</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <p className="text-xs text-text-secondary m-0">Scroll down and tap <strong>"Add to Home Screen"</strong></p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <p className="text-xs text-text-secondary m-0">Tap <strong>Add</strong> in the top right</p>
                </div>
              </div>
            ) : (
              /* CTA buttons */
              <div className="flex gap-2">
                <button
                  className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-bold font-body transition-all duration-150 hover:bg-primary-hover active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70"
                  onClick={handleInstall}
                  disabled={installing}
                >
                  {installing ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Download size={15} />
                  )}
                  {installing ? "Installing..." : "Install App"}
                </button>
                <button
                  className="py-2.5 px-4 rounded-xl text-sm font-semibold font-body text-text-secondary bg-bg border border-border transition-colors hover:border-text-muted"
                  onClick={handleDismiss}
                >
                  Not now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PWAInstallPrompt;
