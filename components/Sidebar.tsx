"use client";

import useDesign from "@/context/DesignContext";
import { UnsplashPhoto } from "@/types/UnsplashPhoto";
import DEBOUNCE from "@/utils/DEBOUNCE";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Book,
  Check,
  Italic,
  LetterText,
  LibraryBig,
  SquareDashed,
  Text,
  Underline,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function Sidebar({
  selectedView,
  setSelectedView,
}: {
  selectedView: "Front" | "Back" | "Spine";
  setSelectedView: React.Dispatch<
    React.SetStateAction<"Front" | "Back" | "Spine">
  >;
}) {
  const [selectedFrontView, setSelectedFrontView] = useState<
    "Background" | "Text"
  >("Background");

  const [imageList, setImageList] = useState([]);
  const [imageQuery, setImageQuery] = useState("");

  const searchImages = DEBOUNCE(async (query: string) => {
    const images = await fetch("/api/searchImage", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: query,
      }),
    });
    const imageList = (await images.json()).response.results;
    setImageList(imageList);
    console.log(imageList);
  });

  const { designData, setDesignData } = useDesign()!;

  const handleViewClick = (view: "Front" | "Back" | "Spine") => {
    setSelectedView(view);
  };

  const handleFrontViewClick = (view: "Background" | "Text") => {
    setSelectedFrontView(view);
  };

  const handleBackgroundColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        backgroundType: "Color",
        color: {
          ...org.front.color,
          colorCode: colorCode,
        },
      },
    }));
  };

  const handleColorInputChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        backgroundType: "Color",
        color: {
          ...org.front.color,
          colorCode: colorCode,
        },
      },
    }));
  };

  const handleGradientFromChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        backgroundType: "Gradient",
        gradient: {
          ...org.front.gradient,
          from: value,
        },
      },
    }));
  };

  const handleGradientToChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        backgroundType: "Gradient",
        gradient: {
          ...org.front.gradient,
          to: value,
        },
      },
    }));
  };

  const handleGradientDirectionChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        backgroundType: "Gradient",
        gradient: {
          ...org.front.gradient,
          direction: parseInt(value),
        },
      },
    }));
  };

  const handleImageQueryChange = async (value: string) => {
    setImageQuery(value);
    searchImages(value);
  };

  const handleImageClick = (imageUrl: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        backgroundType: "Image",
        image: {
          ...org.front.image,
          imageUrl: imageUrl,
        },
      },
    }));
  };

  const handleImageOverlayColorChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        image: {
          ...org.front.image,
          overlayColor: colorCode,
        },
      },
    }));
  };

  const handleImageOverlayOpacityChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        image: {
          ...org.front.image,
          overlayOpacity: parseFloat(value),
        },
      },
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
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
          front: {
            ...org.front,
            backgroundType: "Image",
            image: {
              ...org.front.image,
              imageUrl: imageUrl,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTitleContentChange = (content: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            content: content,
          },
        },
      },
    }));
  };

  const handleTitleColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            color: colorCode,
          },
        },
      },
    }));
  };

  const handleTitleSizeChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            size: parseInt(value),
          },
        },
      },
    }));
  };

  const handleTitleFontChange = (font: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            font: font,
          },
        },
      },
    }));
  };

  const handleTitleBoldToggle = () => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            bold: !org.front.text.title.bold,
          },
        },
      },
    }));
  };

  const handleTitleItalicToggle = () => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            italic: !org.front.text.title.italic,
          },
        },
      },
    }));
  };

  const handleTitleUnderlineToggle = () => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            underline: !org.front.text.title.underline,
          },
        },
      },
    }));
  };

  const handleTitleAlignChange = (
    align: "left" | "center" | "right" | "justify"
  ) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            align: align,
          },
        },
      },
    }));
  };

  const handleTitleLineHeightChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          title: {
            ...org.front.text.title,
            lineHeight: parseFloat(value),
          },
        },
      },
    }));
  };

  const handleSubtitleContentChange = (content: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            content: content,
          },
        },
      },
    }));
  };

  const handleSubtitleColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            color: colorCode,
          },
        },
      },
    }));
  };

  const handleSubtitleSizeChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            size: parseInt(value),
          },
        },
      },
    }));
  };

  const handleSubtitleFontChange = (font: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            font: font,
          },
        },
      },
    }));
  };

  const handleSubtitleBoldToggle = () => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            bold: !org.front.text.subTitle.bold,
          },
        },
      },
    }));
  };

  const handleSubtitleItalicToggle = () => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            italic: !org.front.text.subTitle.italic,
          },
        },
      },
    }));
  };

  const handleSubtitleUnderlineToggle = () => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            underline: !org.front.text.subTitle.underline,
          },
        },
      },
    }));
  };

  const handleSubtitleAlignChange = (
    align: "left" | "center" | "right" | "justify"
  ) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            align: align,
          },
        },
      },
    }));
  };

  const handleSubtitleLineHeightChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      front: {
        ...org.front,
        text: {
          ...org.front.text,
          subTitle: {
            ...org.front.text.subTitle,
            lineHeight: parseFloat(value),
          },
        },
      },
    }));
  };

  const handleSpineColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      spine: {
        ...org.spine,
        color: {
          colorCode: colorCode,
        },
      },
    }));
  };

  const handleSpineColorInputChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      spine: {
        ...org.spine,
        color: {
          colorCode: colorCode,
        },
      },
    }));
  };

  const handleBackColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        color: {
          colorCode: colorCode,
        },
      },
    }));
  };

  const handleBackColorInputChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        color: {
          colorCode: colorCode,
        },
      },
    }));
  };

  const handleDescriptionContentChange = (content: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        description: {
          ...org.back.description,
          content: content,
        },
      },
    }));
  };

  const handleDescriptionSizeChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        description: {
          ...org.back.description,
          size: parseInt(value),
        },
      },
    }));
  };

  const handleDescriptionColorChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        description: {
          ...org.back.description,
          color: colorCode,
        },
      },
    }));
  };

  const handleDescriptionFontChange = (font: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        description: {
          ...org.back.description,
          font: font,
        },
      },
    }));
  };

  const handleAuthorTitleChange = (title: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        author: {
          ...org.back.author,
          title: title,
        },
      },
    }));
  };

  const handleAuthorContentChange = (content: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        author: {
          ...org.back.author,
          content: content,
        },
      },
    }));
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
          back: {
            ...org.back,
            author: {
              ...org.back.author,
              imageUrl: imageUrl,
            },
          },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAuthorSizeChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        author: {
          ...org.back.author,
          size: parseInt(value),
        },
      },
    }));
  };

  const handleAuthorColorChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        author: {
          ...org.back.author,
          color: colorCode,
        },
      },
    }));
  };

  const handleAuthorFontChange = (font: string) => {
    setDesignData((org) => ({
      ...org,
      back: {
        ...org.back,
        author: {
          ...org.back.author,
          font: font,
        },
      },
    }));
  };
  return (
    <div className="px-3 flex  min-w-108 divide-x-2 divide-zinc-200">
      <div className="flex flex-col justify-start items-center pr-4">
        <button
          onClick={() => handleViewClick("Front")}
          className={`flex flex-col justify-center items-center p-6 w-full hover:bg-foreground/10 cursor-pointer duration-200 aspect-square ${
            selectedView === "Front"
              ? "border-b-2 border-theme"
              : "border-b-2 border-white"
          }`}
        >
          <Book
            className={
              selectedView === "Front" ? "text-theme" : "text-foreground"
            }
          ></Book>
          <div
            className={
              selectedView === "Front" ? "text-theme" : "text-foreground"
            }
          >
            Front
          </div>
        </button>
        <button
          onClick={() => handleViewClick("Spine")}
          className={`flex flex-col justify-center items-center p-6 w-full hover:bg-foreground/10 cursor-pointer duration-200 aspect-square ${
            selectedView === "Spine"
              ? "border-b-2 border-theme"
              : "border-b-2 border-white"
          }`}
        >
          <LibraryBig
            className={
              selectedView === "Spine" ? "text-theme" : "text-foreground"
            }
          ></LibraryBig>
          <div
            className={
              selectedView === "Spine" ? "text-theme" : "text-foreground"
            }
          >
            Spine
          </div>
        </button>
        <button
          onClick={() => handleViewClick("Back")}
          className={`flex flex-col justify-center items-center p-6 w-full  hover:bg-foreground/10 cursor-pointer duration-200 aspect-square ${
            selectedView === "Back"
              ? "border-b-2 border-theme"
              : "border-b-2 border-white"
          }`}
        >
          <LibraryBig
            className={
              selectedView === "Back" ? "text-theme" : "text-foreground"
            }
          ></LibraryBig>
          <div
            className={
              selectedView === "Back" ? "text-theme" : "text-foreground"
            }
          >
            Back
          </div>
        </button>
      </div>
      <div className="w-full">
        {selectedView === "Front" ? (
          <div className="p-3 overflow-y-scroll h-full noscrollbar">
            <div className="">Front</div>
            <div className="grid grid-cols-2 w-full">
              <button
                onClick={() => handleFrontViewClick("Background")}
                className={`p-3   hover:bg-foreground/10 cursor-pointer duration-200 aspect-square justify-center items-center text-center flex flex-col gap-2 ${
                  selectedFrontView === "Background"
                    ? "border-b-2 border-theme"
                    : "border-b-2 border-white"
                }`}
              >
                <SquareDashed
                  className={
                    selectedFrontView === "Background"
                      ? "text-theme"
                      : "text-foreground"
                  }
                ></SquareDashed>
                <div
                  className={`text-sm ${
                    selectedFrontView === "Background"
                      ? "text-theme"
                      : "text-foreground"
                  }`}
                >
                  Background
                </div>
              </button>
              <button
                onClick={() => handleFrontViewClick("Text")}
                className={`p-3   hover:bg-foreground/10 cursor-pointer duration-200 aspect-square justify-center items-center text-center flex flex-col gap-2 ${
                  selectedFrontView === "Text"
                    ? "border-b-2 border-theme"
                    : "border-b-2 border-white"
                }`}
              >
                <LetterText
                  className={`text-sm ${
                    selectedFrontView === "Text"
                      ? "text-theme"
                      : "text-foreground"
                  }`}
                ></LetterText>
                <div
                  className={`text-sm ${
                    selectedFrontView === "Text"
                      ? "text-theme"
                      : "text-foreground"
                  }`}
                >
                  Text
                </div>
              </button>
            </div>
            {selectedFrontView === "Background" ? (
              <div className="divide-y-2 divide-zinc-500">
                <div className="space-y-3 py-3">
                  <div>Choose color</div>

                  <div className="grid grid-cols-5 gap-1">
                    {[
                      "#FF6B6B",
                      "#4ECDC4",
                      "#45B7D1",
                      "#FFA07A",
                      "#98D8C8",
                      "#F7DC6F",
                      "#BB8FCE",
                      "#85C1E2",
                      "#F8B739",
                      "#52B788",
                      "#E74C3C",
                      "#3498DB",
                      "#9B59B6",
                      "#E67E22",
                      "#1ABC9C",
                    ].map((x) => {
                      return (
                        <div
                          key={x}
                          onClick={() => handleBackgroundColorClick(x)}
                          className="w-8 aspect-square rounded-full cursor-pointer flex justify-center items-center text-white"
                          style={{
                            background: x,
                          }}
                        >
                          {x === designData.front.color?.colorCode && (
                            <Check></Check>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <div>Custom</div>
                    <div className="flex border border-foreground/50 p-1">
                      <input
                        value={designData.front.color?.colorCode}
                        className="aspect-square h-8"
                        onChange={(e) => handleColorInputChange(e.target.value)}
                        type="color"
                      />
                      <input
                        className="focus-within:outline-0 w-fit"
                        onChange={(e) => handleColorInputChange(e.target.value)}
                        value={designData.front.color?.colorCode}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 py-3">
                  <div>Select colors for gradient</div>

                  <div className="grid grid-cols-3">
                    <div>
                      <div>From</div>
                      <input
                        value={designData.front.gradient.from}
                        className="aspect-square h-8 w-1/2"
                        onChange={(e) =>
                          handleGradientFromChange(e.target.value)
                        }
                        type="color"
                      />
                    </div>
                    <div>
                      <div>To</div>
                      <input
                        value={designData.front.gradient.to}
                        className="aspect-square h-8 w-1/2"
                        onChange={(e) => handleGradientToChange(e.target.value)}
                        type="color"
                      />
                    </div>
                    <div>
                      <div>Direction</div>
                      <input
                        value={designData.front.gradient.direction}
                        className="aspect-square h-8 w-1/2"
                        onChange={(e) =>
                          handleGradientDirectionChange(e.target.value)
                        }
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 py-3">
                  <div>Upload image</div>
                  <div>
                    <label
                      htmlFor="image-upload"
                      className="block w-full p-3 border-2 border-dashed border-foreground/30 rounded-lg text-center cursor-pointer hover:border-theme hover:bg-foreground/5 transition-colors"
                    >
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-8 h-8 text-foreground/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm text-foreground/70">
                          Click to upload image
                        </span>
                        <span className="text-xs text-foreground/50">
                          PNG, JPG, GIF up to 10MB
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="space-y-3 py-3">
                  <div>Select image</div>
                  <div>
                    <input
                      value={imageQuery}
                      onChange={(e) => handleImageQueryChange(e.target.value)}
                      className="border rounded-md w-full p-2"
                      type="text"
                      placeholder="Search for image"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {imageList.map((image: UnsplashPhoto) => (
                      <div
                        onClick={() => handleImageClick(image.urls.full)}
                        key={image.id}
                      >
                        <img
                          className="w-36 rounded-md object-cover h-full"
                          src={image.urls.regular}
                          alt=""
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 py-3">
                  <div>Image Overlay</div>
                  <div className="space-y-3">
                    <div>
                      <div className="mb-2">Overlay Color</div>
                      <div className="grid grid-cols-5 gap-1">
                        {[
                          "#000000",
                          "#FFFFFF",
                          "#FF6B6B",
                          "#4ECDC4",
                          "#45B7D1",
                          "#FFA07A",
                          "#98D8C8",
                          "#F7DC6F",
                          "#BB8FCE",
                          "#85C1E2",
                        ].map((x) => {
                          return (
                            <div
                              key={x}
                              onClick={() => handleImageOverlayColorChange(x)}
                              className="w-8 aspect-square rounded-full cursor-pointer flex justify-center items-center text-white border border-foreground/20"
                              style={{
                                background: x,
                              }}
                            >
                              {x === designData.front.image.overlayColor && (
                                <Check className="w-4 h-4"></Check>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">Custom Overlay Color</div>
                      <div className="flex border border-foreground/50 p-1">
                        <input
                          value={designData.front.image.overlayColor}
                          className="aspect-square h-8"
                          onChange={(e) =>
                            handleImageOverlayColorChange(e.target.value)
                          }
                          type="color"
                        />
                        <input
                          className="focus-within:outline-0 w-fit"
                          onChange={(e) =>
                            handleImageOverlayColorChange(e.target.value)
                          }
                          value={designData.front.image.overlayColor}
                        ></input>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">Overlay Opacity</div>
                      <input
                        min={0}
                        max={1}
                        step={0.05}
                        value={designData.front.image.overlayOpacity}
                        onChange={(e) =>
                          handleImageOverlayOpacityChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                      <div className="text-sm text-center text-foreground/70">
                        {Math.round(
                          designData.front.image.overlayOpacity * 100
                        )}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedFrontView === "Text" ? (
              <div className="divide-y-2 divide-zinc-500">
                <div className="space-y-2 py-3">
                  <div>Title</div>
                  <input
                    value={designData.front.text.title.content}
                    onChange={(e) => handleTitleContentChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB]"
                    placeholder="Title"
                  ></input>
                  <div className="space-y-3 py-3">
                    <div>Title color</div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        "#FF6B6B",
                        "#4ECDC4",
                        "#45B7D1",
                        "#FFA07A",
                        "#98D8C8",
                        "#F7DC6F",
                        "#BB8FCE",
                        "#85C1E2",
                        "#F8B739",
                        "#52B788",
                        "#E74C3C",
                        "#3498DB",
                        "#9B59B6",
                        "#E67E22",
                        "#1ABC9C",
                      ].map((x) => {
                        return (
                          <div
                            key={x}
                            onClick={() => handleTitleColorClick(x)}
                            className="w-8 aspect-square rounded-full cursor-pointer flex justify-center items-center text-white"
                            style={{
                              background: x,
                            }}
                          >
                            {x === designData.front.color?.colorCode && (
                              <Check></Check>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3">
                      <div className="mb-2">Custom Title Color</div>
                      <div className="flex border border-foreground/50 p-1">
                        <input
                          value={designData.front.text.title.color}
                          className="aspect-square h-8"
                          onChange={(e) =>
                            handleTitleColorClick(e.target.value)
                          }
                          type="color"
                        />
                        <input
                          className="focus-within:outline-0 w-fit"
                          onChange={(e) =>
                            handleTitleColorClick(e.target.value)
                          }
                          value={designData.front.text.title.color}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Title Size</div>
                    <div>
                      <input
                        min={12}
                        max={100}
                        value={designData.front.text.title.size}
                        onChange={(e) => handleTitleSizeChange(e.target.value)}
                        type="range"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Title Font</div>
                    <select
                      value={designData.front.text.title.font}
                      onChange={(e) => handleTitleFontChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                    >
                      <option value="Default">Default</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Impact">Impact</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                      <option value="Palatino">Palatino</option>
                      <option value="Garamond">Garamond</option>
                      <option value="Bookman">Bookman</option>
                      <option value="Avant Garde">Avant Garde</option>
                    </select>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Title Styling</div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleTitleBoldToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.title.bold
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Bold className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleTitleItalicToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.title.italic
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Italic className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleTitleUnderlineToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.title.underline
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Underline className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Title Alignment</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTitleAlignChange("left")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.title.align === "left"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignLeft className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleTitleAlignChange("center")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.title.align === "center"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignCenter className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleTitleAlignChange("right")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.title.align === "right"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignRight className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleTitleAlignChange("justify")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.title.align === "justify"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignJustify className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Title Line Height</div>
                    <div>
                      <input
                        min={0.5}
                        max={3}
                        step={0.1}
                        value={designData.front.text.title.lineHeight}
                        onChange={(e) =>
                          handleTitleLineHeightChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                      <div className="text-sm text-center text-foreground/70">
                        {designData.front.text.title.lineHeight}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 py-3">
                  <div>Subtitle</div>
                  <input
                    value={designData.front.text.subTitle.content}
                    onChange={(e) =>
                      handleSubtitleContentChange(e.target.value)
                    }
                    className="w-full p-2 rounded-lg bg-[#F3EDEB]"
                    placeholder="Subtitle"
                  ></input>
                  <div className="space-y-3 py-3">
                    <div>Subtitle color</div>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        "#FF6B6B",
                        "#4ECDC4",
                        "#45B7D1",
                        "#FFA07A",
                        "#98D8C8",
                        "#F7DC6F",
                        "#BB8FCE",
                        "#85C1E2",
                        "#F8B739",
                        "#52B788",
                        "#E74C3C",
                        "#3498DB",
                        "#9B59B6",
                        "#E67E22",
                        "#1ABC9C",
                      ].map((x) => {
                        return (
                          <div
                            key={x}
                            onClick={() => handleSubtitleColorClick(x)}
                            className="w-8 aspect-square rounded-full cursor-pointer flex justify-center items-center text-white"
                            style={{
                              background: x,
                            }}
                          >
                            {x === designData.front.text.subTitle.color && (
                              <Check></Check>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3">
                      <div className="mb-2">Custom Subtitle Color</div>
                      <div className="flex border border-foreground/50 p-1">
                        <input
                          value={designData.front.text.subTitle.color}
                          className="aspect-square h-8"
                          onChange={(e) =>
                            handleSubtitleColorClick(e.target.value)
                          }
                          type="color"
                        />
                        <input
                          className="focus-within:outline-0 w-fit"
                          onChange={(e) =>
                            handleSubtitleColorClick(e.target.value)
                          }
                          value={designData.front.text.subTitle.color}
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Subtitle Size</div>
                    <div>
                      <input
                        min={10}
                        max={80}
                        value={designData.front.text.subTitle.size}
                        onChange={(e) =>
                          handleSubtitleSizeChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Subtitle Font</div>
                    <select
                      value={designData.front.text.subTitle.font}
                      onChange={(e) => handleSubtitleFontChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                    >
                      <option value="Default">Default</option>
                      <option value="Arial">Arial</option>
                      <option value="Helvetica">Helvetica</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Courier New">Courier New</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Impact">Impact</option>
                      <option value="Comic Sans MS">Comic Sans MS</option>
                      <option value="Trebuchet MS">Trebuchet MS</option>
                      <option value="Palatino">Palatino</option>
                      <option value="Garamond">Garamond</option>
                      <option value="Bookman">Bookman</option>
                      <option value="Avant Garde">Avant Garde</option>
                    </select>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Subtitle Styling</div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubtitleBoldToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.subTitle.bold
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Bold className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleSubtitleItalicToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.subTitle.italic
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Italic className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleSubtitleUnderlineToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.subTitle.underline
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Underline className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Subtitle Alignment</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSubtitleAlignChange("left")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.subTitle.align === "left"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignLeft className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleSubtitleAlignChange("center")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.subTitle.align === "center"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignCenter className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleSubtitleAlignChange("right")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.subTitle.align === "right"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignRight className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleSubtitleAlignChange("justify")}
                        className={`p-2 rounded border flex-1 ${
                          designData.front.text.subTitle.align === "justify"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignJustify className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Subtitle Line Height</div>
                    <div>
                      <input
                        min={0.5}
                        max={3}
                        step={0.1}
                        value={designData.front.text.subTitle.lineHeight}
                        onChange={(e) =>
                          handleSubtitleLineHeightChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                      <div className="text-sm text-center text-foreground/70">
                        {designData.front.text.subTitle.lineHeight}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        ) : selectedView === "Spine" ? (
          <div className="p-3 overflow-y-scroll h-full noscrollbar">
            <div className="mb-4 text-lg font-semibold">Spine</div>
            <div className="divide-y-2 divide-zinc-500">
              <div className="space-y-3 py-3">
                <div>Choose spine color</div>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    "#FF6B6B",
                    "#4ECDC4",
                    "#45B7D1",
                    "#FFA07A",
                    "#98D8C8",
                    "#F7DC6F",
                    "#BB8FCE",
                    "#85C1E2",
                    "#F8B739",
                    "#52B788",
                    "#E74C3C",
                    "#3498DB",
                    "#9B59B6",
                    "#E67E22",
                    "#1ABC9C",
                  ].map((x) => {
                    return (
                      <div
                        key={x}
                        onClick={() => handleSpineColorClick(x)}
                        className="w-8 aspect-square rounded-full cursor-pointer flex justify-center items-center text-white"
                        style={{
                          background: x,
                        }}
                      >
                        {x === designData.spine.color?.colorCode && (
                          <Check></Check>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div>Custom</div>
                  <div className="flex border border-foreground/50 p-1">
                    <input
                      value={designData.spine.color?.colorCode}
                      className="aspect-square h-8"
                      onChange={(e) =>
                        handleSpineColorInputChange(e.target.value)
                      }
                      type="color"
                    />
                    <input
                      className="focus-within:outline-0 w-fit"
                      onChange={(e) =>
                        handleSpineColorInputChange(e.target.value)
                      }
                      value={designData.spine.color?.colorCode}
                    ></input>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : selectedView === "Back" ? (
          <div className="p-3 overflow-y-scroll h-full noscrollbar">
            <div className="mb-4 text-lg font-semibold">Back Cover</div>
            <div className="divide-y-2 divide-zinc-500">
              <div className="space-y-3 py-3">
                <div>Background color</div>
                <div className="grid grid-cols-5 gap-1">
                  {[
                    "#FFFFFF",
                    "#F5F5F5",
                    "#E8E8E8",
                    "#FF6B6B",
                    "#4ECDC4",
                    "#45B7D1",
                    "#FFA07A",
                    "#98D8C8",
                    "#F7DC6F",
                    "#BB8FCE",
                  ].map((x) => {
                    return (
                      <div
                        key={x}
                        onClick={() => handleBackColorClick(x)}
                        className="w-8 aspect-square rounded-full cursor-pointer flex justify-center items-center text-white border border-foreground/20"
                        style={{
                          background: x,
                        }}
                      >
                        {x === designData.back.color?.colorCode && (
                          <Check className="text-black"></Check>
                        )}
                      </div>
                    );
                  })}
                </div>
                <div>
                  <div>Custom</div>
                  <div className="flex border border-foreground/50 p-1">
                    <input
                      value={designData.back.color?.colorCode}
                      className="aspect-square h-8"
                      onChange={(e) =>
                        handleBackColorInputChange(e.target.value)
                      }
                      type="color"
                    />
                    <input
                      className="focus-within:outline-0 w-fit"
                      onChange={(e) =>
                        handleBackColorInputChange(e.target.value)
                      }
                      value={designData.back.color?.colorCode}
                    ></input>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-3">
                <div className="font-semibold">Book Description</div>
                <textarea
                  value={designData.back.description.content}
                  onChange={(e) =>
                    handleDescriptionContentChange(e.target.value)
                  }
                  className="w-full p-2 rounded-lg bg-[#F3EDEB] min-h-24"
                  placeholder="Enter book description"
                />
                <div>
                  <div className="mb-2">Text Size</div>
                  <input
                    min={10}
                    max={24}
                    value={designData.back.description.size}
                    onChange={(e) =>
                      handleDescriptionSizeChange(e.target.value)
                    }
                    type="range"
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="mb-2">Text Color</div>
                  <div className="flex border border-foreground/50 p-1">
                    <input
                      value={designData.back.description.color}
                      className="aspect-square h-8"
                      onChange={(e) =>
                        handleDescriptionColorChange(e.target.value)
                      }
                      type="color"
                    />
                    <input
                      className="focus-within:outline-0 w-fit"
                      onChange={(e) =>
                        handleDescriptionColorChange(e.target.value)
                      }
                      value={designData.back.description.color}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="mb-2">Font</div>
                  <select
                    value={designData.back.description.font}
                    onChange={(e) =>
                      handleDescriptionFontChange(e.target.value)
                    }
                    className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                  >
                    <option value="Default">Default</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 py-3">
                <div className="font-semibold">About the Author</div>
                <div>
                  <div className="mb-2">Section Title</div>
                  <input
                    value={designData.back.author.title}
                    onChange={(e) => handleAuthorTitleChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB]"
                    placeholder="ABOUT THE AUTHOR"
                  />
                </div>
                <div>
                  <div className="mb-2">Author Bio</div>
                  <textarea
                    value={designData.back.author.content}
                    onChange={(e) => handleAuthorContentChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB] min-h-20"
                    placeholder="Enter author biography"
                  />
                </div>
                <div>
                  <div className="mb-2">Author Image</div>
                  <label
                    htmlFor="author-image-upload"
                    className="block w-full p-3 border-2 border-dashed border-foreground/30 rounded-lg text-center cursor-pointer hover:border-theme hover:bg-foreground/5 transition-colors"
                  >
                    <input
                      id="author-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAuthorImageUpload}
                      className="hidden"
                    />
                    {designData.back.author.imageUrl ? (
                      <img
                        src={designData.back.author.imageUrl}
                        alt="Author"
                        className="w-full h-32 object-cover rounded"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <svg
                          className="w-8 h-8 text-foreground/50"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm text-foreground/70">
                          Upload author photo
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                <div>
                  <div className="mb-2">Text Size</div>
                  <input
                    min={8}
                    max={20}
                    value={designData.back.author.size}
                    onChange={(e) => handleAuthorSizeChange(e.target.value)}
                    type="range"
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="mb-2">Text Color</div>
                  <div className="flex border border-foreground/50 p-1">
                    <input
                      value={designData.back.author.color}
                      className="aspect-square h-8"
                      onChange={(e) => handleAuthorColorChange(e.target.value)}
                      type="color"
                    />
                    <input
                      className="focus-within:outline-0 w-fit"
                      onChange={(e) => handleAuthorColorChange(e.target.value)}
                      value={designData.back.author.color}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="mb-2">Font</div>
                  <select
                    value={designData.back.author.font}
                    onChange={(e) => handleAuthorFontChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                  >
                    <option value="Default">Default</option>
                    <option value="Arial">Arial</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Verdana">Verdana</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
