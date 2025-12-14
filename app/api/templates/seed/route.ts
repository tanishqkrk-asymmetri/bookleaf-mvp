import { db } from "@/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { NextResponse } from "next/server";
import { defaultTemplates } from "@/utils/seedTemplates";

const TEMPLATES_DOC_PATH = "templates/templates";

// POST - Seed templates into Firestore
export async function POST() {
  try {
    const templatesDocRef = doc(db, TEMPLATES_DOC_PATH);
    const templatesDoc = await getDoc(templatesDocRef);

    // Check if templates already exist
    if (templatesDoc.exists()) {
      const data = templatesDoc.data();
      const existingTemplates = data.allTemplates || [];

      if (existingTemplates.length > 0) {
        return NextResponse.json({
          success: false,
          message: `Templates already exist (${existingTemplates.length} found). Delete them first if you want to reseed.`,
        });
      }
    }

    // Add IDs to templates and prepare for storage
    const templatesWithIds = defaultTemplates.map((template, index) => ({
      id: `template-${Date.now()}-${index}`,
      ...template,
      createdAt: new Date().toISOString(),
    }));

    // Save all templates in a single document
    await setDoc(templatesDocRef, {
      allTemplates: templatesWithIds,
      lastModified: new Date().toISOString(),
      seededAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${templatesWithIds.length} templates`,
      count: templatesWithIds.length,
    });
  } catch (error) {
    console.error("Error seeding templates:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed templates" },
      { status: 500 }
    );
  }
}
