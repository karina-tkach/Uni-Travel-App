import {Stars} from "../offers/Stars.jsx";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

export function ItemCard({ item, path,
                         checkIn = null, checkOut = null,
                             onAdd, isSelected  }) {

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col p-2">
            <div className="relative overflow-hidden rounded-2xl">
                {item.imageUrl && (
                    <img
                        src={item.imageUrl}
                        alt={item.label}
                        className="w-full h-60 object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                )}
                {onAdd && (
                        <button
                            onClick={() => {
                                onAdd?.();
                            }}
                            className={`absolute top-3 right-3 text-white text-2xl px-3 rounded 
        ${isSelected ? "bg-red-600 hover:bg-red-800" : "bg-green-600 hover:bg-green-800"}
    `}>
                            +
                        </button>
                    )}
            </div>

            <div className="flex flex-col flex-grow">
                <h1
                    className="mt-3 text-2xl font-bold text-green-800 flex items-center justify-between hover:text-green-600"
                >
                    {item.label}
                </h1>
                <p className="mt-1 text-gray-600 flex items-center gap-2">
                    Локація: {item.city}
                </p>
                <div className="mt-auto flex flex-col gap-2">

                <p className="mt-1 text-gray-600 flex items-center gap-2">
                    <Info className="w-4 h-4 text-green-500" />
                    {Math.round(item.price)} грн
                </p>


                <div className="flex w-full row justify-end gap-2">
                <Stars rating={item.reviewScore} />
                </div>

                <Link
                    to={path}
                    state={{ checkIn: checkIn, checkOut: checkOut }}
                    className="w-full bg-blue-800 text-white py-2 rounded-lg mt-3 flex items-center justify-center hover:bg-blue-900"
                >
                    Детальніше
                </Link>
                </div>
            </div>
        </div>

    );
}
