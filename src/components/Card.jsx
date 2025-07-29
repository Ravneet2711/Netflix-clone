import React from "react";
import { useCardContext } from "../context/CardContext";

const Card = ({ item }) => {
  const { cardState, setCardState } = useCardContext();

  const handleHover = (e) => {
    if (cardState.cardId === item.id && cardState.ishovered) {
      return;
    }
    // console.log(e);
    const cardElement = e.target;
    const cardRect = cardElement.getBoundingClientRect();
    setCardState({
      item,
      isHovered: true,
      cardId: item.id,
      position: { x: cardRect.left + cardRect.width / 2, y: cardRect.top },
    });
  };
  return (
    <div
      className="cursor-pointer text-white opacity-100 pointer-events-auto relative sm:w-56 w-36"
      onMouseEnter={handleHover}
      role="Presentation"
    >
      <img
        src={`https://image.tmdb.org/t/p/w300${item.backdrop_path}`}
        alt={item.title}
        className="w-full h-auto block"
      />
    </div>
  );
};

export default Card;
