import {ItemCard} from "../hotel/ItemCard.jsx";
import {ArrowDown} from "lucide-react";
import {TransportCard} from "../transport/TransportCard.jsx";
import {PlaceCard} from "../places/PlaceCard.jsx";

export default function OfferSection({categoryName, loading, items,
                                         loadingMore = false,
                                         hasMore = false,
                                         onLoadMore = () => {}, onSave = () => {}, path = null,
                                         checkIn = null,
                                         checkOut = null,
                                         isGroupMode = false,
                                         onAdd = () => {},
                                         selectedIds = null}) {

    return (
        <div className="my-5">
            <h2 className="text-[48px] font-[Montserrat] text-[#365287] font-[700]">{categoryName}</h2>

            {loading && items?.length === 0 ? (
                <div className="flex items-center justify-center w-full h-[400px] bg-blue-100">
                    <div className="flex flex-col items-center">
                        <svg
                            className="animate-spin h-10 w-10 text-blue-700 mb-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                        </svg>
                        <span className="text-blue-800 text-lg font-bold">Завантаження...</span>
                    </div>
                </div>
            ) : (
                <>
                    {items?.length === 0 ? (
                        <div className="flex items-center justify-center w-full h-[200px] bg-red-100 rounded-xl">
                            <div className="flex flex-col items-center">
                                <span className="text-red-800 text-lg font-bold italic">Помилка підключення або дані відсутні</span>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 gap-[70px] my-6">
                                {items?.map((item, index) => (
                                    categoryName === "Транспорт" ?
                                        (<TransportCard
                                            key={index}
                                            item={item}
                                            path={path + "/" + item.id}
                                            onAdd={isGroupMode ? () => onAdd("transport", item) : null}
                                            isSelected={selectedIds?.includes(item.id) || false}/>) :

                                        categoryName === "Заклади Харчування" || categoryName === "Розваги"
                                            || categoryName === "Збережені пропозиції"
                                            ?
                                                (
                                                    <PlaceCard item={item} onSave={onSave}
                                                               onAdd={isGroupMode ? () => onAdd(categoryName === "Розваги" ? "activities" : "food", item) : null}/>
                                                ) : (
                                        <ItemCard
                                        key={index}
                                        item={item}
                                        path={path + "/" + item.id}
                                        checkIn={checkIn} checkOut={checkOut}
                                        isSelected={selectedIds?.includes(item.id) || false}
                                        onAdd={isGroupMode ? () => onAdd("housing", item) : null}
                                    />)
                                ))}
                            </div>

                            {hasMore && (
                                <div className="flex justify-center py-10">
                                    <button
                                        onClick={onLoadMore}
                                        disabled={loadingMore}
                                        className={`
                                    w-14 h-14 flex items-center justify-center
                                    rounded-full border-4 border-blue-700
                                    transition
                                    ${loadingMore ? "opacity-50 cursor-not-allowed bg-gray-600" : "hover:bg-gray-100"}
                                `}
                                    >
                                        <ArrowDown className={`w-6 h-6 text-blue-700 ${loadingMore && "animate-pulse"}`} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
}
