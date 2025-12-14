"use client";

import { useState } from "react";

export default function SeedTemplatesPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSeed = async () => {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/templates/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        setMessage(data.message);
      } else {
        setError(data.message || data.error);
      }
    } catch (err) {
      setError("Failed to seed templates. Please check the console for errors.");
      console.error("Error seeding templates:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Seed Templates
        </h1>
        
        <p className="text-gray-600 mb-6">
          Click the button below to populate your Firestore database with default book cover templates.
          This will add 8 pre-designed templates to your templates collection.
        </p>

        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          onClick={handleSeed}
          disabled={loading}
          className={`w-full py-3 px-4 rounded font-semibold text-white transition-colors ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Seeding Templates..." : "Seed Templates"}
        </button>

        <div className="mt-6 text-sm text-gray-500">
          <p className="font-semibold mb-2">Note:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>This will only work if no templates exist yet</li>
            <li>You can delete existing templates from Firebase Console</li>
            <li>After seeding, templates will be available in the Sidebar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

