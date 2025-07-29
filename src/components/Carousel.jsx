import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";

const Carousel = ({ items, title }) => {
  const carouselContainer = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollAmount = 320;

  useEffect(() => {
    const updateCanScrollRight = () => {
      if (carouselContainer.current) {
        const container = carouselContainer.current;
        setCanScrollRight(
          container.scrollLeft + container.clientWidth < container.scrollWidth
        );
      }
    };
    updateCanScrollRight();
    const resizeObserver = new ResizeObserver(updateCanScrollRight);

    if (carouselContainer.current) {
      resizeObserver.observe(carouselContainer.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [scrollPosition]);

  const handleScroll = () => {
    if (carouselContainer.current) {
      setScrollPosition(carouselContainer.current.scrollLeft);
    }
  };

  const scrollLeft = () => {
    if (carouselContainer.current) {
      const newPosition = Math.max(0, scrollPosition - scrollAmount);
      setScrollPosition(newPosition);
      carouselContainer.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (carouselContainer.current) {
      const newPosition = scrollPosition + scrollAmount;
      setScrollPosition(newPosition);
      carouselContainer.current.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      <h1 className="mt-4 mb-2 text-white text-2xl font-semibold">{title}</h1>
      <div className="relative scrollbar-none">
        {scrollPosition > 0 && (
          <button
            className="absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white
              border-none p-4 cursor-pointer z-10 transition-colors duration-300 ease-in-out hover:bg-opacity-40 h-full left-0
        "
            onClick={scrollLeft}
          >
            <ChevronLeft />
          </button>
        )}
        {canScrollRight && (
          <button
            className="absolute top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white
              border-none p-4 cursor-pointer z-10 transition-colors duration-300 ease-in-out hover:bg-opacity-40 h-full right-0
        "
            onClick={scrollRight}
          >
            <ChevronRight />
          </button>
        )}
        <div
          ref={carouselContainer}
          onScroll={handleScroll}
          className="overflow-x-auto flex scroll-snap-x-mandatory scrollbar-none"
        >
          {items
            .filter((item) => item.backdrop_path)
            ?.map((item) => (
              <div className="scroll-snap-center flex-none mr-4">
                <Card item={item} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
