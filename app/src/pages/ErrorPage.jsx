import { useLocation, useNavigate } from "react-router-dom";
import { TravelAlt } from "healthicons-react";

export default function ErrorPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const { message, code } = location.state || {
        message: "Сталася неочікувана помилка.",
        code: 500,
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-white px-4">
            <div className="
                w-full max-w-lg
                bg-white/70
                backdrop-blur-xl
                shadow-xl
                rounded-3xl
                p-10
                text-center
                border border-[#345185]/20
            ">
                {/* Icon */}
                <div className="flex justify-center mb-6 text-[#345185]">
                    <TravelAlt className="h-16 w-16 opacity-80" />
                </div>

                {/* Title */}
                <h1 className="text-5xl font-bold text-[#345185] mb-4">
                    Помилка {code}
                </h1>

                {/* Description */}
                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                    {message}
                </p>

                {/* Back button */}
                <button
                    onClick={() => navigate(-1)}
                    className="
                        bg-[#345185]
                        hover:bg-[#2b416c]
                        text-white
                        px-8 py-3
                        rounded-xl
                        transition
                        shadow-md
                        text-lg
                    "
                >
                    ← Повернутися назад
                </button>
            </div>
        </div>
    );
}
