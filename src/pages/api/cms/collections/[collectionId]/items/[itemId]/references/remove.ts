import type { APIRoute } from 'astro';

// Mock data store for development
const store = new Map<string, any[]>();

export const POST: APIRoute = async ({ params, request }) => {
  const { collectionId, itemId } = params;

  if (!collectionId || !itemId) {
    return new Response(JSON.stringify({ error: 'Collection ID and Item ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const refs = await request.json();
    const collection = store.get(collectionId) || [];
    const item = collection.find((i: any) => i._id === itemId);

    if (!item) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    Object.entries(refs).forEach(([key, values]: [string, any]) => {
      if (item[key]) {
        item[key] = item[key].filter((v: string) => !values.includes(v));
      }
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to remove references' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
