import {Stars} from "../offers/Stars.jsx";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";
import {useState} from "react";

export function PlaceCard({ item, onSave, onAdd }) {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [clicked, setClicked] = useState(false);


    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col p-2">
            <div className="relative overflow-hidden rounded-2xl">
                {item.imageUrl && (
                    <img
                        src={`/api/places/images/proxy?url=${encodeURIComponent(item.imageUrl)}`}
                        alt={item.name}
                        className="w-full h-60 object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                )}
                {onAdd ? (
                    <button
                        onClick={() => {
                            setClicked(!clicked);
                            onAdd?.();
                        }}
                        className={`absolute top-3 right-3 text-white text-2xl px-3 rounded 
        ${clicked ? "bg-red-600 hover:bg-red-800" : "bg-green-600 hover:bg-green-800"}
    `}>
                        +
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            if (user?.username != null) {
                                onSave(item);
                            } else {
                                navigate("/login");
                            }
                        }
                    }
                        className={`absolute top-3 right-3 px-2 rounded-lg bg-gray-300/40  text-gray-800 text-2xl transition ${
                            item?.saved ? "text-red-500 bg-gray-300/70" : ""
                        }`}>
                        ♥
                    </button>)}
            </div>

            <div className="flex flex-col flex-grow">
                <h1
                    className="mt-3 text-2xl font-bold text-green-800 flex items-center justify-between hover:text-green-600"
                >
                    {item.name}
                </h1>
                <p className="mt-1 text-gray-900 flex items-center gap-2">
                    Тип: {item.type}
                </p>
                <p className="mt-1 text-gray-600 italic flex items-center gap-2">
                    Адреса: {item.fullAddress}
                </p>
                <div className="mt-auto flex flex-col gap-2">

                    <div className="flex w-full row justify-end gap-2">
                        <Stars rating={item?.rating * 2} />
                    </div>

                    <Link
                        to={item.mapsUrl}
                        className="w-full bg-blue-800 text-white py-2 rounded-lg mt-3 flex items-center justify-center hover:bg-blue-900"
                    >
                        Детальніше
                    </Link>
                </div>
            </div>
        </div>

    );
}
