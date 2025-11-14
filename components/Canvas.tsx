"use client";

import useDesign from "@/context/DesignContext";

export default function Canvas({
  selectedView,
  setSelectedView,
}: {
  selectedView: "Front" | "Back" | "Spine";
  setSelectedView: React.Dispatch<
    React.SetStateAction<"Front" | "Back" | "Spine">
  >;
}) {
  const { designData } = useDesign()!;

  return (
    <div className="w-full bg-[#f3edeb] ">
      <div className="flex justify-center items-center h-full gap-6">
        <div
          onClick={() => {
            // setSelectedView("Back");
          }}
          className="back bg-foreground/20"
          style={{
            height: "36em",
            aspectRatio: "1/1.33",
            background: "",
          }}
        ></div>
        <div
          onClick={() => {
            // setSelectedView("Spine");
          }}
          className="back bg-foreground/20"
          style={{
            height: "36em",
            aspectRatio: "0.16/1.33",
            background: "",
          }}
        ></div>
        <div
          onClick={() => {
            // setSelectedView("Front");
          }}
          className="back bg-foreground/20 relative"
          style={{
            height: "36em",
            aspectRatio: "1/1.33",
            background:
              designData.front.backgroundType === "Gradient"
                ? `linear-gradient(${designData.front.gradient?.direction}deg, ${designData.front.gradient?.from}, ${designData.front.gradient?.to})`
                : designData.front.color?.colorCode,
          }}
        >
          {designData.front.backgroundType === "Image" && (
            <img
              src={designData.front.image.imageUrl}
              className="w-full h-full absolute top-0 left-0 object-cover"
              alt=""
            />
          )}
          <div>{designData.front.text.title}</div>
        </div>
      </div>
    </div>
  );
}
