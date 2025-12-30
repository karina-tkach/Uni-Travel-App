import { Pencil, Trash2, Star } from "lucide-react";
import { useState } from "react";
import TransportFormModal from "./TransportFormModal.jsx";
import { fetchData } from "../../utils/fetch.jsx";
import { useNavigate } from "react-router-dom";

export default function MyTransportCard({ offer, onChanged }) {
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);

    const handleDelete = async () => {
        if (!window.confirm("Ви впевнені, що хочете видалити цей транспорт?")) return;

        await fetchData({
            url: `/api/transport?id=${offer.id}`,
            method: "DELETE",
            navigate,
            onSuccess: onChanged
        });
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow overflow-hidden">
                <img
                    src={offer.imageUrl}
                    alt=""
                    className="h-48 w-full object-cover"
                />

                <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">
                        {offer.pointA} → {offer.pointB}
                    </h3>

                    <p className="text-sm text-gray-500">
                        {offer.transportType} · {offer.travelDate}
                    </p>

                    <p className="text-sm">{offer.description}</p>

                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{offer.rating}</span>
                        <span className="text-sm text-gray-500">
                            ({offer.availableSeats} місць)
                        </span>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                        <div>
                            {offer.oldPrice && (
                                <p className="text-sm line-through text-gray-400">
                                    {offer.oldPrice} грн
                                </p>
                            )}
                            <p className="font-bold text-green-700">
                                {offer.price} грн
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={() => setEditing(true)}>
                                <Pencil className="w-5 h-5 text-blue-600" />
                            </button>
                            <button onClick={handleDelete}>
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {editing && (
                <TransportFormModal
                    mode="edit"
                    initialData={offer}
                    onClose={() => setEditing(false)}
                    onSuccess={onChanged}
                />
            )}
        </>
    );
}
