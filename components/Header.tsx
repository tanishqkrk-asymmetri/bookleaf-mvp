"use client";
import useDesign from "@/context/DesignContext";
import * as htmlToImage from "html-to-image";
import {
  ChevronRight,
  Download,
  Loader2,
  Check,
  Save,
  Edit2,
} from "lucide-react";
import { useState } from "react";

export default function Header({ url }: { url?: string }) {
  const { designData, setDesignData, isSaving } = useDesign()!;
  const [isEditingBookName, setIsEditingBookName] = useState(false);
  const [tempBookName, setTempBookName] = useState(designData.bookName);
  const [isUploading, setIsUploading] = useState(false);

  const handleSaveBookName = () => {
    setDesignData((prev) => ({
      ...prev,
      bookName: tempBookName,
    }));
    setIsEditingBookName(false);
  };

  const handleEditBookName = () => {
    setTempBookName(designData.bookName);
    setIsEditingBookName(true);
  };
  const [test, setTest] = useState("");
  const convertElementToBase64 = async (
    className: string,
  ): Promise<string | null> => {
    const element = document.querySelector(`.${className}`) as HTMLElement;

    if (!element) {
      console.error(`Element with class ${className} not found`);
      return null;
    }

    try {
      element.style.scale = "1";

      const dataUrl = await htmlToImage.toSvg(element, {
        quality: 1,
      });

      // Extract SVG content from data URL and convert to base64
      // dataUrl format: "data:image/svg+xml;charset=utf-8,<svg>...</svg>"
      const svgContent = decodeURIComponent(
        dataUrl.replace("data:image/svg+xml;charset=utf-8,", ""),
      );

      // Convert SVG string to base64
      const base64Svg = btoa(unescape(encodeURIComponent(svgContent)));

      console.log("Base64 SVG:", base64Svg);

      return base64Svg;
    } catch (error) {
      console.error(`Error converting ${className} to base64:`, error);
      console.log("=========================");
      console.log(error);
      console.log("=========================");
      return null;
    }
  };

  const [links, setLinks] = useState({
    frontImageUrl: "",
    backImageUrl: "",
  });

  const handleContinue = async () => {
    setIsUploading(true);
    try {
      const [frontBase64, backBase64] = await Promise.all([
        convertElementToBase64("frontMain"),
        convertElementToBase64("back"),
      ]);

      console.log([frontBase64, backBase64]);

      const uploadResults = await Promise.all(
        [frontBase64, backBase64].map(async (x, i) => {
          const response = await fetch("/api/uploadImage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              filename: (designData.bookName + Date.now() + ".svg").replaceAll(
                " ",
                "_",
              ),
              upload_file: {
                filename: (
                  designData.ISBN +
                  (i === 0 ? "front" : i === 1 ? "back" : "") +
                  ".svg"
                ).replaceAll(" ", "_"),
                // contents: x!.split("data:image/svg+xml;charset=utf-8,")[1],
                // contents: x?.split(",")[1] || x,
                contents: x,
              },
            }),
          });
          const result = await response.json();
          return { index: i, hostedLink: result.hosted_link };
        }),
      );

      const newLinks = {
        frontImageUrl: uploadResults[0]?.hostedLink || "",
        backImageUrl: uploadResults[1]?.hostedLink || "",
      };

      console.log(newLinks);

      setLinks(newLinks);

      const post = await fetch("/api/saveBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...designData,
          coverData: JSON.stringify({ ...designData.coverData }),
          ...newLinks,
        }),
      });

      console.log(post.body);

      console.log(url);
      window.location.href = url || "/";
    } catch (error) {
      console.error("Error uploading:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-background px-4 text-foreground fixed top-0 h-16 z-50">
      <img
        className="fixed top-0 left-0 w-36 z-99999999999"
        src={
          "6274f7c38db2a9c87269441dcb6b21d1.cdn.bubble.io/f1769157617924x859769648027283500/1234546back.svg"
        }
        alt=""
      />
      {/* <img
        className="fixed top-0 left-36 w-36 z-99999999999"
        src={links.backImageUrl}
        alt=""
      /> */}
      <div className="flex justify-between items-center h-full">
        <img
          src={"/white.png"}
          alt="Bookleaf Publishing"
          className="h-16 w-auto"
        />

        <div className="flex items-center gap-4">
          {/* Book Name Editor */}
          <div className="flex items-center gap-2">
            <div>{tempBookName}</div>
            {isEditingBookName ? (
              <>
                <input
                  type="text"
                  value={tempBookName}
                  onChange={(e) => setTempBookName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSaveBookName();
                    } else if (e.key === "Escape") {
                      setIsEditingBookName(false);
                    }
                  }}
                  disabled
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#e45a6a] focus:border-transparent"
                  placeholder="Enter book name"
                  autoFocus
                />
                <button
                  onClick={handleSaveBookName}
                  className="p-2 bg-[#e45a6a] text-white rounded-md hover:bg-[#d14959] transition-colors hidden"
                  title="Save book name"
                >
                  <Save size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={handleEditBookName}
                className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100 transition-colors group hidden"
                title="Click to edit book name"
              >
                <span className="font-medium text-gray-800">
                  {designData.bookName || "Untitled Book"}
                </span>
                <Edit2
                  size={14}
                  className="text-gray-400 group-hover:text-gray-600"
                />
              </button>
            )}
          </div>
          {/* Saving Indicator */}
          <div className="flex items-center gap-2 text-sm">
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#e45a6a]" />
                <span className="text-gray-600">Saving...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-green-600" />
                <span className="text-gray-600">Saved</span>
              </>
            )}
          </div>
          <button
            onClick={async () => {
              await handleContinue();
              // console.log(links);
            }}
            disabled={isUploading}
            className="bg-[#e45a6a] rounded-md p-2 text-white flex hover:scale-105 duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-1" />
                Uploading...
              </>
            ) : (
              <>
                Continue <ChevronRight />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
