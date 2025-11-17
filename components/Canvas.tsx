"use client";

import useDesign from "@/context/DesignContext";
import { useDraggable } from "@reactuses/core";
import { useEffect, useRef, useState } from "react";

export default function Canvas({
  selectedView,
  setSelectedView,
}: {
  selectedView: "Front" | "Back" | "Spine";
  setSelectedView: React.Dispatch<
    React.SetStateAction<"Front" | "Back" | "Spine">
  >;
}) {
  const { designData, setDesignData } = useDesign()!;

  const el = useRef<HTMLDivElement>(null);
  const scope = useRef<HTMLDivElement>(null);

  const initialValue = {
    x: designData.front.text.position.x,
    y: designData.front.text.position.y,
  };

  const [x, y, isDragging, setPosition] = useDraggable(el, {
    initialValue,
    preventDefault: true,
    containerElement: scope,
  });

  const [showCenterLineX, setShowCenterLineX] = useState(false);
  const [showCenterLineY, setShowCenterLineY] = useState(false);
  const [wasDragging, setWasDragging] = useState(false);
  const snapThreshold = 15; // pixels threshold for snapping

  useEffect(() => {
    if (isDragging && scope.current && el.current) {
      setWasDragging(true);
      const containerRect = scope.current.getBoundingClientRect();
      const elementRect = el.current.getBoundingClientRect();

      const containerCenterX = containerRect.width / 2;
      const containerCenterY = containerRect.height / 2;

      const elementCenterX = x + elementRect.width / 2;
      const elementCenterY = y + elementRect.height / 2;

      const distanceFromCenterX = Math.abs(elementCenterX - containerCenterX);
      const distanceFromCenterY = Math.abs(elementCenterY - containerCenterY);

      // Show center lines when near center
      setShowCenterLineX(distanceFromCenterX < snapThreshold);
      setShowCenterLineY(distanceFromCenterY < snapThreshold);

      // Snap to center
      if (distanceFromCenterX < snapThreshold) {
        const snapX = containerCenterX - elementRect.width / 2;
        setPosition({ x: snapX, y });
      }
      if (distanceFromCenterY < snapThreshold) {
        const snapY = containerCenterY - elementRect.height / 2;
        setPosition({ x, y: snapY });
      }
    } else {
      setShowCenterLineX(false);
      setShowCenterLineY(false);
    }
  }, [x, y, isDragging, setPosition]);

  // Save position to designData when drag ends
  useEffect(() => {
    if (wasDragging && !isDragging) {
      setDesignData((org) => ({
        ...org,
        front: {
          ...org.front,
          text: {
            ...org.front.text,
            position: {
              x: x,
              y: y,
            },
          },
        },
      }));
      setWasDragging(false);
    }
  }, [isDragging, wasDragging, x, y, setDesignData]);

  console.log(x, y);

  return (
    <div className="w-full bg-[#f3edeb] ">
      <div className="flex justify-center items-center h-full gap-6">
        <div
          onClick={() => {
            // setSelectedView("Back");
          }}
          className="back flex flex-col justify-between p-8"
          style={{
            height: "36em",
            aspectRatio: "1/1.33",
            background: designData.back.color?.colorCode || "#FFFFFF",
          }}
        >
          {/* Book Description */}
          <div
            className="text-justify"
            style={{
              color: designData.back.description.color,
              fontSize: designData.back.description.size + "px",
              fontFamily:
                designData.back.description.font === "Default"
                  ? "inherit"
                  : designData.back.description.font,
              lineHeight: 1.6,
            }}
          >
            {designData.back.description.content}
          </div>

          {/* About the Author Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div
              className="font-bold mb-3 tracking-wider"
              style={{
                color: designData.back.author.color,
                fontSize: designData.back.author.size + 2 + "px",
                fontFamily:
                  designData.back.author.font === "Default"
                    ? "inherit"
                    : designData.back.author.font,
              }}
            >
              {designData.back.author.title}
            </div>
            <div className="flex gap-4">
              {/* Author Text (Left) */}
              <div
                className="flex-1 text-justify"
                style={{
                  color: designData.back.author.color,
                  fontSize: designData.back.author.size + "px",
                  fontFamily:
                    designData.back.author.font === "Default"
                      ? "inherit"
                      : designData.back.author.font,
                  lineHeight: 1.5,
                }}
              >
                {designData.back.author.content}
              </div>
              {/* Author Image (Right) */}
              <div className="w-32 h-32 flex-shrink-0">
                {designData.back.author.imageUrl ? (
                  <img
                    src={designData.back.author.imageUrl}
                    alt="Author"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-foreground/10 rounded flex items-center justify-center text-foreground/30 text-xs text-center p-2">
                    Add author image
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* BookLeaf Logo at Bottom */}
          <div className="flex gap-1 font-thin items-center">
            <div className="aspect-square bg-background text-foreground w-8 h-8 text-center flex justify-center items-center font-bold text-2xl ">
              /
            </div>
            <p className="leading-4 font-semibold">
              Bookleaf <br /> Publishing
            </p>
          </div>
        </div>
        <div
          onClick={() => {
            // setSelectedView("Spine");
          }}
          className="spine"
          style={{
            height: "36em",
            aspectRatio: "0.16/1.33",
            background: designData.spine.color?.colorCode || "#f5f5f5",
          }}
        ></div>
        <div
          onClick={() => {
            // setSelectedView("Front");
          }}
          className="front bg-foreground/20  overflow-hidden flex justify-center items-center p-8 relative"
          style={{
            height: "36em",
            aspectRatio: "1/1.33",
            background:
              designData.front.backgroundType === "Gradient"
                ? `linear-gradient(${designData.front.gradient?.direction}deg, ${designData.front.gradient?.from}, ${designData.front.gradient?.to})`
                : designData.front.color?.colorCode,
          }}
        >
          <div
            ref={scope}
            className={`h-full w-full relative transition-all ${
              isDragging
                ? "border-dashed border-2 border-theme"
                : "border-none "
            }`}
          >
            {/* Vertical center line */}
            {showCenterLineX && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-theme z-20 pointer-events-none"
                style={{
                  left: "50%",
                  transform: "translateX(-50%)",
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-theme rounded-full"></div>
              </div>
            )}

            {/* Horizontal center line */}
            {showCenterLineY && (
              <div
                className="absolute left-0 right-0 h-0.5 bg-theme z-20 pointer-events-none"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-theme rounded-full"></div>
              </div>
            )}

            {/* Corner guides - shown when dragging */}
            {isDragging && (
              <>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-theme pointer-events-none z-20"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-theme pointer-events-none z-20"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-theme pointer-events-none z-20"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-theme pointer-events-none z-20"></div>
              </>
            )}

            <div
              ref={el}
              style={{
                position: "absolute",
                cursor: "move",
                zIndex: 10,
                touchAction: "none",
                left: x,
                top: y,
                whiteSpace: "nowrap",
              }}
              className="z-999999  h-fit  flex flex-col w-fit cursor-grab select-none "
            >
              <div
                style={{
                  color: designData.front.text.title.color,
                  fontSize: designData.front.text.title.size + "px",
                  fontFamily:
                    designData.front.text.title.font === "Default"
                      ? "inherit"
                      : designData.front.text.title.font,
                  fontWeight: designData.front.text.title.bold
                    ? "bold"
                    : "normal",
                  fontStyle: designData.front.text.title.italic
                    ? "italic"
                    : "normal",
                  textDecoration: designData.front.text.title.underline
                    ? "underline"
                    : "none",
                  textAlign: designData.front.text.title.align,
                  lineHeight: designData.front.text.title.lineHeight,
                }}
              >
                {designData.front.text.title.content}
              </div>
              <div
                style={{
                  color: designData.front.text.subTitle.color,
                  fontSize: designData.front.text.subTitle.size + "px",
                  fontFamily:
                    designData.front.text.subTitle.font === "Default"
                      ? "inherit"
                      : designData.front.text.subTitle.font,
                  fontWeight: designData.front.text.subTitle.bold
                    ? "bold"
                    : "normal",
                  fontStyle: designData.front.text.subTitle.italic
                    ? "italic"
                    : "normal",
                  textDecoration: designData.front.text.subTitle.underline
                    ? "underline"
                    : "none",
                  textAlign: designData.front.text.subTitle.align,
                  lineHeight: designData.front.text.subTitle.lineHeight,
                }}
              >
                {designData.front.text.subTitle.content}
              </div>
            </div>
          </div>

          {designData.front.backgroundType === "Image" && (
            <>
              <img
                src={designData.front.image.imageUrl}
                className="w-full h-full absolute top-0 left-0 object-cover"
                alt=""
              />
              <div
                className="w-full h-full absolute top-0 left-0"
                style={{
                  backgroundColor: designData.front.image.overlayColor,
                  opacity: designData.front.image.overlayOpacity,
                  pointerEvents: "none",
                }}
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
