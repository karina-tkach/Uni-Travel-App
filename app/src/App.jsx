import {Route, Routes} from "react-router-dom";
import PublicRoutes from "./routes/PublicRoutes.jsx";
import Header from "./components/nav/Header.jsx";
import Footer from "./components/nav/Footer.jsx";
import NotFound from "./pages/NotFound.jsx";
import AuthRoutes from "./routes/AuthRoutes.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import PartnerRoutes from "./routes/PartnerRoutes.jsx";

function App() {

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Routes>
                    {PublicRoutes}
                    {AuthRoutes}
                    {AdminRoutes}
                    {PartnerRoutes}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App
