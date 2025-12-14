// This utility script helps seed initial templates into Firestore
// You can run this once to populate your templates collection

import { CoverData } from "@/types/Book";

export const defaultTemplates: CoverData[] = [
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Serif",
        title: {
          color: "#FFFFFF",
          content: "The Great Novel",
          font: "Serif",
          size: 42,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.2,
          position: { x: 50, y: 35 },
        },
        subTitle: {
          color: "#FFFFFF",
          content: "A Timeless Classic",
          font: "Serif",
          size: 18,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 50 },
        },
        authorName: {
          color: "#FFFFFF",
          content: "John Smith",
          font: "Serif",
          size: 20,
          bold: false,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570",
        overlayColor: "#000000",
        overlayOpacity: 0.4,
      },
      template: {
        templateId: "template_1",
      },
    },
    back: {
      color: {
        colorCode: "#2C3E50",
      },
      description: {
        content:
          "A masterpiece of literature that explores the depths of human nature and society. This compelling narrative takes readers on an unforgettable journey through time and emotion.",
        size: 14,
        color: "#FFFFFF",
        font: "Serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "An acclaimed writer whose works have captivated readers worldwide for decades. Winner of numerous literary awards and beloved by critics and readers alike.",
        imageUrl: "",
        size: 12,
        color: "#FFFFFF",
        font: "Serif",
      },
    },
    spine: {
      color: {
        colorCode: "#2C3E50",
      },
    },
  },
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Fantasy",
        title: {
          color: "#FFD700",
          content: "REALM OF DRAGONS",
          font: "Fantasy",
          size: 44,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.2,
          position: { x: 50, y: 35 },
        },
        subTitle: {
          color: "#E0E0E0",
          content: "Book One of the Chronicles",
          font: "Serif",
          size: 14,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 50 },
        },
        authorName: {
          color: "#E0E0E0",
          content: "Marcus Dragonheart",
          font: "Serif",
          size: 18,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23",
        overlayColor: "#1A0033",
        overlayOpacity: 0.6,
      },
      template: {
        templateId: "template_3",
      },
    },
    back: {
      color: {
        colorCode: "#2C1B47",
      },
      description: {
        content:
          "In a world where magic has been forgotten and dragons are myths, one young hero discovers an ancient power that could change everything. An epic adventure of courage, friendship, and destiny.",
        size: 14,
        color: "#FFFFFF",
        font: "Serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "Master of epic fantasy and world-building. This internationally acclaimed series has enchanted millions of readers across the globe.",
        imageUrl: "",
        size: 12,
        color: "#E0E0E0",
        font: "Serif",
      },
    },
    spine: {
      color: {
        colorCode: "#FFD700",
      },
    },
  },
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Monospace",
        title: {
          color: "#FFFFFF",
          content: "NEXUS PRIME",
          font: "Sans-serif",
          size: 50,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.1,
          position: { x: 50, y: 35 },
        },
        subTitle: {
          color: "#00FFFF",
          content: "THE FUTURE IS NOW",
          font: "Sans-serif",
          size: 14,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 50 },
        },
        authorName: {
          color: "#00FFFF",
          content: "Dr. Alex Nova",
          font: "Sans-serif",
          size: 18,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
        overlayColor: "#000033",
        overlayOpacity: 0.5,
      },
      template: {
        templateId: "template_5",
      },
    },
    back: {
      color: {
        colorCode: "#0A0A1A",
      },
      description: {
        content:
          "In the year 2347, humanity has colonized the stars. But when an ancient alien intelligence awakens, one crew must race against time to prevent galactic annihilation.",
        size: 14,
        color: "#FFFFFF",
        font: "Sans-serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "Award-winning science fiction author with a background in astrophysics. Known for hard sci-fi with compelling characters and mind-bending concepts.",
        imageUrl: "",
        size: 12,
        color: "#00FFFF",
        font: "Sans-serif",
      },
    },
    spine: {
      color: {
        colorCode: "#00FFFF",
      },
    },
  },
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Gothic",
        title: {
          color: "#FFFFFF",
          content: "SHADOWS FALL",
          font: "Gothic",
          size: 46,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.2,
          position: { x: 50, y: 35 },
        },
        subTitle: {
          color: "#8B0000",
          content: "A Tale of Terror",
          font: "Serif",
          size: 16,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 50 },
        },
        authorName: {
          color: "#8B0000",
          content: "Vincent Dark",
          font: "Serif",
          size: 20,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1509248961158-e54f6934749c",
        overlayColor: "#000000",
        overlayOpacity: 0.7,
      },
      template: {
        templateId: "template_6",
      },
    },
    back: {
      color: {
        colorCode: "#1A0000",
      },
      description: {
        content:
          "In the abandoned mansion on Hollow Hill, something sinister awaits. A chilling tale of supernatural horror that will haunt your dreams long after the final page.",
        size: 14,
        color: "#FFFFFF",
        font: "Serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "Master of modern horror with a talent for creating atmospheric dread. Praised for psychological depth and unforgettable scares.",
        imageUrl: "",
        size: 12,
        color: "#CCCCCC",
        font: "Serif",
      },
    },
    spine: {
      color: {
        colorCode: "#8B0000",
      },
    },
  },
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Sans-serif",
        title: {
          color: "#FFFFFF",
          content: "WINNING MINDSET",
          font: "Sans-serif",
          size: 42,
          bold: true,
          italic: false,
          underline: false,
          align: "left",
          lineHeight: 1.2,
          position: { x: 10, y: 35 },
        },
        subTitle: {
          color: "#FFA500",
          content: "Strategies for Modern Leaders",
          font: "Sans-serif",
          size: 16,
          bold: true,
          italic: false,
          underline: false,
          align: "left",
          lineHeight: 1.5,
          position: { x: 10, y: 50 },
        },
        authorName: {
          color: "#FFA500",
          content: "Michael Success",
          font: "Sans-serif",
          size: 18,
          bold: true,
          italic: false,
          underline: false,
          align: "left",
          lineHeight: 1.5,
          position: { x: 10, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab",
        overlayColor: "#003366",
        overlayOpacity: 0.6,
      },
      template: {
        templateId: "template_7",
      },
    },
    back: {
      color: {
        colorCode: "#003366",
      },
      description: {
        content:
          "Transform your approach to business and life with proven strategies from top industry leaders. Learn the habits and mindsets that separate good from great.",
        size: 14,
        color: "#FFFFFF",
        font: "Sans-serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "Former Fortune 500 CEO and sought-after business consultant. Has advised countless companies on strategy, leadership, and organizational transformation.",
        imageUrl: "",
        size: 12,
        color: "#FFA500",
        font: "Sans-serif",
      },
    },
    spine: {
      color: {
        colorCode: "#FFA500",
      },
    },
  },
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Handwriting",
        title: {
          color: "#FFFFFF",
          content: "Wanderlust",
          font: "Handwriting",
          size: 52,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.3,
          position: { x: 50, y: 30 },
        },
        subTitle: {
          color: "#FFFFFF",
          content: "A Journey of Discovery",
          font: "Handwriting",
          size: 18,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 45 },
        },
        authorName: {
          color: "#FFFFFF",
          content: "Sofia Journey",
          font: "Handwriting",
          size: 22,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
        overlayColor: "#006666",
        overlayOpacity: 0.3,
      },
      template: {
        templateId: "template_8",
      },
    },
    back: {
      color: {
        colorCode: "#E8F4F8",
      },
      description: {
        content:
          "From bustling cities to remote villages, one traveler's quest to find meaning in the journey itself. An inspiring memoir about adventure, culture, and self-discovery.",
        size: 14,
        color: "#333333",
        font: "Serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "World traveler and storyteller who has visited over 100 countries. Writer for major travel publications and passionate advocate for cultural exchange.",
        imageUrl: "",
        size: 12,
        color: "#555555",
        font: "Serif",
      },
    },
    spine: {
      color: {
        colorCode: "#006666",
      },
    },
  },
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Serif",
        title: {
          color: "#FFFFFF",
          content: "ECHOES OF REVOLUTION",
          font: "Serif",
          size: 38,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.3,
          position: { x: 50, y: 35 },
        },
        subTitle: {
          color: "#D4AF37",
          content: "Paris, 1789",
          font: "Serif",
          size: 18,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 50 },
        },
        authorName: {
          color: "#D4AF37",
          content: "Pierre Laurent",
          font: "Serif",
          size: 20,
          bold: false,
          italic: true,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
        overlayColor: "#3D2817",
        overlayOpacity: 0.5,
      },
      template: {
        templateId: "template_9",
      },
    },
    back: {
      color: {
        colorCode: "#8B7355",
      },
      description: {
        content:
          "In the tumultuous days of the French Revolution, two families find their fates intertwined. A sweeping historical epic of love, betrayal, and survival against impossible odds.",
        size: 14,
        color: "#FFFFFF",
        font: "Serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "Historian and novelist specializing in European history. Known for meticulous research and bringing the past to vivid life on the page.",
        imageUrl: "",
        size: 12,
        color: "#F5E6D3",
        font: "Serif",
      },
    },
    spine: {
      color: {
        colorCode: "#D4AF37",
      },
    },
  },
  {
    editTrace: [],
    lastEdited: 0,
    front: {
      backgroundType: "Image",
      text: {
        font: "Sans-serif",
        title: {
          color: "#FFFFFF",
          content: "MINDFUL LIVING",
          font: "Sans-serif",
          size: 44,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.2,
          position: { x: 50, y: 35 },
        },
        subTitle: {
          color: "#FFFFFF",
          content: "Transform Your Life Daily",
          font: "Sans-serif",
          size: 16,
          bold: true,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 50 },
        },
        authorName: {
          color: "#FFFFFF",
          content: "Dr. Zen Mindful",
          font: "Sans-serif",
          size: 18,
          bold: false,
          italic: false,
          underline: false,
          align: "center",
          lineHeight: 1.5,
          position: { x: 50, y: 85 },
        },
      },
      color: {
        colorCode: "",
      },
      gradient: {
        direction: 0,
        from: "",
        to: "",
      },
      image: {
        imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773",
        overlayColor: "#4A90E2",
        overlayOpacity: 0.4,
      },
      template: {
        templateId: "template_10",
      },
    },
    back: {
      color: {
        colorCode: "#E8F5F7",
      },
      description: {
        content:
          "Discover practical techniques for reducing stress, increasing happiness, and living with intention. A comprehensive guide to mindfulness and personal growth for modern life.",
        size: 14,
        color: "#333333",
        font: "Sans-serif",
      },
      author: {
        title: "ABOUT THE AUTHOR",
        content:
          "Licensed therapist and mindfulness coach with over 15 years of experience. Featured speaker at wellness conferences worldwide.",
        imageUrl: "",
        size: 12,
        color: "#555555",
        font: "Sans-serif",
      },
    },
    spine: {
      color: {
        colorCode: "#4A90E2",
      },
    },
  },
];

// Function to seed templates - can be called from a page or API route
export async function seedTemplates() {
  try {
    const results = await Promise.all(
      defaultTemplates.map(async (template) => {
        const response = await fetch("/api/templates", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(template),
        });
        return response.json();
      })
    );
    
    console.log("Templates seeded successfully:", results);
    return { success: true, results };
  } catch (error) {
    console.error("Error seeding templates:", error);
    return { success: false, error };
  }
}

