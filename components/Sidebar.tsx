"use client";

import useDesign from "@/context/DesignContext";
import { UnsplashPhoto } from "@/types/UnsplashPhoto";
import DEBOUNCE from "@/utils/DEBOUNCE";
import {
  Book,
  Check,
  LetterText,
  LibraryBig,
  SquareDashed,
  Text,
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
  return (
    <div className="px-3 flex  min-w-108 divide-x-2 divide-zinc-200">
      <div className="flex flex-col justify-start items-center pr-4">
        <button
          onClick={() => {
            setSelectedView("Front");
          }}
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
          onClick={() => {
            setSelectedView("Spine");
          }}
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
          onClick={() => {
            setSelectedView("Back");
          }}
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
                onClick={() => {
                  setSelectedFrontView("Background");
                }}
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
                onClick={() => {
                  setSelectedFrontView("Text");
                }}
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
                          onClick={() => {
                            setDesignData((org) => ({
                              ...org,
                              front: {
                                ...org.front,
                                backgroundType: "Color",
                                color: {
                                  ...org.front.color,
                                  colorCode: x,
                                },
                              },
                            }));
                          }}
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
                        onChange={(e) => {
                          setDesignData((org) => ({
                            ...org,
                            front: {
                              ...org.front,
                              backgroundType: "Color",
                              color: {
                                ...org.front.color,
                                colorCode: e.target.value,
                              },
                            },
                          }));
                        }}
                        type="color"
                      />
                      <input
                        className="focus-within:outline-0 w-fit"
                        onChange={(e) => {
                          setDesignData((org) => ({
                            ...org,
                            front: {
                              ...org.front,
                              backgroundType: "Color",
                              color: {
                                ...org.front.color,
                                colorCode: e.target.value,
                              },
                            },
                          }));
                        }}
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
                        onChange={(e) => {
                          setDesignData((org) => ({
                            ...org,
                            front: {
                              ...org.front,
                              backgroundType: "Gradient",
                              gradient: {
                                ...org.front.gradient,
                                from: e.target.value,
                              },
                            },
                          }));
                        }}
                        type="color"
                      />
                    </div>
                    <div>
                      <div>To</div>
                      <input
                        value={designData.front.gradient.to}
                        className="aspect-square h-8 w-1/2"
                        onChange={(e) => {
                          setDesignData((org) => ({
                            ...org,
                            front: {
                              ...org.front,
                              backgroundType: "Gradient",
                              gradient: {
                                ...org.front.gradient,
                                to: e.target.value,
                              },
                            },
                          }));
                        }}
                        type="color"
                      />
                    </div>
                    <div>
                      <div>Direction</div>
                      <input
                        value={designData.front.gradient.direction}
                        className="aspect-square h-8 w-1/2"
                        onChange={(e) => {
                          setDesignData((org) => ({
                            ...org,
                            front: {
                              ...org.front,
                              backgroundType: "Gradient",
                              gradient: {
                                ...org.front.gradient,
                                direction: parseInt(e.target.value),
                              },
                            },
                          }));
                        }}
                        type="number"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-3 py-3 hidden">
                  <div>Upload image</div>
                </div>
                <div className="space-y-3 py-3">
                  <div>Select image</div>
                  <div>
                    <input
                      value={imageQuery}
                      onChange={async (e) => {
                        setImageQuery(e.target.value);
                        searchImages(e.target.value);
                      }}
                      className="border rounded-md w-full p-2"
                      type="text"
                      placeholder="Search for image"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {imageList.map((image: UnsplashPhoto) => (
                      <div
                        onClick={() => {
                          setDesignData((org) => ({
                            ...org,
                            front: {
                              ...org.front,
                              backgroundType: "Image",
                              image: {
                                imageUrl: image.urls.full,
                              },
                            },
                          }));
                        }}
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
              </div>
            ) : selectedFrontView === "Text" ? (
              <div></div>
            ) : (
              <></>
            )}
          </div>
        ) : selectedView === "Spine" ? (
          <div></div>
        ) : selectedView === "Back" ? (
          <div></div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
