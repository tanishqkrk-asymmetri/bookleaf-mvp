"use client";

import useDesign from "@/context/DesignContext";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";

// Helper function to convert uploaded file to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file as base64"));
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
};

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

  // Refs for each draggable element
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const authorNameRef = useRef<HTMLDivElement>(null);

  // State for dragging and snapping
  const [isDragging, setIsDragging] = useState(false);
  const [snapGuides, setSnapGuides] = useState({ showX: false, showY: false });

  // Constants for snapping
  const SNAP_THRESHOLD = 10; // pixels from center to trigger snap
  const FRONT_COVER_WIDTH = 487;
  const FRONT_COVER_HEIGHT = 782;
  const PADDING = 35; // padding of the front cover
  const BOTTOM_PADDING = 40;
  const AVAILABLE_WIDTH = FRONT_COVER_WIDTH - PADDING * 2;
  const AVAILABLE_HEIGHT = FRONT_COVER_HEIGHT - PADDING - BOTTOM_PADDING;
  const CENTER_X = AVAILABLE_WIDTH / 2;
  const CENTER_Y = AVAILABLE_HEIGHT / 2;

  // Helper function to apply snapping (now works with top-left positioning)
  const applySnapping = (
    x: number,
    y: number,
    elementRef?: React.RefObject<HTMLDivElement | null>,
  ) => {
    let snappedX = x;
    let snappedY = y;

    // If we have the element ref, we can center it properly
    const elementWidth = elementRef?.current?.offsetWidth || 0;
    const elementHeight = elementRef?.current?.offsetHeight || 0;

    // Calculate the center point of the element
    const elementCenterX = x + elementWidth / 2;
    const elementCenterY = y + elementHeight / 2;

    const showXGuide = Math.abs(elementCenterX - CENTER_X) < SNAP_THRESHOLD;
    const showYGuide = Math.abs(elementCenterY - CENTER_Y) < SNAP_THRESHOLD;

    if (showXGuide) {
      snappedX = CENTER_X - elementWidth / 2;
    }
    if (showYGuide) {
      snappedY = CENTER_Y - elementHeight / 2;
    }

    setSnapGuides({ showX: showXGuide, showY: showYGuide });
    return { x: snappedX, y: snappedY };
  };

  // Function to determine if a color is dark or light
  const isColorDark = (hexColor: string): boolean => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.5 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  // Get contrasting color for BookLeaf logo
  const getLogoColors = () => {
    const bgColor = designData.coverData.back.color?.colorCode || "#FFFFFF";
    const isDark = isColorDark(bgColor);
    return {
      logoBackground: isDark ? "#FFFFFF" : "#000000",
      logoText: isDark ? "#000000" : "#FFFFFF",
      textColor: isDark ? "#FFFFFF" : "#000000",
    };
  };

  // Calculate spine width based on page count
  const calculateSpineWidth = () => {
    const pageCount = designData.pageCount || 200;
    const spineWidthMm = (((pageCount as number) / 2) * 80 * 1.43) / 1000 + 0.6;
    const spineWidthPx = spineWidthMm * 3.78;
    return spineWidthPx;
  };

  const handleAuthorImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      try {
        // Convert file to base64
        const base64Data = await fileToBase64(file);
        const base64Content = base64Data.split(",")[1]; // Remove data:image/...;base64, prefix

        // Upload to S3
        const timestamp = Date.now();
        const extension = file.name.split(".").pop() || "jpg";
        const filename = `author_${timestamp}.${extension}`;

        const response = await fetch("/api/uploadImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: filename,
            upload_file: {
              filename: filename,
              contents: base64Content,
            },
          }),
        });

        const result = await response.json();

        // Update with hosted URL from S3
        if (result.hosted_link) {
          setDesignData((org) => ({
            ...org,
            coverData: {
              ...org.coverData,
              back: {
                ...org.coverData.back,
                author: {
                  ...org.coverData.back.author,
                  imageUrl: result.hosted_link,
                },
              },
            },
          }));
        } else {
          throw new Error("No hosted link returned from server");
        }
      } catch (error) {
        console.error("Error uploading author image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  // Handlers for draggable elements
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragStop = () => {
    setIsDragging(false);
    setSnapGuides({ showX: false, showY: false });
  };

  const handleTitleDrag = (e: DraggableEvent, data: DraggableData) => {
    applySnapping(data.x, data.y, titleRef);
  };

  const handleTitleStop = (e: DraggableEvent, data: DraggableData) => {
    const snapped = applySnapping(data.x, data.y, titleRef);
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          text: {
            ...org.coverData.front.text,
            title: {
              ...org.coverData.front.text.title,
              position: {
                x: snapped.x,
                y: snapped.y,
              },
            },
          },
        },
      },
    }));
    handleDragStop();
  };

  const handleSubtitleDrag = (e: DraggableEvent, data: DraggableData) => {
    applySnapping(data.x, data.y, subtitleRef);
  };

  const handleSubtitleStop = (e: DraggableEvent, data: DraggableData) => {
    const snapped = applySnapping(data.x, data.y, subtitleRef);
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          text: {
            ...org.coverData.front.text,
            subTitle: {
              ...org.coverData.front.text.subTitle,
              position: {
                x: snapped.x,
                y: snapped.y,
              },
            },
          },
        },
      },
    }));
    handleDragStop();
  };

  const handleAuthorNameDrag = (e: DraggableEvent, data: DraggableData) => {
    applySnapping(data.x, data.y, authorNameRef);
  };

  const handleAuthorNameStop = (e: DraggableEvent, data: DraggableData) => {
    const snapped = applySnapping(data.x, data.y, authorNameRef);
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          text: {
            ...org.coverData.front.text,
            authorName: {
              ...org.coverData.front.text.authorName,
              position: {
                x: snapped.x,
                y: snapped.y,
              },
            },
          },
        },
      },
    }));
    handleDragStop();
  };

  // Initialize barcode
  useEffect(() => {
    const barcodeElement = document.querySelector("#barcode");
    if (barcodeElement && designData.ISBN) {
      try {
        JsBarcode("#barcode", designData.ISBN, {
          format: "CODE128",
          lineColor: "#000",
          width: 0.8,
          height: 50,
          displayValue: true,
          fontSize: 10,
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [designData.ISBN]);

  const proxyUrl = `/api/proxy?url=${encodeURIComponent("https://" + designData.coverData.front.image.imageUrl.replaceAll("//", ""))}`;

  console.log(proxyUrl);
  return (
    <div className="w-full bg-[#f3edeb] ">
      <div className="flex justify-center items-center h-full gap-0">
        <div
          onClick={() => {
            // setSelectedView("Back");
          }}
          className="back flex flex-col justify-between scale-80"
          style={{
            height: "782px",
            width: "487px",
            padding: "35px",
            background: designData.coverData.back.color?.colorCode || "#FFFFFF",
          }}
        >
          {/* Book Description */}
          <div
            className="text-justify"
            style={{
              color: designData.coverData.back.description.color,
              fontSize: designData.coverData.back.description.size + "px",
              fontFamily:
                designData.coverData.back.description.font === "Default"
                  ? "inherit"
                  : designData.coverData.back.description.font,
              lineHeight: 1.6,
            }}
          >
            {designData.coverData.back.description.content}
          </div>

          {/* About the Author Section */}
          <div className="flex-1 flex flex-col justify-center">
            <div
              className="font-bold mb-3 tracking-wider"
              style={{
                color: designData.coverData.back.author.color,
                fontSize: designData.coverData.back.author.size + 2 + "px",
                fontFamily:
                  designData.coverData.back.author.font === "Default"
                    ? "inherit"
                    : designData.coverData.back.author.font,
              }}
            >
              {designData.coverData.back.author.title}
            </div>
            <div className="flex gap-4">
              <div
                className="flex-1 text-justify"
                style={{
                  color: designData.coverData.back.author.color,
                  fontSize: designData.coverData.back.author.size + "px",
                  fontFamily:
                    designData.coverData.back.author.font === "Default"
                      ? "inherit"
                      : designData.coverData.back.author.font,
                  lineHeight: 1.5,
                }}
              >
                {designData.coverData.back.author.content}
              </div>
              <div className="w-32 h-32 shrink-0">
                {designData.coverData.back.author.imageUrl ? (
                  <img
                    src={designData.coverData.back.author.imageUrl}
                    alt="Author"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <>
                    <input
                      id="canvas-author-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAuthorImageUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="canvas-author-image-upload"
                      className={`w-full h-full ${
                        isColorDark(
                          designData.coverData.back.color?.colorCode ||
                            "#FFFFFF",
                        )
                          ? "bg-white/50 text-black"
                          : "bg-black/50 text-white"
                      }  rounded flex items-center justify-center  text-xs text-center p-2 cursor-pointer  transition-colors`}
                    >
                      Add author image
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* BookLeaf Logo at Bottom */}
          <div className="flex justify-between items-start">
            <div>
              <img
                src={
                  isColorDark(
                    designData.coverData.back.color?.colorCode || "#FFFFFF",
                  )
                    ? "/black2.png"
                    : "/white2.png"
                }
                alt="Bookleaf Publishing"
                className="h-22 w-auto"
              />
            </div>
            <div className="flex flex-col items-center">
              <svg id="barcode"></svg>
              {/* <div
                className="text-xs mt-1"
                style={{ color: getLogoColors().textColor }}
              >
                {designData.ISBN}
              </div> */}
            </div>
          </div>
        </div>

        <div
          onClick={() => {
            // setSelectedView("Spine");
          }}
          className="spine scale-80"
          style={{
            height: "782px",
            width: `${calculateSpineWidth()}px`,
            background:
              designData.coverData.spine.color?.colorCode || "#f5f5f5",
          }}
        ></div>

        <div
          onClick={() => {
            // setSelectedView("Front");
          }}
          className="frontMain bg-foreground/20 flex justify-center items-center relative scale-80"
          style={{
            height: "782px",
            width: "487px",
            paddingTop: "60px",
            paddingLeft: "35px",
            paddingRight: "35px",
            paddingBottom: "60px",
            background:
              designData.coverData.front.backgroundType === "Gradient"
                ? `linear-gradient(${designData.coverData.front.gradient?.direction}deg, ${designData.coverData.front.gradient?.from}, ${designData.coverData.front.gradient?.to})`
                : designData.coverData.front.color?.colorCode,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Margin Guidelines - shown only when dragging */}
            {isDragging && (
              <>
                {/* Top margin line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "rgba(59, 130, 246, 0.5)",
                    zIndex: 5,
                  }}
                />
                {/* Bottom margin line */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "1px",
                    backgroundColor: "rgba(59, 130, 246, 0.5)",
                    zIndex: 5,
                  }}
                />
                {/* Left margin line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "1px",
                    backgroundColor: "rgba(59, 130, 246, 0.5)",
                    zIndex: 5,
                  }}
                />
                {/* Right margin line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: "1px",
                    backgroundColor: "rgba(59, 130, 246, 0.5)",
                    zIndex: 5,
                  }}
                />
              </>
            )}

            {/* Center Snap Guides */}
            {snapGuides.showX && (
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: CENTER_X,
                  width: "2px",
                  backgroundColor: "rgba(236, 72, 153, 0.8)",
                  zIndex: 5,
                }}
              />
            )}
            {snapGuides.showY && (
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: CENTER_Y,
                  height: "2px",
                  backgroundColor: "rgba(236, 72, 153, 0.8)",
                  zIndex: 5,
                }}
              />
            )}

            {/* Title - Draggable */}
            <Draggable
              key={`title-${designData.coverData.front.text.title.position.x}-${designData.coverData.front.text.title.position.y}`}
              nodeRef={titleRef}
              position={{
                x: designData.coverData.front.text.title.position.x,
                y: designData.coverData.front.text.title.position.y,
              }}
              onStart={handleDragStart}
              onDrag={handleTitleDrag}
              onStop={handleTitleStop}
              bounds="parent"
            >
              <div
                ref={titleRef}
                style={{
                  position: "absolute",
                  cursor: "move",
                  zIndex: 10,
                  touchAction: "none",
                  maxWidth: "90%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
                className="h-fit cursor-grab select-none active:cursor-grabbing"
              >
                <div
                  style={{
                    color: designData.coverData.front.text.title.color,
                    fontSize: designData.coverData.front.text.title.size + "px",
                    fontFamily:
                      designData.coverData.front.text.title.font === "Default"
                        ? "inherit"
                        : designData.coverData.front.text.title.font,
                    fontWeight: designData.coverData.front.text.title.bold
                      ? "bold"
                      : "normal",
                    fontStyle: designData.coverData.front.text.title.italic
                      ? "italic"
                      : "normal",
                    textDecoration: designData.coverData.front.text.title
                      .underline
                      ? "underline"
                      : "none",
                    textAlign: designData.coverData.front.text.title.align,
                    lineHeight:
                      designData.coverData.front.text.title.lineHeight,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {designData.coverData.front.text.title.content}
                </div>
              </div>
            </Draggable>

            {/* Subtitle - Draggable */}
            <Draggable
              key={`subtitle-${designData.coverData.front.text.subTitle.position.x}-${designData.coverData.front.text.subTitle.position.y}`}
              nodeRef={subtitleRef}
              position={{
                x: designData.coverData.front.text.subTitle.position.x,
                y: designData.coverData.front.text.subTitle.position.y,
              }}
              onStart={handleDragStart}
              onDrag={handleSubtitleDrag}
              onStop={handleSubtitleStop}
              bounds="parent"
            >
              <div
                ref={subtitleRef}
                style={{
                  position: "absolute",
                  cursor: "move",
                  zIndex: 10,
                  touchAction: "none",
                  maxWidth: "90%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
                className="h-fit cursor-grab select-none active:cursor-grabbing"
              >
                <div
                  style={{
                    color: designData.coverData.front.text.subTitle.color,
                    fontSize:
                      designData.coverData.front.text.subTitle.size + "px",
                    fontFamily:
                      designData.coverData.front.text.subTitle.font ===
                      "Default"
                        ? "inherit"
                        : designData.coverData.front.text.subTitle.font,
                    fontWeight: designData.coverData.front.text.subTitle.bold
                      ? "bold"
                      : "normal",
                    fontStyle: designData.coverData.front.text.subTitle.italic
                      ? "italic"
                      : "normal",
                    textDecoration: designData.coverData.front.text.subTitle
                      .underline
                      ? "underline"
                      : "none",
                    textAlign: designData.coverData.front.text.subTitle.align,
                    lineHeight:
                      designData.coverData.front.text.subTitle.lineHeight,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {designData.coverData.front.text.subTitle.content}
                </div>
              </div>
            </Draggable>

            {/* Author Name - Draggable */}
            <Draggable
              key={`authorName-${designData.coverData.front.text.authorName.position.x}-${designData.coverData.front.text.authorName.position.y}`}
              nodeRef={authorNameRef}
              position={{
                x: designData.coverData.front.text.authorName.position.x,
                y: designData.coverData.front.text.authorName.position.y,
              }}
              onStart={handleDragStart}
              onDrag={handleAuthorNameDrag}
              onStop={handleAuthorNameStop}
              bounds="parent"
            >
              <div
                ref={authorNameRef}
                style={{
                  position: "absolute",
                  cursor: "move",
                  zIndex: 10,
                  touchAction: "none",
                  maxWidth: "90%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
                className="h-fit cursor-grab select-none active:cursor-grabbing"
              >
                <div
                  style={{
                    color: designData.coverData.front.text.authorName.color,
                    fontSize:
                      designData.coverData.front.text.authorName.size + "px",
                    fontFamily:
                      designData.coverData.front.text.authorName.font ===
                      "Default"
                        ? "inherit"
                        : designData.coverData.front.text.authorName.font,
                    fontWeight: designData.coverData.front.text.authorName.bold
                      ? "bold"
                      : "normal",
                    fontStyle: designData.coverData.front.text.authorName.italic
                      ? "italic"
                      : "normal",
                    textDecoration: designData.coverData.front.text.authorName
                      .underline
                      ? "underline"
                      : "none",
                    textAlign: designData.coverData.front.text.authorName.align,
                    lineHeight:
                      designData.coverData.front.text.authorName.lineHeight,
                  }}
                >
                  {designData.coverData.front.text.authorName.content}
                </div>
              </div>
            </Draggable>
          </div>

          {designData.coverData.front.backgroundType === "Image" && (
            <>
              <img
                // src={proxyUrl}
                src={designData.coverData.front.image.imageUrl}
                className="w-full h-full absolute top-0 left-0 object-cover"
                alt=""
                style={{ zIndex: 0 }}
              />
              <div
                className="w-full h-full absolute top-0 left-0"
                style={{
                  backgroundColor:
                    designData.coverData.front.image.overlayColor,
                  opacity: designData.coverData.front.image.overlayOpacity,
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              ></div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
