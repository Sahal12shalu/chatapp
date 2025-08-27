import { useEffect } from "react";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed  top-5 bg-gradient-to-b from-white/30 via-white/20 to-white/20 text-white px-4 py-2 rounded-xl shadow-lg animate-fadeIn">
      {message}
    </div>
  );
}
