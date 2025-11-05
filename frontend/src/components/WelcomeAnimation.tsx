import { useEffect, useState } from "react";

type WelcomeAnimationProps = {
  onClose: () => void;
};

export default function WelcomeAnimation({ onClose }: WelcomeAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto close after 3 seconds
    const timeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose();
      }, 500); // Wait for fade out
    }, 2000);

    return () => clearTimeout(timeout);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-gradient-to-br from-blue-50 via-emerald-50 to-cyan-50 flex items-center justify-center transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="text-center px-4">
        <h1 className="welcome-text-shadows text-6xl md:text-8xl lg:text-9xl font-extrabold mb-4" style={{ fontSize: 'calc(2rem + 5vw)' }}>
          Welcome
        </h1>
        <h2 className="welcome-text-shadows text-4xl md:text-6xl lg:text-7xl font-extrabold" style={{ fontSize: 'calc(1.5rem + 4vw)' }}>
          to SMUxChange
        </h2>
      </div>
    </div>
  );
}

