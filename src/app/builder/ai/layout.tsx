import { AuthProvider } from "@/components/auth/AuthProvider";
import { BuilderProvider } from "@/lib/builder/store";

export default function AILayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <BuilderProvider>{children}</BuilderProvider>
    </AuthProvider>
  );
}
