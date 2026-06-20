interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  titleColor?: string;
}

export default function StatCard({
  title,
  value,
  description,
  titleColor = "text-gray-700",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all duration-300 hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.15)] hover:-translate-y-1 flex flex-col gap-1">
      <h3 className={`font-semibold ${titleColor} text-sm uppercase tracking-wide opacity-80`}>{title}</h3>
      <p className="font-bold text-2xl sm:text-3xl text-gray-900 mt-1">{value}</p>
      <p className="font-medium text-xs sm:text-sm text-gray-500 mt-2 bg-gray-50 inline-block px-2 py-1 rounded-md self-start">{description}</p>
    </div>
  );
}