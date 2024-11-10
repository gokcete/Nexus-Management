import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

function RoomPhotos({ room }) {
  const pictures = room?.pictures || [];

  if (pictures.length === 0) {
    return <div>No pictures available</div>;
  }

  const [currentPicture, setCurrentPicture] = useState(0);

  const next = () => setCurrentPicture((prev) => (prev + 1) % pictures.length);
  const previous = () =>
    setCurrentPicture((prev) => (prev - 1 + pictures.length) % pictures.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="relative h-[40vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPicture}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className=" inset-0 "
          >
            <img
              src={pictures[currentPicture]}
              alt={room.room_number}
              style={{ objectFit: "cover" }}
            />
          </motion.div>
        </AnimatePresence>

        <motion.div className="absolute left-0 top-0 bottom-0 w-24 flex items-center justify-center z-50">
          <button
            onClick={previous}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Previous room"
          >
            <ChevronLeft size={48} />
          </button>
        </motion.div>

        <motion.div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center z-50">
          <button
            onClick={next}
            className="text-white hover:text-gray-300 transition-colors"
            aria-label="Next room"
          >
            <ChevronRight size={48} />
          </button>
        </motion.div>
      </div>
    </>
  );
}

export default RoomPhotos;
