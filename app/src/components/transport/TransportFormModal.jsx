import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { fetchData } from "../../utils/fetch.jsx";
import { useNavigate } from "react-router-dom";

export default function TransportFormModal({
                                               mode,
                                               onClose,
                                               onSuccess,
                                               initialData
                                           }) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            pointA: "",
            pointB: "",
            travelDate: "",
            transportType: "",
            description: "",
            price: "",
            oldPrice: "",
            rating: "",
            availableSeats: "",
            imageUrl: "",
            bookingUrl: ""
        }
    });

    useEffect(() => {
        if (initialData) {
            reset({
                ...initialData
            });
        }
    }, [initialData, reset]);

    const onSubmit = async (data) => {
        await fetchData({
            url:"/api/transport",
            method: mode === "create" ? "POST" : "PUT",
            body: data,
            navigate,
            onSuccess: () => {
                onSuccess();
                onClose();
            }
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white w-full max-w-2xl rounded-xl p-6 space-y-4"
            >
                <h2 className="text-xl font-semibold">
                    {mode === "create" ? "Додати транспорт" : "Редагувати транспорт"}
                </h2>
                {errors && Object.keys(errors).length > 0 && (<p className="text-red-500">Поля є обов'язковими</p> )}

                <div className="grid grid-cols-2 gap-4">
                    <input {...register("pointA", { required: true })} placeholder="Пункт А" className="input border-2 p-2 rounded-md" />
                    <input {...register("pointB", { required: true })} placeholder="Пункт Б" className="input border-2 p-2 rounded-md" />
                    <input type="date" {...register("travelDate", { required: true })} className="input border-2 p-2 rounded-md" />
                    <input {...register("transportType", { required: true })} placeholder="Тип транспорту" className="input border-2 p-2 rounded-md" />
                    <input type="number" {...register("price", { required: true })} placeholder="Ціна" className="input border-2 p-2 rounded-md" />
                    <input type="number" {...register("oldPrice")} placeholder="Стара ціна" className="input border-2 p-2 rounded-md" />
                    <input type="number" {...register("availableSeats", { required: true })} placeholder="Місця" className="input border-2 p-2 rounded-md" />
                    <input type="number" step="0.1" min="0" max="10" {...register("rating", { required: true })} placeholder="Рейтинг (від 0 до 10)" className="input border-2 p-2 rounded-md" />
                </div>

                <textarea {...register("description", { required: true })} placeholder="Опис" className="input w-full border-2 p-2 rounded-md" />

                <input {...register("imageUrl", { required: true })} placeholder="URL зображення" className="input border-2 p-2 rounded-md" />
                <input {...register("bookingUrl", { required: true })} placeholder="URL бронювання" className="input border-2 p-2 rounded-md ml-2" />

                <div className="flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">
                        Скасувати
                    </button>
                    <button type="submit" className="bg-indigo-700 text-white px-4 py-2 rounded">
                        {mode === "create" ? "Додати" : "Зберегти"}
                    </button>
                </div>
            </form>
        </div>
    );
}
