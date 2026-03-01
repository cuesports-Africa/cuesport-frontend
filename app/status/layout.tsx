import { Header } from "@/components/layout";

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 flex justify-center">{children}</main>
    </>
  );
}
