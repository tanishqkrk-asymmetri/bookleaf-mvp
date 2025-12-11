export async function POST(request: Request) {
  const req = await request.json();

  const response = await fetch(
    "https://dashboard.bookleafpub.in/version-test/api/1.1/wf/get-user-data?id=" +
      req.id,
    {
      method: "GET",
      headers: {
        "content-type": "application/json",
        authorization: "Bearer 8fa412098df1854f20b7607ec869e4d8",
      },
    }
  );

  console.log(response);
  const data = await response.json();

  // return Response.json({ hi: "hi" });
  return Response.json(data.response);
}
