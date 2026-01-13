"use client";

import Canvas from "@/components/Canvas";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useDesign from "@/context/DesignContext";
import { Book } from "@/types/Book";

export default function Home() {
  const [selectedView, setSelectedView] = useState<"Front" | "Back" | "Spine">(
    "Front"
  );

  const { designData, setDesignData } = useDesign()!;

  const [bookData, setBookData] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      setError("Missing ID");
      setLoading(false);
      return;
    }

    const fetchBookData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/canvasDatabase", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch book data");
        }

        const data = await response.json();

        setBookData(data);
        // console.log(Object.keys(data).length > 1);
        if (Object.keys(data).length > 1) {
          // console.log(JSON.parse(data));
          setDesignData((org) => ({
            ...org,
            id,
            bookName: data.bookName || "",
            ISBN: data.ISBN?.toString() || "",
            splineWidth: data?.splineWidth.toString() || "",
            coverData: JSON.parse(data.coverData || "") || {},
            redirect_url: data?.redirect_url,
          }));
          setError(null);
        } else {
          setError("No data found for this book.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  console.log(designData);
  return (
    <div className="">
      {/* <button
        className="z-99999 fixed top-1/2 left-1/2 text-5xl text-white bg-red-500 hidden"
        onClick={async () => {
          const response = await fetch("/api/saveBook", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...designData,
              coverData: JSON.stringify({
                ...designData.coverData,
                editTrace: [],
                lastEdited: 0,
                front: {
                  backgroundType: "Color",
                  text: {
                    font: "Default",
                    title: {
                      color: "#000000",
                      content: "Sample Title",
                      font: "Default",
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
                      font: "Default",
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
                      font: "Default",
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
              }),
            }),
          });
        }}
      >
        UNGABUGNA
      </button> */}
      <Header url={designData.redirect_url}></Header>
      <div className="flex  pt-16 overflow-hidden min-h-screen max-h-screen">
        <Sidebar
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        ></Sidebar>
        <Canvas
          selectedView={selectedView}
          setSelectedView={setSelectedView}
        ></Canvas>
      </div>
    </div>
  );
}
