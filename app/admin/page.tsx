"use client";

import useAuth from "@/context/AuthContext";
import { useEffect, useState, useRef } from "react";
import { CoverData } from "@/types/Book";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "@/firebase";
import * as htmlToImage from "html-to-image";

// Helper function to convert uploaded file to base64 using htmlToImage
const fileToBase64WithHtmlToImage = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);

    img.onload = async () => {
      try {
        // Create a container for the image
        const container = document.createElement("div");
        container.style.position = "absolute";
        container.style.left = "-9999px";
        container.appendChild(img);
        document.body.appendChild(container);

        // Convert to base64 using htmlToImage
        const dataUrl = await htmlToImage.toPng(img, { quality: 1 });

        // Cleanup
        document.body.removeChild(container);
        URL.revokeObjectURL(url);

        resolve(dataUrl);
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
};

interface Template {
  id: string;
  name: string;
  coverData: CoverData;
}

interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    full: string;
  };
  user: {
    name: string;
  };
}

function LoginScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign Up
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          setLoading(false);
          return;
        }
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // Sign In
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err: any) {
      console.error("Authentication error:", err);
      switch (err.code) {
        case "auth/invalid-email":
          setError("Invalid email address");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled");
          break;
        case "auth/user-not-found":
          setError("No account found with this email");
          break;
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/email-already-in-use":
          setError("Email already in use");
          break;
        case "auth/weak-password":
          setError("Password is too weak");
          break;
        default:
          setError("Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Admin Portal
            </h1>
            <p className="text-gray-600">
              {isSignUp ? "Create your account" : "Sign in to continue"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="admin@example.com"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            {/* Confirm Password Field (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  disabled={loading}
                />
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Toggle Sign In / Sign Up */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>BookLeaf Admin Template Editor</p>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const { user } = useAuth()!;
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    null
  );
  const [currentTemplate, setCurrentTemplate] = useState<Template | null>(null);

  // Refs for draggable elements
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const authorNameRef = useRef<HTMLDivElement>(null);

  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [snapGuides, setSnapGuides] = useState({ showX: false, showY: false });

  // Unsplash image search
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UnsplashImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Saving state
  const [isSaving, setIsSaving] = useState(false);

  // Image upload state
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Delete confirmation state
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    show: boolean;
    templateId: string | null;
    templateName: string;
  }>({
    show: false,
    templateId: null,
    templateName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Available fonts
  const availableFonts = [
    "Default",
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Georgia",
    "Verdana",
    "Courier New",
    "Trebuchet MS",
    "Comic Sans MS",
    "Impact",
    "Palatino",
    "Garamond",
    "Bookman",
    "Avant Garde",
  ];

  // Constants for snapping
  const SNAP_THRESHOLD = 10;
  const FRONT_COVER_WIDTH = 487;
  const FRONT_COVER_HEIGHT = 782;
  const PADDING = 35;
  const BOTTOM_PADDING = 40;
  const AVAILABLE_WIDTH = FRONT_COVER_WIDTH - PADDING * 2;
  const AVAILABLE_HEIGHT = FRONT_COVER_HEIGHT - PADDING - BOTTOM_PADDING;
  const CENTER_X = AVAILABLE_WIDTH / 2;
  const CENTER_Y = AVAILABLE_HEIGHT / 2;

  // Check authentication
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [user]);

  // Load templates from Firestore or initialize with default
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const response = await fetch("/api/templates");
        const data = await response.json();

        if (data.success && data.templates && data.templates.length > 0) {
          // Convert Firestore templates to admin Template format
          const loadedTemplates: Template[] = data.templates.map(
            (template: any, index: number) => ({
              id: template.id,
              name: template.name || `Template ${index + 1}`,
              coverData: {
                editTrace: template.editTrace || [],
                lastEdited: template.lastEdited || Date.now(),
                front: template.front,
                back: template.back,
                spine: template.spine,
              },
            })
          );

          setTemplates(loadedTemplates);
          setSelectedTemplateId(loadedTemplates[0].id);
          setCurrentTemplate(loadedTemplates[0]);
        } else {
          // Initialize with default template if none exist
          const defaultTemplate: Template = {
            id: "template-new",
            name: "New Template",
            coverData: {
              editTrace: [],
              lastEdited: Date.now(),
              front: {
                backgroundType: "Color",
                template: { templateId: "" },
                color: { colorCode: "#FFFFFF" },
                image: {
                  imageUrl: "",
                  overlayColor: "#000000",
                  overlayOpacity: 0,
                },
                gradient: { from: "", to: "", direction: 0 },
                text: {
                  font: "Default",
                  title: {
                    content: "Sample Title",
                    size: 48,
                    color: "#000000",
                    font: "Default",
                    bold: true,
                    italic: false,
                    underline: false,
                    align: "center",
                    lineHeight: 1.2,
                    position: { x: 50, y: 100 },
                  },
                  subTitle: {
                    content: "Subtitle Here",
                    size: 24,
                    color: "#333333",
                    font: "Default",
                    bold: false,
                    italic: false,
                    underline: false,
                    align: "center",
                    lineHeight: 1.4,
                    position: { x: 50, y: 200 },
                  },
                  authorName: {
                    content: "Author Name",
                    size: 20,
                    color: "#666666",
                    font: "Default",
                    bold: false,
                    italic: false,
                    underline: false,
                    align: "center",
                    lineHeight: 1.5,
                    position: { x: 50, y: 600 },
                  },
                },
              },
              back: {
                color: { colorCode: "#F5F5F5" },
                description: {
                  content: "Book description goes here",
                  size: 14,
                  color: "#000000",
                  font: "Default",
                },
                author: {
                  title: "ABOUT THE AUTHOR",
                  content: "Author bio goes here",
                  imageUrl: "",
                  size: 12,
                  color: "#000000",
                  font: "Default",
                },
              },
              spine: {
                color: { colorCode: "#3498DB" },
              },
            },
          };

          setTemplates([defaultTemplate]);
          setSelectedTemplateId(defaultTemplate.id);
          setCurrentTemplate(defaultTemplate);
        }
      } catch (error) {
        console.error("Error loading templates:", error);
        // Fall back to default template on error
        const defaultTemplate: Template = {
          id: "template-new",
          name: "New Template",
          coverData: {
            editTrace: [],
            lastEdited: Date.now(),
            front: {
              backgroundType: "Color",
              template: { templateId: "" },
              color: { colorCode: "#FFFFFF" },
              image: {
                imageUrl: "",
                overlayColor: "#000000",
                overlayOpacity: 0,
              },
              gradient: { from: "", to: "", direction: 0 },
              text: {
                font: "Default",
                title: {
                  content: "Sample Title",
                  size: 48,
                  color: "#000000",
                  font: "Default",
                  bold: true,
                  italic: false,
                  underline: false,
                  align: "center",
                  lineHeight: 1.2,
                  position: { x: 50, y: 100 },
                },
                subTitle: {
                  content: "Subtitle Here",
                  size: 24,
                  color: "#333333",
                  font: "Default",
                  bold: false,
                  italic: false,
                  underline: false,
                  align: "center",
                  lineHeight: 1.4,
                  position: { x: 50, y: 200 },
                },
                authorName: {
                  content: "Author Name",
                  size: 20,
                  color: "#666666",
                  font: "Default",
                  bold: false,
                  italic: false,
                  underline: false,
                  align: "center",
                  lineHeight: 1.5,
                  position: { x: 50, y: 600 },
                },
              },
            },
            back: {
              color: { colorCode: "#F5F5F5" },
              description: {
                content: "Book description goes here",
                size: 14,
                color: "#000000",
                font: "Default",
              },
              author: {
                title: "ABOUT THE AUTHOR",
                content: "Author bio goes here",
                imageUrl: "",
                size: 12,
                color: "#000000",
                font: "Default",
              },
            },
            spine: {
              color: { colorCode: "#3498DB" },
            },
          },
        };

        setTemplates([defaultTemplate]);
        setSelectedTemplateId(defaultTemplate.id);
        setCurrentTemplate(defaultTemplate);
      }
    };

    loadTemplates();
  }, []);

  // Update current template when selection changes
  useEffect(() => {
    if (selectedTemplateId) {
      const template = templates.find((t) => t.id === selectedTemplateId);
      if (template) {
        setCurrentTemplate(template);
      }
    }
  }, [selectedTemplateId, templates]);

  // Helper function to apply snapping
  const applySnapping = (
    x: number,
    y: number,
    elementRef?: React.RefObject<HTMLDivElement | null>
  ) => {
    let snappedX = x;
    let snappedY = y;

    const elementWidth = elementRef?.current?.offsetWidth || 0;
    const elementHeight = elementRef?.current?.offsetHeight || 0;

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

  // Drag handlers
  const handleDragStart = () => setIsDragging(true);
  const handleDragStop = () => {
    setIsDragging(false);
    setSnapGuides({ showX: false, showY: false });
  };

  const handleTitleDrag = (e: DraggableEvent, data: DraggableData) => {
    applySnapping(data.x, data.y, titleRef);
  };

  const handleTitleStop = (e: DraggableEvent, data: DraggableData) => {
    const snapped = applySnapping(data.x, data.y, titleRef);
    updateTemplateField(["front", "text", "title", "position"], snapped);
    handleDragStop();
  };

  const handleSubtitleDrag = (e: DraggableEvent, data: DraggableData) => {
    applySnapping(data.x, data.y, subtitleRef);
  };

  const handleSubtitleStop = (e: DraggableEvent, data: DraggableData) => {
    const snapped = applySnapping(data.x, data.y, subtitleRef);
    updateTemplateField(["front", "text", "subTitle", "position"], snapped);
    handleDragStop();
  };

  const handleAuthorNameDrag = (e: DraggableEvent, data: DraggableData) => {
    applySnapping(data.x, data.y, authorNameRef);
  };

  const handleAuthorNameStop = (e: DraggableEvent, data: DraggableData) => {
    const snapped = applySnapping(data.x, data.y, authorNameRef);
    updateTemplateField(["front", "text", "authorName", "position"], snapped);
    handleDragStop();
  };

  // Update template field helper
  const updateTemplateField = (path: string[], value: any) => {
    if (!currentTemplate) return;

    setCurrentTemplate((prev) => {
      if (!prev) return prev;
      const newTemplate = { ...prev };
      let obj: any = newTemplate.coverData;

      for (let i = 0; i < path.length - 1; i++) {
        obj = obj[path[i]];
      }
      obj[path[path.length - 1]] = value;

      return newTemplate;
    });

    // Update in templates array
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === currentTemplate.id
          ? { ...t, coverData: { ...currentTemplate.coverData } }
          : t
      )
    );
  };

  // Add new template
  const addNewTemplate = () => {
    const newTemplate: Template = {
      id: `template-${Date.now()}`,
      name: `Template ${templates.length + 1}`,
      coverData: {
        ...templates[0].coverData,
        editTrace: [],
        lastEdited: Date.now(),
      },
    };
    setTemplates([...templates, newTemplate]);
    setSelectedTemplateId(newTemplate.id);
  };

  // Delete template
  const handleDeleteClick = (
    e: React.MouseEvent,
    templateId: string,
    templateName: string
  ) => {
    e.stopPropagation(); // Prevent selecting the template
    setDeleteConfirmation({
      show: true,
      templateId,
      templateName,
    });
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation.templateId) return;

    // Can't delete if it's the only template
    if (templates.length === 1) {
      alert(
        "⚠️ Cannot delete the last template. You must have at least one template."
      );
      setDeleteConfirmation({
        show: false,
        templateId: null,
        templateName: "",
      });
      return;
    }

    const templateIdToDelete = deleteConfirmation.templateId;
    setIsDeleting(true);

    try {
      // Remove template from array
      const updatedTemplates = templates.filter(
        (t) => t.id !== templateIdToDelete
      );

      // Prepare templates for saving to Firestore
      const templatesToSave = updatedTemplates.map((template) => ({
        id: template.id,
        name: template.name,
        ...template.coverData,
      }));

      // Save updated templates to Firestore
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templates: templatesToSave }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local state
        setTemplates(updatedTemplates);

        // If deleted template was selected, select the first remaining template
        if (selectedTemplateId === templateIdToDelete) {
          setSelectedTemplateId(updatedTemplates[0].id);
          setCurrentTemplate(updatedTemplates[0]);
        }

        setDeleteConfirmation({
          show: false,
          templateId: null,
          templateName: "",
        });
        alert("✅ Template deleted successfully!");
      } else {
        throw new Error(result.error || "Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("❌ Failed to delete template. Please try again.");
      setDeleteConfirmation({
        show: false,
        templateId: null,
        templateName: "",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation({ show: false, templateId: null, templateName: "" });
  };

  // Save all templates
  const saveAllTemplates = async () => {
    setIsSaving(true);
    try {
      // Prepare templates for saving (include name and coverData)
      const templatesToSave = templates.map((template) => ({
        id: template.id,
        name: template.name,
        ...template.coverData,
      }));

      // Save all templates in one request
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templates: templatesToSave }),
      });

      const result = await response.json();

      if (result.success) {
        // Update local templates with returned IDs (in case new ones were created)
        if (result.templates) {
          setTemplates((prev) =>
            prev.map((template, index) => ({
              ...template,
              id: result.templates[index].id,
            }))
          );

          // Update selected template ID if it changed
          if (currentTemplate) {
            const currentIndex = templates.findIndex(
              (t) => t.id === currentTemplate.id
            );
            if (currentIndex !== -1 && result.templates[currentIndex]) {
              setSelectedTemplateId(result.templates[currentIndex].id);
            }
          }
        }

        alert("✅ All templates saved successfully!");
      } else {
        alert("⚠️ Failed to save templates. Check console for details.");
        console.error("Save error:", result.error);
      }
    } catch (error) {
      console.error("Error saving templates:", error);
      alert("❌ Failed to save templates. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Search Unsplash images
  const searchUnsplashImages = async (query: string, page: number = 1) => {
    setIsSearching(true);
    try {
      const response = await fetch("/api/searchImage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, page }),
      });
      const data = await response.json();
      setSearchResults(data.response.results || []);
    } catch (error) {
      console.error("Error searching images:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Select image from Unsplash
  const selectUnsplashImage = (imageUrl: string) => {
    if (!currentTemplate) return;
    const newCoverData = { ...currentTemplate.coverData };
    newCoverData.front.backgroundType = "Image";
    newCoverData.front.image.imageUrl = imageUrl;
    newCoverData.front.image.overlayColor = "#000000";
    newCoverData.front.image.overlayOpacity = 0.3;
    setCurrentTemplate({ ...currentTemplate, coverData: newCoverData });
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === currentTemplate.id ? { ...t, coverData: newCoverData } : t
      )
    );
    setShowImageSearch(false);
  };

  // Upload custom image
  const handleCustomImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !currentTemplate) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setIsUploadingImage(true);
    try {
      // Convert file to base64 using htmlToImage
      const base64Data = await fileToBase64WithHtmlToImage(file);

      // First, set a temporary preview
      const newCoverData = { ...currentTemplate.coverData };
      newCoverData.front.backgroundType = "Image";
      newCoverData.front.image.imageUrl = base64Data;
      newCoverData.front.image.overlayColor = "#000000";
      newCoverData.front.image.overlayOpacity = 0.3;
      setCurrentTemplate({ ...currentTemplate, coverData: newCoverData });
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === currentTemplate.id ? { ...t, coverData: newCoverData } : t
        )
      );

      // Upload to server
      const response = await fetch("/api/uploadImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename: `frontcover${Date.now()}.jpg`,
          upload_file: {
            filename: `frontcover${Date.now()}.jpg`,
            contents: base64Data.split(",")[1],
          },
        }),
      });

      const result = await response.json();

      // Update with hosted URL
      if (result.hosted_link) {
        const updatedCoverData = { ...currentTemplate.coverData };
        updatedCoverData.front.backgroundType = "Image";
        updatedCoverData.front.image.imageUrl = result.hosted_link;
        updatedCoverData.front.image.overlayColor = "#000000";
        updatedCoverData.front.image.overlayOpacity = 0.3;
        setCurrentTemplate({ ...currentTemplate, coverData: updatedCoverData });
        setTemplates((prev) =>
          prev.map((t) =>
            t.id === currentTemplate.id
              ? { ...t, coverData: updatedCoverData }
              : t
          )
        );
        alert("✅ Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploadingImage(false);
      event.target.value = ""; // Reset file input
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-lg text-gray-300">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  if (!currentTemplate) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-lg text-gray-300">No template selected</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-72 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-sm font-semibold text-gray-100 uppercase tracking-wide">
            Templates
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative group w-full text-left px-4 py-2.5 rounded-md transition-all text-sm font-medium cursor-pointer flex items-center justify-between ${
                selectedTemplateId === template.id
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() => setSelectedTemplateId(template.id)}
            >
              <span className="flex-1">{template.name}</span>
              <button
                onClick={(e) =>
                  handleDeleteClick(e, template.id, template.name)
                }
                className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-600 ${
                  selectedTemplateId === template.id
                    ? "hover:bg-red-700"
                    : "hover:bg-red-600"
                }`}
                title="Delete template"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-700 space-y-2">
          <button
            onClick={addNewTemplate}
            className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 text-gray-200 rounded-md hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            + New Template
          </button>

          <button
            onClick={saveAllTemplates}
            disabled={isSaving}
            className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save All"
            )}
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-100">
                {currentTemplate.name}
              </h1>
              <p className="text-sm text-gray-400 mt-1">
                Customize your book cover template
              </p>
            </div>
          </div>

          {/* Template Name Editor */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
              Template Name
            </label>
            <input
              type="text"
              value={currentTemplate.name}
              onChange={(e) => {
                setCurrentTemplate({
                  ...currentTemplate,
                  name: e.target.value,
                });
                setTemplates((prev) =>
                  prev.map((t) =>
                    t.id === currentTemplate.id
                      ? { ...t, name: e.target.value }
                      : t
                  )
                );
              }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Front Cover Editor */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Front Cover
              </h3>
            </div>

            {/* Front Cover Canvas */}
            <div className="p-6 bg-gray-850 flex justify-center">
              <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
                <div
                  className="relative"
                  style={{
                    height: "782px",
                    width: "487px",
                    paddingTop: "35px",
                    paddingLeft: "35px",
                    paddingRight: "35px",
                    paddingBottom: "40px",
                    background:
                      currentTemplate.coverData.front.backgroundType ===
                      "Gradient"
                        ? `linear-gradient(${currentTemplate.coverData.front.gradient.direction}deg, ${currentTemplate.coverData.front.gradient.from}, ${currentTemplate.coverData.front.gradient.to})`
                        : currentTemplate.coverData.front.color.colorCode,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {/* Snap Guides */}
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

                    {/* Title */}
                    <Draggable
                      key={`title-${currentTemplate.coverData.front.text.title.position.x}-${currentTemplate.coverData.front.text.title.position.y}`}
                      nodeRef={titleRef}
                      position={
                        currentTemplate.coverData.front.text.title.position
                      }
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
                          maxWidth: "90%",
                          wordWrap: "break-word",
                        }}
                        className="cursor-grab select-none active:cursor-grabbing"
                      >
                        <div
                          style={{
                            color:
                              currentTemplate.coverData.front.text.title.color,
                            fontSize:
                              currentTemplate.coverData.front.text.title.size +
                              "px",
                            fontFamily:
                              currentTemplate.coverData.front.text.title.font,
                            fontWeight: currentTemplate.coverData.front.text
                              .title.bold
                              ? "bold"
                              : "normal",
                            fontStyle: currentTemplate.coverData.front.text
                              .title.italic
                              ? "italic"
                              : "normal",
                            textDecoration: currentTemplate.coverData.front.text
                              .title.underline
                              ? "underline"
                              : "none",
                            textAlign:
                              currentTemplate.coverData.front.text.title.align,
                            lineHeight:
                              currentTemplate.coverData.front.text.title
                                .lineHeight,
                          }}
                        >
                          {currentTemplate.coverData.front.text.title.content}
                        </div>
                      </div>
                    </Draggable>

                    {/* Subtitle */}
                    <Draggable
                      key={`subtitle-${currentTemplate.coverData.front.text.subTitle.position.x}-${currentTemplate.coverData.front.text.subTitle.position.y}`}
                      nodeRef={subtitleRef}
                      position={
                        currentTemplate.coverData.front.text.subTitle.position
                      }
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
                          maxWidth: "90%",
                          wordWrap: "break-word",
                        }}
                        className="cursor-grab select-none active:cursor-grabbing"
                      >
                        <div
                          style={{
                            color:
                              currentTemplate.coverData.front.text.subTitle
                                .color,
                            fontSize:
                              currentTemplate.coverData.front.text.subTitle
                                .size + "px",
                            fontFamily:
                              currentTemplate.coverData.front.text.subTitle
                                .font,
                            fontWeight: currentTemplate.coverData.front.text
                              .subTitle.bold
                              ? "bold"
                              : "normal",
                            fontStyle: currentTemplate.coverData.front.text
                              .subTitle.italic
                              ? "italic"
                              : "normal",
                            textDecoration: currentTemplate.coverData.front.text
                              .subTitle.underline
                              ? "underline"
                              : "none",
                            textAlign:
                              currentTemplate.coverData.front.text.subTitle
                                .align,
                            lineHeight:
                              currentTemplate.coverData.front.text.subTitle
                                .lineHeight,
                          }}
                        >
                          {
                            currentTemplate.coverData.front.text.subTitle
                              .content
                          }
                        </div>
                      </div>
                    </Draggable>

                    {/* Author Name */}
                    <Draggable
                      key={`author-${currentTemplate.coverData.front.text.authorName.position.x}-${currentTemplate.coverData.front.text.authorName.position.y}`}
                      nodeRef={authorNameRef}
                      position={
                        currentTemplate.coverData.front.text.authorName.position
                      }
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
                          maxWidth: "90%",
                          wordWrap: "break-word",
                        }}
                        className="cursor-grab select-none active:cursor-grabbing"
                      >
                        <div
                          style={{
                            color:
                              currentTemplate.coverData.front.text.authorName
                                .color,
                            fontSize:
                              currentTemplate.coverData.front.text.authorName
                                .size + "px",
                            fontFamily:
                              currentTemplate.coverData.front.text.authorName
                                .font,
                            fontWeight: currentTemplate.coverData.front.text
                              .authorName.bold
                              ? "bold"
                              : "normal",
                            fontStyle: currentTemplate.coverData.front.text
                              .authorName.italic
                              ? "italic"
                              : "normal",
                            textDecoration: currentTemplate.coverData.front.text
                              .authorName.underline
                              ? "underline"
                              : "none",
                            textAlign:
                              currentTemplate.coverData.front.text.authorName
                                .align,
                            lineHeight:
                              currentTemplate.coverData.front.text.authorName
                                .lineHeight,
                          }}
                        >
                          {
                            currentTemplate.coverData.front.text.authorName
                              .content
                          }
                        </div>
                      </div>
                    </Draggable>

                    {/* Background Image (if selected) */}
                    {currentTemplate.coverData.front.backgroundType ===
                      "Image" &&
                      currentTemplate.coverData.front.image.imageUrl && (
                        <>
                          <img
                            src={currentTemplate.coverData.front.image.imageUrl}
                            className="w-full h-full absolute top-0 left-0 object-cover"
                            alt="Background"
                            // style={{ zIndex: -1 }}
                          />
                          <div
                            className="w-full h-full absolute top-0 left-0"
                            style={{
                              backgroundColor:
                                currentTemplate.coverData.front.image
                                  .overlayColor,
                              opacity:
                                currentTemplate.coverData.front.image
                                  .overlayOpacity,
                              pointerEvents: "none",
                              zIndex: 0,
                            }}
                          ></div>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Front Cover Controls */}
            <div className="p-4 grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                  Background Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.backgroundType = "Color";
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      currentTemplate.coverData.front.backgroundType === "Color"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Solid Color
                  </button>
                  <button
                    onClick={() => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.backgroundType = "Gradient";
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      currentTemplate.coverData.front.backgroundType ===
                      "Gradient"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Gradient
                  </button>
                  <button
                    onClick={() => setShowImageSearch(true)}
                    className={`px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      currentTemplate.coverData.front.backgroundType === "Image"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    Image
                  </button>
                </div>
              </div>

              {currentTemplate.coverData.front.backgroundType === "Color" && (
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentTemplate.coverData.front.color.colorCode}
                      onChange={(e) => {
                        const newCoverData = { ...currentTemplate.coverData };
                        newCoverData.front.color.colorCode = e.target.value;
                        setCurrentTemplate({
                          ...currentTemplate,
                          coverData: newCoverData,
                        });
                        setTemplates((prev) =>
                          prev.map((t) =>
                            t.id === currentTemplate.id
                              ? { ...t, coverData: newCoverData }
                              : t
                          )
                        );
                      }}
                      className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                    />
                    <input
                      type="text"
                      value={currentTemplate.coverData.front.color.colorCode}
                      onChange={(e) => {
                        const newCoverData = { ...currentTemplate.coverData };
                        newCoverData.front.color.colorCode = e.target.value;
                        setCurrentTemplate({
                          ...currentTemplate,
                          coverData: newCoverData,
                        });
                        setTemplates((prev) =>
                          prev.map((t) =>
                            t.id === currentTemplate.id
                              ? { ...t, coverData: newCoverData }
                              : t
                          )
                        );
                      }}
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              )}

              {currentTemplate.coverData.front.backgroundType ===
                "Gradient" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                      From Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTemplate.coverData.front.gradient.from}
                        onChange={(e) => {
                          const newCoverData = {
                            ...currentTemplate.coverData,
                          };
                          newCoverData.front.gradient.from = e.target.value;
                          setCurrentTemplate({
                            ...currentTemplate,
                            coverData: newCoverData,
                          });
                          setTemplates((prev) =>
                            prev.map((t) =>
                              t.id === currentTemplate.id
                                ? { ...t, coverData: newCoverData }
                                : t
                            )
                          );
                        }}
                        className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={currentTemplate.coverData.front.gradient.from}
                        onChange={(e) => {
                          const newCoverData = {
                            ...currentTemplate.coverData,
                          };
                          newCoverData.front.gradient.from = e.target.value;
                          setCurrentTemplate({
                            ...currentTemplate,
                            coverData: newCoverData,
                          });
                          setTemplates((prev) =>
                            prev.map((t) =>
                              t.id === currentTemplate.id
                                ? { ...t, coverData: newCoverData }
                                : t
                            )
                          );
                        }}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                      To Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={currentTemplate.coverData.front.gradient.to}
                        onChange={(e) => {
                          const newCoverData = {
                            ...currentTemplate.coverData,
                          };
                          newCoverData.front.gradient.to = e.target.value;
                          setCurrentTemplate({
                            ...currentTemplate,
                            coverData: newCoverData,
                          });
                          setTemplates((prev) =>
                            prev.map((t) =>
                              t.id === currentTemplate.id
                                ? { ...t, coverData: newCoverData }
                                : t
                            )
                          );
                        }}
                        className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={currentTemplate.coverData.front.gradient.to}
                        onChange={(e) => {
                          const newCoverData = {
                            ...currentTemplate.coverData,
                          };
                          newCoverData.front.gradient.to = e.target.value;
                          setCurrentTemplate({
                            ...currentTemplate,
                            coverData: newCoverData,
                          });
                          setTemplates((prev) =>
                            prev.map((t) =>
                              t.id === currentTemplate.id
                                ? { ...t, coverData: newCoverData }
                                : t
                            )
                          );
                        }}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                      Direction
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={currentTemplate.coverData.front.gradient.direction}
                      onChange={(e) => {
                        const newCoverData = { ...currentTemplate.coverData };
                        newCoverData.front.gradient.direction = parseInt(
                          e.target.value
                        );
                        setCurrentTemplate({
                          ...currentTemplate,
                          coverData: newCoverData,
                        });
                        setTemplates((prev) =>
                          prev.map((t) =>
                            t.id === currentTemplate.id
                              ? { ...t, coverData: newCoverData }
                              : t
                          )
                        );
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0°</span>
                      <span className="font-mono font-semibold text-gray-200">
                        {currentTemplate.coverData.front.gradient.direction}°
                      </span>
                      <span>360°</span>
                    </div>
                  </div>
                </>
              )}

              {currentTemplate.coverData.front.backgroundType === "Image" && (
                <>
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                      Background Image
                    </label>
                    {currentTemplate.coverData.front.image.imageUrl ? (
                      <div className="relative mb-3">
                        <img
                          src={currentTemplate.coverData.front.image.imageUrl}
                          alt="Background"
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            onClick={() => setShowImageSearch(true)}
                            className="px-2 py-1 bg-gray-800/90 text-gray-200 rounded-md text-xs font-medium shadow-md hover:bg-gray-700 backdrop-blur-sm"
                          >
                            Search
                          </button>
                          <label className="px-2 py-1 bg-gray-800/90 text-gray-200 rounded-md text-xs font-medium shadow-md hover:bg-gray-700 backdrop-blur-sm cursor-pointer">
                            {isUploadingImage ? "Uploading..." : "Upload"}
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleCustomImageUpload}
                              disabled={isUploadingImage}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <button
                          onClick={() => setShowImageSearch(true)}
                          className="w-full px-3 py-4 border-2 border-dashed border-gray-600 rounded-md text-sm text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors"
                        >
                          Search from Unsplash
                        </button>
                        <label className="w-full px-3 py-4 border-2 border-dashed border-gray-600 rounded-md text-sm text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center cursor-pointer">
                          {isUploadingImage ? (
                            <span className="flex items-center gap-2">
                              <svg
                                className="animate-spin h-4 w-4 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Uploading...
                            </span>
                          ) : (
                            "Upload Custom Image"
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCustomImageUpload}
                            disabled={isUploadingImage}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                      Overlay Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={
                          currentTemplate.coverData.front.image.overlayColor
                        }
                        onChange={(e) => {
                          const newCoverData = { ...currentTemplate.coverData };
                          newCoverData.front.image.overlayColor =
                            e.target.value;
                          setCurrentTemplate({
                            ...currentTemplate,
                            coverData: newCoverData,
                          });
                          setTemplates((prev) =>
                            prev.map((t) =>
                              t.id === currentTemplate.id
                                ? { ...t, coverData: newCoverData }
                                : t
                            )
                          );
                        }}
                        className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                      />
                      <input
                        type="text"
                        value={
                          currentTemplate.coverData.front.image.overlayColor
                        }
                        onChange={(e) => {
                          const newCoverData = { ...currentTemplate.coverData };
                          newCoverData.front.image.overlayColor =
                            e.target.value;
                          setCurrentTemplate({
                            ...currentTemplate,
                            coverData: newCoverData,
                          });
                          setTemplates((prev) =>
                            prev.map((t) =>
                              t.id === currentTemplate.id
                                ? { ...t, coverData: newCoverData }
                                : t
                            )
                          );
                        }}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                      Overlay Opacity
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={
                        currentTemplate.coverData.front.image.overlayOpacity
                      }
                      onChange={(e) => {
                        const newCoverData = { ...currentTemplate.coverData };
                        newCoverData.front.image.overlayOpacity = parseFloat(
                          e.target.value
                        );
                        setCurrentTemplate({
                          ...currentTemplate,
                          coverData: newCoverData,
                        });
                        setTemplates((prev) =>
                          prev.map((t) =>
                            t.id === currentTemplate.id
                              ? { ...t, coverData: newCoverData }
                              : t
                          )
                        );
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>0%</span>
                      <span className="font-mono font-semibold text-gray-200">
                        {Math.round(
                          currentTemplate.coverData.front.image.overlayOpacity *
                            100
                        )}
                        %
                      </span>
                      <span>100%</span>
                    </div>
                  </div>
                </>
              )}

              {/* Text Content Editors */}
              <div className="col-span-2 pt-4 border-t border-gray-700">
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-3">
                  Text Elements
                </label>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={currentTemplate.coverData.front.text.title.content}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.front.text.title.content = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md mb-2 text-sm"
                  placeholder="Enter title"
                />
                <select
                  value={currentTemplate.coverData.front.text.title.font}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.front.text.title.font = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md mb-2 text-sm"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTemplate.coverData.front.text.title.color}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.text.title.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                  />
                  <input
                    type="text"
                    value={currentTemplate.coverData.front.text.title.color}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.text.title.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={currentTemplate.coverData.front.text.subTitle.content}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.front.text.subTitle.content = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md mb-2 text-sm"
                  placeholder="Enter subtitle"
                />
                <select
                  value={currentTemplate.coverData.front.text.subTitle.font}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.front.text.subTitle.font = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md mb-2 text-sm"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTemplate.coverData.front.text.subTitle.color}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.text.subTitle.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                  />
                  <input
                    type="text"
                    value={currentTemplate.coverData.front.text.subTitle.color}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.text.subTitle.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-medium text-gray-400 mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={
                    currentTemplate.coverData.front.text.authorName.content
                  }
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.front.text.authorName.content = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md mb-2 text-sm"
                  placeholder="Enter author name"
                />
                <select
                  value={currentTemplate.coverData.front.text.authorName.font}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.front.text.authorName.font = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md mb-2 text-sm"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={
                      currentTemplate.coverData.front.text.authorName.color
                    }
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.text.authorName.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                  />
                  <input
                    type="text"
                    value={
                      currentTemplate.coverData.front.text.authorName.color
                    }
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.front.text.authorName.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Back Cover Editor */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Back Cover
              </h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                  Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTemplate.coverData.back.color.colorCode}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.back.color.colorCode = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                  />
                  <input
                    type="text"
                    value={currentTemplate.coverData.back.color.colorCode}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.back.color.colorCode = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                  Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentTemplate.coverData.back.description.color}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.back.description.color = e.target.value;
                      newCoverData.back.author.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                  />
                  <input
                    type="text"
                    value={currentTemplate.coverData.back.description.color}
                    onChange={(e) => {
                      const newCoverData = { ...currentTemplate.coverData };
                      newCoverData.back.description.color = e.target.value;
                      newCoverData.back.author.color = e.target.value;
                      setCurrentTemplate({
                        ...currentTemplate,
                        coverData: newCoverData,
                      });
                      setTemplates((prev) =>
                        prev.map((t) =>
                          t.id === currentTemplate.id
                            ? { ...t, coverData: newCoverData }
                            : t
                        )
                      );
                    }}
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                    placeholder="#000000"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                  Description Font
                </label>
                <select
                  value={currentTemplate.coverData.back.description.font}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.back.description.font = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                  Author Content Font
                </label>
                <select
                  value={currentTemplate.coverData.back.author.font}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.back.author.font = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm"
                >
                  {availableFonts.map((font) => (
                    <option key={font} value={font}>
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Spine Editor */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                Spine
              </h3>
            </div>
            <div className="p-4">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wide mb-2">
                Spine Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTemplate.coverData.spine.color.colorCode}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.spine.color.colorCode = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="w-16 h-9 rounded-md cursor-pointer border border-gray-600"
                />
                <input
                  type="text"
                  value={currentTemplate.coverData.spine.color.colorCode}
                  onChange={(e) => {
                    const newCoverData = { ...currentTemplate.coverData };
                    newCoverData.spine.color.colorCode = e.target.value;
                    setCurrentTemplate({
                      ...currentTemplate,
                      coverData: newCoverData,
                    });
                    setTemplates((prev) =>
                      prev.map((t) =>
                        t.id === currentTemplate.id
                          ? { ...t, coverData: newCoverData }
                          : t
                      )
                    );
                  }}
                  className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm font-mono"
                  placeholder="#3498DB"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Unsplash Image Search Modal */}
      {showImageSearch && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col border border-gray-700">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-100">
                  Search Images
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  Powered by Unsplash
                </p>
              </div>
              <button
                onClick={() => setShowImageSearch(false)}
                className="text-gray-400 hover:text-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 border-b border-gray-700">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    searchUnsplashImages(searchQuery, 1);
                  }
                }}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="flex-1 px-4 py-2.5 bg-gray-700 border border-gray-600 text-gray-100 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? "Searching..." : "Search"}
                </button>
              </form>
            </div>

            {/* Search Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {isSearching ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {searchResults.map((image) => (
                    <button
                      key={image.id}
                      onClick={() => selectUnsplashImage(image.urls.regular)}
                      className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
                    >
                      <img
                        src={image.urls.small}
                        alt={`Photo by ${image.user.name}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Select
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent">
                        <p className="text-white text-xs truncate">
                          by {image.user.name}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <svg
                    className="w-16 h-16 text-gray-600 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-gray-400 text-sm">
                    Search for images to get started
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation.show && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-start mb-4">
              <div className="shrink-0 w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Delete Template
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  Are you sure you want to delete &quot;
                  <strong>{deleteConfirmation.templateName}</strong>&quot;? This
                  action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-gray-200 bg-gray-700 border border-gray-600 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isDeleting && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
