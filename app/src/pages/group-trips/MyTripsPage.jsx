import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchData} from "../../utils/fetch.jsx";
import {useLoading} from "../../utils/useLoading.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {GroupTripCard} from "../../components/group-trips/GroupTripCard.jsx";
import {ArrowDown} from "lucide-react";

export default function MyTripsPage() {
    const [myCreatedTrips, setMyCreatedTrips] = useState([]);
    const [myJoinedTrips, setMyJoinedTrips] = useState([]);
    const navigate = useNavigate();
    const {loading, start, stop} = useLoading();
    const {loadingJoined, startJoined, stopJoined} = useLoading();

    const fetchMyJoinedTrips = async () => {
        await fetchData({
            url: `/api/group-trips/my-joined-trips`,
            method: "GET",
            onSuccess: (data) => setMyJoinedTrips(data || []),
            navigate,
            onStart: startJoined,
            onFinally: stopJoined,
        });
    };

    const fetchMyCreatedTrips = async () => {
        await fetchData({
            url: `/api/group-trips/my-trips`,
            method: "GET",
            onSuccess: (data) => setMyCreatedTrips(data || []),
            navigate,
            onStart: start,
            onFinally: stop,
        });
    };

    const fetchAll = async () => {
        await Promise.all([
            fetchMyCreatedTrips(),
            fetchMyJoinedTrips()
        ]);
    }

    useEffect(() => {
        fetchAll();
    }, []);

    if (loading || loadingJoined) {
        return <LoadingPage/>;
    }


    return (
        <>
        <div className="page-container p-6">
            <div className="page-header flex items-center justify-between mb-6">
                <h1 className="font-bold text-blue-800 text-[45px]">Мої Створені Групові подорожі</h1>
            </div>

            {/* Empty state */}
            {!loading && myCreatedTrips.length === 0 && (
                <p>Немає групових подорожей!</p>
            )}

            {/* Items */}
            <div className="grid grid-cols-3 gap-[70px] my-6">
                {myCreatedTrips?.map((trip, index) => (
                    <GroupTripCard key={index}
                                   item={trip}
                                   path={"/group-trips/details/" + trip.id}
                    isMyTrip={true} onChanged={fetchMyCreatedTrips}/>
                ))}
            </div>
        </div>

            <div className="page-container p-6">
                <div className="page-header flex items-center justify-between mb-6">
                    <h1 className="font-bold text-blue-800 text-[45px]">Мої Приєднані Групові подорожі</h1>
                </div>

                {/* Empty state */}
                {!loadingJoined && myJoinedTrips.length === 0 && (
                    <p>Немає групових подорожей!</p>
                )}

                {/* Items */}
                <div className="grid grid-cols-3 gap-[70px] my-6">
                    {myJoinedTrips?.map((trip, index) => (
                        <GroupTripCard key={index}
                                       item={trip}
                                       path={"/group-trips/details/" + trip.id}/>
                    ))}
                </div>
            </div>
            </>
    );
}