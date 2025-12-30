import { Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import MyOffersPage from "../pages/transport/MyOffersPage.jsx";

const PartnerRoutes = [
    <Route path="/my-offers" element={<ProtectedRoute requiredRoles={["PARTNER"]}>
        <MyOffersPage/>
    </ProtectedRoute>} />,

];

export default PartnerRoutes;
