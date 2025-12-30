import UkraineCityInput from "./UkraineCityInput.jsx";

export default function PlacesSearchBar({ value, onChange, onSearch }) {

    return (
        <div className="bg-white rounded-2xl shadow p-6 mt-2 border-4 border-blue-900 flex gap-6 items-end flex-wrap">
            <div className="flex flex-col flex-1 min-w-[200px]">
                <label className="text-sm text-gray-600 mb-1">Оберіть місто</label>
                <UkraineCityInput
                    value={value}
                    onChange={onChange}
                    placeholder="Місто"
                />
            </div>
            <button
                onClick={onSearch}
                className="bg-[#365287] text-white px-8 py-2 rounded-xl hover:opacity-80 disabled:opacity-50"
            >
                Знайти
            </button>
        </div>
    );
}
