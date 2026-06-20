import Image from "next/image";

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

export function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-3 mb-2">
      {/* Logo visible only on mobile (desktop shows it in the left panel) */}
      <Image
        src="/logo.png"
        alt="Jupi Solutions Logo"
        width={100}
        height={100}
        quality={100}
        priority
        className="block sm:hidden drop-shadow-md"
      />
      <h1 className="font-bold text-2xl sm:text-3xl text-center">{title}</h1>
      <p className="opacity-60 text-center text-sm">{subtitle}</p>
    </div>
  );
}
