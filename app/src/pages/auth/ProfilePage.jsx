import { useAuth } from "../../context/AuthContext.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import {useEffect, useState} from "react";
import {fetchData} from "../../utils/fetch.jsx";
import {useLoading} from "../../utils/useLoading.jsx";
import {useNavigate} from "react-router-dom";

export default function ProfilePage() {
    const { user, fetchUser } = useAuth();
    const loading = useLoading();
    const navigate = useNavigate();
    const [likedItems, setLikedItems] = useState([]);

    useEffect(() => {
        fetchData({
            url: `/api/places/my_savings`,
            method: "GET",
            navigate,
            onStart: loading.start,
            onFinally: loading.stop,
            onSuccess: data => setLikedItems(data || [])
        });
    })

    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.username,
        password: ""
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            name: formData.firstName,
            surname: formData.lastName,
            email: formData.email,
            password: formData.password
        };

        await fetchData({
            url: `/api/users/me`,
            method: "PUT",
            body: body,
            navigate,
            onStart: loading.start,
            onFinally: loading.stop,
            onSuccess: () => {
                setShowForm(false);
                fetchUser();
            }
        });

    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-6">
                <div className="w-30 h-30 rounded-full bg-slate-200 flex items-center justify-center text-2xl">
                    👤
                </div>

                <div>
                    <h2 className="text-3xl font-semibold">{user?.firstName + " " + user?.lastName}</h2>
                    <p className="text-lg text-gray-500">{user?.roles[0]} · {user?.username}</p>
                </div>
                <button onClick={() => setShowForm(true)}
                        className="text-xl ml-auto bg-indigo-700 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition"> Редагувати </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white p-6 rounded-md w-full max-w-md shadow-lg relative"
                    >
                        <h2 className="text-xl text-center text-blue-900 font-semibold mb-4">Редагувати профіль</h2>

                        <div className="mb-4">
                            <label className="block mb-1">Ім'я</label>
                            <input
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full border-2 border-blue-900 px-3 py-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Прізвище</label>
                            <input
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full border-2 border-blue-900 px-3 py-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Пошта</label>
                            <input
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full border-2 border-blue-900 px-3 py-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-1">Пароль</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Leave empty to keep current"
                                className="w-full border-2 border-blue-900 px-3 py-2 rounded"
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                type="submit"
                                disabled={loading.loading}
                                className="bg-indigo-900 text-white px-4 py-2 rounded hover:bg-indigo-800"
                            >
                                {loading.loading ? 'Збереження...' : 'Зберегти'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Скасувати
                            </button>
                        </div>
                    </form>
                </div>
            )}


            <hr className="my-6" />

            {/* Slider */}
            <h3 className="text-xl font-semibold mb-4">Вподобані пропозиції</h3>

            <Swiper
                modules={[Navigation]}    // register Navigation
                navigation                // enable arrows
                spaceBetween={20}
                slidesPerView={4}
                loop={true}
            >
                {likedItems.map(item => (
                    <SwiperSlide key={item.id}>
                        <div className="relative w-full">
                            <div className="h-36 bg-gray-300 rounded-xl" >
                                {item.imageUrl && (
                                    <img
                                        src={`api/places/images/proxy?url=${encodeURIComponent(item.imageUrl)}`}
                                        alt={item.name}
                                        className="w-full h-36 rounded-xl object-cover transform transition-transform duration-300 hover:scale-105"
                                    />
                                )}
                            </div>
                            <p className="mt-2 text-sm">{item.name}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
