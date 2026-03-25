import type { APIRoute } from 'astro';

// Mock data store for development
const store = new Map<string, any[]>();

export const GET: APIRoute = async ({ params }) => {
  const { collectionId, itemId } = params;

  if (!collectionId || !itemId) {
    return new Response(JSON.stringify({ error: 'Collection ID and Item ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const collection = store.get(collectionId) || [];
  const item = collection.find((i: any) => i._id === itemId);

  if (!item) {
    return new Response(JSON.stringify({ error: 'Item not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(item), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { collectionId, itemId } = params;

  if (!collectionId || !itemId) {
    return new Response(JSON.stringify({ error: 'Collection ID and Item ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const data = await request.json();
    const collection = store.get(collectionId) || [];
    const index = collection.findIndex((i: any) => i._id === itemId);

    if (index === -1) {
      return new Response(JSON.stringify({ error: 'Item not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    collection[index] = { ...collection[index], ...data };

    return new Response(JSON.stringify(collection[index]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to update item' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const DELETE: APIRoute = async ({ params }) => {
  const { collectionId, itemId } = params;

  if (!collectionId || !itemId) {
    return new Response(JSON.stringify({ error: 'Collection ID and Item ID required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const collection = store.get(collectionId) || [];
  const index = collection.findIndex((i: any) => i._id === itemId);

  if (index !== -1) {
    collection.splice(index, 1);
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
