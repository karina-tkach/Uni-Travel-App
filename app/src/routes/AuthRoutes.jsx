import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ProfilePage from "../pages/auth/ProfilePage.jsx";
import SavedItemsPage from "../pages/saved/SavedItemsPage.jsx";
import MyTripsPage from "../pages/group-trips/MyTripsPage.jsx";

const AuthRoutes = [
    <Route path="/profile" element={<ProtectedRoute requiredRoles={["VISITOR", "ADMIN", "PARTNER", "ANALYST"]}>
        <ProfilePage/>
    </ProtectedRoute>} />,
    <Route path="/my-savings" element={<ProtectedRoute requiredRoles={["VISITOR", "ADMIN", "PARTNER", "ANALYST"]}>
        <SavedItemsPage/>
    </ProtectedRoute>} />,
    <Route path="/my-trips" element={<ProtectedRoute requiredRoles={["VISITOR", "ADMIN", "PARTNER", "ANALYST"]}>
        <MyTripsPage/>
    </ProtectedRoute>} />,

];

export default AuthRoutes;
