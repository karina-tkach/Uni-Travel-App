import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../utils/fetch.jsx";
import { useLoading } from "../../utils/useLoading.jsx";
import {GroupTripCard} from "../../components/group-trips/GroupTripCard.jsx";
import {ArrowDown} from "lucide-react";
import {useAuth} from "../../context/AuthContext.jsx";

const GroupsTripsPage = () => {
    const navigate = useNavigate();
    const { loading, start, stop } = useLoading();

    const [groupTrips, setGroupTrips] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const {user} = useAuth();

    const fetchGroupTrips = async (page = 1) => {
        await fetchData({
            url: `/api/group-trips/search?pageNumber=${page}`,
            method: "GET",
            navigate,
            onStart: start,
            onFinally: stop,
            onSuccess: data => {
                if (page === 1) {
                    setGroupTrips(data);
                } else {
                    setGroupTrips(prev => [...prev, ...data]);
                }

                setHasMore(data.length > 0);
            }
        });

    };

    useEffect(() => {
        fetchGroupTrips();
    }, [navigate]);

    const loadMoreGroupTrips = async () => {
        const nextPage = page + 1;
        setPage(nextPage);
        await fetchGroupTrips(nextPage);
    };

    return (
        <div className="page-container p-6">
            <div className="page-header flex items-center justify-between mb-6">
                <h1 className="font-bold text-blue-800 text-[45px]">Групові подорожі</h1>

                {(user && user.username !== null) && <button
                    className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 text-[20px]"
                    onClick={() => navigate("/offers", { state: { mode: "GROUP_CREATE" } })}
                >
                    + Створити групову подорож
                </button>}
            </div>

            {/* Loading */}
            {loading && <p>Завантаження групових подорожей...</p>}

            {/* Empty state */}
            {!loading && groupTrips.length === 0 && (
                <p>Немає групових подорожей!</p>
            )}

            {/* Items */}
            <div className="grid grid-cols-3 gap-[70px] my-6">
                {groupTrips?.map((trip, index) => (
                    <GroupTripCard key={index}
                                   item={trip}
                                   path={"/group-trips/details/" + trip.id}/>
                ))}
            </div>
            {hasMore && (
                <div className="flex justify-center py-10">
                    <button
                        onClick={loadMoreGroupTrips}
                        disabled={loading && groupTrips.length > 0}
                        className={`
                                    w-14 h-14 flex items-center justify-center
                                    rounded-full border-4 border-blue-700
                                    transition
                                    ${(loading && groupTrips.length > 0) ? "opacity-50 cursor-not-allowed bg-gray-600" : "hover:bg-gray-100"}
                                `}
                    >
                        <ArrowDown className={`w-6 h-6 text-blue-700 ${(loading && groupTrips.length > 0) && "animate-pulse"}`} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default GroupsTripsPage;
