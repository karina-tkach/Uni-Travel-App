import OfferSection from "../../components/offers/OfferSection.jsx";
import {useLoading} from "../../utils/useLoading.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {fetchData} from "../../utils/fetch.jsx";

export default function SavedItemsPage() {
    const loading = useLoading();
    const [savedItems, setSavedItems] = useState([]);
    const navigate = useNavigate();

    const fetchSaved = async () => {
        await fetchData({
            url: "/api/places/my_savings",
            method: "GET",
            navigate,
            onStart: loading.start,
            onFinally: loading.stop,
            onSuccess: data => {
                const enriched = data?.map(i => ({
                    ...i,
                    saved: true
                }));
                setSavedItems(enriched || []);
            }
        });
    };

    useEffect(() => {
        fetchSaved();
    });

    const onUnsave = async (item) => {
        await fetchData({
            url: `/api/places/manage_saving`,
            method: "POST",
            body: {
                id: item.id,
                name: item.name,
                category: item.category,
                fullAddress: item.fullAddress,
                rating: item.rating,
                imageUrl: item.imageUrl,
                mapsUrl: item.mapsUrl,
                type: item.type
            },
            navigate,
            onSuccess: () => {
                fetchSaved()
            }
        });
    }

    return (
        <div className="p-10">
            <OfferSection loading={loading.loading} categoryName={"Збережені пропозиції"}
                          items={savedItems}
                          onSave={onUnsave}/>
        </div>
    );
}