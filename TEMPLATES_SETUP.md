# Templates Setup Guide

This guide explains how to set up and use the dynamic template system with Firestore.

## Overview

The application uses Firestore to store and manage book cover templates dynamically. All templates are stored in a **single document** as an array, which minimizes read/write operations and reduces costs.

### Database Structure

```
Collection: templates
  └── Document: templates
      └── Field: allTemplates (array)
          ├── Template 1
          ├── Template 2
          └── Template 3...
```

This structure ensures:
- ✅ Single read operation fetches all templates
- ✅ Single write operation saves all templates
- ✅ Lower database costs
- ✅ Faster performance

## Initial Setup

### Step 1: Seed Initial Templates

To populate your Firestore database with the default templates:

1. **Option A: Use the Seed Page (Recommended)**
   - Navigate to `/seed-templates` in your browser
   - Click the "Seed Templates" button
   - Wait for confirmation that templates were created

2. **Option B: Use the API Directly**
   ```bash
   curl -X POST http://localhost:3000/api/templates/seed
   ```

### Step 2: Verify Templates

You can verify the templates were created by:

1. Checking the Firebase Console:
   - Go to Firestore Database
   - Look for the `templates` collection
   - Click on the `templates` document
   - You should see an `allTemplates` array with 8 templates

2. Checking the application:
   - Go to the main design page
   - Open the Sidebar
   - Click on "Template" tab
   - You should see all the templates loaded

## API Endpoints

### GET `/api/templates`
Fetch all templates from the single Firestore document.

**Response:**
```json
{
  "success": true,
  "templates": [
    {
      "id": "template_id",
      "editTrace": [],
      "lastEdited": 0,
      "front": { ... },
      "back": { ... },
      "spine": { ... }
    }
  ]
}
```

**Note:** This reads from `templates/templates` document and returns the `allTemplates` array.

### POST `/api/templates`
Save all templates at once (replaces entire array).

**Request Body:**
```json
{
  "templates": [
    {
      "id": "template_id",
      "editTrace": [],
      "lastEdited": 0,
      "front": { ... },
      "back": { ... },
      "spine": { ... }
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "templates": [...],
  "message": "All templates saved successfully"
}
```

**Note:** This is the primary method used by the admin panel. It replaces the entire `allTemplates` array in one write operation.

### PUT `/api/templates`
Update a single template in the array.

**Request Body:**
```json
{
  "id": "template_id",
  "editTrace": [],
  "lastEdited": 0,
  "front": { ... },
  "back": { ... },
  "spine": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template updated successfully"
}
```

**Note:** This finds and updates one template in the array, then writes the entire document.

### DELETE `/api/templates`
Delete a template from the array.

**Request Body:**
```json
{
  "id": "template_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Template deleted successfully"
}
```

**Note:** This removes one template from the array, then writes the updated array.

### POST `/api/templates/seed`
Seed the database with default templates. Will only work if no templates exist.

**Response:**
```json
{
  "success": true,
  "message": "Successfully seeded 8 templates",
  "count": 8
}
```

**Note:** Creates the `templates/templates` document with all default templates in the `allTemplates` array.

## How It Works

### In the Sidebar Component

1. When the Sidebar component mounts, it automatically fetches templates:
   ```typescript
   useEffect(() => {
     const fetchTemplates = async () => {
       const response = await fetch("/api/templates");
       const data = await response.json();
       if (data.success) {
         setTemplates(data.templates);
       }
     };
     fetchTemplates();
   }, []);
   ```

2. While loading, a spinner is displayed
3. If no templates are found, a message is shown
4. Once loaded, templates are displayed in a grid

### Template Data Structure

Each template follows the `CoverData` type defined in `types/Book.d.ts`:

```typescript
interface CoverData {
  editTrace: any[];
  lastEdited: number;
  front: {
    backgroundType: "Color" | "Gradient" | "Image";
    text: { ... };
    color: { ... };
    gradient: { ... };
    image: { ... };
    template: { ... };
  };
  back: {
    color: { ... };
    description: { ... };
    author: { ... };
  };
  spine: {
    color: { ... };
  };
}
```

## Managing Templates

### Adding New Templates

**Best Method: Use Admin Panel (`/admin`)**
1. Go to `/admin`
2. Click "+ New Template"
3. Customize the template
4. Click "Save All"

This saves all templates in one operation.

**Alternative: Through Firebase Console**
1. Go to Firestore Database
2. Navigate to `templates` collection → `templates` document
3. Edit the `allTemplates` array
4. Add your template object to the array
5. Save

### Updating Templates

**Preferred: Save All Templates**
```typescript
const response = await fetch("/api/templates", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ 
    templates: allYourTemplates 
  })
});
```

**Update Single Template**
```typescript
const updatedTemplate = { 
  id: "template_id",
  /* updated template data */
};
const response = await fetch("/api/templates", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(updatedTemplate)
});
```

### Deleting Templates

```typescript
const response = await fetch("/api/templates", {
  method: "DELETE",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: "template_id" })
});
```

**Note:** The admin panel doesn't have a delete UI yet. Use the API directly or edit in Firebase Console.

## Troubleshooting

### Templates Not Loading

1. **Check Firebase Configuration:**
   - Ensure `firebase.js` has correct credentials
   - Verify Firestore is enabled in Firebase Console

2. **Check Browser Console:**
   - Look for any error messages
   - Verify the API is responding

3. **Verify Firestore Rules:**
   - Ensure read/write permissions are set correctly
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /templates/templates {
         allow read, write: if true; // Adjust based on your auth requirements
       }
     }
   }
   ```
   
   **Important:** The path is now `templates/templates` (collection/document), not `templates/{templateId}`

### "Templates Already Exist" Error

If you see this when trying to seed:
1. Delete existing templates from Firebase Console
2. Or use the DELETE endpoint to remove them programmatically
3. Then try seeding again

## Files Changed

- `app/api/templates/route.ts` - Main API endpoint for CRUD operations
- `app/api/templates/seed/route.ts` - Seeding endpoint
- `components/Sidebar.tsx` - Updated to fetch templates dynamically
- `utils/seedTemplates.ts` - Contains default template data
- `app/seed-templates/page.tsx` - UI for seeding templates

## Future Enhancements

Possible improvements:
- Add template categories/tags
- Implement template search/filter
- Add template preview before applying
- Create template management UI in admin panel
- Allow users to save their custom designs as templates

