export async function POST(request: Request) {
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
    }
  );

  const data = await response.json();

  //   console.log(data);

  return Response.json(data.response);
}
