"use client";

import Canvas from "@/components/Canvas";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import useDesign from "@/context/DesignContext";
import { useEffect, useState } from "react";

export default function Home() {
  const [selectedView, setSelectedView] = useState<"Front" | "Back" | "Spine">(
    "Front"
  );

  const { designData } = useDesign()!;

  useEffect(() => {
    localStorage.setItem("designData", JSON.stringify(designData));
  }, [selectedView]);

  return (
    <div className="">
      <Header></Header>
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
