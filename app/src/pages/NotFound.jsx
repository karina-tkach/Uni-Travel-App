import { Link } from "react-router-dom";
import { TravelAlt } from "healthicons-react";

export default function NotFound() {
    return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center bg-blue-50 text-[#345185] p-6">

            <TravelAlt className="w-24 h-24 text-[#345185] mb-6 opacity-80" />

            <h1 className="text-6xl font-bold mb-4">
                404
            </h1>

            <p className="text-2xl text-center max-w-lg leading-snug mb-10">
                Упс... Сторінку не знайдено.<br/>
                Але нові пригоди вже чекають на тебе!
            </p>

            <Link
                to="/"
                className="
          bg-[#345185]
          hover:bg-[#2b416c]
          text-white
          px-8 py-4
          rounded-xl
          text-xl
          transition
          shadow-lg
        "
            >
                Повернутися на головну
            </Link>
        </div>
    );
}
