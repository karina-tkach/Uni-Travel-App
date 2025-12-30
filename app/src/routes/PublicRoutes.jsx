import {Route} from "react-router-dom";
import OffersPage from "../pages/offers/OffersPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import ErrorPage from "../pages/ErrorPage.jsx";
import RegisterPage from "../pages/auth/RegisterPage.jsx";
import LoginPage from "../pages/auth/LoginPage.jsx";
import HotelDetailsPage from "../pages/hotels/HotelDetailsPage.jsx"
import TransportDetailsPage from "../pages/transport/TransportDetailsPage.jsx";
import GroupTripsPage from "../pages/group-trips/GroupTripsPage.jsx";
import GroupTripPage from "../pages/group-trips/GroupTripPage.jsx";

const PublicRoutes = [
    <Route path="/" element={<HomePage/>} />,
    <Route path="/offers" element={<OffersPage/>} />,
    <Route path="/housing/details/:id" element={<HotelDetailsPage/>} />,
    <Route path="/transport/details/:id" element={<TransportDetailsPage/>} />,
    <Route path="/register" element={<RegisterPage />} />,
    <Route path="/login" element={<LoginPage />} />,
    <Route path="/group-trips" element={<GroupTripsPage />} />,
    <Route path="/group-trips/details/:id" element={<GroupTripPage />} />,

    <Route path="/error" element={<ErrorPage />} />
];

export default PublicRoutes;