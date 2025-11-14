export async function POST(request: Request) {
  const { query, page } = await request.json();
  const response = await (
    await fetch(
      `https://api.unsplash.com/search/photos?page=${page}&query=${query}&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
    )
  ).json();
  return Response.json({ response });
}
