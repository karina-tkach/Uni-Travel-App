import { useEffect, useState } from "react";
import {fetchData} from "../../utils/fetch.jsx";
import {useLoading} from "../../utils/useLoading.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import OfferSection from "../../components/offers/OfferSection.jsx";
import SearchBar from "../../components/offers/SearchBar.jsx";
import TransportSearchBar from "../../components/offers/TransportSearchBar.jsx";
import PlacesSearchBar from "../../components/offers/PlacesSearchBar.jsx";

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

export default function OffersPage() {
    const location = useLocation();

    const isGroupMode = location.state?.mode === "GROUP_CREATE";

    const [groupSelection, setGroupSelection] = useState({
        transport: [],
        housing: [],
        food: [],
        activities: []
    });

    const [tripType, setTripType] = useState("Активний");
    const SINGLE_CATEGORIES = ["transport", "housing"];
    const [description, setDescription] = useState("");
    const [mainImageUrl, setMainImageUrl] = useState("");
    const [maxParticipants, setMaxParticipants] = useState(5);
    const isCreateDisabled =
        groupSelection.transport.length < 1 ||
        groupSelection.housing.length < 1 ||
        !description.trim() ||
        maxParticipants < 2;

    const addToGroup = (category, item) => {
        setGroupSelection(prev => {
            const exists = prev[category].some(i => i.id === item.id);

            // toggle off if already selected
            if (exists) {
                return {
                    ...prev,
                    [category]: prev[category].filter(i => i.id !== item.id)
                };
            }

            // only one allowed
            if (SINGLE_CATEGORIES.includes(category)) {
                return {
                    ...prev,
                    [category]: [item]   // replace previous
                };
            }

            // multiple allowed
            return {
                ...prev,
                [category]: [...prev[category], item]
            };
        });
    };

    const createGroupTrip = async () => {
        const payload = {
            description: description,
            entertainmentType: tripType,
            maxParticipants: maxParticipants,
            mainImageUrl: mainImageUrl,
            transportOffer: groupSelection.transport[0],
            housingDetail: {id: groupSelection.housing[0].id,
                price: groupSelection.housing[0].price,
                reviewScore: groupSelection.housing[0].reviewScore},
            placeOffers: [...groupSelection.food, ...groupSelection.activities]
        }
        await fetchData({
            url: "/api/group-trips",
            method: "POST",
            body: payload,
            navigate,
            onSuccess: () => {
                navigate("/group-trips", { state: { success: true } });
            }
        });
    };


    const [transportItems, setTransportItems] = useState([]);
    const [transportPage, setTransportPage] = useState(1);
    const [transportHasMore, setTransportHasMore] = useState(true);


    const [housingItems, setHousingItems] = useState([]);
    const [housingPage, setHousingPage] = useState(1);
    const [housingHasMore, setHousingHasMore] = useState(true);


    const [foodItems, setFoodItems] = useState([]);
    const [foodPage, setFoodPage] = useState(1);
    const [foodHasMore, setFoodHasMore] = useState(true);

    const [activitiesItems, setActivitiesItems] = useState([]);
    const [activitiesPage, setActivitiesPage] = useState(1);
    const [activitiesHasMore, setActivitiesHasMore] = useState(true);

    const navigate = useNavigate();
    const transportLoading = useLoading();
    const housingLoading = useLoading();
    const foodLoading = useLoading();
    const activitiesLoading = useLoading();

    const today = new Date();
    const weekLater = new Date();
    weekLater.setDate(today.getDate() + 7);

    const [search, setSearch] = useState({
        checkIn: formatDate(today),
        checkOut: formatDate(weekLater),
        region: "Черкаська область",
    });
    const [city, setCity] = useState("Черкаси, Черкаська область");

    const [searchData, setSearchData] = useState({
        pointA: "Багачеве",
        pointB: "Черкаси",
        travelDate: "2025-12-25"
    });

    const [savedIds, setSavedIds] = useState(new Set());

    const fetchSaved = async () => {
        await fetchData({
            url: "/api/places/my_savings",
            method: "GET",
            navigate,
            onSuccess: data => {
                setSavedIds(new Set(data.map(p => p.id)));
            }
        });
    };

    const savePlace = async (item) => {
        await fetchData({
            url: `/api/places/manage_saving`,
            method: "POST",
            body: {
                id: item.id,
                name: item.name,
                category: item.category,
                fullAddress: item.fullAddress,
                rating: item.rating,
                imageUrl: item.imageUrl,
                mapsUrl: item.mapsUrl,
                type: item.type
            },
            navigate,
            onSuccess: () => {
                setFoodItems(prev =>
                    prev.map(i =>
                        i.id === item.id ? { ...i, saved: !i.saved } : i
                    )
                );
                setActivitiesItems(prev =>
                    prev.map(i =>
                        i.id === item.id ? { ...i, saved: !i.saved } : i
                    )
                );
                setSavedIds(prev => {
                    const newSet = new Set(prev);
                    if (newSet.has(item.id)) {
                        newSet.delete(item.id);
                    } else {
                        newSet.add(item.id);
                    }
                    return newSet;
                });
            }
        });
    }

    const fetchHousing = async (page = 1) => {
        await fetchData({
            url: `/api/housing/search?pageNumber=${page}`,
            method: "POST",
            body: search,
            navigate,
            onStart: housingLoading.start,
            onFinally: housingLoading.stop,
            onSuccess: data => {
                if (page === 1) {
                    setHousingItems(data);
                } else {
                    setHousingItems(prev => [...prev, ...data]);
                }

                setHousingHasMore(data.length > 0);
            }
        });
    };

    const fetchTransport = async (page = 1) => {
        await fetchData({
            url: `/api/transport/search?pageNumber=${page}`,
            method: "POST",
            body: searchData,
            navigate,
            onStart: transportLoading.start,
            onFinally: transportLoading.stop,
            onSuccess: data => {
                if (page === 1) {
                    setTransportItems(data);
                } else {
                    setTransportItems(prev => [...prev, ...data]);
                }

                setTransportHasMore(data.length > 0);
            }
        });
    };

    const fetchFood = async (page = 1) => {
        await fetchData({
            url: `/api/places/search?pageNumber=${page}`,
            method: "POST",
            body: {city: city, placeType: "FOOD"},
            navigate,
            onStart: foodLoading.start,
            onFinally: foodLoading.stop,
            onSuccess: data => {
                const enriched = data.map(i => ({
                    ...i,
                    saved: savedIds.has(i.id)  // use latest savedIds
                }));

                setFoodItems(prev => page === 1 ? enriched : [...prev, ...enriched]);
                setFoodHasMore(data.length > 0);
            }
        });
    };

    const fetchActivities = async (page = 1) => {
        await fetchData({
            url: `/api/places/search?pageNumber=${page}`,
            method: "POST",
            body: {city: city, placeType: "ACTIVITIES"},
            navigate,
            onStart: activitiesLoading.start,
            onFinally: activitiesLoading.stop,
            onSuccess: data => {
                const enriched = data.map(i => ({
                    ...i,
                    saved: savedIds.has(i.id)  // use latest savedIds
                }));

                setActivitiesItems(prev => page === 1 ? enriched : [...prev, ...enriched]);

                setActivitiesHasMore(data.length > 0);
            }
        });
    };

    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    useEffect(() => {
        setFoodItems(prev => prev.map(i => ({ ...i, saved: savedIds.has(i.id) })));
        setActivitiesItems(prev => prev.map(i => ({ ...i, saved: savedIds.has(i.id) })));
    }, [savedIds]);


    const loadMoreHousing = async () => {
        const nextPage = housingPage + 1;
        setHousingPage(nextPage);
        await fetchHousing(nextPage);
    };

    const loadMoreTransport = async () => {
        const nextPage = transportPage + 1;
        setTransportPage(nextPage);
        await fetchTransport(nextPage);
    };

    const loadMoreFood = async () => {
        const nextPage = foodPage + 1;
        setFoodPage(nextPage);
        await fetchFood(nextPage);
    };

    const loadMoreActivities = async () => {
        const nextPage = activitiesPage + 1;
        setActivitiesPage(nextPage);
        await fetchActivities(nextPage);
    };

    const onSearch = async () => {
        setHousingPage(1);
        setHousingHasMore(true);
        setTransportPage(1);
        setTransportHasMore(true);
        setFoodPage(1);
        setFoodHasMore(true);
        setActivitiesPage(1);
        setActivitiesHasMore(true);
        setCity(search.region);
        await fetchAll()
    };

    const fetchAll = async () => {


        await Promise.all([
            fetchTransport(transportPage),
            fetchHousing(housingPage),
            fetchFood(foodPage),
            fetchActivities(activitiesPage)
        ]);
    }

    useEffect(() => {
        fetchSaved();
        fetchAll();
    }, [navigate]);

    return (
        <div className="px-[100px]">
            <SearchBar
                value={search}
                onChange={setSearch}
                onSearch={onSearch}
            />
            <OfferSection loading={housingLoading.loading} categoryName={"Проживання"} loadingMore={housingLoading.loading && housingItems.length > 0}
                          hasMore={housingHasMore}
                          onLoadMore={loadMoreHousing} items={housingItems} path={"/housing/details"}
                          checkIn={search.checkIn}
                          checkOut={search.checkOut}
                          isGroupMode={isGroupMode}
                          selectedIds={groupSelection.housing.map(i => i.id)}
                          onAdd={addToGroup}/>

            <TransportSearchBar
                value={searchData}
                onChange={setSearchData}
                onSearch={() => fetchTransport(1)}
            />
            <OfferSection loading={transportLoading.loading} categoryName={"Транспорт"}
                          loadingMore={transportLoading.loading && transportItems.length > 0}
                          hasMore={transportHasMore}
                          onLoadMore={loadMoreTransport} items={transportItems}
                          path={"/transport/details"}
                          isGroupMode={isGroupMode}
                          onAdd={addToGroup}
                          selectedIds={groupSelection.transport.map(i => i.id)}/>

            <PlacesSearchBar
                value={city}
                onChange={setCity}
                onSearch={() => {
                    Promise.all([
                        fetchFood(1),
                        fetchActivities(1)
                    ]);
                }
            }
            />
            <OfferSection loading={foodLoading.loading} categoryName={"Заклади Харчування"}
                          loadingMore={foodLoading.loading && foodItems.length > 0}
                          hasMore={foodHasMore}
                          onLoadMore={loadMoreFood} items={foodItems}
            onSave={savePlace} isGroupMode={isGroupMode}
                          onAdd={addToGroup}/>
            <OfferSection loading={activitiesLoading.loading} categoryName={"Розваги"}
                          loadingMore={activitiesLoading.loading && activitiesItems.length > 0}
                          hasMore={activitiesHasMore}
                          onLoadMore={loadMoreActivities} items={activitiesItems}
            onSave={savePlace} isGroupMode={isGroupMode}
                          onAdd={addToGroup}/>

            {isGroupMode && (
                <div className="my-10 bg-gray-100 p-6 rounded-xl">
                    <h3 className="text-2xl font-bold mb-6">Налаштування групової подорожі</h3>

                    {/* 📝 Опис */}
                    <div className="mb-6">
                        <label className="block font-semibold mb-2">
                            Опис подорожі
                        </label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Опишіть ідею подорожі, очікування, деталі..."
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                            rows={4}
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block font-semibold mb-2">
                            Посилання на головне фото (необов'язково)
                        </label>
                        <input
                            value={mainImageUrl}
                            onChange={e => setMainImageUrl(e.target.value)}
                            placeholder="Залиште пустим для додавання дефолтного фото"
                            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    {/* 👥 Макс учасників */}
                    <div className="mb-6">
                        <label className="block font-semibold mb-2">
                            Максимальна кількість учасників
                        </label>
                        <input
                            type="number"
                            min={2}
                            max={50}
                            value={maxParticipants}
                            onChange={e => setMaxParticipants(Number(e.target.value))}
                            className="w-40 p-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 outline-none"
                        />
                    </div>

                    {/* 🎯 Тип відпочинку */}
                    <div className="mb-6">
                        <h3 className="text-xl font-bold mb-4">Тип відпочинку</h3>

                        {["Активний", "Розважальний", "Культурний"].map(type => (
                            <label key={type} className="mr-6 cursor-pointer">
                                <input
                                    type="radio"
                                    value={type}
                                    checked={tripType === type}
                                    onChange={() => setTripType(type)}
                                />
                                <span className="ml-2">{type}</span>
                            </label>
                        ))}
                    </div>

                    {/* ✅ Кнопка */}
                    <button
                        onClick={createGroupTrip}
                        disabled={isCreateDisabled}
                        className="mt-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-xl transition"
                    >
                        Створити групову подорож
                    </button>
                </div>
            )}

        </div>

    );
}
