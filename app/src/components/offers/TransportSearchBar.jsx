import UkraineCityInput from "./UkraineCityInput.jsx";

export default function TransportSearchBar({ value, onChange, onSearch }) {
    const handleChange = (field, val) => {
        onChange({
            ...value,
            [field]: val,
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 mt-2 border-4 border-blue-900 flex gap-6 items-end flex-wrap">
            {/* Point A */}
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-sm text-gray-600 mb-1">Пункт A</label>
                <UkraineCityInput
                    value={value.pointA}
                    onChange={(val) => handleChange("pointA", val.split(",")[0].trim())}
                    placeholder="Місто відправлення"
                />
            </div>

            {/* Point B */}
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-sm text-gray-600 mb-1">Пункт B</label>
                <UkraineCityInput
                    value={value.pointB}
                    onChange={(val) => handleChange("pointB", val.split(",")[0].trim())}
                    placeholder="Місто прибуття"
                />
            </div>

            {/* Date */}
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Дата поїздки</label>
                <input
                    type="date"
                    value={value.travelDate}
                    onChange={(e) => handleChange("travelDatetravelDate", e.target.value)}
                    className="border-2 border-blue-900 rounded-lg px-3 py-2 bg-[#365287]/30"
                />
            </div>

            {/* Search Button */}
            <button
                onClick={onSearch}
                className="bg-[#365287] text-white px-8 py-2 rounded-xl hover:opacity-80 disabled:opacity-50"
            >
                Знайти
            </button>
        </div>
    );
}
