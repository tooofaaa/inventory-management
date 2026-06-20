import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row items-center justify-around h-screen">
      <Image
        src="/logo.png"
        width={32}
        height={32}
        alt="Logo"
        className="mr-2 hidden sm:block"
      />

      {children}
    </div>
  );
}
