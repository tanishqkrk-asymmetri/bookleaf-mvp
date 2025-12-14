import { db } from "@/firebase";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { NextResponse } from "next/server";

const TEMPLATES_DOC_PATH = "templates/templates";

// POST - Migrate from multi-document to single document structure
export async function POST() {
  try {
    // Check if single document already exists
    const singleDocRef = doc(db, TEMPLATES_DOC_PATH);
    const singleDocSnap = await (async () => {
      try {
        const { getDoc } = await import("firebase/firestore");
        return await getDoc(singleDocRef);
      } catch (e) {
        return null;
      }
    })();

    if (singleDocSnap && singleDocSnap.exists()) {
      return NextResponse.json({
        success: false,
        message: "Single document structure already exists. No migration needed.",
      });
    }

    // Get all templates from the collection (old structure)
    const templatesCollection = collection(db, "templates");
    const templatesSnapshot = await getDocs(templatesCollection);

    if (templatesSnapshot.empty) {
      return NextResponse.json({
        success: false,
        message: "No templates found to migrate.",
      });
    }

    // Collect all templates
    const templates: any[] = [];
    const docIdsToDelete: string[] = [];

    templatesSnapshot.forEach((document) => {
      // Skip if it's the "templates" document (already in new structure)
      if (document.id === "templates") {
        return;
      }

      templates.push({
        id: document.id,
        ...document.data(),
      });
      docIdsToDelete.push(document.id);
    });

    if (templates.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No templates found to migrate (only found the target document).",
      });
    }

    // Create the new single document structure
    await setDoc(singleDocRef, {
      allTemplates: templates,
      lastModified: new Date().toISOString(),
      migratedAt: new Date().toISOString(),
    });

    // Optionally delete old documents (commented out for safety)
    // Uncomment the following lines if you want to auto-delete old documents
    /*
    for (const docId of docIdsToDelete) {
      await deleteDoc(doc(db, "templates", docId));
    }
    */

    return NextResponse.json({
      success: true,
      message: `Successfully migrated ${templates.length} templates to new structure.`,
      templatesCount: templates.length,
      note: "Old documents were NOT deleted. Delete them manually after verifying the migration.",
      oldDocIds: docIdsToDelete,
    });
  } catch (error) {
    console.error("Error during migration:", error);
    return NextResponse.json(
      { success: false, error: "Migration failed. Check console for details." },
      { status: 500 }
    );
  }
}

// GET - Check migration status
export async function GET() {
  try {
    const { getDoc } = await import("firebase/firestore");
    
    // Check if new structure exists
    const singleDocRef = doc(db, TEMPLATES_DOC_PATH);
    const singleDocSnap = await getDoc(singleDocRef);

    // Check if old structure exists
    const templatesCollection = collection(db, "templates");
    const templatesSnapshot = await getDocs(templatesCollection);

    const oldDocCount = templatesSnapshot.size;
    const hasNewStructure = singleDocSnap.exists();
    const newStructureCount = hasNewStructure
      ? (singleDocSnap.data()?.allTemplates || []).length
      : 0;

    // Filter out the "templates" document from old count
    const actualOldCount = templatesSnapshot.docs.filter(
      (d) => d.id !== "templates"
    ).length;

    return NextResponse.json({
      success: true,
      hasNewStructure,
      newStructureTemplateCount: newStructureCount,
      oldStructureDocumentCount: actualOldCount,
      needsMigration: actualOldCount > 0 && !hasNewStructure,
      status:
        actualOldCount === 0 && hasNewStructure
          ? "✅ Using new single-document structure"
          : actualOldCount > 0 && !hasNewStructure
          ? "⚠️ Migration needed - old structure detected"
          : actualOldCount > 0 && hasNewStructure
          ? "⚠️ Both structures exist - cleanup needed"
          : "❌ No templates found",
    });
  } catch (error) {
    console.error("Error checking migration status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check migration status" },
      { status: 500 }
    );
  }
}

