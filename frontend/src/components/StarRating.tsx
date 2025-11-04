import { Star } from "lucide-react";

/**
 * StarRating component
 * Renders 0–5 yellow stars (including partial stars) based on the given rating.
 * Example: <StarRating rating={3.5} />
 */
export default function StarRating({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const partialFill = rating - fullStars;

  return (
    <div className="flex items-center gap-1 justify-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const isFull = i < fullStars;
        const isPartial = i === fullStars && partialFill > 0;

        return (
          <div key={i} className="relative w-5 h-5">
            {/* Base outline star */}
            <Star
              size={20}
              stroke="#FFD700"
              fill="none"
              className="absolute top-0 left-0"
            />
            {/* Filled or partial star overlay */}
            {(isFull || isPartial) && (
              <div
                className="absolute top-0 left-0 overflow-hidden h-full"
                style={{
                  width: isFull ? "100%" : `${partialFill * 100}%`,
                }}
              >
                <Star
                  size={20}
                  fill="#FFD700"
                  stroke="#FFD700"
                  className="absolute top-0 left-0"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
