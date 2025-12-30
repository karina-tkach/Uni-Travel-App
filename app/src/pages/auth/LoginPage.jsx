import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {GoogleLogin} from "@react-oauth/google";

export default function LoginPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (response.status === 200) {
                await fetchUser();
                navigate('/');
            } else if (response.status === 401) {
                const resData = await response.json();
                setServerError(resData.message || 'Неправильні облікові дані.');
            } else {
                const resData = await response.json();
                navigate('/error', {
                    state: {
                        message: resData.message || "Щось пішло не так.",
                        code: response.status
                    }
                });
            }
        } catch (error) {
            navigate('/error', {
                state: {
                    message: "Щось пішло не так",
                    code: 500
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;

        const res = await fetch("/api/auth/google", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
        });

        if (!res.ok) {
            const err = await res.json();
            navigate("/error", {
                state: { message: err.message || "Помилка серверу", code: res.status }
            });
            return;
        }

        navigate("/");
    };

    return (
        <div className="min-h-[90vh] flex items-stretch justify-center p-4 bg-gray-100">

            <div className="relative grow bg-white rounded-3xl p-8 shadow-xl w-full flex flex-col justify-center">

                <div
                    className="absolute inset-0 rounded-3xl w-full h-full"
                    style={{
                        backgroundImage: "url('/train.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "blur(1px)"
                    }}
                ></div>

                <div className="absolute inset-0 bg-black/5 backdrop-blur-lg rounded-3xl"></div>

                <div className="relative w-full max-w-lg mx-auto bg-white/95 backdrop-blur-xl rounded-3xl p-10 border border-[#345185]/20 z-10">
                    <h2 className="text-3xl font-bold text-[#345185] text-center mb-6 font-[Montserrat]">
                        Вхід в особистий кабінет
                    </h2>

                    {serverError && (
                        <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded p-3 text-sm">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Електронна адреса"
                                {...register('email', { required: 'Email є обов’язковим',
                                })}
                                className={`w-full bg-[#d7e0f5] border-2 border-[#345185] text-[#345185] rounded-xl px-4 py-3 outline-none focus:ring
                                    ${errors.email ? 'ring-red-300' : 'ring-[#345185]/30'}`}
                            />
                            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <input
                                id="password"
                                type="password"
                                placeholder="Пароль"
                                {...register('password', { required: 'Пароль є обов’язковим'})}
                                className={`w-full bg-[#d7e0f5] border-2 border-[#345185] text-[#345185] rounded-xl px-4 py-3 outline-none focus:ring
                                    ${errors.password ? 'ring-red-300' : 'ring-[#345185]/30'}`}
                            />
                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                        </div>
                        <p className="text-right font-[Montserrat] text-[#345185]"><a href="/app/public">Забули пароль?</a></p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#345185] font-[Montserrat] hover:bg-[#2b416c] text-white py-3 rounded-xl hover:cursor-pointer font-medium transition disabled:opacity-50"
                        >
                            {loading ? 'Вхід...' : 'Увійти'}
                        </button>
                        <p className="text-center text-[#345185]">Не маєш акаунту? <a href="/register" className="font-bold">Зареєструватись</a></p>
                        <hr/>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => {
                                navigate("/error", {
                                    state: { message: "Сталася невідома помилка", code: 500}
                                })
                            }}
                        />
                    </form>

                </div>
            </div>
        </div>
    );
}