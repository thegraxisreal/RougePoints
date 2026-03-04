import { SignIn } from "@clerk/nextjs";
import { dark as clerkDark } from "@clerk/themes";

const appearance = {
  baseTheme: clerkDark,
  variables: {
    colorBackground: "#13131a",
    colorInputBackground: "#1a1a26",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "rgba(255,255,255,0.55)",
    colorTextOnPrimaryBackground: "#000000",
    colorPrimary: "#fbbf24",
    colorDanger: "#f87171",
    colorSuccess: "#34d399",
    colorNeutral: "#8b8fa8",
    borderRadius: "12px",
    fontFamily: "DM Sans, system-ui, sans-serif",
    fontSize: "14px",
  },
  elements: {
    rootBox: { width: "100%" },
    card: {
      background: "#13131a",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 32px 64px rgba(0,0,0,0.6)",
    },
    headerTitle: { color: "#ffffff", fontSize: "20px" },
    headerSubtitle: { color: "rgba(255,255,255,0.45)" },
    socialButtonsBlockButton: {
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#ffffff",
    },
    socialButtonsBlockButtonText: { color: "#ffffff", fontWeight: "500" },
    socialButtonsBlockButtonArrow: { color: "rgba(255,255,255,0.4)" },
    dividerLine: { background: "rgba(255,255,255,0.07)" },
    dividerText: { color: "rgba(255,255,255,0.3)" },
    formFieldLabel: { color: "rgba(255,255,255,0.6)", fontSize: "12px" },
    formFieldInput: {
      background: "#1a1a26",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#ffffff",
    },
    formFieldInputShowPasswordButton: { color: "rgba(255,255,255,0.4)" },
    formButtonPrimary: {
      background: "#fbbf24",
      color: "#000000",
      fontWeight: "600",
    },
    footerActionText: { color: "rgba(255,255,255,0.4)" },
    footerActionLink: { color: "#fbbf24" },
    identityPreviewText: { color: "#ffffff" },
    identityPreviewEditButton: { color: "#fbbf24" },
    formResendCodeLink: { color: "#fbbf24" },
    otpCodeFieldInput: {
      background: "#1a1a26",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "#ffffff",
    },
    alertText: { color: "rgba(255,255,255,0.7)" },
    formFieldError: { color: "#f87171" },
    badge: { background: "rgba(251,191,36,0.15)", color: "#fbbf24" },
  },
} as const;

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
      <SignIn appearance={appearance} />
    </main>
  );
}
