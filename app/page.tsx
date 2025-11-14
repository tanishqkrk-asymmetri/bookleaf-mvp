"use client";

import Canvas from "@/components/Canvas";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";

export default function Home() {
  const [selectedView, setSelectedView] = useState<"Front" | "Back" | "Spine">(
    "Front"
  );
  return (
    <div className="">
      <Header></Header>
      <div className="flex min-h-screen pt-16 overflow-hidden h-screen">
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
