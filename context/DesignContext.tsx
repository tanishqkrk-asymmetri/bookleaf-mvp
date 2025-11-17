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
        subTitle: {
          color: "#000000",
          content: "Sample SubTitle",
          font: "Default",
          size: 16,
          bold: false,
          italic: false,
          underline: false,
          align: "left",
          lineHeight: 1.5,
        },
        title: {
          color: "#000000",
          content: "Sample Title",
          font: "Default",
          size: 16,
          bold: false,
          italic: false,
          underline: false,
          align: "left",
          lineHeight: 1.5,
        },

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
        overlayColor: "#000000",
        overlayOpacity: 0,
      },
      template: {
        templateId: "",
      },
    },
    back: {
      color: {
        colorCode: "#FFFFFF",
      },
      description: {
        content:
          "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
        size: 14,
        color: "#000000",
        font: "Default",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
        imageUrl: "",
        size: 12,
        color: "#000000",
        font: "Default",
      },
    },
    spine: {
      color: {
        colorCode: "#3498DB",
      },
    },
  });

  useEffect(() => {
    if (window) {
      const designData = localStorage.getItem("designData");
      if (designData) setDesignData(JSON.parse(designData));
    }
  }, []);

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
