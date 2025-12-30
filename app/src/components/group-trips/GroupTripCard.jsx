import {Stars} from "../offers/Stars.jsx";
import {Info, Trash2} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import {fetchData} from "../../utils/fetch.jsx";

export function GroupTripCard({ item, path, isMyTrip = false, onChanged = () => { }   }) {
    const navigate = useNavigate();

    const handleDelete = async () => {
        if (!window.confirm("Ви впевнені, що хочете видалити цю групову подорож?")) return;

        await fetchData({
            url: `/api/group-trips?id=${item.id}`,
            method: "DELETE",
            navigate,
            onSuccess: onChanged
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col p-2">

            <div className="relative overflow-hidden rounded-2xl">
                {isMyTrip && <button
                    onClick={handleDelete}
                    className={`absolute top-3 right-3 cursor-pointer p-4 rounded-lg bg-gray-300/40  text-gray-800 text-2xl transition`}>
                    <Trash2 className="w-5 h-5 text-red-600" />
                </button>}
                {item.mainImageUrl && (
                    <img
                        src={item.mainImageUrl}
                        alt={item.name}
                        className="w-full h-60 object-cover"
                    />
                )}
            </div>

            <div className="flex flex-col flex-grow">
                <h1
                    className="mt-3 text-2xl font-bold text-green-800 flex items-center justify-between hover:text-green-600"
                >
                    {item.name}
                </h1>
                <p className="mt-1 text-gray-600 flex items-center gap-2">
                    Тип відпочинку: {item.entertainmentType}
                </p>
                <div className="mt-auto flex flex-col gap-2">

                    <p className="mt-1 text-gray-600 flex items-center gap-2">
                        <Info className="w-4 h-4 text-green-500" />
                        Макс. к-ть учасників: {item.maxParticipants}
                    </p>


                    <div className="flex w-full row justify-end gap-2">
                        Творець: {item.createdBy.name + " " + item.createdBy.surname}
                    </div>

                    <Link
                        to={path}
                        className="w-full bg-blue-800 text-white py-2 rounded-lg mt-3 flex items-center justify-center hover:bg-blue-900"
                    >
                        Детальніше
                    </Link>
                </div>
            </div>
        </div>

    );
}
