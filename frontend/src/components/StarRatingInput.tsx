import { useState } from "react";
import { Star } from "lucide-react";

type StarRatingInputProps = {
  value: number;
  onChange: (rating: number) => void;
};

export default function StarRatingInput({ value, onChange }: StarRatingInputProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  function handleStarClick(e: React.MouseEvent, index: number) {
    const { left, width } = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const clickX = e.clientX - left;

    const isHalf = clickX < width / 2; // left half clicked
    const newRating = isHalf ? index + 0.5 : index + 1;

    // Reset to 0 if clicking the same rating again
    if (newRating === value) {
      onChange(0);
    } else {
      onChange(newRating);
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((index) => {
        const displayRating = hoverRating ?? value;
        const fullStars = Math.floor(displayRating);
        const isFull = index < fullStars;
        const isHalf = index === fullStars && displayRating % 1 !== 0;

        return (
          <div
            key={index}
            className="relative w-7 h-7 cursor-pointer"
            onMouseMove={(e) => {
              const { left, width } = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const hoverX = e.clientX - left;
              const isHalfHover = hoverX < width / 2;
              setHoverRating(isHalfHover ? index + 0.5 : index + 1);
            }}
            onMouseLeave={() => setHoverRating(null)}
            onClick={(e) => handleStarClick(e, index)}
          >
            {/* Base Star */}
            <Star
              size={28}
              stroke="#FFD700"
              fill="rgba(255,255,255,0.2)"
              className="absolute top-0 left-0"
            />

            {/* Filled Star */}
            {(isFull || isHalf) && (
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: isFull ? "100%" : "50%" }}
              >
                <Star size={28} fill="#FFD700" stroke="#FFD700" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
