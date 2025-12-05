"use client";

import useDesign from "@/context/DesignContext";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { useRef } from "react";

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
  // Function to determine if a color is dark or light
  const isColorDark = (hexColor: string): boolean => {
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
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
    const spineWidthMm = ((pageCount / 2) * 80 * 1.43) / 1000 + 0.6;
    const spineWidthPx = spineWidthMm * 3.78;
    return spineWidthPx;
  };

  const handleAuthorImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setDesignData((org) => ({
          ...org,
          coverData: {
            ...org.coverData,
            back: {
              ...org.coverData.back,
              author: {
                ...org.coverData.back.author,
                imageUrl: imageUrl,
              },
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for draggable elements
  const handleTitleDrag = (e: DraggableEvent, data: DraggableData) => {
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
                x: data.x,
                y: data.y,
              },
            },
          },
        },
      },
    }));
  };

  const handleSubtitleDrag = (e: DraggableEvent, data: DraggableData) => {
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
                x: data.x,
                y: data.y,
              },
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameDrag = (e: DraggableEvent, data: DraggableData) => {
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
                x: data.x,
                y: data.y,
              },
            },
          },
        },
      },
    }));
  };

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
            padding: "27px",
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
                      className="w-full h-full bg-foreground/10 rounded flex items-center justify-center text-foreground/30 text-xs text-center p-2 cursor-pointer hover:bg-foreground/20 transition-colors"
                    >
                      Add author image
                    </label>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* BookLeaf Logo at Bottom */}
          <div
            className="flex gap-1 font-thin items-center"
            style={{ color: getLogoColors().textColor }}
          >
            <div
              className="aspect-square w-8 h-8 text-center flex justify-center items-center font-bold text-2xl"
              style={{
                backgroundColor: getLogoColors().logoBackground,
                color: getLogoColors().logoText,
              }}
            >
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
          className="front bg-foreground/20 flex justify-center items-center relative scale-80"
          style={{
            height: "782px",
            width: "487px",
            paddingTop: "27px",
            paddingLeft: "27px",
            paddingRight: "27px",
            paddingBottom: "40px",
            background:
              designData.coverData.front.backgroundType === "Gradient"
                ? `linear-gradient(${designData.coverData.front.gradient?.direction}deg, ${designData.coverData.front.gradient?.from}, ${designData.coverData.front.gradient?.to})`
                : designData.coverData.front.color?.colorCode,
          }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {/* Title - Draggable */}
            <Draggable
              nodeRef={titleRef}
              position={{
                x: designData.coverData.front.text.title.position.x,
                y: designData.coverData.front.text.title.position.y,
              }}
              onDrag={handleTitleDrag}
              bounds="parent"
            >
              <div
                ref={titleRef}
                style={{
                  position: "absolute",
                  cursor: "move",
                  zIndex: 10,
                  touchAction: "none",
                  maxWidth: "100%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
                className="h-fit cursor-grab select-none"
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
                  }}
                >
                  {designData.coverData.front.text.title.content}
                </div>
              </div>
            </Draggable>

            {/* Subtitle - Draggable */}
            <Draggable
              nodeRef={subtitleRef}
              position={{
                x: designData.coverData.front.text.subTitle.position.x,
                y: designData.coverData.front.text.subTitle.position.y,
              }}
              onDrag={handleSubtitleDrag}
              bounds="parent"
            >
              <div
                ref={subtitleRef}
                style={{
                  position: "absolute",
                  cursor: "move",
                  zIndex: 10,
                  touchAction: "none",
                  maxWidth: "100%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
                className="h-fit cursor-grab select-none"
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
                  }}
                >
                  {designData.coverData.front.text.subTitle.content}
                </div>
              </div>
            </Draggable>

            {/* Author Name - Draggable */}
            <Draggable
              nodeRef={authorNameRef}
              position={{
                x: designData.coverData.front.text.authorName.position.x,
                y: designData.coverData.front.text.authorName.position.y,
              }}
              onDrag={handleAuthorNameDrag}
              bounds="parent"
            >
              <div
                ref={authorNameRef}
                style={{
                  position: "absolute",
                  cursor: "move",
                  zIndex: 10,
                  touchAction: "none",
                  maxWidth: "100%",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
                className="h-fit cursor-grab select-none"
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
                src={designData.coverData.front.image.imageUrl}
                className="w-full h-full absolute top-0 left-0 object-cover"
                alt=""
              />
              <div
                className="w-full h-full absolute top-0 left-0"
                style={{
                  backgroundColor:
                    designData.coverData.front.image.overlayColor,
                  opacity: designData.coverData.front.image.overlayOpacity,
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
