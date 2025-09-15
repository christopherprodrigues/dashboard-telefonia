interface KpiCardProps {
    title: string;
    value: string | number;
}

export function KpiCard({ title, value }: KpiCardProps) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
            <h3 className="text-sm font-medium text-gray-500 tracking-wider">{title}</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
    );
}