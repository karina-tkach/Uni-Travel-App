import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams, Link} from "react-router-dom";
import {useLoading} from "../../utils/useLoading.jsx";
import {fetchData} from "../../utils/fetch.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {Stars} from "../../components/offers/Stars.jsx";
import {Heart} from "lucide-react";
import {useAuth} from "../../context/AuthContext.jsx";

export default function HotelDetailsPage() {
    const [hotel, setHotel] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, start, stop } = useLoading();
    const location = useLocation();
    const { checkIn, checkOut } = location.state || {};
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { user } = useAuth();

    const [search, setSearch] = useState({
        checkIn: checkIn,
        checkOut: checkOut,
        hotelId: id
    });

    useEffect(() => {
        const fetchHotel = async () => {
            await fetchData({
                url: `/api/housing/searchHotel`,
                method: "POST",
                body: search,
                onSuccess: (data) => setHotel(data || []),
                navigate,
                onStart: start,
                onFinally: stop
            });
        };

        fetchHotel();
    }, [id, navigate]);

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className="max-w-6xl mx-auto bg-white mt-2 p-6 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col md:w-1/2 gap-3">
                <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden">
                    {hotel.photos && (
                        <img
                            src={hotel.photos[0]}
                            alt={hotel.hotelName}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
                <div className="flex gap-3">
                    {hotel.photos && hotel.photos?.slice(0, 4).map((photo, idx) => (
                        <div key={idx} className="flex-1 h-24 bg-gray-200 rounded-lg overflow-hidden">
                            <img src={photo} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:w-1/2 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-blue-900">{hotel.hotelName}</h1>
                        <button className="text-red-500 hover:text-red-700">
                            <Heart className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="flex items-center mt-2 gap-2">
                        {hotel.reviewScore && (
                        <Stars rating={hotel.reviewScore} />
                        )
                        }
                    </div>

                    <div className="mt-4 text-gray-700">
                        <p>
                            {showFullDescription
                                ? hotel.description
                                : `${hotel.description?.slice(0, 250)}${hotel.description?.length > 250 ? "..." : ""}`}
                        </p>
                        {hotel.description?.length > 150 && (
                            <button
                                onClick={() => setShowFullDescription(!showFullDescription)}
                                className="text-blue-700 mt-1 underlinetext-sm"
                            >
                                {showFullDescription ? "Згорнути" : "Детальніше"}
                            </button>
                        )}
                    </div>
                </div>

                <div className="mt-6">
                    <div className="border-2 border-[#365287] rounded-2xl p-4 bg-gray-50">
                        <h2 className="font-bold text-lg text-[#365287] mb-2">Одномісний номер</h2>
                        <p className="text-gray-600 mb-2">
                            Комфортний варіант для одного гостя. В номері є всі необхідні зручності.
                        </p>
                        <div className="flex items-center justify-between">
                        <p className="font-bold text-[#365287] text-lg">{Math.round(hotel.price)} грн</p>
                            <a href={user?.username != null ? hotel.url : "/login"} target="_blank" rel="noopener noreferrer" className="mt-2 w-[60%] bg-[#365287] text-center text-white py-2 rounded-lg hover:bg-blue-900 transition">
                                <button>
                                    Забронювати
                                </button>
                            </a>

                        </div>
                    </div>

                    <Link
                        to="/offers"
                        className="mt-4 w-full border border-blue-800 text-blue-800 py-2 rounded-lg hover:bg-blue-50 transition flex justify-center items-center text-center"
                    >
                        Переглянути інші пропозиції
                    </Link>
                </div>
            </div>
        </div>
    );
}