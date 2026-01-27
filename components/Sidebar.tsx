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
  Group,
  Italic,
  LetterText,
  LibraryBig,
  RectangleCircle,
  RectangleVertical,
  SquareDashed,
  Text,
  Underline,
} from "lucide-react";
import { useEffect, useState } from "react";
import { CoverData } from "../types/Book";

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
    "Background" | "Text" | "Template"
  >("Template");

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

  // console.log(designData.coverData.front.text.title.content);
  const [templates, setTemplates] = useState<CoverData[]>([]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);

  // Fetch templates from Firestore on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setIsLoadingTemplates(true);
        const response = await fetch("/api/templates");
        const data = await response.json();

        if (data.success && data.templates) {
          setTemplates(data.templates);
        } else {
          console.error("Failed to fetch templates:", data.error);
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
      } finally {
        setIsLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleViewClick = (view: "Front" | "Back" | "Spine") => {
    setSelectedView(view);
  };

  const handleFrontViewClick = (view: "Background" | "Text" | "Template") => {
    setSelectedFrontView(view);
  };

  const handleBackgroundColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          backgroundType: "Color",
          color: {
            ...org.coverData.front.color,
            colorCode: colorCode,
          },
        },
      },
    }));
  };

  const handleColorInputChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          backgroundType: "Color",
          color: {
            ...org.coverData.front.color,
            colorCode: colorCode,
          },
        },
      },
    }));
  };

  const handleGradientFromChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          backgroundType: "Gradient",
          gradient: {
            ...org.coverData.front.gradient,
            from: value,
          },
        },
      },
    }));
  };

  const handleGradientToChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          backgroundType: "Gradient",
          gradient: {
            ...org.coverData.front.gradient,
            to: value,
          },
        },
      },
    }));
  };

  const handleGradientDirectionChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          backgroundType: "Gradient",
          gradient: {
            ...org.coverData.front.gradient,
            direction: parseInt(value),
          },
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
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          backgroundType: "Image",
          image: {
            ...org.coverData.front.image,
            imageUrl: imageUrl,
          },
        },
      },
    }));
  };

  const handleImageOverlayColorChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          image: {
            ...org.coverData.front.image,
            overlayColor: colorCode,
          },
        },
      },
    }));
  };

  const handleImageOverlayOpacityChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        front: {
          ...org.coverData.front,
          image: {
            ...org.coverData.front.image,
            overlayOpacity: parseFloat(value),
          },
        },
      },
    }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file");
        return;
      }

      if (file.size > 2097152) {
        alert("Please upload files below 2MB");
        return;
      }

      try {
        // Convert file to base64
        const base64Data = await fileToBase64(file);
        const base64Content = base64Data.split(",")[1]; // Remove data:image/...;base64, prefix

        // Upload to S3
        const timestamp = Date.now();
        const extension = file.name.split(".").pop() || "jpg";
        const filename = `frontcover_${timestamp}.${extension}`;

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
              front: {
                ...org.coverData.front,
                backgroundType: "Image",
                image: {
                  ...org.coverData.front.image,
                  imageUrl: result.hosted_link,
                },
              },
            },
          }));
        } else {
          throw new Error("No hosted link returned from server");
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      }
    }
  };

  const handleTitleContentChange = (content: string) => {
    // console.log(content);
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
              content: content,
            },
          },
        },
      },
    }));
  };

  const handleTitleColorClick = (colorCode: string) => {
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
              color: colorCode,
            },
          },
        },
      },
    }));
  };

  const handleTitleSizeChange = (value: string) => {
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
              size: parseInt(value),
            },
          },
        },
      },
    }));
  };

  const handleTitleFontChange = (font: string) => {
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
              font: font,
            },
          },
        },
      },
    }));
  };

  const handleTitleBoldToggle = () => {
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
              bold: !org.coverData.front.text.title.bold,
            },
          },
        },
      },
    }));
  };

  const handleTitleItalicToggle = () => {
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
              italic: !org.coverData.front.text.title.italic,
            },
          },
        },
      },
    }));
  };

  const handleTitleUnderlineToggle = () => {
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
              underline: !org.coverData.front.text.title.underline,
            },
          },
        },
      },
    }));
  };

  const handleTitleAlignChange = (
    align: "left" | "center" | "right" | "justify",
  ) => {
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
              align: align,
            },
          },
        },
      },
    }));
  };

  const handleTitleLineHeightChange = (value: string) => {
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
              lineHeight: parseFloat(value),
            },
          },
        },
      },
    }));
  };

  const handleSubtitleContentChange = (content: string) => {
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
              content: content,
            },
          },
        },
      },
    }));
  };

  const handleSubtitleColorClick = (colorCode: string) => {
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
              color: colorCode,
            },
          },
        },
      },
    }));
  };

  const handleSubtitleSizeChange = (value: string) => {
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
              size: parseInt(value),
            },
          },
        },
      },
    }));
  };

  const handleSubtitleFontChange = (font: string) => {
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
              font: font,
            },
          },
        },
      },
    }));
  };

  const handleSubtitleBoldToggle = () => {
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
              bold: !org.coverData.front.text.subTitle.bold,
            },
          },
        },
      },
    }));
  };

  const handleSubtitleItalicToggle = () => {
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
              italic: !org.coverData.front.text.subTitle.italic,
            },
          },
        },
      },
    }));
  };

  const handleSubtitleUnderlineToggle = () => {
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
              underline: !org.coverData.front.text.subTitle.underline,
            },
          },
        },
      },
    }));
  };

  const handleSubtitleAlignChange = (
    align: "left" | "center" | "right" | "justify",
  ) => {
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
              align: align,
            },
          },
        },
      },
    }));
  };

  const handleSubtitleLineHeightChange = (value: string) => {
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
              lineHeight: parseFloat(value),
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameContentChange = (content: string) => {
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
              content: content,
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameColorClick = (colorCode: string) => {
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
              color: colorCode,
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameSizeChange = (value: string) => {
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
              size: parseInt(value),
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameFontChange = (font: string) => {
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
              font: font,
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameBoldToggle = () => {
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
              bold: !org.coverData.front.text.authorName.bold,
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameItalicToggle = () => {
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
              italic: !org.coverData.front.text.authorName.italic,
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameUnderlineToggle = () => {
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
              underline: !org.coverData.front.text.authorName.underline,
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameAlignChange = (
    align: "left" | "center" | "right" | "justify",
  ) => {
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
              align: align,
            },
          },
        },
      },
    }));
  };

  const handleAuthorNameLineHeightChange = (value: string) => {
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
              lineHeight: parseFloat(value),
            },
          },
        },
      },
    }));
  };

  const handleSpineColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        spine: {
          ...org.coverData.spine,
          color: {
            colorCode: colorCode,
          },
        },
      },
    }));
  };

  const handleSpineColorInputChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        spine: {
          ...org.coverData.spine,
          color: {
            colorCode: colorCode,
          },
        },
      },
    }));
  };

  const handleBackColorClick = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          color: {
            colorCode: colorCode,
          },
        },
      },
    }));
  };

  const handleBackColorInputChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          color: {
            colorCode: colorCode,
          },
        },
      },
    }));
  };

  const handleDescriptionContentChange = (content: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          description: {
            ...org.coverData.back.description,
            content: content,
          },
        },
      },
    }));
  };

  const handleDescriptionSizeChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          description: {
            ...org.coverData.back.description,
            size: parseInt(value),
          },
        },
      },
    }));
  };

  const handleDescriptionColorChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          description: {
            ...org.coverData.back.description,
            color: colorCode,
          },
        },
      },
    }));
  };

  const handleDescriptionFontChange = (font: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          description: {
            ...org.coverData.back.description,
            font: font,
          },
        },
      },
    }));
  };

  const handleAuthorTitleChange = (title: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          author: {
            ...org.coverData.back.author,
            title: title,
          },
        },
      },
    }));
  };

  const handleAuthorContentChange = (content: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          author: {
            ...org.coverData.back.author,
            content: content,
          },
        },
      },
    }));
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

  const handleAuthorSizeChange = (value: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          author: {
            ...org.coverData.back.author,
            size: parseInt(value),
          },
        },
      },
    }));
  };

  const handleAuthorColorChange = (colorCode: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          author: {
            ...org.coverData.back.author,
            color: colorCode,
          },
        },
      },
    }));
  };

  const handleAuthorFontChange = (font: string) => {
    setDesignData((org) => ({
      ...org,
      coverData: {
        ...org.coverData,
        back: {
          ...org.coverData.back,
          author: {
            ...org.coverData.back.author,
            font: font,
          },
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
          <RectangleVertical
            className={
              selectedView === "Spine" ? "text-theme" : "text-foreground"
            }
          ></RectangleVertical>
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
          <Book
            style={{
              transform: "scaleX(-1)",
            }}
            className={
              selectedView === "Back" ? "text-theme" : "text-foreground"
            }
          ></Book>
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
            <div className="grid grid-cols-3 w-full">
              <button
                onClick={() => handleFrontViewClick("Template")}
                className={`p-3   hover:bg-foreground/10 cursor-pointer duration-200 aspect-square justify-center items-center text-center flex flex-col gap-2 ${
                  selectedFrontView === "Template"
                    ? "border-b-2 border-theme"
                    : "border-b-2 border-white"
                }`}
              >
                <Group
                  className={`text-sm ${
                    selectedFrontView === "Template"
                      ? "text-theme"
                      : "text-foreground"
                  }`}
                ></Group>
                <div
                  className={`text-sm ${
                    selectedFrontView === "Template"
                      ? "text-theme"
                      : "text-foreground"
                  }`}
                >
                  Template
                </div>
              </button>
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
                  Image
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
                <div className="space-y-3 py-3 hidden">
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
                          {x ===
                            designData.coverData.front.color?.colorCode && (
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
                        value={designData.coverData.front.color?.colorCode}
                        className="aspect-square h-8"
                        onChange={(e) => handleColorInputChange(e.target.value)}
                        type="color"
                      />
                      <input
                        className="focus-within:outline-0 w-fit"
                        onChange={(e) => handleColorInputChange(e.target.value)}
                        value={designData.coverData.front.color?.colorCode}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 py-3 hidden">
                  <div>Select colors for gradient</div>

                  <div className="grid grid-cols-3">
                    <div>
                      <div>From</div>
                      <input
                        value={designData.coverData.front.gradient.from}
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
                        value={designData.coverData.front.gradient.to}
                        className="aspect-square h-8 w-1/2"
                        onChange={(e) => handleGradientToChange(e.target.value)}
                        type="color"
                      />
                    </div>
                    <div>
                      <div>Direction</div>
                      <input
                        value={designData.coverData.front.gradient.direction}
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
                          PNG, JPG, GIF up to 10MB and should be 5x8 inches in
                          size
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
                    {imageList?.map((image: UnsplashPhoto) => (
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
                              {x ===
                                designData.coverData.front.image
                                  .overlayColor && (
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
                          value={designData.coverData.front.image.overlayColor}
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
                          value={designData.coverData.front.image.overlayColor}
                        ></input>
                      </div>
                    </div>
                    <div>
                      <div className="mb-2">Overlay Opacity</div>
                      <input
                        min={0}
                        max={1}
                        step={0.05}
                        value={designData.coverData.front.image.overlayOpacity}
                        onChange={(e) =>
                          handleImageOverlayOpacityChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                      <div className="text-sm text-center text-foreground/70">
                        {Math.round(
                          designData.coverData.front.image.overlayOpacity * 100,
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
                  <textarea
                    rows={3}
                    value={designData.coverData.front.text.title.content}
                    onChange={(e) => {
                      handleTitleContentChange(e.target.value);
                    }}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB] resize-y"
                    placeholder="Title"
                  ></textarea>
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
                            {x ===
                              designData.coverData.front.color?.colorCode && (
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
                          value={designData.coverData.front.text.title.color}
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
                          value={designData.coverData.front.text.title.color}
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
                        value={designData.coverData.front.text.title.size}
                        onChange={(e) => handleTitleSizeChange(e.target.value)}
                        type="range"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Title Font</div>
                    <select
                      value={designData.coverData.front.text.title.font}
                      onChange={(e) => handleTitleFontChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                    >
                      <option value="Default" style={{ fontFamily: "inherit" }}>
                        Default
                      </option>
                      <option
                        value="Alex Brush"
                        style={{ fontFamily: "Alex Brush" }}
                      >
                        Alex Brush
                      </option>
                      <option value="Allura" style={{ fontFamily: "Allura" }}>
                        Allura
                      </option>
                      <option value="Anton" style={{ fontFamily: "Anton" }}>
                        Anton
                      </option>
                      <option value="Archivo" style={{ fontFamily: "Archivo" }}>
                        Archivo
                      </option>
                      <option
                        value="Architects Daughter"
                        style={{ fontFamily: "Architects Daughter" }}
                      >
                        Architects Daughter
                      </option>
                      <option value="Arimo" style={{ fontFamily: "Arimo" }}>
                        Arimo
                      </option>
                      <option
                        value="Bebas Neue"
                        style={{ fontFamily: "Bebas Neue" }}
                      >
                        Bebas Neue
                      </option>
                      <option value="Cinzel" style={{ fontFamily: "Cinzel" }}>
                        Cinzel
                      </option>
                      <option
                        value="Comic Sans MS"
                        style={{ fontFamily: "Comic Sans MS" }}
                      >
                        Comic Sans MS
                      </option>
                      <option
                        value="Cormorant Garamond"
                        style={{ fontFamily: "Cormorant Garamond" }}
                      >
                        Cormorant Garamond
                      </option>
                      <option
                        value="Courier New"
                        style={{ fontFamily: "Courier New" }}
                      >
                        Courier New
                      </option>
                      <option
                        value="Courgette"
                        style={{ fontFamily: "Courgette" }}
                      >
                        Courgette
                      </option>
                      <option
                        value="Dancing Script"
                        style={{ fontFamily: "Dancing Script" }}
                      >
                        Dancing Script
                      </option>
                      <option value="Forum" style={{ fontFamily: "Forum" }}>
                        Forum
                      </option>
                      <option value="Futura" style={{ fontFamily: "Futura" }}>
                        Futura
                      </option>
                      <option value="Georgia" style={{ fontFamily: "Georgia" }}>
                        Georgia
                      </option>
                      <option
                        value="Great Vibes"
                        style={{ fontFamily: "Great Vibes" }}
                      >
                        Great Vibes
                      </option>
                      <option value="Impact" style={{ fontFamily: "Impact" }}>
                        Impact
                      </option>
                      <option
                        value="Josefin Sans"
                        style={{ fontFamily: "Josefin Sans" }}
                      >
                        Josefin Sans
                      </option>
                      <option value="Lato" style={{ fontFamily: "Lato" }}>
                        Lato
                      </option>
                      <option
                        value="Merriweather"
                        style={{ fontFamily: "Merriweather" }}
                      >
                        Merriweather
                      </option>
                      <option
                        value="Montserrat"
                        style={{ fontFamily: "Montserrat" }}
                      >
                        Montserrat
                      </option>
                      <option
                        value="Mr Dafoe"
                        style={{ fontFamily: "Mr Dafoe" }}
                      >
                        Mr Dafoe
                      </option>
                      <option value="Nunito" style={{ fontFamily: "Nunito" }}>
                        Nunito
                      </option>
                      <option value="Oswald" style={{ fontFamily: "Oswald" }}>
                        Oswald
                      </option>
                      <option
                        value="Pacifico"
                        style={{ fontFamily: "Pacifico" }}
                      >
                        Pacifico
                      </option>
                      <option
                        value="Palatino"
                        style={{ fontFamily: "Palatino" }}
                      >
                        Palatino
                      </option>
                      <option
                        value="Playfair Display"
                        style={{ fontFamily: "Playfair Display" }}
                      >
                        Playfair Display
                      </option>
                      <option
                        value="Playfair Display SC"
                        style={{ fontFamily: "Playfair Display SC" }}
                      >
                        Playfair Display SC
                      </option>
                      <option value="Poppins" style={{ fontFamily: "Poppins" }}>
                        Poppins
                      </option>
                      <option
                        value="Quicksand"
                        style={{ fontFamily: "Quicksand" }}
                      >
                        Quicksand
                      </option>
                      <option value="Satisfy" style={{ fontFamily: "Satisfy" }}>
                        Satisfy
                      </option>
                      <option
                        value="Tangerine"
                        style={{ fontFamily: "Tangerine" }}
                      >
                        Tangerine
                      </option>
                      <option
                        value="Vidaloka"
                        style={{ fontFamily: "Vidaloka" }}
                      >
                        Vidaloka
                      </option>
                      <option
                        value="Breathing"
                        style={{ fontFamily: "Breathing" }}
                      >
                        Breathing
                      </option>
                      <option
                        value="Bright Sunshine"
                        style={{ fontFamily: "Bright Sunshine" }}
                      >
                        Bright Sunshine
                      </option>
                      <option
                        value="Brittany Signature"
                        style={{ fontFamily: "Brittany Signature" }}
                      >
                        Brittany Signature
                      </option>
                      <option
                        value="Eyesome Script"
                        style={{ fontFamily: "Eyesome Script" }}
                      >
                        Eyesome Script
                      </option>
                      <option
                        value="Gellatio"
                        style={{ fontFamily: "Gellatio" }}
                      >
                        Gellatio
                      </option>
                      <option
                        value="Le Jour Serif"
                        style={{ fontFamily: "Le Jour Serif" }}
                      >
                        Le Jour Serif
                      </option>
                      <option value="Majesty" style={{ fontFamily: "Majesty" }}>
                        Majesty
                      </option>
                      <option
                        value="Marck Script"
                        style={{ fontFamily: "Marck Script" }}
                      >
                        Marck Script
                      </option>
                      <option
                        value="TC Chaddlewood"
                        style={{ fontFamily: "TC Chaddlewood" }}
                      >
                        TC Chaddlewood
                      </option>
                    </select>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Title Styling</div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleTitleBoldToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.title.bold
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Bold className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleTitleItalicToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.title.italic
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Italic className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleTitleUnderlineToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.title.underline
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
                          designData.coverData.front.text.title.align === "left"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignLeft className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleTitleAlignChange("center")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.title.align ===
                          "center"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignCenter className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleTitleAlignChange("right")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.title.align ===
                          "right"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignRight className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleTitleAlignChange("justify")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.title.align ===
                          "justify"
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
                        value={designData.coverData.front.text.title.lineHeight}
                        onChange={(e) =>
                          handleTitleLineHeightChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                      <div className="text-sm text-center text-foreground/70">
                        {designData.coverData.front.text.title.lineHeight}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 py-3">
                  <div>Subtitle</div>
                  <textarea
                    rows={3}
                    value={designData.coverData.front.text.subTitle.content}
                    onChange={(e) => {
                      handleSubtitleContentChange(e.target.value);
                    }}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB] resize-y"
                    placeholder="Subtitle"
                  ></textarea>
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
                            {x ===
                              designData.coverData.front.text.subTitle
                                .color && <Check></Check>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3">
                      <div className="mb-2">Custom Subtitle Color</div>
                      <div className="flex border border-foreground/50 p-1">
                        <input
                          value={designData.coverData.front.text.subTitle.color}
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
                          value={designData.coverData.front.text.subTitle.color}
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
                        value={designData.coverData.front.text.subTitle.size}
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
                      value={designData.coverData.front.text.subTitle.font}
                      onChange={(e) => handleSubtitleFontChange(e.target.value)}
                      className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                    >
                      <option value="Default" style={{ fontFamily: "inherit" }}>
                        Default
                      </option>
                      <option
                        value="Alex Brush"
                        style={{ fontFamily: "Alex Brush" }}
                      >
                        Alex Brush
                      </option>
                      <option value="Allura" style={{ fontFamily: "Allura" }}>
                        Allura
                      </option>
                      <option value="Anton" style={{ fontFamily: "Anton" }}>
                        Anton
                      </option>
                      <option value="Archivo" style={{ fontFamily: "Archivo" }}>
                        Archivo
                      </option>
                      <option
                        value="Architects Daughter"
                        style={{ fontFamily: "Architects Daughter" }}
                      >
                        Architects Daughter
                      </option>
                      <option value="Arimo" style={{ fontFamily: "Arimo" }}>
                        Arimo
                      </option>
                      <option
                        value="Bebas Neue"
                        style={{ fontFamily: "Bebas Neue" }}
                      >
                        Bebas Neue
                      </option>
                      <option value="Cinzel" style={{ fontFamily: "Cinzel" }}>
                        Cinzel
                      </option>
                      <option
                        value="Comic Sans MS"
                        style={{ fontFamily: "Comic Sans MS" }}
                      >
                        Comic Sans MS
                      </option>
                      <option
                        value="Cormorant Garamond"
                        style={{ fontFamily: "Cormorant Garamond" }}
                      >
                        Cormorant Garamond
                      </option>
                      <option
                        value="Courier New"
                        style={{ fontFamily: "Courier New" }}
                      >
                        Courier New
                      </option>
                      <option
                        value="Courgette"
                        style={{ fontFamily: "Courgette" }}
                      >
                        Courgette
                      </option>
                      <option
                        value="Dancing Script"
                        style={{ fontFamily: "Dancing Script" }}
                      >
                        Dancing Script
                      </option>
                      <option value="Forum" style={{ fontFamily: "Forum" }}>
                        Forum
                      </option>
                      <option value="Futura" style={{ fontFamily: "Futura" }}>
                        Futura
                      </option>
                      <option value="Georgia" style={{ fontFamily: "Georgia" }}>
                        Georgia
                      </option>
                      <option
                        value="Great Vibes"
                        style={{ fontFamily: "Great Vibes" }}
                      >
                        Great Vibes
                      </option>
                      <option value="Impact" style={{ fontFamily: "Impact" }}>
                        Impact
                      </option>
                      <option
                        value="Josefin Sans"
                        style={{ fontFamily: "Josefin Sans" }}
                      >
                        Josefin Sans
                      </option>
                      <option value="Lato" style={{ fontFamily: "Lato" }}>
                        Lato
                      </option>
                      <option
                        value="Merriweather"
                        style={{ fontFamily: "Merriweather" }}
                      >
                        Merriweather
                      </option>
                      <option
                        value="Montserrat"
                        style={{ fontFamily: "Montserrat" }}
                      >
                        Montserrat
                      </option>
                      <option
                        value="Mr Dafoe"
                        style={{ fontFamily: "Mr Dafoe" }}
                      >
                        Mr Dafoe
                      </option>
                      <option value="Nunito" style={{ fontFamily: "Nunito" }}>
                        Nunito
                      </option>
                      <option value="Oswald" style={{ fontFamily: "Oswald" }}>
                        Oswald
                      </option>
                      <option
                        value="Pacifico"
                        style={{ fontFamily: "Pacifico" }}
                      >
                        Pacifico
                      </option>
                      <option
                        value="Palatino"
                        style={{ fontFamily: "Palatino" }}
                      >
                        Palatino
                      </option>
                      <option
                        value="Playfair Display"
                        style={{ fontFamily: "Playfair Display" }}
                      >
                        Playfair Display
                      </option>
                      <option
                        value="Playfair Display SC"
                        style={{ fontFamily: "Playfair Display SC" }}
                      >
                        Playfair Display SC
                      </option>
                      <option value="Poppins" style={{ fontFamily: "Poppins" }}>
                        Poppins
                      </option>
                      <option
                        value="Quicksand"
                        style={{ fontFamily: "Quicksand" }}
                      >
                        Quicksand
                      </option>
                      <option value="Satisfy" style={{ fontFamily: "Satisfy" }}>
                        Satisfy
                      </option>
                      <option
                        value="Tangerine"
                        style={{ fontFamily: "Tangerine" }}
                      >
                        Tangerine
                      </option>
                      <option
                        value="Vidaloka"
                        style={{ fontFamily: "Vidaloka" }}
                      >
                        Vidaloka
                      </option>
                      <option
                        value="Breathing"
                        style={{ fontFamily: "Breathing" }}
                      >
                        Breathing
                      </option>
                      <option
                        value="Bright Sunshine"
                        style={{ fontFamily: "Bright Sunshine" }}
                      >
                        Bright Sunshine
                      </option>
                      <option
                        value="Brittany Signature"
                        style={{ fontFamily: "Brittany Signature" }}
                      >
                        Brittany Signature
                      </option>
                      <option
                        value="Eyesome Script"
                        style={{ fontFamily: "Eyesome Script" }}
                      >
                        Eyesome Script
                      </option>
                      <option
                        value="Gellatio"
                        style={{ fontFamily: "Gellatio" }}
                      >
                        Gellatio
                      </option>
                      <option
                        value="Le Jour Serif"
                        style={{ fontFamily: "Le Jour Serif" }}
                      >
                        Le Jour Serif
                      </option>
                      <option value="Majesty" style={{ fontFamily: "Majesty" }}>
                        Majesty
                      </option>
                      <option
                        value="Marck Script"
                        style={{ fontFamily: "Marck Script" }}
                      >
                        Marck Script
                      </option>
                      <option
                        value="TC Chaddlewood"
                        style={{ fontFamily: "TC Chaddlewood" }}
                      >
                        TC Chaddlewood
                      </option>
                    </select>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Subtitle Styling</div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSubtitleBoldToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.subTitle.bold
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Bold className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleSubtitleItalicToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.subTitle.italic
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Italic className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleSubtitleUnderlineToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.subTitle.underline
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
                          designData.coverData.front.text.subTitle.align ===
                          "left"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignLeft className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleSubtitleAlignChange("center")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.subTitle.align ===
                          "center"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignCenter className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleSubtitleAlignChange("right")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.subTitle.align ===
                          "right"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignRight className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleSubtitleAlignChange("justify")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.subTitle.align ===
                          "justify"
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
                        value={
                          designData.coverData.front.text.subTitle.lineHeight
                        }
                        onChange={(e) =>
                          handleSubtitleLineHeightChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                      <div className="text-sm text-center text-foreground/70">
                        {designData.coverData.front.text.subTitle.lineHeight}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 py-3">
                  <div>Author Name</div>
                  <input
                    value={designData.coverData.front.text.authorName.content}
                    onChange={(e) =>
                      handleAuthorNameContentChange(e.target.value)
                    }
                    className="w-full p-2 rounded-lg bg-[#F3EDEB]"
                    placeholder="Author Name"
                  ></input>
                  <div className="space-y-3 py-3">
                    <div>Author Name color</div>
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
                            onClick={() => handleAuthorNameColorClick(x)}
                            className="w-8 aspect-square rounded-full cursor-pointer flex justify-center items-center text-white"
                            style={{
                              background: x,
                            }}
                          >
                            {x ===
                              designData.coverData.front.text.authorName
                                .color && <Check></Check>}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-3">
                      <div className="mb-2">Custom Author Name Color</div>
                      <div className="flex border border-foreground/50 p-1">
                        <input
                          value={
                            designData.coverData.front.text.authorName.color
                          }
                          className="aspect-square h-8"
                          onChange={(e) =>
                            handleAuthorNameColorClick(e.target.value)
                          }
                          type="color"
                        />
                        <input
                          className="focus-within:outline-0 w-fit"
                          onChange={(e) =>
                            handleAuthorNameColorClick(e.target.value)
                          }
                          value={
                            designData.coverData.front.text.authorName.color
                          }
                        ></input>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Author Name Size</div>
                    <div>
                      <input
                        min={10}
                        max={80}
                        value={designData.coverData.front.text.authorName.size}
                        onChange={(e) =>
                          handleAuthorNameSizeChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Author Name Font</div>
                    <select
                      value={designData.coverData.front.text.authorName.font}
                      onChange={(e) =>
                        handleAuthorNameFontChange(e.target.value)
                      }
                      className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                    >
                      <option value="Default" style={{ fontFamily: "inherit" }}>
                        Default
                      </option>
                      <option
                        value="Alex Brush"
                        style={{ fontFamily: "Alex Brush" }}
                      >
                        Alex Brush
                      </option>
                      <option value="Allura" style={{ fontFamily: "Allura" }}>
                        Allura
                      </option>
                      <option value="Anton" style={{ fontFamily: "Anton" }}>
                        Anton
                      </option>
                      <option value="Archivo" style={{ fontFamily: "Archivo" }}>
                        Archivo
                      </option>
                      <option
                        value="Architects Daughter"
                        style={{ fontFamily: "Architects Daughter" }}
                      >
                        Architects Daughter
                      </option>
                      <option value="Arimo" style={{ fontFamily: "Arimo" }}>
                        Arimo
                      </option>
                      <option
                        value="Bebas Neue"
                        style={{ fontFamily: "Bebas Neue" }}
                      >
                        Bebas Neue
                      </option>
                      <option value="Cinzel" style={{ fontFamily: "Cinzel" }}>
                        Cinzel
                      </option>
                      <option
                        value="Comic Sans MS"
                        style={{ fontFamily: "Comic Sans MS" }}
                      >
                        Comic Sans MS
                      </option>
                      <option
                        value="Cormorant Garamond"
                        style={{ fontFamily: "Cormorant Garamond" }}
                      >
                        Cormorant Garamond
                      </option>
                      <option
                        value="Courier New"
                        style={{ fontFamily: "Courier New" }}
                      >
                        Courier New
                      </option>
                      <option
                        value="Courgette"
                        style={{ fontFamily: "Courgette" }}
                      >
                        Courgette
                      </option>
                      <option
                        value="Dancing Script"
                        style={{ fontFamily: "Dancing Script" }}
                      >
                        Dancing Script
                      </option>
                      <option value="Forum" style={{ fontFamily: "Forum" }}>
                        Forum
                      </option>
                      <option value="Futura" style={{ fontFamily: "Futura" }}>
                        Futura
                      </option>
                      <option value="Georgia" style={{ fontFamily: "Georgia" }}>
                        Georgia
                      </option>
                      <option
                        value="Great Vibes"
                        style={{ fontFamily: "Great Vibes" }}
                      >
                        Great Vibes
                      </option>
                      <option value="Impact" style={{ fontFamily: "Impact" }}>
                        Impact
                      </option>
                      <option
                        value="Josefin Sans"
                        style={{ fontFamily: "Josefin Sans" }}
                      >
                        Josefin Sans
                      </option>
                      <option value="Lato" style={{ fontFamily: "Lato" }}>
                        Lato
                      </option>
                      <option
                        value="Merriweather"
                        style={{ fontFamily: "Merriweather" }}
                      >
                        Merriweather
                      </option>
                      <option
                        value="Montserrat"
                        style={{ fontFamily: "Montserrat" }}
                      >
                        Montserrat
                      </option>
                      <option
                        value="Mr Dafoe"
                        style={{ fontFamily: "Mr Dafoe" }}
                      >
                        Mr Dafoe
                      </option>
                      <option value="Nunito" style={{ fontFamily: "Nunito" }}>
                        Nunito
                      </option>
                      <option value="Oswald" style={{ fontFamily: "Oswald" }}>
                        Oswald
                      </option>
                      <option
                        value="Pacifico"
                        style={{ fontFamily: "Pacifico" }}
                      >
                        Pacifico
                      </option>
                      <option
                        value="Palatino"
                        style={{ fontFamily: "Palatino" }}
                      >
                        Palatino
                      </option>
                      <option
                        value="Playfair Display"
                        style={{ fontFamily: "Playfair Display" }}
                      >
                        Playfair Display
                      </option>
                      <option
                        value="Playfair Display SC"
                        style={{ fontFamily: "Playfair Display SC" }}
                      >
                        Playfair Display SC
                      </option>
                      <option value="Poppins" style={{ fontFamily: "Poppins" }}>
                        Poppins
                      </option>
                      <option
                        value="Quicksand"
                        style={{ fontFamily: "Quicksand" }}
                      >
                        Quicksand
                      </option>
                      <option value="Satisfy" style={{ fontFamily: "Satisfy" }}>
                        Satisfy
                      </option>
                      <option
                        value="Tangerine"
                        style={{ fontFamily: "Tangerine" }}
                      >
                        Tangerine
                      </option>
                      <option
                        value="Vidaloka"
                        style={{ fontFamily: "Vidaloka" }}
                      >
                        Vidaloka
                      </option>
                      <option
                        value="Breathing"
                        style={{ fontFamily: "Breathing" }}
                      >
                        Breathing
                      </option>
                      <option
                        value="Bright Sunshine"
                        style={{ fontFamily: "Bright Sunshine" }}
                      >
                        Bright Sunshine
                      </option>
                      <option
                        value="Brittany Signature"
                        style={{ fontFamily: "Brittany Signature" }}
                      >
                        Brittany Signature
                      </option>
                      <option
                        value="Eyesome Script"
                        style={{ fontFamily: "Eyesome Script" }}
                      >
                        Eyesome Script
                      </option>
                      <option
                        value="Gellatio"
                        style={{ fontFamily: "Gellatio" }}
                      >
                        Gellatio
                      </option>
                      <option
                        value="Le Jour Serif"
                        style={{ fontFamily: "Le Jour Serif" }}
                      >
                        Le Jour Serif
                      </option>
                      <option value="Majesty" style={{ fontFamily: "Majesty" }}>
                        Majesty
                      </option>
                      <option
                        value="Marck Script"
                        style={{ fontFamily: "Marck Script" }}
                      >
                        Marck Script
                      </option>
                      <option
                        value="TC Chaddlewood"
                        style={{ fontFamily: "TC Chaddlewood" }}
                      >
                        TC Chaddlewood
                      </option>
                    </select>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Author Name Styling</div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAuthorNameBoldToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.authorName.bold
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Bold className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleAuthorNameItalicToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.authorName.italic
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Italic className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={handleAuthorNameUnderlineToggle}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.authorName.underline
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <Underline className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Author Name Alignment</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAuthorNameAlignChange("left")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.authorName.align ===
                          "left"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignLeft className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleAuthorNameAlignChange("center")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.authorName.align ===
                          "center"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignCenter className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleAuthorNameAlignChange("right")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.authorName.align ===
                          "right"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignRight className="w-5 h-5 mx-auto" />
                      </button>
                      <button
                        onClick={() => handleAuthorNameAlignChange("justify")}
                        className={`p-2 rounded border flex-1 ${
                          designData.coverData.front.text.authorName.align ===
                          "justify"
                            ? "bg-theme text-white border-theme"
                            : "bg-white border-foreground/20"
                        }`}
                      >
                        <AlignJustify className="w-5 h-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-3 py-3">
                    <div>Author Name Line Height</div>
                    <div>
                      <input
                        min={0.5}
                        max={10}
                        step={0.1}
                        value={
                          designData.coverData.front.text.authorName.lineHeight
                        }
                        onChange={(e) =>
                          handleAuthorNameLineHeightChange(e.target.value)
                        }
                        type="range"
                        className="w-full"
                      />
                      <div className="text-sm text-center text-foreground/70">
                        {designData.coverData.front.text.authorName.lineHeight}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedFrontView === "Template" ? (
              <div className="space-y-6">
                <div className=""></div>
                {isLoadingTemplates ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme"></div>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="text-center py-12 text-foreground/50">
                    No templates available
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    {templates.map((temp, i) => {
                      // Canvas dimensions (matching Canvas.tsx)
                      const CANVAS_WIDTH = 500;
                      const CANVAS_HEIGHT = 782;
                      const CANVAS_PADDING_X = 35;
                      const CANVAS_PADDING_Y_TOP = 35;
                      const CANVAS_PADDING_Y_BOTTOM = 40;
                      const AVAILABLE_WIDTH =
                        CANVAS_WIDTH - CANVAS_PADDING_X * 2;
                      const AVAILABLE_HEIGHT =
                        CANVAS_HEIGHT -
                        CANVAS_PADDING_Y_TOP -
                        CANVAS_PADDING_Y_BOTTOM;

                      // Scale factor for thumbnail (25% of canvas size)
                      const thumbnailScale = 0.25;

                      return (
                        <div
                          onClick={() => {
                            setDesignData((org) => {
                              return {
                                ...org,
                                coverData: {
                                  editTrace: org.coverData.editTrace,
                                  lastEdited: org.coverData.lastEdited,
                                  back: temp.back,
                                  front: temp.front,
                                  spine: temp.spine,
                                },
                              };
                            });
                          }}
                          key={i}
                          className="cursor-pointer hover:ring-2 hover:ring-theme transition-all rounded-lg overflow-hidden relative"
                        >
                          {temp.front.backgroundType === "Image" && (
                            <>
                              <img
                                src={
                                  temp.front.image.imageUrl +
                                  "?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzA0MDJ8MHwxfHNlYXJjaHwxfHxwYWx8ZW58MHx8fHwxNzY0NzIyMzE3fDA&ixlib=rb-4.1.0&q=80&w=400"
                                }
                                className="w-full h-full absolute top-0 left-0 object-cover"
                                alt=""
                                style={{ zIndex: 0 }}
                              />
                              <div
                                className="w-full h-full absolute top-0 left-0"
                                style={{
                                  backgroundColor:
                                    temp.front.image.overlayColor,
                                  opacity: temp.front.image.overlayOpacity,
                                  pointerEvents: "none",
                                  zIndex: 1,
                                }}
                              ></div>
                            </>
                          )}

                          <div
                            onClick={() => {
                              // setSelectedView("Front");
                            }}
                            className="front  overflow-hidden flex justify-center items-center relative"
                            style={{
                              height: `${CANVAS_HEIGHT * thumbnailScale}px`,
                              width: `${CANVAS_WIDTH * thumbnailScale}px`,
                              padding: `${
                                CANVAS_PADDING_Y_TOP * thumbnailScale
                              }px ${CANVAS_PADDING_X * thumbnailScale}px ${
                                CANVAS_PADDING_Y_BOTTOM * thumbnailScale
                              }px`,
                              background:
                                temp.front.backgroundType === "Gradient"
                                  ? `linear-gradient(${temp.front.gradient?.direction}deg, ${temp.front.gradient?.from}, ${temp.front.gradient?.to})`
                                  : temp.front.color?.colorCode,
                            }}
                          >
                            <div
                              className={`h-full w-full relative transition-all`}
                            >
                              {/* Title */}
                              <div
                                style={{
                                  position: "absolute",
                                  zIndex: 10,
                                  left: `${
                                    temp.front.text.title.position.x *
                                    (thumbnailScale - 0.2)
                                  }px`,
                                  top: `${
                                    temp.front.text.title.position.y *
                                    thumbnailScale
                                  }px`,
                                  width: "90%",
                                }}
                                className="select-none"
                              >
                                <div
                                  style={{
                                    color: temp.front.text.title.color,
                                    fontSize: `${
                                      temp.front.text.title.size *
                                      thumbnailScale
                                    }px`,
                                    fontFamily:
                                      temp.front.text.title.font === "Default"
                                        ? "inherit"
                                        : temp.front.text.title.font,
                                    fontWeight: temp.front.text.title.bold
                                      ? "bold"
                                      : "normal",
                                    fontStyle: temp.front.text.title.italic
                                      ? "italic"
                                      : "normal",
                                    textDecoration: temp.front.text.title
                                      .underline
                                      ? "underline"
                                      : "none",
                                    textAlign: temp.front.text.title.align,
                                    lineHeight:
                                      temp.front.text.title.lineHeight,
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                    width: "100%",
                                  }}
                                >
                                  {temp.front.text.title.content}
                                </div>
                              </div>
                              {/* Subtitle */}
                              <div
                                style={{
                                  position: "absolute",
                                  zIndex: 10,
                                  left: `${
                                    temp.front.text.subTitle.position.x *
                                    thumbnailScale
                                  }px`,
                                  top: `${
                                    temp.front.text.subTitle.position.y *
                                    thumbnailScale
                                  }px`,
                                  width: "90%",
                                }}
                                className="select-none"
                              >
                                <div
                                  style={{
                                    color: temp.front.text.subTitle.color,
                                    fontSize: `${
                                      temp.front.text.subTitle.size *
                                      thumbnailScale
                                    }px`,
                                    fontFamily:
                                      temp.front.text.subTitle.font ===
                                      "Default"
                                        ? "inherit"
                                        : temp.front.text.subTitle.font,
                                    fontWeight: temp.front.text.subTitle.bold
                                      ? "bold"
                                      : "normal",
                                    fontStyle: temp.front.text.subTitle.italic
                                      ? "italic"
                                      : "normal",
                                    textDecoration: temp.front.text.subTitle
                                      .underline
                                      ? "underline"
                                      : "none",
                                    textAlign: temp.front.text.subTitle.align,
                                    lineHeight:
                                      temp.front.text.subTitle.lineHeight,
                                    wordWrap: "break-word",
                                    overflowWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                    width: "100%",
                                  }}
                                >
                                  {temp.front.text.subTitle.content}
                                </div>
                              </div>
                              {/* Author Name */}
                              <div
                                style={{
                                  position: "absolute",
                                  zIndex: 10,
                                  left: `${
                                    temp.front.text.authorName.position.x *
                                    thumbnailScale
                                  }px`,
                                  top: `${
                                    temp.front.text.authorName.position.y *
                                    thumbnailScale
                                  }px`,
                                  color: temp.front.text.authorName.color,
                                  fontSize: `${
                                    temp.front.text.authorName.size *
                                    thumbnailScale
                                  }px`,
                                  fontFamily:
                                    temp.front.text.authorName.font ===
                                    "Default"
                                      ? "inherit"
                                      : temp.front.text.authorName.font,
                                  fontWeight: temp.front.text.authorName.bold
                                    ? "bold"
                                    : "normal",
                                  fontStyle: temp.front.text.authorName.italic
                                    ? "italic"
                                    : "normal",
                                  textDecoration: temp.front.text.authorName
                                    .underline
                                    ? "underline"
                                    : "none",
                                  textAlign: temp.front.text.authorName.align,
                                  lineHeight:
                                    temp.front.text.authorName.lineHeight,
                                  maxWidth: "90%",
                                  wordWrap: "break-word",
                                  overflowWrap: "break-word",
                                }}
                                className="select-none"
                              >
                                {temp.front.text.authorName.content}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
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
                        {x === designData.coverData.spine.color?.colorCode && (
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
                      value={designData.coverData.spine.color?.colorCode}
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
                      value={designData.coverData.spine.color?.colorCode}
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
                        {x === designData.coverData.back.color?.colorCode && (
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
                      value={designData.coverData.back.color?.colorCode}
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
                      value={designData.coverData.back.color?.colorCode}
                    ></input>
                  </div>
                </div>
              </div>

              <div className="space-y-3 py-3">
                <div className="font-semibold">Book Description</div>
                <textarea
                  value={designData.coverData.back.description.content}
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
                    value={designData.coverData.back.description.size}
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
                      value={designData.coverData.back.description.color}
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
                      value={designData.coverData.back.description.color}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="mb-2">Font</div>
                  <select
                    value={designData.coverData.back.description.font}
                    onChange={(e) =>
                      handleDescriptionFontChange(e.target.value)
                    }
                    className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                  >
                    <option value="Default" style={{ fontFamily: "inherit" }}>
                      Default
                    </option>
                    <option
                      value="Alex Brush"
                      style={{ fontFamily: "Alex Brush" }}
                    >
                      Alex Brush
                    </option>
                    <option value="Allura" style={{ fontFamily: "Allura" }}>
                      Allura
                    </option>
                    <option value="Anton" style={{ fontFamily: "Anton" }}>
                      Anton
                    </option>
                    <option value="Archivo" style={{ fontFamily: "Archivo" }}>
                      Archivo
                    </option>
                    <option
                      value="Architects Daughter"
                      style={{ fontFamily: "Architects Daughter" }}
                    >
                      Architects Daughter
                    </option>
                    <option value="Arimo" style={{ fontFamily: "Arimo" }}>
                      Arimo
                    </option>
                    <option
                      value="Bebas Neue"
                      style={{ fontFamily: "Bebas Neue" }}
                    >
                      Bebas Neue
                    </option>
                    <option value="Cinzel" style={{ fontFamily: "Cinzel" }}>
                      Cinzel
                    </option>
                    <option
                      value="Comic Sans MS"
                      style={{ fontFamily: "Comic Sans MS" }}
                    >
                      Comic Sans MS
                    </option>
                    <option
                      value="Cormorant Garamond"
                      style={{ fontFamily: "Cormorant Garamond" }}
                    >
                      Cormorant Garamond
                    </option>
                    <option
                      value="Courier New"
                      style={{ fontFamily: "Courier New" }}
                    >
                      Courier New
                    </option>
                    <option
                      value="Courgette"
                      style={{ fontFamily: "Courgette" }}
                    >
                      Courgette
                    </option>
                    <option
                      value="Dancing Script"
                      style={{ fontFamily: "Dancing Script" }}
                    >
                      Dancing Script
                    </option>
                    <option value="Forum" style={{ fontFamily: "Forum" }}>
                      Forum
                    </option>
                    <option value="Futura" style={{ fontFamily: "Futura" }}>
                      Futura
                    </option>
                    <option value="Georgia" style={{ fontFamily: "Georgia" }}>
                      Georgia
                    </option>
                    <option
                      value="Great Vibes"
                      style={{ fontFamily: "Great Vibes" }}
                    >
                      Great Vibes
                    </option>
                    <option value="Impact" style={{ fontFamily: "Impact" }}>
                      Impact
                    </option>
                    <option
                      value="Josefin Sans"
                      style={{ fontFamily: "Josefin Sans" }}
                    >
                      Josefin Sans
                    </option>
                    <option value="Lato" style={{ fontFamily: "Lato" }}>
                      Lato
                    </option>
                    <option
                      value="Merriweather"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      Merriweather
                    </option>
                    <option
                      value="Montserrat"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      Montserrat
                    </option>
                    <option value="Mr Dafoe" style={{ fontFamily: "Mr Dafoe" }}>
                      Mr Dafoe
                    </option>
                    <option value="Nunito" style={{ fontFamily: "Nunito" }}>
                      Nunito
                    </option>
                    <option value="Oswald" style={{ fontFamily: "Oswald" }}>
                      Oswald
                    </option>
                    <option value="Pacifico" style={{ fontFamily: "Pacifico" }}>
                      Pacifico
                    </option>
                    <option value="Palatino" style={{ fontFamily: "Palatino" }}>
                      Palatino
                    </option>
                    <option
                      value="Playfair Display"
                      style={{ fontFamily: "Playfair Display" }}
                    >
                      Playfair Display
                    </option>
                    <option
                      value="Playfair Display SC"
                      style={{ fontFamily: "Playfair Display SC" }}
                    >
                      Playfair Display SC
                    </option>
                    <option value="Poppins" style={{ fontFamily: "Poppins" }}>
                      Poppins
                    </option>
                    <option
                      value="Quicksand"
                      style={{ fontFamily: "Quicksand" }}
                    >
                      Quicksand
                    </option>
                    <option value="Satisfy" style={{ fontFamily: "Satisfy" }}>
                      Satisfy
                    </option>
                    <option
                      value="Tangerine"
                      style={{ fontFamily: "Tangerine" }}
                    >
                      Tangerine
                    </option>
                    <option value="Vidaloka" style={{ fontFamily: "Vidaloka" }}>
                      Vidaloka
                    </option>
                    <option
                      value="Breathing"
                      style={{ fontFamily: "Breathing" }}
                    >
                      Breathing
                    </option>
                    <option
                      value="Bright Sunshine"
                      style={{ fontFamily: "Bright Sunshine" }}
                    >
                      Bright Sunshine
                    </option>
                    <option
                      value="Brittany Signature"
                      style={{ fontFamily: "Brittany Signature" }}
                    >
                      Brittany Signature
                    </option>
                    <option
                      value="Eyesome Script"
                      style={{ fontFamily: "Eyesome Script" }}
                    >
                      Eyesome Script
                    </option>
                    <option value="Gellatio" style={{ fontFamily: "Gellatio" }}>
                      Gellatio
                    </option>
                    <option
                      value="Le Jour Serif"
                      style={{ fontFamily: "Le Jour Serif" }}
                    >
                      Le Jour Serif
                    </option>
                    <option value="Majesty" style={{ fontFamily: "Majesty" }}>
                      Majesty
                    </option>
                    <option
                      value="Marck Script"
                      style={{ fontFamily: "Marck Script" }}
                    >
                      Marck Script
                    </option>
                    <option
                      value="TC Chaddlewood"
                      style={{ fontFamily: "TC Chaddlewood" }}
                    >
                      TC Chaddlewood
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-3 py-3">
                <div className="font-semibold">About the Author</div>
                <div>
                  <div className="mb-2">Section Title</div>
                  <input
                    value={designData.coverData.back.author.title}
                    onChange={(e) => handleAuthorTitleChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB]"
                    placeholder="ABOUT THE AUTHOR"
                  />
                </div>
                <div>
                  <div className="mb-2">Author Bio</div>
                  <textarea
                    value={designData.coverData.back.author.content}
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
                    {designData.coverData.back.author.imageUrl ? (
                      <img
                        src={designData.coverData.back.author.imageUrl}
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
                    value={designData.coverData.back.author.size}
                    onChange={(e) => handleAuthorSizeChange(e.target.value)}
                    type="range"
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="mb-2">Text Color</div>
                  <div className="flex border border-foreground/50 p-1">
                    <input
                      value={designData.coverData.back.author.color}
                      className="aspect-square h-8"
                      onChange={(e) => handleAuthorColorChange(e.target.value)}
                      type="color"
                    />
                    <input
                      className="focus-within:outline-0 w-fit"
                      onChange={(e) => handleAuthorColorChange(e.target.value)}
                      value={designData.coverData.back.author.color}
                    ></input>
                  </div>
                </div>
                <div>
                  <div className="mb-2">Font</div>
                  <select
                    value={designData.coverData.back.author.font}
                    onChange={(e) => handleAuthorFontChange(e.target.value)}
                    className="w-full p-2 rounded-lg bg-[#F3EDEB] border border-foreground/20"
                  >
                    <option value="Default" style={{ fontFamily: "inherit" }}>
                      Default
                    </option>
                    <option
                      value="Alex Brush"
                      style={{ fontFamily: "Alex Brush" }}
                    >
                      Alex Brush
                    </option>
                    <option value="Allura" style={{ fontFamily: "Allura" }}>
                      Allura
                    </option>
                    <option value="Anton" style={{ fontFamily: "Anton" }}>
                      Anton
                    </option>
                    <option value="Archivo" style={{ fontFamily: "Archivo" }}>
                      Archivo
                    </option>
                    <option
                      value="Architects Daughter"
                      style={{ fontFamily: "Architects Daughter" }}
                    >
                      Architects Daughter
                    </option>
                    <option value="Arimo" style={{ fontFamily: "Arimo" }}>
                      Arimo
                    </option>
                    <option
                      value="Bebas Neue"
                      style={{ fontFamily: "Bebas Neue" }}
                    >
                      Bebas Neue
                    </option>
                    <option value="Cinzel" style={{ fontFamily: "Cinzel" }}>
                      Cinzel
                    </option>
                    <option
                      value="Comic Sans MS"
                      style={{ fontFamily: "Comic Sans MS" }}
                    >
                      Comic Sans MS
                    </option>
                    <option
                      value="Cormorant Garamond"
                      style={{ fontFamily: "Cormorant Garamond" }}
                    >
                      Cormorant Garamond
                    </option>
                    <option
                      value="Courier New"
                      style={{ fontFamily: "Courier New" }}
                    >
                      Courier New
                    </option>
                    <option
                      value="Courgette"
                      style={{ fontFamily: "Courgette" }}
                    >
                      Courgette
                    </option>
                    <option
                      value="Dancing Script"
                      style={{ fontFamily: "Dancing Script" }}
                    >
                      Dancing Script
                    </option>
                    <option value="Forum" style={{ fontFamily: "Forum" }}>
                      Forum
                    </option>
                    <option value="Futura" style={{ fontFamily: "Futura" }}>
                      Futura
                    </option>
                    <option value="Georgia" style={{ fontFamily: "Georgia" }}>
                      Georgia
                    </option>
                    <option
                      value="Great Vibes"
                      style={{ fontFamily: "Great Vibes" }}
                    >
                      Great Vibes
                    </option>
                    <option value="Impact" style={{ fontFamily: "Impact" }}>
                      Impact
                    </option>
                    <option
                      value="Josefin Sans"
                      style={{ fontFamily: "Josefin Sans" }}
                    >
                      Josefin Sans
                    </option>
                    <option value="Lato" style={{ fontFamily: "Lato" }}>
                      Lato
                    </option>
                    <option
                      value="Merriweather"
                      style={{ fontFamily: "Merriweather" }}
                    >
                      Merriweather
                    </option>
                    <option
                      value="Montserrat"
                      style={{ fontFamily: "Montserrat" }}
                    >
                      Montserrat
                    </option>
                    <option value="Mr Dafoe" style={{ fontFamily: "Mr Dafoe" }}>
                      Mr Dafoe
                    </option>
                    <option value="Nunito" style={{ fontFamily: "Nunito" }}>
                      Nunito
                    </option>
                    <option value="Oswald" style={{ fontFamily: "Oswald" }}>
                      Oswald
                    </option>
                    <option value="Pacifico" style={{ fontFamily: "Pacifico" }}>
                      Pacifico
                    </option>
                    <option value="Palatino" style={{ fontFamily: "Palatino" }}>
                      Palatino
                    </option>
                    <option
                      value="Playfair Display"
                      style={{ fontFamily: "Playfair Display" }}
                    >
                      Playfair Display
                    </option>
                    <option
                      value="Playfair Display SC"
                      style={{ fontFamily: "Playfair Display SC" }}
                    >
                      Playfair Display SC
                    </option>
                    <option value="Poppins" style={{ fontFamily: "Poppins" }}>
                      Poppins
                    </option>
                    <option
                      value="Quicksand"
                      style={{ fontFamily: "Quicksand" }}
                    >
                      Quicksand
                    </option>
                    <option value="Satisfy" style={{ fontFamily: "Satisfy" }}>
                      Satisfy
                    </option>
                    <option
                      value="Tangerine"
                      style={{ fontFamily: "Tangerine" }}
                    >
                      Tangerine
                    </option>
                    <option value="Vidaloka" style={{ fontFamily: "Vidaloka" }}>
                      Vidaloka
                    </option>
                    <option
                      value="Breathing"
                      style={{ fontFamily: "Breathing" }}
                    >
                      Breathing
                    </option>
                    <option
                      value="Bright Sunshine"
                      style={{ fontFamily: "Bright Sunshine" }}
                    >
                      Bright Sunshine
                    </option>
                    <option
                      value="Brittany Signature"
                      style={{ fontFamily: "Brittany Signature" }}
                    >
                      Brittany Signature
                    </option>
                    <option
                      value="Eyesome Script"
                      style={{ fontFamily: "Eyesome Script" }}
                    >
                      Eyesome Script
                    </option>
                    <option value="Gellatio" style={{ fontFamily: "Gellatio" }}>
                      Gellatio
                    </option>
                    <option
                      value="Le Jour Serif"
                      style={{ fontFamily: "Le Jour Serif" }}
                    >
                      Le Jour Serif
                    </option>
                    <option value="Majesty" style={{ fontFamily: "Majesty" }}>
                      Majesty
                    </option>
                    <option
                      value="Marck Script"
                      style={{ fontFamily: "Marck Script" }}
                    >
                      Marck Script
                    </option>
                    <option
                      value="TC Chaddlewood"
                      style={{ fontFamily: "TC Chaddlewood" }}
                    >
                      TC Chaddlewood
                    </option>
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
