import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const TEMPLATES_DOC_PATH = "templates/templates";

// GET - Fetch all templates
export async function GET() {
  try {
    const templatesDocRef = doc(db, TEMPLATES_DOC_PATH);
    const templatesDoc = await getDoc(templatesDocRef);

    if (templatesDoc.exists()) {
      const data = templatesDoc.data();
      const templates = data.allTemplates || [];

      return NextResponse.json({ success: true, templates });
    } else {
      // Document doesn't exist, return empty array
      return NextResponse.json({ success: true, templates: [] });
    }
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

// POST - Save all templates (replaces entire array)
export async function POST(request: Request) {
  try {
    const { templates } = await request.json();

    if (!Array.isArray(templates)) {
      return NextResponse.json(
        { success: false, error: "Templates must be an array" },
        { status: 400 }
      );
    }

    const templatesDocRef = doc(db, TEMPLATES_DOC_PATH);

    // Add IDs to templates that don't have them
    const templatesWithIds = templates.map((template, index) => ({
      id: template.id || `template-${Date.now()}-${index}`,
      ...template,
      lastUpdated: new Date().toISOString(),
    }));

    await setDoc(templatesDocRef, {
      allTemplates: templatesWithIds,
      lastModified: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      templates: templatesWithIds,
      message: "All templates saved successfully",
    });
  } catch (error) {
    console.error("Error saving templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save templates" },
      { status: 500 }
    );
  }
}

// PUT - Update a single template in the array
export async function PUT(request: Request) {
  try {
    const { id, ...templateData } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Template ID is required" },
        { status: 400 }
      );
    }

    const templatesDocRef = doc(db, TEMPLATES_DOC_PATH);
    const templatesDoc = await getDoc(templatesDocRef);

    if (!templatesDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Templates document not found" },
        { status: 404 }
      );
    }

    const data = templatesDoc.data();
    const templates = data.allTemplates || [];

    // Find and update the template
    const templateIndex = templates.findIndex((t: any) => t.id === id);

    if (templateIndex === -1) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    templates[templateIndex] = {
      id,
      ...templateData,
      lastUpdated: new Date().toISOString(),
    };

    await setDoc(templatesDocRef, {
      allTemplates: templates,
      lastModified: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Template updated successfully",
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a template from the array
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Template ID is required" },
        { status: 400 }
      );
    }

    const templatesDocRef = doc(db, TEMPLATES_DOC_PATH);
    const templatesDoc = await getDoc(templatesDocRef);

    if (!templatesDoc.exists()) {
      return NextResponse.json(
        { success: false, error: "Templates document not found" },
        { status: 404 }
      );
    }

    const data = templatesDoc.data();
    const templates = data.allTemplates || [];

    // Filter out the template to delete
    const updatedTemplates = templates.filter((t: any) => t.id !== id);

    if (updatedTemplates.length === templates.length) {
      return NextResponse.json(
        { success: false, error: "Template not found" },
        { status: 404 }
      );
    }

    await setDoc(templatesDocRef, {
      allTemplates: updatedTemplates,
      lastModified: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

