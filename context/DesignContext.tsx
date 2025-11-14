"use client";

import { Book } from "@/types/Book";
import { useContext, createContext, useState, useEffect } from "react";
const DesignContext = createContext<{
  designData: Book;
  setDesignData: React.Dispatch<React.SetStateAction<Book>>;
} | null>(null);

function DesignProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [designData, setDesignData] = useState<Book>({
    id: "",
    bookName: "",
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Color",
      text: {
        font: "Default",
        subtitle: "",
        title: "",
        position: {
          x: 0,
          y: 0,
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "",
      },
      template: {
        templateId: "",
      },
    },
    back: {},
    spine: {},
  });

  return (
    <DesignContext.Provider
      value={{
        designData,
        setDesignData,
      }}
    >
      {children}
    </DesignContext.Provider>
  );
}

export default function useDesign() {
  return useContext(DesignContext);
}
export { DesignProvider };
