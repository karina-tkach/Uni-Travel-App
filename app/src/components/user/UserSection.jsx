import {fetchData} from "../../utils/fetch.jsx";
import {useNavigate} from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function UserSection({ title, users, loading, onDelete, isPartner = false }) {
    const navigate = useNavigate();
    const handleDelete = async (userId) => {
        const confirmed = window.confirm("Ви впевнені, що хочете видалити цього користувача?");
        if (!confirmed) return;

        await fetchData({
            url: `/api/users?id=${userId}`,
            method: "DELETE",
            navigate,
            onStart: () => {},
            onFinally: () => {},
            onSuccess: () => {
                onDelete?.();
            },
        });
    };
    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">{title}</h2>

            {loading ? (
                <div className="flex items-center justify-center w-full h-[400px] bg-blue-100">
                    <div className="flex flex-col items-center">
                        <svg
                            className="animate-spin h-10 w-10 text-blue-700 mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                        <span className="text-blue-800 text-lg font-bold">Завантаження...</span>
                    </div>
                </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users?.length == 0 && <h2 className="text-blue-900 italic">Користувачів поки немає</h2>}
                {users?.map(u => (
                    <div key={u.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
                        <div>
                        <p className="font-semibold">{u.name} {u.surname}</p>
                        <p className="text-sm text-gray-500">{u.email}</p>

                        {isPartner && (
                            <>
                                <p className="mt-2 text-sm">
                                    🏷 {u.serviceName}
                                </p>
                                <a
                                    href={u.serviceUrl}
                                    target="_blank"
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    {u.serviceUrl}
                                </a>
                            </>
                        )}
                        </div>
                        <button
                            onClick={() => handleDelete(u.id)}
                            className="text-red-600 hover:text-red-800"
                            title="Видалити користувача"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
            </div>)}
        </div>
    );
}
