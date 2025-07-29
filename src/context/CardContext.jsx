import { createContext, useContext, useState } from "react";

const CardContext = createContext(null);

export const CardProvider = ({ children }) => {
  const [cardState, setCardState] = useState({
    item: null,
    isHovered: false,
    cardId: null,
    position: { x: -1000, y: 0 },
  });
  return (
    <CardContext.Provider value={{ cardState, setCardState }}>
      {children}
    </CardContext.Provider>
  );
};

export const useCardContext = () => {
  const context = useContext(CardContext);

  if (!context)
    throw new Error("useCardContext must be used within a CardProvider");

  return context;
};
