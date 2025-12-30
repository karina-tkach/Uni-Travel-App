export default function SearchBar({ value, onChange, onSearch }) {
    const regions = [
        "Вінницька область",
        "Волинська область",
        "Дніпропетровська область",
        "Житомирська область",
        "Закарпатська область",
        "Запорізька область",
        "Івано-Франківська область",
        "Київська область",
        "Кіровоградська область",
        "Львівська область",
        "Миколаївська область",
        "Одеська область",
        "Полтавська область",
        "Рівненська область",
        "Сумська область",
        "Тернопільська область",
        "Харківська область",
        "Херсонська область",
        "Хмельницька область",
        "Черкаська область",
        "Чернівецька область",
        "Чернігівська область"
    ];

    const handleChange = (field, val) => {
        onChange({
            ...value,
            [field]: val,
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 mt-2 border-4 border-blue-900 flex gap-6 items-end">
            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Заїзд</label>
                <input
                    type="date"
                    value={value.checkIn}
                    onChange={e => handleChange("checkIn", e.target.value)}
                    className="border-2 border-blue-900 rounded-lg px-3 py-2 bg-[#365287]/30"
                />
            </div>

            <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Виїзд</label>
                <input
                    type="date"
                    value={value.checkOut}
                    onChange={e => handleChange("checkOut", e.target.value)}
                    className="border-2 border-blue-900 rounded-lg px-3 py-2 bg-[#365287]/30"
                />
            </div>

            <div className="flex flex-col flex-1">
                <label className="text-sm text-gray-600 mb-1">Регіон</label>
                <select
                    value={value.region}
                    onChange={e => handleChange("region", e.target.value)}
                    className="border-2 border-blue-900 rounded-lg px-3 py-2 bg-[#365287]/30"
                >
                    {regions.map(region => (
                        <option key={region} value={region}>
                            {region}
                        </option>
                    ))}
                </select>
            </div>
            <button
                onClick={onSearch}
                className="bg-[#365287] text-white px-8 py-2 rounded-xl hover:opacity-80 disabled:opacity-50"
            >
                {"Знайти"}
            </button>
        </div>
    );
}
