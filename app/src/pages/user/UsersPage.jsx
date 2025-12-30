import { useEffect, useState } from "react";
import { fetchData } from "../../utils/fetch.jsx";
import UserSection from "../../components/user/UserSection.jsx";
import AddUserModal from "../../components/user/AddUserModal.jsx";
import {useLoading} from "../../utils/useLoading.jsx";
import {useNavigate} from "react-router-dom";

export default function UsersPage() {
    const adminLoading = useLoading();
    const partnerLoading = useLoading();
    const analystLoading = useLoading();

    const navigate = useNavigate();
    const [users, setUsers] = useState({
        ADMIN: [],
        PARTNER: [],
        ANALYST: []
    });
    const [showForm, setShowForm] = useState(false);

    const loadUsers = async () => {
        const result = {
            ADMIN: [],
            PARTNER: [],
            ANALYST: []
        };

        await Promise.all([
            fetchData({
                url: "/api/users/by-role?role=ADMIN",
                method: "GET",
                navigate,
                onStart: adminLoading.start,
                onFinally: adminLoading.stop,
                onSuccess: data => result.ADMIN = data || []
            }),
            fetchData({
                url: "/api/users/by-role?role=PARTNER",
                method: "GET",
                navigate,
                onStart: partnerLoading.start,
                onFinally: partnerLoading.stop,
                onSuccess: data => result.PARTNER = data || []
            }),
            fetchData({
                url: "/api/users/by-role?role=ANALYST",
                method: "GET",
                navigate,
                onStart: analystLoading.start,
                onFinally: analystLoading.stop,
                onSuccess: data => result.ANALYST = data || []
            })
        ]);

        setUsers(result);
    };


    useEffect(() => {
        loadUsers();
    }, []);


    return (
        <div className="max-w-7xl mx-auto px-6 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Менеджмент користувачів</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-indigo-700 text-white px-4 py-2 rounded hover:bg-indigo-800"
                >
                    + Додати користувача
                </button>
            </div>

            <UserSection title="Адміністратори" onDelete={loadUsers} loading={adminLoading.loading} users={users.ADMIN} />
            <UserSection title="Партнери" onDelete={loadUsers} loading={partnerLoading.loading} users={users.PARTNER} isPartner />
            <UserSection title="Дата-аналітики" onDelete={loadUsers} loading={analystLoading.loading} users={users.ANALYST} />

            {showForm && (
                <AddUserModal
                    onClose={() => setShowForm(false)}
                    onSuccess={loadUsers}
                />
            )}
        </div>
    );
}
