import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RegisterPage() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { fetchUser } = useAuth();

    const onSubmit = async (data) => {
        setLoading(true);
        setServerError('');

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
                credentials: 'include',
            });

            if (response.status === 200) {
                await fetchUser();
                navigate('/');
            } else if (response.status === 400) {
                const resData = await response.json();
                setServerError(resData.message || 'Помилка реєстрації.');
            } else {
                const resData = await response.json();
                navigate('/error', {
                    state: {
                        message: resData.message || "Щось пішло не так",
                        code: response.status
                    }
                });
            }
        } catch {
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
                        Реєстрація
                    </h2>

                    {serverError && (
                        <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded p-3 text-sm">
                            {serverError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                        <div>
                            <input
                                id="name"
                                type="text"
                                placeholder="Ім’я"
                                {...register('name', {
                                    required: 'Ім’я є обов’язковим',
                                    pattern: {
                                        value: /^[a-zA-Zа-яА-ЯЇїІіЄєҐґ-]{2,}$/,
                                        message: 'Ім’я має відповідати шаблону'
                                    }
                                })}
                                className={`w-full bg-[#d7e0f5] border-2 border-[#345185] text-[#345185] rounded-xl px-4 py-3 outline-none focus:ring
            ${errors.name ? 'ring-red-300' : 'ring-[#345185]/30'}`}
                            />
                            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <input
                                id="surname"
                                type="text"
                                placeholder="Прізвище"
                                {...register('surname', {
                                    required: 'Прізвище є обов’язковим',
                                    pattern: {
                                        value: /^[a-zA-Zа-яА-ЯЇїІіЄєҐґ-]{2,}$/,
                                        message: 'Прізвище має відповідати шаблону'
                                    }
                                })}
                                className={`w-full bg-[#d7e0f5] border-2 border-[#345185] text-[#345185] rounded-xl px-4 py-3 outline-none focus:ring
            ${errors.surname ? 'ring-red-300' : 'ring-[#345185]/30'}`}
                            />
                            {errors.surname && <p className="text-red-600 text-sm mt-1">{errors.surname.message}</p>}
                        </div>

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
                                {...register('password', { required: 'Пароль є обов’язковим',
                                    pattern: {
                                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
                                        message: 'Пароль має містити від 8 до 20 символів, 1 велику літеру, 1 малу літеру, 1 цифру та 1 спеціальний символ'
                                    }})}
                                className={`w-full bg-[#d7e0f5] border-2 border-[#345185] text-[#345185] rounded-xl px-4 py-3 outline-none focus:ring
                                    ${errors.password ? 'ring-red-300' : 'ring-[#345185]/30'}`}
                            />
                            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <div>
                            <input
                                id="passwordConfirm"
                                type="password"
                                placeholder="Підтвердіть пароль"
                                {...register('passwordConfirm', { required: 'Підтвердження паролю є обов’язковим',
                                    validate: (value, formValues) =>
                                        value === formValues.password || 'Паролі не співпадають'})}
                                className={`w-full bg-[#d7e0f5] border-2 border-[#345185] text-[#345185] rounded-xl px-4 py-3 outline-none focus:ring
                                    ${errors.passwordConfirm ? 'ring-red-300' : 'ring-[#345185]/30'}`}
                            />
                            {errors.passwordConfirm && <p className="text-red-600 text-sm mt-1">{errors.passwordConfirm.message}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#345185] font-[Montserrat] hover:bg-[#2b416c] text-white py-3 rounded-xl hover:cursor-pointer font-medium transition disabled:opacity-50"
                        >
                            {loading ? 'Реєстрація...' : 'Зареєструватись'}
                        </button>
                        <p className="text-center text-[#345185]">Вже маєш аккаунт? <a href="/login" className="font-bold">Увійти</a></p>
                    </form>

                </div>
            </div>
        </div>
    );
}