import Image from "next/image";

interface DashboardStatProps {
  title: string;
  value: string | number;
  icon: string;
  color?: string;
}

export default function DashboardStat({ title, value, icon, color = "text-gray-600" }: DashboardStatProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 w-full py-4 bg-white rounded-2xl border border-gray-100 shadow-[0_4px_14px_0_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_6px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1">
      <div className="p-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full shadow-sm">
         <Image src={icon} width={32} height={32} alt={title} className="opacity-90 hover:opacity-100 transition-opacity" />
      </div>
      <div className="flex flex-col items-center">
        <p className={`font-extrabold text-2xl ${color}`}>{value}</p>
        <h3 className="text-sm text-gray-500 font-semibold uppercase tracking-wider mt-1">{title}</h3>
      </div>
    </div>
  );
}