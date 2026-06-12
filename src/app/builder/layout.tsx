import { AuthProvider } from "@/components/auth/AuthProvider";
import { BuilderProvider } from "@/lib/builder/store";

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BuilderProvider>{children}</BuilderProvider>
    </AuthProvider>
  );
}
