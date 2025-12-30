export function Stars({ rating }) {
    // Convert 10-scale → 5-star scale
    const starValue = rating / 2;

    const fullStars = Math.floor(starValue);
    const hasHalfStar = starValue - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
        <div className="flex text-xl mt-1">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
                <span key={"f" + i} className="text-blue-800">★</span>
            ))}

            {/* Half Star */}
            {hasHalfStar && (
                <span className="text-blue-800">⯪</span>
                )}

            {/* Empty Stars */}
            {[...Array(emptyStars)].map((_, i) => (
                <span key={"e" + i} className="text-gray-300">★</span>
            ))}
        </div>
    );
}