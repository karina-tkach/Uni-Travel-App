import {useEffect, useState} from "react";
import {Menu, X, User, Instagram, LogOut} from "lucide-react";
import {TravelAlt} from "healthicons-react";
import {Link, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.jsx";

export default function Header() {
    const [open, setOpen] = useState(false);
    const { user, loading, fetchUser } = useAuth();
    const navigate = useNavigate();
    const isLoggedIn = user && user.username !== null;
    const isAdmin = user?.roles.includes("ADMIN");
    const isPartner = user?.roles.includes("PARTNER");
    const isVisitor = user?.roles.includes("VISITOR");
    const isAnalyst = user?.roles.includes("ANALYST");

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                credentials: "include"
            });
            navigate("/login");
            await fetchUser();
        } catch (error) {
            navigate('/error', {
                state: {
                    message: "Щось пішло не так",
                    code: 500
                }
            });
        }
    };

    return (
        <header className="w-full bg-white shadow-sm">
            <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

                <Link to={"/"}>
                <div className="flex items-center gap-2 select-none cursor-pointer justify-center">
                    <span className="flex items-center text-blue-700">
                    <TravelAlt className="w-12 h-12"/>
                    </span>
                    <span className="text-blue-800 font-medium font-[Jomhuria] text-[60px] leading-none">
                    UniTravel
                    </span>
                </div>
                </Link>

                <div className="flex items-center gap-4">
                    <Menu
                        className="w-7 h-7 text-blue-700 cursor-pointer font-extrabold"
                        onClick={() => setOpen(true)}
                    />
                    <Link to={!isLoggedIn ? "/login" : "/profile"}><User className="w-7 h-7 text-blue-700 cursor-pointer"/></Link>
                    </div>
            </div>

            {open && (
                <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setOpen(false)}></div>
            )}

            <aside
                className={`fixed top-0 right-0 h-[70%] w-80 rounded-xl bg-white shadow-xl z-50 p-6 transform transition-transform duration-300 ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex justify-end">
                    <X
                        className="w-7 h-7 text-blue-700 cursor-pointer"
                        onClick={() => setOpen(false)}
                    />
                </div>

                <nav className="mt-6 flex flex-col gap-4 text-blue-900 font-semibold">
                    {isLoggedIn && <a className="hover:text-blue-600 cursor-pointer" href="/profile">Профіль</a>}
                    {isLoggedIn && <a href="/my-savings" className="hover:text-blue-600 cursor-pointer">Мої збереження</a>}
                    {isLoggedIn && <a href="/my-trips" className="hover:text-blue-600 cursor-pointer">Мої групові подорожі</a>}

                    <hr/>

                    <a href="/offers" className="hover:text-blue-600 cursor-pointer">Транспорт, житло, розваги, харчування</a>
                    <a href="/group-trips" className="hover:text-blue-600 cursor-pointer">Групові подорожі</a>

                    <hr/>

                    {isAdmin && <a href="/users" className="hover:text-blue-600 cursor-pointer">Користувачі</a>}
                    {isPartner && <a href="/my-offers" className="hover:text-blue-600 cursor-pointer">Власні пропозиції</a>}
                    <hr/>

                    <a className="hover:text-blue-600 cursor-pointer">Допомога</a>
                    {!isLoggedIn ? (<a className="hover:text-blue-600 cursor-pointer"
                    href={"/login"}>Увійти</a>) :(
                        <button onClick={handleLogout} className="flex items-center gap-1 hover:text-green-200 transition">
                            <LogOut className="w-5 h-5" />
                            Вийти
                        </button>
                    )}
                </nav>

                <div className="absolute bottom-6 mb-8 left-6 flex gap-4 text-blue-700 text-2xl">
                    <a className="cursor-pointer"><Instagram className="w-10 h-10"/> </a>
                    <a className="cursor-pointer"><svg
                        className="h-10 w-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        version="1.1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        xmlSpace="preserve"
                        style={{
                            fillRule: "evenodd",
                            clipRule: "evenodd",
                            strokeLinejoin: "round",
                            strokeMiterlimit: "1.41421",
                        }}
                    >
                        <path
                            id="telegram-1"
                            d="M18.384,22.779c0.322,0.228 0.737,0.285 1.107,0.145c0.37,-0.141 0.642,-0.457 0.724,-0.84c0.869,-4.084 2.977,-14.421 3.768,-18.136c0.06,-0.28 -0.04,-0.571 -0.26,-0.758c-0.22,-0.187 -0.525,-0.241 -0.797,-0.14c-4.193,1.552 -17.106,6.397 -22.384,8.35c-0.335,0.124 -0.553,0.446 -0.542,0.799c0.012,0.354 0.25,0.661 0.593,0.764c2.367,0.708 5.474,1.693 5.474,1.693c0,0 1.452,4.385 2.209,6.615c0.095,0.28 0.314,0.5 0.603,0.576c0.288,0.075 0.596,-0.004 0.811,-0.207c1.216,-1.148 3.096,-2.923 3.096,-2.923c0,0 3.572,2.619 5.598,4.062Zm-11.01,-8.677l1.679,5.538l0.373,-3.507c0,0 6.487,-5.851 10.185,-9.186c0.108,-0.098 0.123,-0.262 0.033,-0.377c-0.089,-0.115 -0.253,-0.142 -0.376,-0.064c-4.286,2.737 -11.894,7.596 -11.894,7.596Z"
                        />
                    </svg> </a>
                    <a className="cursor-pointer"><svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg></a>
                </div>
            </aside>
        </header>
    );
}
