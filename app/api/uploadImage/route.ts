// Increase body size limit for this route
export const maxDuration = 60; // seconds

export async function POST(request: Request) {
  try {
    const req = await request.json();

    const response = await fetch(
      "https://dashboard.bookleafpub.in/version-test/api/1.1/wf/upload-aws",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: "Bearer 8fa412098df1854f20b7607ec869e4d8",
        },
        body: JSON.stringify(req),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Upload API error:", response.status, errorText);
      return Response.json(
        { error: `Upload failed: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(data);
    return Response.json(data.response);
  } catch (error) {
    console.error("Upload error:", error);
    return Response.json(
      { error: "Failed to process upload" },
      { status: 500 }
    );
  }
}
