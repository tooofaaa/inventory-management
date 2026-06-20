import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row min-h-screen">
      {/* Left branding panel - visible on desktop only */}
      <div className="hidden sm:flex flex-col items-center justify-center w-1/2 bg-[#1a2e6e] gap-6 p-12">
        <Image
          src="/logo.png"
          width={220}
          height={220}
          alt="Jupi Solutions Logo"
          quality={100}
          priority
          className="drop-shadow-2xl"
        />
        <div className="text-center">
          <h1 className="text-white text-3xl font-bold tracking-wide">Jupi Solutions</h1>
          <p className="text-blue-200 text-sm mt-2 opacity-80">Inventory Management System</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex flex-col items-center justify-center w-full sm:w-1/2 bg-white">
        {children}
      </div>
    </div>
  );
}
