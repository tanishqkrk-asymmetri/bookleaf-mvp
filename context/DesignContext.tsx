"use client";

import { Book } from "@/types/Book";
import { useContext, createContext, useState, useEffect, useRef } from "react";
const DesignContext = createContext<{
  designData: Book;
  setDesignData: React.Dispatch<React.SetStateAction<Book>>;
  isSaving: boolean;
} | null>(null);

function DesignProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [designData, setDesignData] = useState<Book>({
    id: "",
    redirect_url: "",
    backImageUrl: "",
    frontImageUrl: "",
    splineImageUrl: "",
    bookName: "",
    ISBN: "",
    pageCount: "200",
    splineWidth: "0",
    coverData: {
      editTrace: [],
      lastEdited: 0,
      front: {
        backgroundType: "Color",
        text: {
          font: "Lato",
          title: {
            color: "#000000",
            content: "Sample Title",
            font: "Lato",
            size: 32,
            bold: true,
            italic: false,
            underline: false,
            align: "center",
            lineHeight: 1.2,
            position: {
              x: 50,
              y: 40,
            },
          },
          subTitle: {
            color: "#000000",
            content: "Sample SubTitle",
            font: "Lato",
            size: 18,
            bold: false,
            italic: false,
            underline: false,
            align: "center",
            lineHeight: 1.5,
            position: {
              x: 50,
              y: 55,
            },
          },
          authorName: {
            color: "#000000",
            content: "Author Name",
            font: "Lato",
            size: 16,
            bold: false,
            italic: false,
            underline: false,
            align: "center",
            lineHeight: 1.5,
            position: {
              x: 50,
              y: 85,
            },
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
          font: "Lato",
        },
        author: {
          title: "ABOUT THE AUTHOR",
          content:
            "It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.",
          imageUrl: "",
          size: 12,
          color: "#000000",
          font: "Lato",
        },
      },
      spine: {
        color: {
          colorCode: "#3498DB",
        },
      },
    },
    backColor: "",
  });

  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  async function saveData() {
    const response = await fetch("/api/saveBook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...designData,
        coverData: JSON.stringify(designData.coverData),
        backColor:
          designData.backColor ||
          designData.coverData.spine.color.colorCode ||
          "",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch book data");
    }

    const data = await response.json();
    console.log("=====================");
    console.log(data);
    console.log("=====================");
  }

  // Autosave with 1000ms debounce
  useEffect(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Check if we should save
    if (
      window &&
      designData &&
      (designData.coverData.front.text.title.content !== "Sample Title" ||
        designData.coverData.front.text.authorName.content !== "Author Name")
    ) {
      // Set saving state immediately
      setIsSaving(true);

      // Debounce the actual save by 100ms
      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await saveData();
          console.log("Design data autosaved");
        } catch (error) {
          console.error(error);
        } finally {
          setIsSaving(false);
        }
      }, 1000);
    }

    // Cleanup function
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [designData]);

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
        isSaving,
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
