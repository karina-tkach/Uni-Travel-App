import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import UsersPage from "../pages/user/UsersPage.jsx";

const AdminRoutes = [
    <Route path="/users" element={<ProtectedRoute requiredRoles={["ADMIN"]}>
        <UsersPage/>
    </ProtectedRoute>} />,

];

export default AdminRoutes;
