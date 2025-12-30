import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchData} from "../../utils/fetch.jsx";
import {useLoading} from "../../utils/useLoading.jsx";
import {useAuth} from "../../context/AuthContext.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {ItemCard} from "../../components/hotel/ItemCard.jsx";
import {TransportCard} from "../../components/transport/TransportCard.jsx";
import {PlaceCard} from "../../components/places/PlaceCard.jsx";

export default function GroupTripPage() {
    const { id } = useParams();
    const { loading, start, stop } = useLoading();
    const [trip, setTrip] = useState([]);
    const navigate = useNavigate();
    const { user } = useAuth();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isCreator, setIsCreator] = useState(false);
    const [isParticipant, setIsParticipant] = useState(false);



    useEffect(() => {
        const fetchTrip = async () => {
            await fetchData({
                url: `/api/group-trips/search/${id}`,
                method: "GET",
                onSuccess: (data) => setTrip(data || []),
                navigate,
                onStart: start,
                onFinally: stop
            });
        };

        fetchTrip();
    }, [id, navigate]);

    useEffect(() => {
        if (!trip.id) return;

        const fetchCreatedTrips = async () => {
            await fetchData({
                url: `/api/group-trips/my-trips`,
                method: "GET",
                onSuccess: (data) => setIsCreator(data.some(trip1 => trip1.id === trip.id)),
                navigate
            });
        };

        fetchCreatedTrips();
    }, [trip, navigate]);

    useEffect(() => {
        if (!trip.id) return;

        const fetchAddedTrips = async () => {
            await fetchData({
                url: `/api/group-trips/my-joined-trips`,
                method: "GET",
                onSuccess: (data) => setIsParticipant(data.some(trip1 => trip1.id === trip.id)),
                navigate
            });
        };

        fetchAddedTrips();
    }, [trip, navigate]);

    const handleJoin = async () => {
        if (!trip.id) return;
        const addParticipant = async () => {
            await fetchData({
                url: `/api/group-trips/add-participant`,
                method: "PUT",
                body: trip,
                onSuccess: (data) => {
                    setTrip(data);
                    setIsParticipant(true);
                },
                navigate
            });
        };

        addParticipant();
    };

    const handleLeave = async () => {
        if (!trip.id) return;
        const deleteParticipant = async () => {
            await fetchData({
                url: `/api/group-trips/delete-participant`,
                method: "PUT",
                body: trip,
                onSuccess: (data) => {
                    setTrip(data);
                    setIsParticipant(false);
                },
                navigate
            });
        };

        deleteParticipant();
    };

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className="flex gap-8 px-10 py-8">
            {/* Left side - cards */}
            <div className="flex-1 flex flex-col gap-6">
                {/* Housing */}
                {trip.housingDetail && (
                    <ItemCard
                        item={trip.housingDetail}
                        path={`${trip.housingDetail.url}`}
                    />
                )}

                {trip.transportOffer && (
                    <TransportCard
                        item={trip.transportOffer}
                        path={`/transport/details/${trip.transportOffer.id}`}
                    />
                )}

                {/* Place offers */}
                <div className="grid grid-cols-2 gap-6">
                    {trip?.placeOffers?.map((place) => (
                        <PlaceCard key={place.id} item={place} />
                    ))}
                </div>
            </div>

            {/* Right side - group info */}
            <div className="w-[650px] bg-gray-100 p-6 rounded-xl flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-2">{trip.name}</h2>
                    <div className="flex items-center gap-2 justify-between">
                    <h2 className="text-xl font-bold mb-2">{trip.transportOffer?.travelDate}</h2>
                        <h2 className="text-xl font-bold mb-2">Ціна: {trip.housingDetail?.price+trip.transportOffer?.price}</h2>
                    </div>
                    <div className="mt-4 text-gray-700">
                        <p>
                            {showFullDescription
                                ? trip.description
                                : `${trip.description?.slice(0, 250)}${trip.description?.length > 250 ? "..." : ""}`}
                        </p>
                        {trip.description?.length > 150 && (
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-blue-700 mt-1 underlinetext-sm"
                            >
                                {showFullDescription ? "Згорнути" : "Детальніше"}
                            </button>
                        )}
                    </div>

                    <div className="mt-4 border-2 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Учасники групи</h3>
                    <ul className="mb-4 list-disc list-inside">
                        {!trip?.participants?.length && <p className="italic">Учасників поки немає</p>}
                        {trip?.participants?.map((p) => (
                            <li key={p.id}>{p.email} {p.name} {p.surname}</li>
                        ))}
                    </ul>
                        {(user && user.username !== null && !isCreator) && <div className="flex gap-4">
                            {isParticipant ? (<button onClick={handleLeave} className="flex-1 py-2 rounded border border-gray-400">Від'єднатись</button>) :
                                (<button onClick={handleJoin} className="flex-1 py-2 rounded bg-blue-700 text-white hover:bg-blue-800">Приєднатись</button>)}
                    </div>}
                    </div>
                </div>


            </div>
        </div>
    );
}