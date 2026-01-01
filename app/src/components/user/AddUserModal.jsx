import { useForm } from "react-hook-form";
import { useState } from "react";
import {useNavigate} from "react-router-dom";

export default function AddUserModal({ onClose, onSuccess }) {
    const [role, setRole] = useState("ADMIN");
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: "",
            surname: "",
            email: "",
            password: "",
            serviceName: "",
            serviceUrl: ""
        }
    });

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            role: role
        };
        setLoading(true);
        setServerError('');

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                credentials: 'include',
            });

            if (response.status === 200 || response.status === 201) {
                onSuccess();
                onClose();
            } else if (response.status === 400) {
                const resData = await response.json();
                setServerError(resData.message || 'Помилка додавання.');
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded w-full max-w-md shadow-lg"
                noValidate
            >
                <h2 className="text-lg font-semibold mb-4">
                    Новий користувач
                </h2>

                {serverError && (
                    <div className="mb-4 text-red-700 bg-red-100 border border-red-300 rounded p-3 text-sm">
                        {serverError}
                    </div>
                )}

                {/* ROLE */}
                <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    className="w-full mb-3 border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="ADMIN">Адмін</option>
                    <option value="PARTNER">Партнер</option>
                    <option value="ANALYST">Дата-аналітик</option>
                </select>

                {/* NAME */}
                <Input
                    placeholder="Імʼя"
                    error={errors.name}
                    {...register("name", {
                        required: "Імʼя є обовʼязковим",
                        pattern: {
                            value: /^[a-zA-Zа-яА-ЯЇїІіЄєҐґ-]{2,}$/,
                            message: 'Ім’я має відповідати шаблону'
                        }
                    })}
                />

                {/* SURNAME */}
                <Input
                    placeholder="Прізвище"
                    error={errors.surname}
                    {...register("surname", {
                        required: "Прізвище є обовʼязковим",
                        pattern: {
                            value: /^[a-zA-Zа-яА-ЯЇїІіЄєҐґ-]{2,}$/,
                            message: 'Прізвище має відповідати шаблону'
                        }
                    })}
                />

                {/* EMAIL */}
                <Input
                    type="email"
                    placeholder="Email"
                    error={errors.email}
                    {...register("email", {
                        required: "Email є обовʼязковим"
                    })}
                />

                {/* PASSWORD WITH TOGGLE */}
                <div className="mb-3 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Пароль"
                        {...register("password", {
                            required: "Пароль є обовʼязковим",
                            pattern: {
                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/,
                                message: 'Пароль має містити від 8 до 20 символів, 1 велику літеру, 1 малу літеру, 1 цифру та 1 спеціальний символ'
                            }
                        })}
                        className={`input input border-2 rounded-md border-blue-900 w-full p-2 ${
                            errors.password ? "border-red-400" : ""
                        }`}
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className={`absolute right-3 ${errors.password ? "top-1/4" : "top-1/2"} -translate-y-1/2 text-sm text-gray-500 hover:text-gray-700`}
                    >
                        {showPassword ? "🙈" : "👁"}
                    </button>

                    {errors.password && (
                        <p className="text-red-600 text-sm mt-1">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* PARTNER FIELDS */}
                {role === "PARTNER" && (
                    <>
                        <Input
                            placeholder="Назва сервісу"
                            error={errors.serviceName}
                            {...register("serviceName", {
                                required: "Назва сервісу обовʼязкова"
                            })}
                        />

                        <Input
                            placeholder="URL сервісу"
                            error={errors.serviceUrl}
                            {...register("serviceUrl", {
                                required: "URL сервісу обовʼязковий"
                            })}
                        />
                    </>
                )}

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Скасувати
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800 disabled:opacity-50"
                    >
                        {loading ? 'Збереження...' : 'Зберегти'}
                    </button>
                </div>
            </form>
        </div>
    );
}

const Input = ({ error, ...props }) => (
    <div className="mb-3">
        <input
            {...props}
            className={`input w-full border-2 rounded-md p-2 ${error ? "border-red-400" : "border-blue-900"}`}
        />
        {error && (
            <p className="text-red-600 text-sm mt-1">
                {error.message}
            </p>
        )}
    </div>
);
