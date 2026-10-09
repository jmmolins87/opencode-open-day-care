import LoginPanel from "@/components/auth/login-panel";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-page lg:grid-cols-[1.05fr_1fr]">
      <LoginPanel />
      <LoginForm />
    </div>
  );
}
