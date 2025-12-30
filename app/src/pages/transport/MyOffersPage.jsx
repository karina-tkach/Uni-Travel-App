import { useEffect, useState } from "react";
import { fetchData } from "../../utils/fetch.jsx";
import { useLoading } from "../../utils/useLoading.jsx";
import { useNavigate } from "react-router-dom";
import MyTransportCard from "../../components/transport/MyTransportCard.jsx";
import TransportFormModal from "../../components/transport/TransportFormModal.jsx";

export default function MyOffersPage() {
    const navigate = useNavigate();
    const loading = useLoading();

    const [offers, setOffers] = useState([]);
    const [showAdd, setShowAdd] = useState(false);

    const loadOffers = async () => {
        await fetchData({
            url: "/api/transport",
            method: "GET",
            navigate,
            onStart: loading.start,
            onFinally: loading.stop,
            onSuccess: data => setOffers(data || [])
        });
    };

    useEffect(() => {
        loadOffers();
    }, []);

    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Менеджмент транспорту</h1>

                <button
                    onClick={() => setShowAdd(true)}
                    className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
                >
                    + Додати транспорт
                </button>
            </div>

            {loading.loading ? (
                <div className="text-center py-20 text-lg font-semibold text-blue-800">
                    Завантаження...
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {offers.length === 0 && (
                        <p className="italic text-gray-500">Транспортів поки немає</p>
                    )}

                    {offers?.map(o => (
                        <MyTransportCard
                            key={o.id}
                            offer={o}
                            onChanged={loadOffers}
                        />
                    ))}
                </div>
            )}

            {showAdd && (
                <TransportFormModal
                    mode="create"
                    onClose={() => setShowAdd(false)}
                    onSuccess={loadOffers}
                />
            )}
        </div>
    );
}
