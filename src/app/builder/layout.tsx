import { BuilderProvider } from "@/lib/builder/store";

export default function BuilderLayout({ children }: { children: React.ReactNode }) {
  return <BuilderProvider>{children}</BuilderProvider>;
}
