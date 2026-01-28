"use client";

import Canvas from "@/components/Canvas";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useDesign from "@/context/DesignContext";
import { Book } from "@/types/Book";
import { AnimatePresence, motion } from "motion/react";

export default function Home() {
  const [selectedView, setSelectedView] = useState<"Front" | "Back" | "Spine">(
    "Front",
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

        const coverData = JSON.parse(data?.coverData);

        // console.log(JSON.parse(data.coverData));
        if (data) {
          setDesignData((org) => ({
            // ...org,
            ...data,
            coverData,
            backColor: "",
          }));

          // console.log({
          //   ...data,
          //   coverData,
          // });

          setError(null);
        } else {
          setError("No data found for this book.");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookData();
  }, [id]);
  const [popup, setPopup] = useState(true);

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

  // console.log(designData);
  return (
    <div className="">
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="w-screen h-screen bg-black/50 fixed top-0 left-0 z-9999999"
          ></motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {popup && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="w-4xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99999999999 bg-white p-2 rounded-xl space-y-3"
          >
            <img className="w-full" src="/popup.png" alt="" />
            <div className="flex justify-center items-center">
              <button
                onClick={() => {
                  setPopup(false);
                }}
                className="bg-theme rounded-md p-2 text-white cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
