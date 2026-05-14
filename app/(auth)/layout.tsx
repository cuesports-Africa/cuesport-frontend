import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - CueSports Africa",
  description: "Sign in or create an account for CueSports Africa.",
  robots: { index: false, follow: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
