import {useEffect, useState} from "react";
import {useLocation, useNavigate, useParams, Link} from "react-router-dom";
import {useLoading} from "../../utils/useLoading.jsx";
import {fetchData} from "../../utils/fetch.jsx";
import LoadingPage from "../LoadingPage.jsx";
import {Stars} from "../../components/offers/Stars.jsx";
import {Heart} from "lucide-react";
import {useAuth} from "../../context/AuthContext.jsx";

export default function TransportDetailsPage() {
    const [transport, setTransport] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();
    const { loading, start, stop } = useLoading();
    const [showFullDescription, setShowFullDescription] = useState(false);
    const { user } = useAuth();


    useEffect(() => {
        const fetchTransport = async () => {
            await fetchData({
                url: `/api/transport/${id}`,
                method: "GET",
                onSuccess: (data) => setTransport(data || []),
                navigate,
                onStart: start,
                onFinally: stop
            });
        };

        fetchTransport();
    }, [id, navigate]);

    if (loading) {
        return <LoadingPage/>;
    }

    return (
        <div className="max-w-6xl mx-auto bg-white mt-2 p-6 flex flex-col md:flex-row gap-6">
            <div className="flex flex-col md:w-1/2 gap-3">
                <div className="w-full h-96 bg-gray-200 rounded-2xl overflow-hidden">
                    {transport.imageUrl && (
                        <img
                            src={transport.imageUrl}
                            alt={transport.pointA}
                            className="w-full h-full object-cover"
                        />
                    )}
                </div>
            </div>

            <div className="md:w-1/2 flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-blue-900">{transport.pointA + "-" +
                        transport.pointB}</h1>
                    </div>

                    <div className="flex items-center mt-2 gap-2">
                        {transport.rating && (
                            <Stars rating={transport.rating} />
                        )
                        }
                    </div>

                    <div className="mt-4 text-gray-700">
                        <p>
                            {showFullDescription
                                ? transport.description
                                : `${transport.description?.slice(0, 250)}${transport.description?.length > 250 ? "..." : ""}`}
                        </p>
                        {transport.description?.length > 150 && (
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
                        <h2 className="font-bold text-lg text-[#365287] mb-2">{transport.travelDate}</h2>
                        <p className="text-gray-600 mb-2">
                            {transport.transportType}
                            <br/>
                            Вільних місць: {transport.availableSeats}
                        </p>
                        <div className="flex items-center justify-between">
                            <p className="font-bold text-[#365287] text-lg">{Math.round(transport.price)} грн</p>
                            <a href={user!=null ? transport.bookingUrl : "/login"} target="_blank" rel="noopener noreferrer" className="mt-2 w-[60%] bg-[#365287] text-center text-white py-2 rounded-lg hover:bg-blue-900 transition">
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